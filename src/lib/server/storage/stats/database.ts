import { prisma } from '$lib/server/prisma';

// Works both on the local dev Postgres and on Prisma Postgres in production.
export async function getDatabaseSizeBytes(): Promise<number> {
	const [row] = await prisma.$queryRaw<
		[{ size: bigint }]
	>`SELECT pg_database_size(current_database()) AS size`;

	return Number(row.size);
}
