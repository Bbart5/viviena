import { resolve } from '$app/paths';
import { JWT_SECRET } from '$env/static/private';
import { SESSION_TOKEN_COOKIE_NAME } from '$lib/consts/auth';
import { MailTransport } from '$lib/server/mail/MailTransport';
import type { JwtSessionPayload } from '$lib/types/jwt.payload';
import { json, redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

MailTransport.getInstance();

const PROTECTED_PREFIXES = [resolve('/admin'), resolve('/api/admin')] as const;
const PUBLIC_PATHS = [resolve('/admin/login'), resolve('/admin/logout')] as const;
const API_PREFIX = resolve('/api');
const LOGIN_PATH = resolve('/admin/login');

export const handle: Handle = async ({ event, resolve }) => {
	const jwtToken = event.cookies.get(SESSION_TOKEN_COOKIE_NAME);

	let jwtTokenValid: JwtSessionPayload | null = null;
	try {
		jwtTokenValid = jwtToken ? (jwt.verify(jwtToken, JWT_SECRET) as JwtSessionPayload) : null;
	} catch {
		jwtTokenValid = null;
	}

	const currentPath = event.url.pathname;
	const isProtected =
		PROTECTED_PREFIXES.some((path) => currentPath === path || currentPath.startsWith(`${path}/`)) &&
		!PUBLIC_PATHS.some((path) => currentPath === path);

	if (isProtected && !jwtTokenValid) {
		if (currentPath.startsWith(API_PREFIX)) {
			return json({ success: false, message: 'Brak autoryzacji.' }, { status: 401 });
		}

		throw redirect(303, LOGIN_PATH);
	}

	return resolve(event);
};
