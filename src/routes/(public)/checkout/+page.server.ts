import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { orders, orderItems, products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getCartWithItems, clearCart } from '$lib/server/cart';
import { initializePayment } from '$lib/server/flutterwave';
import { createId } from '$lib/server/db/id';
import { ulid } from 'ulid';
import { env } from '$env/dynamic/private';

const shippingSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	phone: z.string().min(10, 'Valid phone number required'),
	address: z.string().min(5, 'Address is required'),
	city: z.string().min(2, 'City is required'),
	state: z.string().min(2, 'State is required')
});

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/checkout');
	}

	const cart = await getCartWithItems(locals.user.id, cookies.get('cart_session_id'));
	const items = cart?.items ?? [];

	if (items.length === 0) {
		redirect(303, '/cart');
	}

	const total = items.reduce((sum, item) => {
		const price = item.product.discountPrice ?? item.product.price;
		return sum + price * item.quantity;
	}, 0);

	return {
		cart,
		total,
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies, url }) => {
		if (!locals.user) {
			redirect(303, '/login?redirect=/checkout');
		}

		const formData = await request.formData();
		const shippingData = {
			name: formData.get('name') as string,
			phone: formData.get('phone') as string,
			address: formData.get('address') as string,
			city: formData.get('city') as string,
			state: formData.get('state') as string
		};

		const result = shippingSchema.safeParse(shippingData);
		if (!result.success) {
			return fail(400, {
				shipping: shippingData,
				errors: result.error.flatten().fieldErrors
			});
		}

		// Get cart
		const cart = await getCartWithItems(locals.user.id, cookies.get('cart_session_id'));
		const items = cart?.items ?? [];

		if (items.length === 0) {
			return fail(400, { message: 'Cart is empty' });
		}

		// Verify stock for all items
		for (const item of items) {
			const product = await db.query.products.findFirst({
				where: eq(products.id, item.productId)
			});
			if (!product || product.stock < item.quantity) {
				return fail(400, {
					message: `"${item.product.name}" is out of stock or has insufficient quantity`
				});
			}
		}

		// Calculate total
		const total = items.reduce((sum, item) => {
			const price = item.product.discountPrice ?? item.product.price;
			return sum + price * item.quantity;
		}, 0);

		// Create order
		const orderId = createId('ord');
		const paymentReference = `pay_${ulid()}`;

		await db.insert(orders).values({
			id: orderId,
			userId: locals.user.id,
			status: 'pending',
			total,
			shippingAddress: result.data,
			paymentReference,
			paymentStatus: 'pending'
		});

		// Create order items and decrement stock
		for (const item of items) {
			await db.insert(orderItems).values({
				id: createId('oi'),
				orderId,
				productId: item.productId,
				quantity: item.quantity,
				priceAtPurchase: item.product.discountPrice ?? item.product.price
			});

			await db
				.update(products)
				.set({ stock: item.product.stock - item.quantity })
				.where(eq(products.id, item.productId));
		}

		// Initialize Flutterwave payment
		const origin = env.ORIGIN || url.origin;
		const redirectUrl = `${origin}/checkout/verify`;

		const payment = await initializePayment({
			email: locals.user.email,
			amount: total,
			txRef: paymentReference,
			redirectUrl,
			customerName: result.data.name,
			customerPhone: result.data.phone
		});

		// Redirect to Flutterwave payment page
		redirect(303, payment.data.link);
	}
};
