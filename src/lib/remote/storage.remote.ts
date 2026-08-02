import { command, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth';
import { getResourceUsage } from '$lib/server/storage/stats';

export const getStorageUsage = query(async () => {
	requireAdmin();

	return getResourceUsage();
});

/**
 * getResourceUsage() caches for a minute so page loads stay cheap; the refresh
 * button bypasses that cache and then re-runs the query against the warm one,
 * all in a single round trip.
 */
export const refreshStorageUsage = command(async () => {
	requireAdmin();

	await getResourceUsage(true);

	await getStorageUsage().refresh();
});
