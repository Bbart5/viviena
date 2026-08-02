import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import * as z from 'zod';

const areasData = z.object({
	id: z.string(),
	title: z.string(),
	header1: z.string(),
	paragraph1: z.string(),
	header2: z.string(),
	paragraph2: z.string(),
	header3: z.string(),
	paragraph3: z.string(),
	header4: z.string(),
	paragraph4: z.string(),
	header5: z.string(),
	paragraph5: z.string()
});

export const getAreas = query(async () => {
	return prisma.areas.findFirstOrThrow();
});

export const updateAreas = command(areasData, async ({ id, ...data }) => {
	requireAdmin();

	await prisma.areas.update({ where: { id }, data });

	await getAreas().refresh();
});
