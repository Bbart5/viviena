import { SITE_DESCRIPTION } from '$lib/consts/site';
import { renderOgImage, type OgCardContent } from '$lib/server/og/render';
import { prisma } from '$lib/server/prisma';
import { error, type RequestHandler } from '@sveltejs/kit';

const DEFAULT_CARD: OgCardContent = {
	kicker: 'Stowarzyszenie',
	headline: ['Działamy tam, gdzie', 'dziś potrzeba najwięcej'],
	description: SITE_DESCRIPTION
};

// Content sourced live from the database, so the shared card always matches the
// hero/about copy the admins publish. Falls back to DEFAULT_CARD on any failure.
const DYNAMIC_CARDS: Record<string, () => Promise<OgCardContent>> = {
	home: async () => {
		const hero = await prisma.hero.findFirstOrThrow();
		return {
			kicker: hero.title,
			headline: [hero.header1, hero.header2, hero.header3],
			description: hero.description
		};
	},
	'o-nas': async () => {
		const about = await prisma.about.findFirstOrThrow();
		return {
			kicker: about.title,
			headline: [about.header],
			description: about.paragraph1
		};
	}
};

const STATIC_CARDS: Record<string, OgCardContent> = {
	dzialania: {
		kicker: 'Nasze działania',
		headline: ['Inicjatywy i projekty', 'na rzecz społeczności'],
		description: 'Zobacz, jakie działania prowadzi Stowarzyszenie VIVIENA i jak możesz się włączyć.'
	},
	zespol: {
		kicker: 'Nasz zespół',
		headline: ['Ludzie, którzy tworzą', 'Stowarzyszenie VIVIENA'],
		description: 'Poznaj osoby zaangażowane w codzienną pracę i rozwój stowarzyszenia.'
	},
	dokumenty: {
		kicker: 'Dokumenty',
		headline: ['Dokumenty i informacje', 'organizacyjne'],
		description: 'Polityka prywatności, regulamin strony oraz dane organizacyjne stowarzyszenia.'
	},
	kontakt: {
		kicker: 'Kontakt',
		headline: ['Skontaktuj się', 'z nami'],
		description: 'Masz pytanie lub chcesz nawiązać współpracę? Napisz do Stowarzyszenia VIVIENA.'
	}
};

async function resolveCard(slug: string): Promise<OgCardContent> {
	const loadDynamic = DYNAMIC_CARDS[slug];
	if (loadDynamic) {
		try {
			return await loadDynamic();
		} catch {
			return DEFAULT_CARD;
		}
	}

	const staticCard = STATIC_CARDS[slug];
	if (staticCard) {
		return staticCard;
	}

	throw error(404, 'Nie znaleziono obrazka.');
}

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	const png = await renderOgImage(await resolveCard(params.card!));

	setHeaders({
		'Content-Type': 'image/png',
		// Cacheable at the CDN for a day; stale copies may be served while revalidating,
		// so admin content edits show up in link previews within ~a day.
		'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
	});

	return new Response(new Uint8Array(png));
};
