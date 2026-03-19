/**
 * Converts a Railway bucket URL to a proxy URL.
 * Already-proxied URLs and empty strings pass through unchanged.
 */
export function proxyImageUrl(url: string): string {
	if (!url) return url;
	if (url.startsWith('/api/images/')) return url;

	// Match Railway bucket URLs: https://<endpoint>/<bucket>/<key>
	const match = url.match(/^https?:\/\/[^/]+\/[^/]+\/((?:products|categories)\/.+)$/);
	if (match) {
		return `/api/images/${match[1]}`;
	}

	return url;
}
