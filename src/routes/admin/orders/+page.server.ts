import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, eq, and, count } from 'drizzle-orm';

const ITEMS_PER_PAGE = 20;

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status');
	const paymentStatus = url.searchParams.get('paymentStatus');
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));

	const conditions = [];
	if (status) conditions.push(eq(orders.status, status));
	if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [orderList, [countResult]] = await Promise.all([
		db.query.orders.findMany({
			where: whereClause,
			with: { items: true, user: true },
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
		filters: { status, paymentStatus }
	};
};
