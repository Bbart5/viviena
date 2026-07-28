import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, S3_BUCKET } from '$env/static/private';
import type { StorageStatsProvider, StorageUsage } from './types';

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

export class R2StatsProvider implements StorageStatsProvider {
	public async getUsage(): Promise<StorageUsage> {
		// R2 free tier limits reset monthly — usage is month-to-date.
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
}
