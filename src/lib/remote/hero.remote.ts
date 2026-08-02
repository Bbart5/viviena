import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import * as z from 'zod';

const heroData = z.object({
	id: z.string(),
	title: z.string(),
	header1: z.string(),
	header2: z.string(),
	header3: z.string(),
	description: z.string()
});

export const getHero = query(async () => {
	const { imageMedia, ...hero } = await prisma.hero.findFirstOrThrow({
		include: { imageMedia: true }
	});

	return { ...hero, imageUrl: imageMedia?.url ?? null };
});

export const updateHero = command(
	heroData.extend({ removeImage: z.boolean() }),
	async ({ id, removeImage, ...data }) => {
		requireAdmin();

		const hero = await prisma.hero.update({ where: { id }, data });

		if (removeImage && hero.imageMediaId) {
			// Deleting the media row clears hero.imageMediaId via the FK's SET NULL.
			await MediaService.getInstance().remove(hero.imageMediaId);
		}

		await getHero().refresh();
	}
);
