import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, eq, and, count } from 'drizzle-orm';

const ITEMS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ locals, url }) => {
	const userId = locals.user!.id;
	const status = url.searchParams.get('status');
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));

	const conditions = [eq(orders.userId, userId)];
	if (status) conditions.push(eq(orders.status, status));

	const whereClause = and(...conditions);

	const [orderList, [countResult]] = await Promise.all([
		db.query.orders.findMany({
			where: whereClause,
			with: { items: true },
			orderBy: desc(orders.createdAt),
			limit: ITEMS_PER_PAGE,
			offset: (page - 1) * ITEMS_PER_PAGE
		}),
		db.select({ total: count() }).from(orders).where(whereClause)
	]);

	return {
		orders: orderList,
		totalOrders: countResult?.total ?? 0,
		totalPages: Math.ceil((countResult?.total ?? 0) / ITEMS_PER_PAGE),
		currentPage: page,
		statusFilter: status
	};
};
