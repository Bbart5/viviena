import { json } from '@sveltejs/kit';

export function apiError(message: string, status = 500) {
	return json({ success: false, message }, { status });
}
