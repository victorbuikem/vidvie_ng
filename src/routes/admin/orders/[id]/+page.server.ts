import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const order = await db.query.orders.findFirst({
		where: eq(orders.id, params.id),
		with: {
			items: { with: { product: true } },
			user: true
		}
	});

	if (!order) {
		error(404, 'Order not found');
	}

	return { order };
};

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();
		const status = formData.get('status') as string;

		await db
			.update(orders)
			.set({ status, updatedAt: new Date() })
			.where(eq(orders.id, params.id));

		return { success: true };
	}
};
