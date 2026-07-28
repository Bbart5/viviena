import { prisma } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT, JWT_SECRET } from '$env/static/private';
import type { JwtSessionPayload } from '$lib/types/jwt.payload';
import { SESSION_TOKEN_COOKIE_NAME, SESSION_TOKEN_COOKIE_PATH } from '$lib/consts/auth';

export class LoginRequestDto {
	@IsNotEmpty()
	@IsString()
	declare username: string;

	@IsNotEmpty()
	@IsString()
	declare password: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const loginDto = plainToInstance(LoginRequestDto, body);
	const errors = await validate(loginDto);

	if (errors.length > 0) {
		const firstError = errors[0];

		return json(
			{
				success: false,
				field: firstError.property,
				message: Object.values(firstError.constraints ?? {})[0] ?? 'Niepoprawne dane.'
			},
			{ status: 400 }
		);
	}

	const foundUser = await prisma.user.findFirst({
		where: {
			username: loginDto.username
		}
	});

	if (!foundUser) {
		return json({ success: true }, { status: 500 });
	}

	const passwordsMatch = await bcrypt.compare(loginDto.password, foundUser.passwordHash);

	if (!passwordsMatch) {
		return json({ success: true }, { status: 500 });
	}

	const token = jwt.sign(
		{
			username: foundUser.username
		} satisfies JwtSessionPayload,
		JWT_SECRET,
		{
			expiresIn: '24h'
		}
	);

	cookies.set(SESSION_TOKEN_COOKIE_NAME, token, {
		path: SESSION_TOKEN_COOKIE_PATH,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		secure: ENVIRONMENT === 'production',
		maxAge: 7 * 24 * 60 * 60 // 7 days in Unix epoch
	});

	return json({ success: true }, { status: 200 });
};
