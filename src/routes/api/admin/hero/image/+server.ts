import { ACCEPTED_IMAGE_MIME_TYPES } from '$lib/consts/storage';
import { apiError } from '$lib/server/api';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_SIZE_BYTES = 10 * 1000 * 1000; // 10 MB

export const DELETE: RequestHandler = async () => {
	try {
		const hero = await prisma.hero.findFirstOrThrow();

		if (hero.imageMediaId) {
			// Deleting the media row clears hero.imageMediaId via the FK's SET NULL.
			await MediaService.getInstance().remove(hero.imageMediaId);
		}

		return json({ success: true });
	} catch (error) {
		console.error(error);

		return apiError('Nie udało się usunąć obrazu.');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('files');

		if (!(file instanceof File) || file.size === 0) {
			return apiError('Nie przesłano pliku.', 400);
		}

		if (!(ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
			return apiError('Nieobsługiwany format obrazu.', 400);
		}

		if (file.size > MAX_SIZE_BYTES) {
			return apiError('Plik jest zbyt duży (maks. 10 MB).', 400);
		}

		const bytes = new Uint8Array(await file.arrayBuffer());
		const hero = await prisma.hero.findFirstOrThrow({ include: { imageMedia: true } });

		const mediaService = MediaService.getInstance();
		const input = { file: bytes, filename: file.name, mimeType: file.type };

		// replace() reuses the existing row, so only a fresh row needs linking.
		const media = hero.imageMedia
			? await mediaService.replace(hero.imageMedia.id, input)
			: await mediaService.create({ ...input, type: 'IMAGE' });

		if (!hero.imageMedia) {
			await prisma.hero.update({ where: { id: hero.id }, data: { imageMediaId: media.id } });
		}

		return json({ success: true, media });
	} catch (error) {
		console.error(error);

		return apiError('Nie udało się przesłać obrazu.');
	}
};
