import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { ulid } from 'ulid';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// Admin route protection
	if (event.url.pathname.startsWith('/admin')) {
		if (!session || session.user.role !== 'admin') {
			redirect(303, '/');
		}
	}

	// Anonymous cart session cookie
	if (!session && !event.cookies.get('cart_session_id')) {
		event.cookies.set('cart_session_id', ulid(), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
