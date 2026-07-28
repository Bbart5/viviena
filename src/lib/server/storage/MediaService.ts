import { prisma } from '$lib/server/prisma';
import type { Media, MediaType } from '../../../../generated/prisma/client';
import { BucketService } from './BucketService';

export interface MediaUploadInput {
	file: Uint8Array;
	filename: string;
	mimeType: string;
	type: MediaType;
}

export class MediaService {
	private static instance: MediaService;

	private constructor() {}

	public static getInstance(): MediaService {
		if (!MediaService.instance) {
			MediaService.instance = new MediaService();
		}

		return MediaService.instance;
	}

	public get(id: string): Promise<Media> {
		return prisma.media.findUniqueOrThrow({ where: { id } });
	}

	public list(): Promise<Media[]> {
		return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
	}

	public async create(input: MediaUploadInput): Promise<Media> {
		const key = this.buildKey(input.filename);
		const url = await BucketService.getInstance().upload(key, input.file, input.mimeType);

		return prisma.media.create({
			data: {
				type: input.type,
				key,
				url,
				filename: input.filename,
				mimeType: input.mimeType,
				size: input.file.byteLength
			}
		});
	}

	/**
	 * The old bucket object is always deleted BEFORE the staged file is uploaded
	 * (see BucketService.overwrite); only then is the database row updated.
	 */
	public async replace(id: string, input: Omit<MediaUploadInput, 'type'>): Promise<Media> {
		const existing = await prisma.media.findUniqueOrThrow({ where: { id } });
		const newKey = this.buildKey(input.filename);
		const url = await BucketService.getInstance().overwrite(
			existing.key,
			newKey,
			input.file,
			input.mimeType
		);

		return prisma.media.update({
			where: { id },
			data: {
				key: newKey,
				url,
				filename: input.filename,
				mimeType: input.mimeType,
				size: input.file.byteLength
			}
		});
	}

	public async remove(id: string): Promise<void> {
		const existing = await prisma.media.findUniqueOrThrow({ where: { id } });

		await BucketService.getInstance().delete(existing.key);
		await prisma.media.delete({ where: { id } });
	}

	private buildKey(filename: string): string {
		return `${crypto.randomUUID()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
	}
}
