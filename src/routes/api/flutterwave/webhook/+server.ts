import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { validateWebhookHash } from '$lib/server/flutterwave';

export const POST: RequestHandler = async ({ request }) => {
	const verifHash = request.headers.get('verif-hash');

	if (!verifHash || !validateWebhookHash(verifHash)) {
		return json({ error: 'Invalid hash' }, { status: 401 });
	}

	const event = await request.json();

	if (event.event === 'charge.completed' && event.data?.status === 'successful') {
		const txRef = event.data.tx_ref as string;

		const order = await db.query.orders.findFirst({
			where: eq(orders.paymentReference, txRef)
		});

		if (order && order.paymentStatus !== 'success') {
			await db
				.update(orders)
				.set({
					paymentStatus: 'success',
					status: 'confirmed',
					updatedAt: new Date()
				})
				.where(eq(orders.id, order.id));
		}
	}

	return json({ received: true });
};
