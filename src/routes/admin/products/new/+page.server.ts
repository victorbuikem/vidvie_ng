import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';
import { createId } from '$lib/server/db/id';
import { z } from 'zod';

const productSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	price: z.number().positive('Price must be positive'),
	discountPrice: z.number().positive().nullable(),
	categoryId: z.string().min(1, 'Category is required'),
	stock: z.number().int().min(0, 'Stock cannot be negative'),
	images: z.array(z.string()).default([]),
	featuredOnLanding: z.boolean().default(false)
});

export const load: PageServerLoad = async () => {
	const allCategories = await db.query.categories.findMany();
	return { categories: allCategories };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const images = (formData.get('images') as string)
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		const data = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: Number(formData.get('price')) * 100, // Naira to kobo
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

		await db.insert(products).values({
			id: createId('prod'),
			...result.data,
			slug,
			active: true
		});

		redirect(303, '/admin/products');
	}
};
