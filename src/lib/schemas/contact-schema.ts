import * as yup from 'yup';

export const CONTACT_SCHEMA_RESTRICTIONS = {
	name: {
		min: 1,
		max: 50,
		matches: /^[\p{L}\s'-]+$/u
	},
	email: {
		max: 100,
	},
	message: {
		min: 20,
		max: 1000,
	}
} as const;

export const contactSchema = yup.object({
	name: yup
		.string()
		.required('Imię jest wymagane.')
		.min(CONTACT_SCHEMA_RESTRICTIONS.name.min, 'Imię musi mieć co najmniej 2 znaki.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.name.max, 'Imię może mieć maksymalnie 50 znaków.')
		.matches(CONTACT_SCHEMA_RESTRICTIONS.name.matches, 'Imię może zawierać tylko litery.'),
	email: yup
		.string()
		.required('Adres e-mail jest wymagany.')
		.email('Podaj poprawny adres e-mail.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.email.max, 'Adres e-mail może mieć maksymalnie 100 znaków.'),
	message: yup
		.string()
		.required('Wiadomość jest wymagana.')
		.min(CONTACT_SCHEMA_RESTRICTIONS.message.min, 'Wiadomość musi mieć co najmniej 20 znaków.')
		.max(CONTACT_SCHEMA_RESTRICTIONS.message.max, 'Wiadomość może mieć maksymalnie 1000 znaków.')
});

export type ContactSchema = yup.InferType<typeof contactSchema>;
