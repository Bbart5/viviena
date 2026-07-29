import { apiError } from '$lib/server/api';
import { prisma } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT, JWT_SECRET } from '$env/static/private';
import type { JwtSessionPayload } from '$lib/types/jwt.payload';
import {
	SESSION_TOKEN_COOKIE_NAME,
	SESSION_TOKEN_COOKIE_PATH,
	SESSION_TTL_SECONDS
} from '$lib/consts/auth';

class LoginRequestDto {
	@IsNotEmpty()
	@IsString()
	declare username: string;

	@IsNotEmpty()
	@IsString()
	declare password: string;
}

// SvelteKit forbids runtime exports besides HTTP verbs in +server.ts; the login
// page only needs the type.
export type { LoginRequestDto };

// Empty, unknown, or wrong credentials all get the same answer so the response
// does not reveal whether the username exists.
const invalidCredentials = () => apiError('Niepoprawny login lub hasło.', 401);

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const loginDto = plainToInstance(LoginRequestDto, body);
		const errors = await validate(loginDto);

		if (errors.length > 0) {
			return invalidCredentials();
		}

		const foundUser = await prisma.user.findFirst({
			where: {
				username: loginDto.username
			}
		});

		if (!foundUser) {
			return invalidCredentials();
		}

		const passwordsMatch = await bcrypt.compare(loginDto.password, foundUser.passwordHash);

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
