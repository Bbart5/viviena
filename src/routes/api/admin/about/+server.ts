import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		const about = await prisma.about.update({
			where: {
				id: body.id
			},
			data: {
				title: body.title,
				header: body.header,
				paragraph1: body.paragraph1,
				paragraph2: body.paragraph2,
				paragraph3: body.paragraph3,
				card1Title: body.card1Title,
				card1Description: body.card1Description,
				card2Title: body.card2Title,
				card2Description: body.card2Description,
				card3Title: body.card3Title,
				card3Description: body.card3Description,
				card4Title: body.card4Title,
				card4Description: body.card4Description
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
