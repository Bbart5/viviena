import { apiError } from '$lib/server/api';
import { prisma } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as z from 'zod';
import { ENVIRONMENT, JWT_SECRET } from '$env/static/private';
import type { JwtSessionPayload } from '$lib/types/jwt.payload';
import {
	SESSION_TOKEN_COOKIE_NAME,
	SESSION_TOKEN_COOKIE_PATH,
	SESSION_TTL_SECONDS
} from '$lib/consts/auth';

// zod instead of class-validator: decorator-based DTOs silently lose their
// metadata under esbuild/oxc transforms, which made validation reject every
// well-formed login.
const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
});

// The login page only needs the type.
export type LoginRequestDto = z.infer<typeof loginSchema>;

// Empty, unknown, or wrong credentials all get the same answer so the response
// does not reveal whether the username exists.
const invalidCredentials = () => apiError('Niepoprawny login lub hasło.', 401);

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const parsed = loginSchema.safeParse(await request.json());

		if (!parsed.success) {
			return invalidCredentials();
		}

		const foundUser = await prisma.user.findFirst({
			where: {
				username: parsed.data.username
			}
		});

		if (!foundUser) {
			return invalidCredentials();
		}

		const passwordsMatch = await bcrypt.compare(parsed.data.password, foundUser.passwordHash);

		if (!passwordsMatch) {
			return invalidCredentials();
		}

		const token = jwt.sign(
			{
				username: foundUser.username
			} satisfies JwtSessionPayload,
			JWT_SECRET,
			{
				expiresIn: SESSION_TTL_SECONDS
			}
		);

		cookies.set(SESSION_TOKEN_COOKIE_NAME, token, {
			path: SESSION_TOKEN_COOKIE_PATH,
			secure: ENVIRONMENT === 'production',
			maxAge: SESSION_TTL_SECONDS
		});

		return json({ success: true });
	} catch (error) {
		console.error(error);

		return apiError('Wystąpił błąd. Spróbuj ponownie później.');
	}
};
