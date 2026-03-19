import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { categories, products } from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

/**
 * Converts a Railway bucket URL to a proxy URL.
 * e.g. https://<endpoint>/<bucket>/products/abc.jpg → /api/images/products/abc.jpg
 */
function toProxyUrl(url: string): string {
	if (!url) return url;
	if (url.startsWith('/api/images/')) return url;

	const match = url.match(/^https?:\/\/[^/]+\/[^/]+\/((?:products|categories)\/.+)$/);
	if (match) {
		return `/api/images/${match[1]}`;
	}
	return url;
}

async function main() {
	console.log('Migrating image URLs to proxy format...\n');

	// Migrate products
	const allProducts = await db.select({ id: products.id, images: products.images }).from(products);
	let productCount = 0;

	for (const product of allProducts) {
		const newImages = product.images.map(toProxyUrl);
		const changed = newImages.some((url, i) => url !== product.images[i]);

		if (changed) {
			await db.update(products).set({ images: newImages }).where(eq(products.id, product.id));
			productCount++;
		}
	}

	console.log(`  Products updated: ${productCount} / ${allProducts.length}`);

	// Migrate categories
	const allCategories = await db
		.select({ id: categories.id, image: categories.image })
		.from(categories);
	let categoryCount = 0;

	for (const category of allCategories) {
		if (category.image) {
			const newImage = toProxyUrl(category.image);
			if (newImage !== category.image) {
				await db
					.update(categories)
					.set({ image: newImage })
					.where(eq(categories.id, category.id));
				categoryCount++;
			}
		}
	}

	console.log(`  Categories updated: ${categoryCount} / ${allCategories.length}`);
	console.log('\nDone!');

	await client.end();
}

main().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
