import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		const about = await prisma.areas.update({
			where: {
				id: body.id
			},
			data: {
				title: body.title,
				header1: body.header1,
				paragraph1: body.paragraph1,
				header2: body.header2,
				paragraph2: body.paragraph2,
				header3: body.header3,
				paragraph3: body.paragraph3,
				header4: body.header4,
				paragraph4: body.paragraph4,
				header5: body.header5,
				paragraph5: body.paragraph5
			}
		});

		return json({
			success: true,
			about
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
