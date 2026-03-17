import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function getSecretKey() {
	const key = env.PAYSTACK_SECRET_KEY;
	if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set');
	return key;
}

async function paystackFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${getSecretKey()}`,
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message ?? 'Paystack API error');
	}

	return data;
}

interface InitializeResponse {
	status: boolean;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export async function initializeTransaction(params: {
	email: string;
	amount: number; // in kobo
	reference: string;
	callbackUrl: string;
	metadata?: Record<string, unknown>;
}) {
	return paystackFetch<InitializeResponse>('/transaction/initialize', {
		method: 'POST',
		body: JSON.stringify({
			email: params.email,
			amount: params.amount,
			reference: params.reference,
			callback_url: params.callbackUrl,
			metadata: params.metadata
		})
	});
}

interface VerifyResponse {
	status: boolean;
	message: string;
	data: {
		status: 'success' | 'failed' | 'abandoned';
		reference: string;
		amount: number;
		currency: string;
		customer: { email: string };
	};
}

export async function verifyTransaction(reference: string) {
	return paystackFetch<VerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

export function validateWebhookSignature(body: string, signature: string): boolean {
	const hash = crypto
		.createHmac('sha512', getSecretKey())
		.update(body)
		.digest('hex');
	return hash === signature;
}
