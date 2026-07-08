import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class ContactDto {
	@IsNotEmpty({
		message: 'Imię jest wymagane.'
	})
	@MinLength(2, {
		message: 'Imię musi mieć co najmniej 2 znaki.'
	})
	@MaxLength(50, {
		message: 'Imię może mieć maksymalnie 50 znaków.'
	})
	@Matches(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]+$/, {
		message: 'Imię może zawierać tylko litery.'
	})
	name!: string;

	@IsNotEmpty({
		message: 'Adres e-mail jest wymagany.'
	})
	@IsEmail(
		{},
		{
			message: 'Podaj poprawny adres e-mail.'
		}
	)
	@MaxLength(100, {
		message: 'Adres e-mail może mieć maksymalnie 100 znaków.'
	})
	email!: string;

	@IsNotEmpty({
		message: 'Wiadomość jest wymagana.'
	})
	@MinLength(20, {
		message: 'Wiadomość musi mieć co najmniej 20 znaków.'
	})
	@MaxLength(1000, {
		message: 'Wiadomość może mieć maksymalnie 1000 znaków.'
	})
	message!: string;
}
