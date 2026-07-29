// Decimal units — Cloudflare bills in GB-months, not GiB.
export const R2_FREE_TIER_LIMITS = {
	storageBytes: 10 * 1000 ** 3, // 10 GB
	classAOps: 1 * 1000 ** 2,
	classBOps: 10 * 1000 ** 2
} as const;

export const PRISMA_POSTGRES_FREE_TIER_LIMITS = {
	databaseBytes: 500 * 1000 ** 2 // 500 MB
} as const;

export const STORAGE_USAGE_ENDPOINT = '/api/admin/storage/usage' as const;

export const PLACEHOLDER_IMAGE_URL =
	'https://placehold.co/800x600/ffffff/3367E2?text=VIVIENA' as const;

export const ACCEPTED_IMAGE_MIME_TYPES = [
	'image/avif',
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/svg+xml',
	'image/gif'
] as const;

export const ACCEPTED_VIDEO_MIME_TYPES = [
	'video/mp4',
	'video/webm',
	'video/ogg',
	'video/quicktime',
	'video/x-matroska'
] as const;

export const ACCEPTED_AUDIO_MIME_TYPES = [
	'audio/mpeg',
	'audio/mp4',
	'audio/aac',
	'audio/wav',
	'audio/ogg',
	'audio/webm',
	'audio/flac'
] as const;
