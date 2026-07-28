// Cloudflare R2 free tier limits (decimal units — Cloudflare bills in GB-months).
export const R2_FREE_TIER_LIMITS = {
	storageBytes: 10 * 1000 ** 3, // 10 GB
	classAOps: 1 * 1000 ** 2,
	classBOps: 10 * 1000 ** 2
} as const;

// Prisma Postgres free tier limit.
export const PRISMA_POSTGRES_FREE_TIER_LIMITS = {
	databaseBytes: 500 * 1000 ** 2 // 500 MB
} as const;

export const STORAGE_USAGE_ENDPOINT = '/api/admin/storage/usage' as const;

// Image formats accepted for image uploads (used by the form `accept` prop and
// mirrored by server-side validation).
export const ACCEPTED_IMAGE_MIME_TYPES = [
	'image/avif',
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/svg+xml',
	'image/gif'
] as const;
