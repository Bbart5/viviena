import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

/**
 * Remote function requests are served from /_app/remote/* and therefore bypass
 * the /api/admin path guard in hooks.server.ts - every admin command and query
 * re-checks the session set there.
 */
export function requireAdmin() {
	if (!getRequestEvent().locals.session) {
		error(401, 'Brak autoryzacji.');
	}
}
