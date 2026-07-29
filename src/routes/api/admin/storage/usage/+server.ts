import { apiError } from '$lib/server/api';
import { getResourceUsage } from '$lib/server/storage/stats';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const usage = await getResourceUsage(url.searchParams.has('fresh'));

		return json({ success: true, usage });
	} catch (error) {
		console.error(error);

		return apiError('Nie udało się pobrać statystyk magazynu.');
	}
};
