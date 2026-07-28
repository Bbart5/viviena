import { ENVIRONMENT } from '$env/static/private';
import { getDatabaseSizeBytes } from './database';
import { MinioStatsProvider } from './MinioStatsProvider';
import { R2StatsProvider } from './R2StatsProvider';
import type { StorageStatsProvider, StorageUsage } from './types';

export interface ResourceUsage extends StorageUsage {
	databaseBytes: number;
}

const CACHE_TTL_MS = 60_000;

const provider: StorageStatsProvider =
	ENVIRONMENT === 'production' ? new R2StatsProvider() : new MinioStatsProvider();

let cache: { usage: ResourceUsage; fetchedAt: number } | null = null;

export async function getResourceUsage(fresh = false): Promise<ResourceUsage> {
	if (!fresh && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.usage;
	}

	const [storageUsage, databaseBytes] = await Promise.all([
		provider.getUsage(),
		getDatabaseSizeBytes()
	]);

	const usage = { ...storageUsage, databaseBytes };
	cache = { usage, fetchedAt: Date.now() };

	return usage;
}

export type { StorageStatsProvider, StorageUsage } from './types';
