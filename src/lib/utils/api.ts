/**
 * Extracts a user-facing message from a failed remote command or query.
 * Commands rejected via error(status, message) surface an HttpError whose
 * body carries the message; plain Errors (e.g. from requestJson) keep theirs.
 */
export function commandErrorMessage(err: unknown, fallback: string): string {
	if (err && typeof err === 'object' && 'body' in err) {
		const message = (err as { body?: { message?: string } }).body?.message;

		if (message) {
			return message;
		}
	}

	if (err instanceof Error && err.message) {
		return err.message;
	}

	return fallback;
}

/**
 * Fetches a `{ success, message?, ... }` JSON endpoint and throws an `Error`
 * carrying the server's message (or `errorFallback`) on any failure, so call
 * sites only need a try/catch.
 */
export async function requestJson<T extends object = object>(
	url: string,
	errorFallback: string,
	init?: RequestInit
): Promise<T> {
	let ok: boolean;
	let body: { success?: boolean; message?: string } & T;

	try {
		const response = await fetch(url, init);
		ok = response.ok;
		body = await response.json();
	} catch {
		throw new Error(errorFallback);
	}

	if (!ok || !body.success) {
		throw new Error(body.message ?? errorFallback);
	}

	return body;
}
