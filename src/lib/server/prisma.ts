import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../../../generated/prisma/client';
import { DATABASE_URL } from '$env/static/private';

// Accelerate URLs (prisma:// / prisma+postgres://) go over HTTP and must not be
// passed to the pg driver adapter; direct postgres:// URLs are the reverse.
const isAccelerate = /^prisma(\+postgres)?:\/\//.test(DATABASE_URL);

const prisma = isAccelerate
	? (new PrismaClient({ accelerateUrl: DATABASE_URL }).$extends(
			withAccelerate()
		) as unknown as PrismaClient)
	: new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

export { prisma };
