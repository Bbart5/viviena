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

	public async replace(id: string, input: Omit<MediaUploadInput, 'type'>): Promise<Media> {
		const existing = await prisma.media.findUniqueOrThrow({ where: { id } });
		const bucket = BucketService.getInstance();
		const key = this.buildKey(input.filename);
		const url = await bucket.upload(key, input.file, input.mimeType);

		const media = await prisma.media.update({
			where: { id },
			data: {
				key,
				url,
				filename: input.filename,
				mimeType: input.mimeType,
				size: input.file.byteLength
			}
		});

		// The old object is deleted last so a failed upload or row update never
		// leaves the site pointing at a missing file; a failed delete merely
		// orphans the old object in the bucket.
		try {
			await bucket.delete(existing.key);
		} catch (error) {
			console.error(`Failed to delete replaced bucket object "${existing.key}".`, error);
		}

		return media;
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
