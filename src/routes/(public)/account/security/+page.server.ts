import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword) {
			return fail(400, { error: 'Current password is required' });
		}

		if (!newPassword || newPassword.length < 8) {
			return fail(400, { error: 'New password must be at least 8 characters' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		try {
			await auth.api.changePassword({
				headers: request.headers,
				body: { currentPassword, newPassword }
			});
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: 'Incorrect current password' });
		}
	}
};
