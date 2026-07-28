import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	const hero = await prisma.hero.findFirstOrThrow();
	const about = await prisma.about.findFirstOrThrow();
	const areas = await prisma.areas.findFirstOrThrow();

	return {
		hero,
		about,
		areas
	};
};