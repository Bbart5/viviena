import { CONTACT_SCHEMA_RESTRICTIONS, type ContactSchema } from '$lib/schemas/contact-schema';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class ContactDto implements ContactSchema {
	@IsNotEmpty()
	@MinLength(CONTACT_SCHEMA_RESTRICTIONS.name.min)
	@MaxLength(CONTACT_SCHEMA_RESTRICTIONS.name.max)
	@Matches(CONTACT_SCHEMA_RESTRICTIONS.name.matches)
	declare name: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(CONTACT_SCHEMA_RESTRICTIONS.email.max)
	declare email: string;

	@IsNotEmpty()
	@MinLength(CONTACT_SCHEMA_RESTRICTIONS.message.min)
	@MaxLength(CONTACT_SCHEMA_RESTRICTIONS.message.max)
	declare message: string;
}
