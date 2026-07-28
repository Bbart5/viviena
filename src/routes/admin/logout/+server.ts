import { SESSION_TOKEN_COOKIE_NAME, SESSION_TOKEN_COOKIE_PATH } from '$lib/consts/auth';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_TOKEN_COOKIE_NAME, { path: SESSION_TOKEN_COOKIE_PATH });

	return json({ success: true }, { status: 200 });
};
