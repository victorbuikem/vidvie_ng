import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

function getClient() {
	if (!env.RAILWAY_BUCKET_ENDPOINT) throw new Error('RAILWAY_BUCKET_ENDPOINT is not set');

	return new S3Client({
		endpoint: env.RAILWAY_BUCKET_ENDPOINT,
		region: 'auto',
		credentials: {
			accessKeyId: env.RAILWAY_BUCKET_ACCESS_KEY!,
			secretAccessKey: env.RAILWAY_BUCKET_SECRET_KEY!
		},
		forcePathStyle: true
	});
}

function getBucketName() {
	if (!env.RAILWAY_BUCKET_NAME) throw new Error('RAILWAY_BUCKET_NAME is not set');
	return env.RAILWAY_BUCKET_NAME;
}

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
	const client = getClient();
	const command = new PutObjectCommand({
		Bucket: getBucketName(),
		Key: key,
		ContentType: contentType
	});

	return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function deleteObject(key: string): Promise<void> {
	const client = getClient();
	await client.send(
		new DeleteObjectCommand({
			Bucket: getBucketName(),
			Key: key
		})
	);
}

export function getPublicUrl(key: string): string {
	const endpoint = env.RAILWAY_BUCKET_ENDPOINT!;
	const bucket = getBucketName();
	return `${endpoint}/${bucket}/${key}`;
}
