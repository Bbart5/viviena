import { GMAIL_USER } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import { MailTransport } from '$lib/server/mail/MailTransport';
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

		// The same zod schema the form validates with client-side; z.object()
		// strips unknown keys, matching yup's old stripUnknown behaviour.
		const parsed = contactSchema.safeParse(body);

		if (!parsed.success) {
			// First issue only - mirrors yup's abortEarly default the client relies on.
			const issue = parsed.error.issues[0];

			return json(
				{
					success: false,
					field: issue.path.join('.') || undefined,
					message: issue.message
				},
				{ status: 400 }
			);
		}

		const contact: ContactSchema = parsed.data;

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
