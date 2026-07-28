import { ENVIRONMENT } from '$env/static/private';
import { MinioStatsProvider } from './MinioStatsProvider';
import { R2StatsProvider } from './R2StatsProvider';
import type { StorageStatsProvider, StorageUsage } from './types';

const CACHE_TTL_MS = 60_000;

const provider: StorageStatsProvider =
	ENVIRONMENT === 'production' ? new R2StatsProvider() : new MinioStatsProvider();

let cache: { usage: StorageUsage; fetchedAt: number } | null = null;

export async function getStorageUsage(fresh = false): Promise<StorageUsage> {
	if (!fresh && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.usage;
	}

	const usage = await provider.getUsage();
	cache = { usage, fetchedAt: Date.now() };

	return usage;
}

export type { StorageStatsProvider, StorageUsage } from './types';
