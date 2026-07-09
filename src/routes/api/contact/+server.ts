import { GMAIL_USER } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import { MailTransport } from '$lib/server/mail/MailTransport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ContactDto } from '$lib/server/dto/ContactDto';

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

async function renderContactEmail(data: ContactDto): Promise<string> {
	const { default: template } = await import('$lib/server/email-templates/contact.html?raw');

	return template
		.replaceAll('{{name}}', escapeHtml(data.name))
		.replaceAll('{{email}}', escapeHtml(data.email))
		.replaceAll('{{message}}', escapeHtml(data.message));
}

export async function POST({ request }: RequestEvent) {
	try {
		const body = await request.json();
		const contactDto = plainToInstance(ContactDto, body);
		const errors = await validate(contactDto);

		if (errors.length > 0) {
			const firstError = errors[0];

			return json(
				{
					success: false,
					field: firstError.property,
					message: Object.values(firstError.constraints ?? {})[0] ?? 'Niepoprawne dane.'
				},
				{ status: 400 }
			);
		}
		const transporter = MailTransport.getInstance();

		await transporter.sendMail({
			from: GMAIL_USER,
			to: GMAIL_USER,
			cc: ['hunterqe999.pl@gmail.com'],
			replyTo: contactDto.email,
			subject: `Nowa wiadomość od ${contactDto.name}`,
			html: await renderContactEmail(contactDto)
		});

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error);

		return json({ success: false, message: 'Nie udało się wysłać wiadomości.' }, { status: 500 });
	}
}
