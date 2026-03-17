import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { products, carts, cartItems } from '$lib/server/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { createId } from '$lib/server/db/id';

export const load: PageServerLoad = async ({ params }) => {
	const product = await db.query.products.findFirst({
		where: eq(products.slug, params.slug),
		with: { category: true }
	});

	if (!product) {
		error(404, 'Product not found');
	}

	const relatedProducts = await db.query.products.findMany({
		where: and(
			eq(products.categoryId, product.categoryId),
			ne(products.id, product.id),
			eq(products.active, true)
		),
		with: { category: true },
		limit: 4
	});

	return { product, relatedProducts };
};

export const actions: Actions = {
	addToCart: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;
		const quantity = Math.max(1, Number(formData.get('quantity') ?? '1'));

		// Verify product exists and has stock
		const product = await db.query.products.findFirst({
			where: eq(products.id, productId)
		});

		if (!product || product.stock < quantity) {
			return { success: false, message: 'Product unavailable or insufficient stock' };
		}

		const userId = locals.user?.id;
		const sessionId = cookies.get('cart_session_id');

		if (!userId && !sessionId) {
			return { success: false, message: 'Unable to create cart' };
		}

		// Find or create cart
		const condition = userId ? eq(carts.userId, userId) : eq(carts.sessionId, sessionId!);
		let cart = await db.query.carts.findFirst({ where: condition });

		if (!cart) {
			const [newCart] = await db
				.insert(carts)
				.values({
					id: createId('cart'),
					userId: userId ?? null,
					sessionId: userId ? null : sessionId
				})
				.returning();
			cart = newCart;
		}

		// Check if item already in cart
		const existingItem = await db.query.cartItems.findFirst({
			where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
		});

		if (existingItem) {
			await db
				.update(cartItems)
				.set({ quantity: existingItem.quantity + quantity })
				.where(eq(cartItems.id, existingItem.id));
		} else {
			await db.insert(cartItems).values({
				id: createId('ci'),
				cartId: cart.id,
				productId,
				quantity
			});
		}

		return { success: true, message: 'Added to cart' };
	}
};
