// Cloudflare R2 free tier limits (decimal units — Cloudflare bills in GB-months).
export const R2_FREE_TIER_LIMITS = {
	storageBytes: 10 * 1000 ** 3, // 10 GB
	classAOps: 1_000_000,
	classBOps: 10_000_000
} as const;

export const STORAGE_USAGE_ENDPOINT = '/api/admin/storage/usage' as const;
