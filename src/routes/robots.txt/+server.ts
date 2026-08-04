import { SITE_URL } from '$lib/consts/site';
import type { RequestHandler } from '@sveltejs/kit';

// Generated at build time so the sitemap URL always follows SITE_URL.
export const prerender = true;

export const GET: RequestHandler = () => {
	const body = [
		'# Public site is crawlable; the admin panel and API are not.',
		'User-agent: *',
		'Disallow: /admin',
		'Disallow: /api',
		'',
		`Sitemap: ${new URL('/sitemap.xml', SITE_URL).href}`,
		''
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
