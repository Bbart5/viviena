import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		const hero = await prisma.hero.update({
			where: {
				id: body.id
			},
			data: {
				title: body.title,
				header1: body.header1,
				header2: body.header2,
				header3: body.header3,
				description: body.description
			}
		});

		return json({
			success: true,
			hero
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				success: false,
				message: 'Nie udało się zapisać zmian.'
			},
			{
				status: 500
			}
		);
	}
};
