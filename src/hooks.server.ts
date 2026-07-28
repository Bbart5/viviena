import { resolve } from '$app/paths';
import { JWT_SECRET } from '$env/static/private';
import { SESSION_TOKEN_COOKIE_NAME } from '$lib/consts/auth';
import { MailTransport } from '$lib/server/mail/MailTransport';
import type { JwtSessionPayload } from '$lib/types/jwt.payload';
import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

MailTransport.getInstance();

const PROTECTED_PATHS = [resolve('/admin')] as const;

export const handle: Handle = async ({ event, resolve }) => {
	const jwtToken = event.cookies.get(SESSION_TOKEN_COOKIE_NAME);
	const jwtTokenValid = jwtToken ? (jwt.verify(jwtToken, JWT_SECRET) as JwtSessionPayload) : null;

	const currentPath = event.url.pathname;
  const isProtected = PROTECTED_PATHS.some((path) => path === currentPath);
	
  if (isProtected && !jwtTokenValid) {
    throw redirect(303, '/');
  }

  return resolve(event);
};
