export interface StorageUsage {
	storageBytes: number;
	/** null = counters unavailable (MinIO in development). */
	classAOps: number | null;
	classBOps: number | null;
}

export interface StorageStatsProvider {
	getUsage(): Promise<StorageUsage>;
}
