import { env } from '$env/dynamic/private';

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

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
		throw new Error(data.message ?? 'Flutterwave API error');
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
