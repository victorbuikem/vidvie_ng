import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { validateWebhookSignature } from '$lib/server/paystack';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('x-paystack-signature');

	if (!signature || !validateWebhookSignature(body, signature)) {
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	const event = JSON.parse(body);

	if (event.event === 'charge.success') {
		const reference = event.data.reference as string;

		const order = await db.query.orders.findFirst({
			where: eq(orders.paymentReference, reference)
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
