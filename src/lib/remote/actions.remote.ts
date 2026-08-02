import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import * as z from 'zod';

const actionData = z.object({
	title: z.string(),
	date: z.string(),
	tag: z.string(),
	tagColor: z.string(),
	description: z.string(),
	details: z.array(z.string()),
	relation: z.string(),
	people: z.array(z.string()),
	partners: z.array(z.string()),
	showCta: z.boolean(),
	ctaLabel: z.string()
});

export const getActions = query(async () => {
	return prisma.action.findMany({
		include: { imageMedia: true },
		orderBy: { createdAt: 'desc' }
	});
});

export const createAction = command(actionData, async (data) => {
	requireAdmin();

	const action = await prisma.action.create({ data });

	await getActions().refresh();

	return action;
});

export const updateAction = command(
	actionData.extend({ id: z.string(), removeImage: z.boolean() }),
	async ({ id, removeImage, ...data }) => {
		requireAdmin();

		const action = await prisma.action.update({ where: { id }, data });

		if (removeImage && action.imageMediaId) {
			// Deleting the media row clears action.imageMediaId via the FK's SET NULL.
			await MediaService.getInstance().remove(action.imageMediaId);
		}

		await getActions().refresh();
	}
);

export const deleteAction = command(z.string(), async (id) => {
	requireAdmin();

	const action = await prisma.action.delete({ where: { id } });

	if (action.imageMediaId) {
		await MediaService.getInstance().remove(action.imageMediaId);
	}

	await getActions().refresh();
});
