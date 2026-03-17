import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders, products } from '$lib/server/db/schema';
import { eq, sql, desc, lt } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [orderStats, revenueResult, lowStockProducts, recentOrders] = await Promise.all([
		db
			.select({ total: sql<number>`cast(count(*) as int)` })
			.from(orders),
		db
			.select({ revenue: sql<number>`cast(coalesce(sum(${orders.total}), 0) as int)` })
			.from(orders)
			.where(eq(orders.paymentStatus, 'success')),
		db.query.products.findMany({
			where: lt(products.stock, 5),
			with: { category: true },
			orderBy: products.stock
		}),
		db.query.orders.findMany({
			orderBy: desc(orders.createdAt),
			limit: 10,
			with: { items: true }
		})
	]);

	return {
		totalOrders: orderStats[0]?.total ?? 0,
		totalRevenue: revenueResult[0]?.revenue ?? 0,
		lowStockProducts,
		recentOrders
	};
};
