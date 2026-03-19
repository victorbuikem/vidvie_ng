import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyTransaction } from '$lib/server/flutterwave';
import { clearCart } from '$lib/server/cart';
import { sendOrderReceipt } from '$lib/server/email';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const status = url.searchParams.get('status');
	const txRef = url.searchParams.get('tx_ref');
	const transactionId = url.searchParams.get('transaction_id');

	if (!txRef || !transactionId) {
		redirect(303, '/');
	}

	// If Flutterwave reports non-successful status in redirect
	if (status !== 'successful') {
		const order = await db.query.orders.findFirst({
			where: eq(orders.paymentReference, txRef)
		});

		if (order && order.paymentStatus === 'pending') {
			await db
				.update(orders)
				.set({ paymentStatus: 'failed', updatedAt: new Date() })
				.where(eq(orders.id, order.id));
		}

		return { status: 'failed' as const, message: 'Payment was not successful' };
	}

	// Find the order
	const order = await db.query.orders.findFirst({
		where: eq(orders.paymentReference, txRef),
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
		const result = await verifyTransaction(transactionId);

		if (result.data.status === 'successful' && result.data.tx_ref === txRef) {
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

			// Send receipt email (non-blocking — don't fail the verification)
			try {
				const shipping = order.shippingAddress as {
					name: string;
					phone: string;
					address: string;
					city: string;
					state: string;
				};
				await sendOrderReceipt({
					to: locals.user?.email ?? '',
					customerName: shipping.name,
					orderId: order.id,
					items: order.items.map((item) => ({
						name: item.product.name,
						quantity: item.quantity,
						priceAtPurchase: item.priceAtPurchase
					})),
					total: order.total,
					shippingAddress: shipping
				});
			} catch (emailError) {
				console.error('Failed to send order receipt email:', emailError);
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
