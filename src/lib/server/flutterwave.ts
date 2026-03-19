import { env } from '$env/dynamic/private';

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

export class FlutterwaveError extends Error {
	status: number;
	data: unknown;

	constructor(message: string, status: number, data: unknown) {
		super(message);
		this.name = 'FlutterwaveError';
		this.status = status;
		this.data = data;
	}
}

type FieldErrors = Partial<Record<'name' | 'phone' | 'address' | 'city' | 'state' | 'email', string[]>>;

export function mapFlutterwaveErrorToFields(message: string): FieldErrors | null {
	const lower = message.toLowerCase();

	const mappings: Array<{ patterns: string[]; field: keyof FieldErrors; message: string }> = [
		{ patterns: ['phone', 'phonenumber', 'phone number'], field: 'phone', message: 'Please provide a valid phone number' },
		{ patterns: ['email', 'customer email'], field: 'email', message: 'Please provide a valid email address' },
		{ patterns: ['address', 'billing address'], field: 'address', message: 'Please provide a valid address' },
		{ patterns: ['name', 'customer name'], field: 'name', message: 'Please provide a valid name' },
		{ patterns: ['city'], field: 'city', message: 'Please provide a valid city' },
		{ patterns: ['state'], field: 'state', message: 'Please provide a valid state' }
	];

	for (const mapping of mappings) {
		if (mapping.patterns.some((p) => lower.includes(p))) {
			return { [mapping.field]: [mapping.message] };
		}
	}

	return null;
}

function getSecretKey() {
	const key = env.FLW_SECRET_KEY;
	if (!key) throw new Error('FLW_SECRET_KEY is not set');
	return key;
}

async function flutterwaveFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${FLUTTERWAVE_BASE_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${getSecretKey()}`,
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	const data = await response.json();
	if (!response.ok) {
		throw new FlutterwaveError(data.message ?? 'Flutterwave API error', response.status, data);
	}

	return data;
}

interface InitializeResponse {
	status: string;
	message: string;
	data: {
		link: string;
	};
}

export async function initializePayment(params: {
	email: string;
	amount: number; // in kobo — converted to Naira internally
	txRef: string;
	redirectUrl: string;
	customerName?: string;
	customerPhone?: string;
}) {
	return flutterwaveFetch<InitializeResponse>('/payments', {
		method: 'POST',
		body: JSON.stringify({
			tx_ref: params.txRef,
			amount: params.amount / 100, // kobo → Naira
			currency: 'NGN',
			redirect_url: params.redirectUrl,
			customer: {
				email: params.email,
				name: params.customerName,
				phonenumber: params.customerPhone
			},
			customizations: {
				title: 'Vidvie Store'
			}
		})
	});
}

interface VerifyResponse {
	status: string;
	message: string;
	data: {
		id: number;
		tx_ref: string;
		flw_ref: string;
		amount: number; // in Naira
		currency: string;
		status: 'successful' | 'failed';
		customer: { email: string };
	};
}

export async function verifyTransaction(transactionId: string) {
	return flutterwaveFetch<VerifyResponse>(`/transactions/${encodeURIComponent(transactionId)}/verify`);
}

export function validateWebhookHash(verifHash: string): boolean {
	const secretHash = env.FLW_SECRET_HASH;
	if (!secretHash) throw new Error('FLW_SECRET_HASH is not set');
	return verifHash === secretHash;
}
