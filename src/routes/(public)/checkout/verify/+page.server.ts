import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyTransaction } from '$lib/server/paystack';
import { clearCart } from '$lib/server/cart';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const reference = url.searchParams.get('reference');

	if (!reference) {
		redirect(303, '/');
	}

	// Find the order
	const order = await db.query.orders.findFirst({
		where: eq(orders.paymentReference, reference),
		with: { items: { with: { product: true } } }
	});

	if (!order) {
		return { status: 'error' as const, message: 'Order not found' };
	}

	// If already verified, just show the status
	if (order.paymentStatus === 'success') {
		return { status: 'success' as const, order };
	}

	try {
		const result = await verifyTransaction(reference);

		if (result.data.status === 'success') {
			await db
				.update(orders)
				.set({
					paymentStatus: 'success',
					status: 'confirmed',
					updatedAt: new Date()
				})
				.where(eq(orders.id, order.id));

			// Clear cart
			const userId = locals.user?.id;
			const sessionId = cookies.get('cart_session_id');
			if (userId || sessionId) {
				const { carts } = await import('$lib/server/db/schema');
				const condition = userId ? eq(carts.userId, userId) : eq(carts.sessionId, sessionId!);
				const cart = await db.query.carts.findFirst({ where: condition });
				if (cart) {
					await clearCart(cart.id);
				}
			}

			return { status: 'success' as const, order: { ...order, paymentStatus: 'success', status: 'confirmed' } };
		} else {
			await db
				.update(orders)
				.set({ paymentStatus: 'failed', updatedAt: new Date() })
				.where(eq(orders.id, order.id));

			return { status: 'failed' as const, message: 'Payment was not successful' };
		}
	} catch {
		return { status: 'error' as const, message: 'Unable to verify payment. Please contact support.' };
	}
};
