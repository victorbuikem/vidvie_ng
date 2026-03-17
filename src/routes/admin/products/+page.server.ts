import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq, desc, ilike, count, and } from 'drizzle-orm';

const ITEMS_PER_PAGE = 20;

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search');
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));

	const conditions = [];
	if (search) {
		conditions.push(ilike(products.name, `%${search}%`));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [productList, [countResult], allCategories] = await Promise.all([
		db.query.products.findMany({
			where: whereClause,
			with: { category: true },
			orderBy: desc(products.createdAt),
			limit: ITEMS_PER_PAGE,
			offset: (page - 1) * ITEMS_PER_PAGE
		}),
		db.select({ total: count() }).from(products).where(whereClause),
		db.query.categories.findMany()
	]);

	return {
		products: productList,
		categories: allCategories,
		totalProducts: countResult?.total ?? 0,
		totalPages: Math.ceil((countResult?.total ?? 0) / ITEMS_PER_PAGE),
		currentPage: page,
		search
	};
};

export const actions: Actions = {
	toggleFeatured: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const featured = formData.get('featured') === 'true';

		await db
			.update(products)
			.set({ featuredOnLanding: featured })
			.where(eq(products.id, id));

		return { success: true };
	},

	toggleActive: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const active = formData.get('active') === 'true';

		await db
			.update(products)
			.set({ active })
			.where(eq(products.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.delete(products).where(eq(products.id, id));
		return { success: true };
	}
};
