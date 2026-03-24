import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user!
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();

		if (!name || name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters', name });
		}

		try {
			await auth.api.updateUser({
				headers: request.headers,
				body: { name }
			});
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: 'Failed to update profile. Please try again.', name });
		}
	}
};
