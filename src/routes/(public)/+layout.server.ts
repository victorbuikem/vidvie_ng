import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { cartItems, carts } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	let cartCount = 0;

	const userId = locals.user?.id;
	const sessionId = cookies.get('cart_session_id');

	if (userId || sessionId) {
		const condition = userId ? eq(carts.userId, userId) : eq(carts.sessionId, sessionId!);

		const result = await db
			.select({ count: sql<number>`cast(coalesce(sum(${cartItems.quantity}), 0) as int)` })
			.from(carts)
			.leftJoin(cartItems, eq(carts.id, cartItems.cartId))
			.where(condition);

		cartCount = result[0]?.count ?? 0;
	}

	return {
		user: locals.user ?? null,
		cartCount
	};
};
