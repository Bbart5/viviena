import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import * as z from 'zod';

const memberData = z.object({
	name: z.string(),
	role: z.string(),
	group: z.enum(['BOARD', 'REVISION'])
});

export const getTeamMembers = query(async () => {
	return prisma.teamMember.findMany({
		include: { imageMedia: true },
		orderBy: { id: 'asc' }
	});
});

export const createTeamMember = command(memberData, async (data) => {
	requireAdmin();

	const member = await prisma.teamMember.create({ data });

	await getTeamMembers().refresh();

	return member;
});

export const updateTeamMember = command(
	memberData.extend({ id: z.string(), removeImage: z.boolean() }),
	async ({ id, removeImage, ...data }) => {
		requireAdmin();

		const member = await prisma.teamMember.update({ where: { id }, data });

		if (removeImage && member.imageMediaId) {
			// Deleting the media row clears member.imageMediaId via the FK's SET NULL.
			await MediaService.getInstance().remove(member.imageMediaId);
		}

		await getTeamMembers().refresh();
	}
);

export const deleteTeamMember = command(z.string(), async (id) => {
	requireAdmin();

	const member = await prisma.teamMember.delete({ where: { id } });

	if (member.imageMediaId) {
		await MediaService.getInstance().remove(member.imageMediaId);
	}

	await getTeamMembers().refresh();
});
