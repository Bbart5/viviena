import { GMAIL_USER } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import { MailTransport } from '$lib/server/mail/MailTransport';
import { ValidationError } from 'yup';
import { contactSchema, type ContactSchema } from '$lib/schemas/contact-schema';

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

async function renderContactEmail(data: ContactSchema): Promise<string> {
	const { default: template } = await import('$lib/server/email-templates/contact.html?raw');

	return template
		.replaceAll('{{name}}', escapeHtml(data.name.trim()))
		.replaceAll('{{email}}', escapeHtml(data.email.trim()))
		.replaceAll('{{message}}', escapeHtml(data.message.trim()).replace(/\r?\n/g, '<br>'));
}

export async function POST({ request }: RequestEvent) {
	try {
		const body = await request.json();

		// The same yup schema the form validates with client-side.
		let contact: ContactSchema;
		try {
			contact = await contactSchema.validate(body, { stripUnknown: true });
		} catch (error) {
			if (error instanceof ValidationError) {
				return json(
					{
						success: false,
						field: error.path,
						message: error.message
					},
					{ status: 400 }
				);
			}

			throw error;
		}

		const transporter = MailTransport.getInstance();

		await transporter.sendMail({
			from: GMAIL_USER,
			to: GMAIL_USER,
			replyTo: contact.email,
			subject: `Nowa wiadomość od ${contact.name}`,
			html: await renderContactEmail(contact)
		});

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error);

		return json({ success: false, message: 'Nie udało się wysłać wiadomości.' }, { status: 500 });
	}
}
