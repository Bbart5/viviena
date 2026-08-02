import { asset } from '$app/paths';
import type { OurDocument } from '../../types';

export const documents: OurDocument[] = [
	{
		title: 'Polityka prywatności',
		description:
			'Informacje dotyczące zasad przetwarzania danych, cookies oraz analityki strony internetowej.',
		href: asset('/documents/polityka-prywatnosci.html'),
		icon: 'privacy_tip'
	},
	{
		title: 'Regulamin strony',
		description: 'Zasady korzystania ze strony internetowej Stowarzyszenia VIVIENA.',
		href: asset('/documents/regulamin-strony.html'),
		icon: 'description'
	},
	{
		title: 'Dane organizacyjne',
		description: 'Podstawowe dane formalne i kontaktowe stowarzyszenia.',
		href: asset('/documents/dane-organizacyjne.html'),
		icon: 'business'
	}
];
