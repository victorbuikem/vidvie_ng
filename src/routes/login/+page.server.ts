import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirect') ?? '/';
		redirect(303, redirectTo);
	}
	return {
		redirectTo: url.searchParams.get('redirect') ?? '/'
	};
};

export const actions: Actions = {
	signin: async ({ request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = formData.get('redirect') as string ?? '/';

		try {
			await auth.api.signInEmail({
				body: { email, password }
			});
			redirect(303, redirectTo);
		} catch (e: any) {
			if (e?.status === 303) throw e; // re-throw redirect
			return fail(400, { email, error: 'Invalid email or password', mode: 'signin' as const });
		}
	},

	signup: async ({ request, url }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = formData.get('redirect') as string ?? '/';

		if (!name || name.length < 2) {
			return fail(400, { email, error: 'Name must be at least 2 characters', mode: 'signup' as const });
		}

		if (password.length < 8) {
			return fail(400, { email, error: 'Password must be at least 8 characters', mode: 'signup' as const });
		}

		try {
			await auth.api.signUpEmail({
				body: { email, password, name }
			});
			redirect(303, redirectTo);
		} catch (e: any) {
			if (e?.status === 303) throw e;
			return fail(400, { email, error: 'Account creation failed. Email may already be in use.', mode: 'signup' as const });
		}
	}
};
