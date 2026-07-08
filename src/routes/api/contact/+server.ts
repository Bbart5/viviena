import { GMAIL_USER } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { MailTransport } from '$lib/server/mail/MailTransport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ContactDto } from '$lib/server/dto/ContactDto';

export async function POST({ request }: RequestEvent) {
	try {
		const body = await request.json();

		const contactDto = plainToInstance(ContactDto, body);

		const errors = await validate(contactDto);

		if (errors.length > 0) {
			const firstError = errors[0];

			return Response.json(
				{
					success: false,
					field: firstError.property,
					message: Object.values(firstError.constraints ?? {})[0] ?? 'Niepoprawne dane.'
				},
				{
					status: 400
				}
			);
		}
		const transporter = MailTransport.getInstance();

		await transporter.sendMail({
			from: GMAIL_USER,
			to: GMAIL_USER,
			replyTo: contactDto.email,
			subject: `Nowa wiadomość od ${contactDto.name}`,
			text: `
Imię: ${contactDto.name}
Email: ${contactDto.email}

Wiadomość:
${contactDto.message}
`
		});

		return Response.json({
			success: true
		});
	} catch (error) {
		console.error(error);

		return Response.json(
			{
				success: false,
				message: 'Nie udało się wysłać wiadomości.'
			},
			{
				status: 500
			}
		);
	}
}
