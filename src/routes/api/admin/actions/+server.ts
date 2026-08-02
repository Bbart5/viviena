import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const action = await request.json();

		await prisma.action.update({
			where: {
				id: action.id
			},
			data: {
				title: action.title,
				date: action.date,
				tag: action.tag,
				tagColor: action.tagColor,
				description: action.description,
				details: action.details,
				relation: action.relation,
				people: action.people,
				partners: action.partners,
				showCta: action.showCta,
				ctaLabel: action.ctaLabel
			}
		});

		return json({
			success: true
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const action = await prisma.action.create({
			data: {
				title: body.title,
				date: body.date,
				tag: body.tag,
				tagColor: body.tagColor,
				description: body.description,
				details: body.details,
				relation: body.relation,
				people: body.people,
				partners: body.partners,
				showCta: body.showCta,
				ctaLabel: body.ctaLabel
			}
		});

		return json({
			success: true,
			action
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				success: false,
				message: 'Nie udało się utworzyć wydarzenia.'
			},
			{
				status: 500
			}
		);
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();

		await prisma.action.delete({
			where: {
				id
			}
		});

		return json({
			success: true
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				success: false,
				message: 'Nie udało się usunąć wydarzenia.'
			},
			{
				status: 500
			}
		);
	}
};
