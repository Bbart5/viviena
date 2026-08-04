import * as z from 'zod';

export const CONTACT_SCHEMA_RESTRICTIONS = {
	name: {
		min: 2,
		max: 50,
		matches: /^[\p{L}\s'-]+$/u
	},
	email: {
		max: 100
	},
	message: {
		min: 20,
		max: 1000
	}
} as const;

// The min(1) checks mirror yup's required(): an empty field reports "jest
// wymagane" instead of the length message.
export const contactSchema = z.object({
	name: z
		.string('Imię jest wymagane.')
		.min(1, 'Imię jest wymagane.')
		.min(CONTACT_SCHEMA_RESTRICTIONS.name.min, 'Imię musi mieć co najmniej 2 znaki.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.name.max, 'Imię może mieć maksymalnie 50 znaków.')
		.regex(CONTACT_SCHEMA_RESTRICTIONS.name.matches, 'Imię może zawierać tylko litery.'),
	email: z
		.string('Adres e-mail jest wymagany.')
		.min(1, 'Adres e-mail jest wymagany.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.email.max, 'Adres e-mail może mieć maksymalnie 100 znaków.')
		// Piped so the format check only runs once the field is non-empty.
		.pipe(z.email('Podaj poprawny adres e-mail.')),
	message: z
		.string('Wiadomość jest wymagana.')
		.min(1, 'Wiadomość jest wymagana.')
		.min(CONTACT_SCHEMA_RESTRICTIONS.message.min, 'Wiadomość musi mieć co najmniej 20 znaków.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.message.max, 'Wiadomość może mieć maksymalnie 1000 znaków.')
});

export type ContactSchema = z.infer<typeof contactSchema>;
