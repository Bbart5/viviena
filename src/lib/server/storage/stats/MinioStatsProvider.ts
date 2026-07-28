import { BucketService } from '../BucketService';
import type { StorageStatsProvider, StorageUsage } from './types';

export class MinioStatsProvider implements StorageStatsProvider {
	public async getUsage(): Promise<StorageUsage> {
		const objects = await BucketService.getInstance().listAll();

		return {
			storageBytes: objects.reduce((sum, object) => sum + object.size, 0),
			// MinIO does not expose R2-style class A/B operation counters.
			classAOps: null,
			classBOps: null
		};
	}
}
