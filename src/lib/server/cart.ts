import { db } from '$lib/server/db';
import { carts, cartItems, products } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { createId } from '$lib/server/db/id';

export async function getOrCreateCart(userId?: string | null, sessionId?: string | null) {
	if (!userId && !sessionId) return null;

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

	return cart;
}

export async function getCartWithItems(userId?: string | null, sessionId?: string | null) {
	if (!userId && !sessionId) return null;

	const condition = userId ? eq(carts.userId, userId) : eq(carts.sessionId, sessionId!);
	return db.query.carts.findFirst({
		where: condition,
		with: {
			items: {
				with: {
					product: {
						with: { category: true }
					}
				}
			}
		}
	});
}

export async function addItem(cartId: string, productId: string, quantity: number) {
	const existing = await db.query.cartItems.findFirst({
		where: and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
	});

	if (existing) {
		await db
			.update(cartItems)
			.set({ quantity: existing.quantity + quantity })
			.where(eq(cartItems.id, existing.id));
	} else {
		await db.insert(cartItems).values({
			id: createId('ci'),
			cartId,
			productId,
			quantity
		});
	}
}

export async function updateItemQuantity(itemId: string, quantity: number) {
	if (quantity <= 0) {
		await db.delete(cartItems).where(eq(cartItems.id, itemId));
	} else {
		await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
	}
}

export async function removeItem(itemId: string) {
	await db.delete(cartItems).where(eq(cartItems.id, itemId));
}

export async function clearCart(cartId: string) {
	await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function mergeGuestCartToUser(sessionId: string, userId: string) {
	const guestCart = await db.query.carts.findFirst({
		where: eq(carts.sessionId, sessionId),
		with: { items: true }
	});

	if (!guestCart || guestCart.items.length === 0) return;

	const userCart = await getOrCreateCart(userId);
	if (!userCart) return;

	for (const item of guestCart.items) {
		await addItem(userCart.id, item.productId, item.quantity);
	}

	// Clean up guest cart
	await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
	await db.delete(carts).where(eq(carts.id, guestCart.id));
}
