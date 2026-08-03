import {
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	ENVIRONMENT,
	S3_BUCKET
} from '$env/static/private';
import { prisma } from '$lib/server/prisma';
import { BucketService } from './BucketService';

export interface StorageUsage {
	storageBytes: number;
	/** null = counters unavailable (MinIO in development). */
	classAOps: number | null;
	classBOps: number | null;
}

export interface ResourceUsage extends StorageUsage {
	databaseBytes: number;
}

// R2 operations billed as class A; every other action type counts as class B.
const CLASS_A_ACTIONS = new Set([
	'ListBuckets',
	'PutBucket',
	'ListObjects',
	'PutObject',
	'CopyObject',
	'CompleteMultipartUpload',
	'CreateMultipartUpload',
	'UploadPart',
	'UploadPartCopy',
	'AbortMultipartUpload',
	'ListMultipartUploads',
	'ListParts',
	'PutBucketEncryption',
	'PutBucketCors',
	'PutBucketLifecycleConfiguration',
	'LifecycleStorageTierTransition'
]);

// TODO: verify the dataset/field names (r2StorageAdaptiveGroups.max.payloadSize/metadataSize,
// r2OperationsAdaptiveGroups.sum.requests, the actionType dimension and the bucketName filter)
// against the current Cloudflare GraphQL Analytics schema before the first production deploy.
const USAGE_QUERY = /* GraphQL */ `
	query R2Usage($accountTag: string!, $bucket: string!, $since: Time!) {
		viewer {
			accounts(filter: { accountTag: $accountTag }) {
				storage: r2StorageAdaptiveGroups(
					limit: 100
					filter: { bucketName: $bucket, datetime_geq: $since }
				) {
					dimensions {
						datetime
					}
					max {
						payloadSize
						metadataSize
					}
				}
				operations: r2OperationsAdaptiveGroups(
					limit: 100
					filter: { bucketName: $bucket, datetime_geq: $since }
				) {
					dimensions {
						actionType
					}
					sum {
						requests
					}
				}
			}
		}
	}
`;

interface StorageGroup {
	dimensions: { datetime: string };
	max: { payloadSize: number; metadataSize: number };
}

interface OperationsGroup {
	dimensions: { actionType: string };
	sum: { requests: number };
}

/** Sums object sizes over the S3 API - works for MinIO and R2 alike, but has no ops counters. */
async function getBucketListingUsage(): Promise<StorageUsage> {
	const objects = await BucketService.getInstance().listAll();

	return {
		storageBytes: objects.reduce((sum, object) => sum + object.size, 0),
		classAOps: null,
		classBOps: null
	};
}

async function getR2Usage(): Promise<StorageUsage> {
	try {
		return await getR2AnalyticsUsage();
	} catch (error) {
		// Analytics needs a CLOUDFLARE_API_TOKEN with "Account Analytics: Read" -
		// without it (or on any API hiccup) still report storage via the S3 API.
		console.error('R2 analytics unavailable, falling back to bucket listing:', error);
		return getBucketListingUsage();
	}
}

async function getR2AnalyticsUsage(): Promise<StorageUsage> {
	// R2 free tier limits reset monthly - usage is month-to-date.
	const since = new Date();
	since.setUTCDate(1);
	since.setUTCHours(0, 0, 0, 0);

	const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: USAGE_QUERY,
			variables: {
				accountTag: CLOUDFLARE_ACCOUNT_ID,
				bucket: S3_BUCKET,
				since: since.toISOString()
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Cloudflare GraphQL API responded with status ${response.status}.`);
	}

	const { data, errors } = await response.json();

	if (errors?.length) {
		throw new Error(`Cloudflare GraphQL API error: ${errors[0].message}`);
	}

	const account = data?.viewer?.accounts?.[0];
	if (!account) {
		throw new Error('Cloudflare GraphQL API returned no account data.');
	}

	// The latest datapoint reflects the current stored bytes.
	const latestStorage = (account.storage as StorageGroup[]).reduce<StorageGroup | null>(
		(latest, group) =>
			!latest || group.dimensions.datetime > latest.dimensions.datetime ? group : latest,
		null
	);

	let classAOps = 0;
	let classBOps = 0;
	for (const group of account.operations as OperationsGroup[]) {
		if (CLASS_A_ACTIONS.has(group.dimensions.actionType)) {
			classAOps += group.sum.requests;
		} else {
			classBOps += group.sum.requests;
		}
	}

	return {
		storageBytes: (latestStorage?.max.payloadSize ?? 0) + (latestStorage?.max.metadataSize ?? 0),
		classAOps,
		classBOps
	};
}

// Works both on the local dev Postgres and on Prisma Postgres in production.
async function getDatabaseSizeBytes(): Promise<number> {
	const [row] = await prisma.$queryRaw<
		[{ size: bigint }]
	>`SELECT pg_database_size(current_database()) AS size`;

	return Number(row.size);
}

const getStorageUsage = ENVIRONMENT === 'production' ? getR2Usage : getBucketListingUsage;

const CACHE_TTL_MS = 60_000;

let cache: { usage: ResourceUsage; fetchedAt: number } | null = null;

export async function getResourceUsage(fresh = false): Promise<ResourceUsage> {
	if (!fresh && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.usage;
	}

	const [storageUsage, databaseBytes] = await Promise.all([
		getStorageUsage(),
		getDatabaseSizeBytes()
	]);

	const usage = { ...storageUsage, databaseBytes };
	cache = { usage, fetchedAt: Date.now() };

	return usage;
}
