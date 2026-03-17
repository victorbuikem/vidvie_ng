import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '$lib/server/db/id';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allCategories = await db.query.categories.findMany({
		with: { products: true }
	});

	return { categories: allCategories };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const image = formData.get('image') as string;

		if (!name?.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

		await db.insert(categories).values({
			id: createId('cat'),
			name: name.trim(),
			slug,
			description: description?.trim() || null,
			image: image?.trim() || null
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const image = formData.get('image') as string;

		if (!name?.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

		await db
			.update(categories)
			.set({
				name: name.trim(),
				slug,
				description: description?.trim() || null,
				image: image?.trim() || null
			})
			.where(eq(categories.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await db.delete(categories).where(eq(categories.id, id));
			return { success: true };
		} catch {
			return fail(400, { error: 'Cannot delete category with existing products' });
		}
	}
};
