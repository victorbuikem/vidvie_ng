import type { Actions } from './$types';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const contactSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	phone: z.string().optional(),
	message: z.string().min(10, 'Message must be at least 10 characters')
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			phone: formData.get('phone') as string,
			message: formData.get('message') as string
		};

		const result = contactSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				data,
				errors: result.error.flatten().fieldErrors
			});
		}

		// TODO: Store message in DB or send via email service
		// For now, just return success
		return { success: true };
	}
};
