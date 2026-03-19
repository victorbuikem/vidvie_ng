import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getObject } from '$lib/server/storage';

export const GET: RequestHandler = async ({ params }) => {
	const key = params.key;
	if (!key || key.includes('..') || key.startsWith('/')) {
		error(400, 'Invalid image key');
	}

	try {
		const response = await getObject(key);

		if (!response.Body) {
			error(404, 'Image not found');
		}

		const contentType = response.ContentType ?? 'application/octet-stream';
		if (!contentType.startsWith('image/')) {
			error(403, 'Not an image');
		}

		const body = response.Body.transformToWebStream();

		const headers: Record<string, string> = {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		};

		if (response.ContentLength != null) {
			headers['Content-Length'] = response.ContentLength.toString();
		}
		if (response.ETag) {
			headers['ETag'] = response.ETag;
		}

		return new Response(body as ReadableStream, { status: 200, headers });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err; // re-throw SvelteKit errors
		const s3Err = err as { name?: string; $metadata?: { httpStatusCode?: number } };
		if (s3Err.name === 'NoSuchKey' || s3Err.$metadata?.httpStatusCode === 404) {
			error(404, 'Image not found');
		}
		console.error('Image proxy error:', err);
		error(500, 'Failed to fetch image');
	}
};
