import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const order = await db.query.orders.findFirst({
		where: and(eq(orders.id, params.id), eq(orders.userId, locals.user!.id)),
		with: {
			items: {
				with: { product: true }
			}
		}
	});

	if (!order) {
		error(404, 'Order not found');
	}

	return { order };
};
