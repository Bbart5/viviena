import { ACCEPTED_IMAGE_MIME_TYPES } from '$lib/consts/storage';
import { apiError } from '$lib/server/api';
import { prisma } from '$lib/server/prisma';
import { MediaService } from '$lib/server/storage/MediaService';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_SIZE_BYTES = 10 * 1000 * 1000; // 10 MB

// Uploads stay a multipart endpoint because command() arguments are
// devalue-serialized JSON and cannot carry a File. Image removal lives in the
// updateAction command instead.
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const id = params.id;
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
		const action = await prisma.action.findUniqueOrThrow({
			where: { id },
			include: { imageMedia: true }
		});

		const mediaService = MediaService.getInstance();
		const input = { file: bytes, filename: file.name, mimeType: file.type };

		// replace() reuses the existing row, so only a fresh row needs linking.
		const media = action.imageMedia
			? await mediaService.replace(action.imageMedia.id, input)
			: await mediaService.create({ ...input, type: 'IMAGE' });

		if (!action.imageMedia) {
			await prisma.action.update({ where: { id }, data: { imageMediaId: media.id } });
		}

		return json({ success: true, media });
	} catch (error) {
		console.error(error);

		return apiError('Nie udało się przesłać obrazu.');
	}
};
