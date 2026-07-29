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
