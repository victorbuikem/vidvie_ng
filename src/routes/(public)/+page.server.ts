import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';
import { eq, isNotNull, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [featuredProducts, discountedProducts, allCategories] = await Promise.all([
		db.query.products.findMany({
			where: eq(products.featuredOnLanding, true),
			with: { category: true },
			limit: 8
		}),
		db.query.products.findMany({
			where: isNotNull(products.discountPrice),
			with: { category: true },
			limit: 4,
			orderBy: desc(products.createdAt)
		}),
		db.query.categories.findMany()
	]);

	return {
		featuredProducts,
		discountedProducts,
		categories: allCategories
	};
};
