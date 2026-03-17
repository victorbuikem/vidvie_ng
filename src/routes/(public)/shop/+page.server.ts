import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';
import { and, eq, gte, lte, ilike, desc, asc, sql, count } from 'drizzle-orm';

const ITEMS_PER_PAGE = 12;

export const load: PageServerLoad = async ({ url }) => {
	const categorySlug = url.searchParams.get('category');
	const search = url.searchParams.get('search');
	const minPrice = url.searchParams.get('minPrice');
	const maxPrice = url.searchParams.get('maxPrice');
	const sort = url.searchParams.get('sort') ?? 'newest';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));

	// Build where conditions
	const conditions = [eq(products.active, true)];

	if (categorySlug) {
		const category = await db.query.categories.findFirst({
			where: eq(categories.slug, categorySlug)
		});
		if (category) {
			conditions.push(eq(products.categoryId, category.id));
		}
	}

	if (search) {
		conditions.push(ilike(products.name, `%${search}%`));
	}

	if (minPrice) {
		conditions.push(gte(products.price, Number(minPrice) * 100)); // convert Naira to kobo
	}

	if (maxPrice) {
		conditions.push(lte(products.price, Number(maxPrice) * 100));
	}

	const whereClause = and(...conditions);

	// Sort
	const orderBy = (() => {
		switch (sort) {
			case 'price-asc':
				return asc(products.price);
			case 'price-desc':
				return desc(products.price);
			case 'newest':
			default:
				return desc(products.createdAt);
		}
	})();

	// Fetch products and total count in parallel
	const [productList, [countResult], allCategories] = await Promise.all([
		db.query.products.findMany({
			where: whereClause,
			with: { category: true },
			orderBy,
			limit: ITEMS_PER_PAGE,
			offset: (page - 1) * ITEMS_PER_PAGE
		}),
		db.select({ total: count() }).from(products).where(whereClause),
		db.query.categories.findMany()
	]);

	const totalProducts = countResult?.total ?? 0;
	const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

	return {
		products: productList,
		categories: allCategories,
		totalProducts,
		totalPages,
		currentPage: page,
		filters: { category: categorySlug, search, minPrice, maxPrice, sort }
	};
};
