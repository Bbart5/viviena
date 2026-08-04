import { SITE_URL } from '$lib/consts/site';
import { documents } from '$lib/data/site-content';
import type { RequestHandler } from '@sveltejs/kit';

// Generated once per build: the homepage plus every document from site-content,
// so newly added documents show up automatically. lastmod is the build date.
export const prerender = true;

export const GET: RequestHandler = () => {
	const lastmod = new Date().toISOString().slice(0, 10);
	const paths = ['/', ...documents.map((doc) => doc.href)];

	const urls = paths
		.map(
			(path) =>
				`\t<url>\n\t\t<loc>${new URL(path, SITE_URL).href}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t</url>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
