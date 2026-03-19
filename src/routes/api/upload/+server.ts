import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPresignedUploadUrl, getPublicUrl } from '$lib/server/storage';
import { ulid } from 'ulid';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { filename, contentType } = await request.json();

	if (!filename || !contentType) {
		return json({ error: 'filename and contentType are required' }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(contentType)) {
		return json({ error: 'File type not allowed. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 });
	}

	// Sanitize filename: lowercase, keep alphanumeric + dots + hyphens
	const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
	const safeName = filename
		.replace(/\.[^/.]+$/, '')
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.slice(0, 50);

	const key = `products/${ulid()}-${safeName}.${ext}`;

	const uploadUrl = await getPresignedUploadUrl(key, contentType);
	const publicUrl = getPublicUrl(key);

	return json({ uploadUrl, key, publicUrl });
};
