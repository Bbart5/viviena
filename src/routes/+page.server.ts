import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	const { imageMedia, ...hero } = await prisma.hero.findFirstOrThrow({
		include: { imageMedia: true }
	});
	const about = await prisma.about.findFirstOrThrow();
	const areas = await prisma.areas.findFirstOrThrow();
	const actions = await prisma.action.findMany();

	return {
		hero: { ...hero, imageUrl: imageMedia?.url ?? null },
		about,
		areas,
		actions
	};
};
