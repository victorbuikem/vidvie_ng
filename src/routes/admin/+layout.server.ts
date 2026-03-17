import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Defense in depth — hooks.server.ts also guards this
	if (!locals.user || locals.user.role !== 'admin') {
		redirect(303, '/');
	}

	return {
		user: locals.user
	};
};
