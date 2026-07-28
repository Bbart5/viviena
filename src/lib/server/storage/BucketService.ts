import {
	S3_ACCESS_KEY_ID,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_FORCE_PATH_STYLE,
	S3_PUBLIC_BASE_URL,
	S3_REGION,
	S3_SECRET_ACCESS_KEY
} from '$env/static/private';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';

export interface BucketObject {
	key: string;
	size: number;
}

export class BucketService {
	private static instance: BucketService;

	private readonly client: S3Client;
	private readonly bucket = S3_BUCKET;

	private constructor() {
		this.client = new S3Client({
			endpoint: S3_ENDPOINT,
			region: S3_REGION,
			credentials: {
				accessKeyId: S3_ACCESS_KEY_ID,
				secretAccessKey: S3_SECRET_ACCESS_KEY
			},
			forcePathStyle: S3_FORCE_PATH_STYLE === 'true'
		});
	}

	public static getInstance(): BucketService {
		if (!BucketService.instance) {
			BucketService.instance = new BucketService();
		}

		return BucketService.instance;
	}

	public getPublicUrl(key: string): string {
		return `${S3_PUBLIC_BASE_URL.replace(/\/+$/, '')}/${key}`;
	}

	public async upload(key: string, body: Uint8Array, contentType: string): Promise<string> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: body,
				ContentType: contentType
			})
		);

		return this.getPublicUrl(key);
	}

	public async get(key: string): Promise<Uint8Array> {
		const response = await this.client.send(
			new GetObjectCommand({ Bucket: this.bucket, Key: key })
		);

		if (!response.Body) {
			throw new Error(`Empty response body for object "${key}".`);
		}

		return response.Body.transformToByteArray();
	}

	public async delete(key: string): Promise<void> {
		await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
	}

	/**
	 * The overwritten object is deleted from the bucket BEFORE the staged one is
	 * uploaded. Deleting a nonexistent key succeeds (S3 semantics), so this is also
	 * safe when the old object is already gone.
	 */
	public async overwrite(
		oldKey: string,
		newKey: string,
		body: Uint8Array,
		contentType: string
	): Promise<string> {
		await this.delete(oldKey);

		return this.upload(newKey, body, contentType);
	}

	public async listAll(prefix?: string): Promise<BucketObject[]> {
		const objects: BucketObject[] = [];
		let continuationToken: string | undefined;

		do {
			const response = await this.client.send(
				new ListObjectsV2Command({
					Bucket: this.bucket,
					Prefix: prefix,
					ContinuationToken: continuationToken
				})
			);

			for (const object of response.Contents ?? []) {
				if (object.Key) {
					objects.push({ key: object.Key, size: object.Size ?? 0 });
				}
			}

			continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
		} while (continuationToken);

		return objects;
	}
}
