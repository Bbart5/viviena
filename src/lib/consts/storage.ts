import { asset } from '$app/paths';

// Decimal units - Cloudflare bills in GB-months, not GiB.
export const R2_FREE_TIER_LIMITS = {
	storageBytes: 10 * 1000 ** 3, // 10 GB
	classAOps: 1 * 1000 ** 2,
	classBOps: 10 * 1000 ** 2
} as const;

export const PRISMA_POSTGRES_FREE_TIER_LIMITS = {
	databaseBytes: 500 * 1000 ** 2 // 500 MB
} as const;

// Served locally - an external placeholder host would be a third-party request
// the privacy policy doesn't cover.
export const PLACEHOLDER_IMAGE_URL = asset('/brand/placeholder.svg');

// No SVG: the upload endpoints trust the client-declared mime type, and SVG
// can carry scripts (stored-XSS risk if media is ever served same-origin).
export const ACCEPTED_IMAGE_MIME_TYPES = [
	'image/avif',
	'image/png',
	'image/jpeg',
	'image/webp',
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
