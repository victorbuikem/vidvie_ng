import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [orderCountResult, recentOrder] = await Promise.all([
		db.select({ total: count() }).from(orders).where(eq(orders.userId, userId)),
		db.query.orders.findFirst({
			where: eq(orders.userId, userId),
			orderBy: [desc(orders.createdAt)],
			columns: { id: true, status: true, createdAt: true, total: true }
		})
	]);

	return {
		orderCount: orderCountResult[0]?.total ?? 0,
		recentOrder: recentOrder ?? null
	};
};

export const actions: Actions = {
	signout: async ({ request }) => {
		await auth.api.signOut({ headers: request.headers });
		redirect(303, '/');
	}
};
