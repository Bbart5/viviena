import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import * as z from 'zod';

const aboutData = z.object({
	id: z.string(),
	title: z.string(),
	header: z.string(),
	paragraph1: z.string(),
	paragraph2: z.string(),
	paragraph3: z.string(),
	card1Title: z.string(),
	card1Description: z.string(),
	card2Title: z.string(),
	card2Description: z.string(),
	card3Title: z.string(),
	card3Description: z.string(),
	card4Title: z.string(),
	card4Description: z.string()
});

export const getAbout = query(async () => {
	return prisma.about.findFirstOrThrow();
});

export const updateAbout = command(aboutData, async ({ id, ...data }) => {
	requireAdmin();

	await prisma.about.update({ where: { id }, data });

	await getAbout().refresh();
});
