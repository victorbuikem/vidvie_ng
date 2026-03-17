import type { PageServerLoad, Actions } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const productSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	price: z.number().positive('Price must be positive'),
	discountPrice: z.number().positive().nullable(),
	categoryId: z.string().min(1, 'Category is required'),
	stock: z.number().int().min(0, 'Stock cannot be negative'),
	images: z.array(z.string().url()).default([]),
	featuredOnLanding: z.boolean().default(false)
});

export const load: PageServerLoad = async ({ params }) => {
	const product = await db.query.products.findFirst({
		where: eq(products.id, params.id),
		with: { category: true }
	});

	if (!product) {
		error(404, 'Product not found');
	}

	const allCategories = await db.query.categories.findMany();
	return { product, categories: allCategories };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const images = (formData.get('images') as string)
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		const data = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: Number(formData.get('price')) * 100,
			discountPrice: formData.get('discountPrice')
				? Number(formData.get('discountPrice')) * 100
				: null,
			categoryId: formData.get('categoryId') as string,
			stock: Number(formData.get('stock') ?? '0'),
			images,
			featuredOnLanding: formData.get('featuredOnLanding') === 'on'
		};

		const result = productSchema.safeParse(data);
		if (!result.success) {
			return fail(400, { data, errors: result.error.flatten().fieldErrors });
		}

		const slug = data.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

		await db
			.update(products)
			.set({ ...result.data, slug, updatedAt: new Date() })
			.where(eq(products.id, params.id));

		redirect(303, '/admin/products');
	}
};
