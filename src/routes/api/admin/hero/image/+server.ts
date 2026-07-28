import { ACCEPTED_IMAGE_MIME_TYPES } from '$lib/consts/storage';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_SIZE_BYTES = 10 * 1000 * 1000; // 10 MB

export const DELETE: RequestHandler = async () => {
	try {
		const hero = await prisma.hero.findFirstOrThrow();

		if (hero.imageMediaId) {
			const existing = await prisma.media.findUnique({ where: { id: hero.imageMediaId } });

			await prisma.hero.update({ where: { id: hero.id }, data: { imageMediaId: null } });

			if (existing) {
				await MediaService.getInstance().remove(existing.id);
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error(error);

		return json(
			{
				success: false,
				message: 'Nie udało się usunąć obrazu.'
			},
			{
				status: 500
			}
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('files');

		if (!(file instanceof File) || file.size === 0) {
			return json({ success: false, message: 'Nie przesłano pliku.' }, { status: 400 });
		}

		if (!(ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
			return json({ success: false, message: 'Nieobsługiwany format obrazu.' }, { status: 400 });
		}

		if (file.size > MAX_SIZE_BYTES) {
			return json(
				{ success: false, message: 'Plik jest zbyt duży (maks. 10 MB).' },
				{ status: 400 }
			);
		}

		const bytes = new Uint8Array(await file.arrayBuffer());
		const hero = await prisma.hero.findFirstOrThrow();
		const existing = hero.imageMediaId
			? await prisma.media.findUnique({ where: { id: hero.imageMediaId } })
			: null;

		const mediaService = MediaService.getInstance();
		const input = { file: bytes, filename: file.name, mimeType: file.type };

		// Replace deletes the old bucket object BEFORE uploading the staged one.
		const media = existing
			? await mediaService.replace(existing.id, input)
			: await mediaService.create({ ...input, type: 'IMAGE' });

		if (hero.imageMediaId !== media.id) {
			await prisma.hero.update({ where: { id: hero.id }, data: { imageMediaId: media.id } });
		}

		return json({
			success: true,
			media
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				success: false,
				message: 'Nie udało się przesłać obrazu.'
			},
			{
				status: 500
			}
		);
	}
};
