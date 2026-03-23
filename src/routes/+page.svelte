<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Navbar,
		Hero,
		About,
		AreasGrid,
		ActionsSection,
		TeamSection,
		DocumentsContact,
		Footer
	} from '$lib';
	import type { Action, Area, HowWeWorkCard, Member, OurDocument } from '../types';

	const howWeWork: HowWeWorkCard[] = [
		{
			title: 'Uważnie obserwujemy potrzeby',
			description: 'Tworzymy działania odpowiadające na to, co naprawdę jest dziś ważne.',
			icon: 'visibility'
		},
		{
			title: 'Działamy konkretnie',
			description: 'Pomysły przekładamy na warsztaty, wydarzenia i inicjatywy z realnym celem.',
			icon: 'rocket_launch'
		},
		{
			title: 'Łączymy energię z odpowiedzialnością',
			description: 'Jesteśmy młodym zespołem, ale działamy profesjonalnie i świadomie.',
			icon: 'balance'
		},
		{
			title: 'Budujemy współpracę',
			description: 'Chcemy łączyć ludzi, środowiska i instytucje wokół wartościowych działań.',
			icon: 'handshake'
		}
	];

	const areas: Area[] = [
		{
			title: 'Edukacja i rozwój',
			description:
				'Tworzymy warsztaty, spotkania i inicjatywy, które wspierają rozwój kompetencji, świadomości i samodzielności.',
			icon: 'school',
			span: 2,
			accentColor: 'primary'
		},
		{
			title: 'Bezpieczeństwo i świadomość',
			description:
				'Podejmujemy tematy związane z bezpieczeństwem osobistym, cyfrowym i społecznym.',
			icon: 'shield',
			span: 1,
			accentColor: 'tertiary'
		},
		{
			title: 'Zdrowie i dobrostan',
			description:
				'Promujemy wiedzę wspierającą zdrowie psychiczne, fizyczne i codzienne funkcjonowanie.',
			icon: 'favorite',
			span: 1,
			accentColor: 'secondary-fixed'
		},
		{
			title: 'Społeczność i współpraca',
			description: 'Budujemy działania, które łączą ludzi, środowiska i pokolenia.',
			icon: 'diversity_3',
			span: 1,
			accentColor: 'primary'
		},
		{
			title: 'Inicjatywy lokalne',
			description: 'Wspieramy projekty odpowiadające na realne potrzeby społeczności lokalnych.',
			icon: 'location_city',
			span: 1,
			accentColor: 'tertiary'
		}
	];

	const actions: Action[] = [
		{
			title: 'Konferencja Finansowa Finance Academy',
			date: '22 kwietnia',
			tag: 'Edukacja',
			tagColor: 'primary',
			description:
				'Wydarzenie poświęcone edukacji finansowej i świadomemu podejmowaniu decyzji. Konferencja będzie przestrzenią do rozmowy o praktycznych aspektach zarządzania pieniędzmi, planowaniu, odpowiedzialności finansowej i kompetencjach potrzebnych młodym ludziom w codziennym życiu.',
			details: [
				'Miejsce: wkrótce',
				'Dla kogo: młodzież, studenci, młodzi dorośli',
				'Status: przygotowanie'
			]
		},
		{
			title: 'Program warsztatów w szkołach',
			date: 'W przygotowaniu',
			tag: 'Społeczność',
			tagColor: 'tertiary',
			description:
				'Cykl zajęć edukacyjnych realizowanych w szkołach, odpowiadających na najważniejsze wyzwania współczesności. Program może obejmować tematy związane z edukacją finansową, bezpieczeństwem cyfrowym, zdrowiem psychicznym, świadomością społeczną i rozwojem kompetencji przyszłości.',
			details: ['Zakres: edukacja, bezpieczeństwo, zdrowie', 'Status: rozwój programu']
		},
		{
			title: 'Warsztaty dla seniorów',
			date: 'Planowane',
			tag: 'Wsparcie',
			tagColor: 'primary',
			description:
				'Działania skierowane do osób starszych, wspierające aktywność, bezpieczeństwo i rozwój kompetencji przydatnych w codziennym życiu. Program może obejmować tematy związane z cyfrową codziennością, bezpieczeństwem, komunikacją, integracją i dobrostanem.',
			details: ['Forma: warsztaty stacjonarne', 'Status: planowanie']
		}
	];

	const boardMembers: Member[] = [
		{
			name: 'Osoba 1',
			role: 'Zarząd',
			description: 'Odpowiada za rozwój organizacji i koordynację działań.',
			img: 'https://placehold.co/600x600'
		},
		{
			name: 'Osoba 2',
			role: 'Zarząd',
			description: 'Wspiera współpracę z partnerami i organizację projektów.',
			img: 'https://placehold.co/600x600'
		},
		{
			name: 'Osoba 3',
			role: 'Zarząd',
			description: 'Zajmuje się obszarem finansowym i sprawami organizacyjnymi.',
			img: 'https://placehold.co/600x600'
		},
		{
			name: 'Osoba 4',
			role: 'Zarząd',
			description: 'Odpowiada za komunikację i zaplecze formalne działań.',
			img: 'https://placehold.co/600x600'
		}
	];

	const revisionMembers: Member[] = [
		{
			name: 'Osoba 1',
			role: 'Komisja rewizyjna',
			description: 'Wspiera przejrzystość działań i dba o ich zgodność z założeniami organizacji.',
			img: 'https://placehold.co/600x600'
		},
		{
			name: 'Osoba 2',
			role: 'Komisja rewizyjna',
			description: 'Czuwa nad porządkiem organizacyjnym i jakością działań stowarzyszenia.',
			img: 'https://placehold.co/600x600'
		},
		{
			name: 'Osoba 3',
			role: 'Komisja rewizyjna',
			description: 'Wspiera kontrolę wewnętrzną i rozwój odpowiedzialnych standardów działania.',
			img: 'https://placehold.co/600x600'
		}
	];

	const documents: OurDocument[] = [
		{
			title: 'Statut',
			description:
				'Podstawowy dokument określający cele, zasady działania i strukturę stowarzyszenia.',
			buttonLabel: 'Otwórz dokument',
			icon: 'gavel'
		},
		{
			title: 'Polityka prywatności',
			description:
				'Informacje dotyczące zasad przetwarzania danych oraz korzystania ze strony internetowej.',
			buttonLabel: 'Otwórz dokument',
			icon: 'privacy_tip'
		},
		{
			title: 'Regulamin strony',
			description: 'Zasady korzystania ze strony internetowej Stowarzyszenia VIVIENA.',
			buttonLabel: 'Otwórz dokument',
			icon: 'description'
		},
		{
			title: 'Dane organizacyjne',
			description: 'Podstawowe dane formalne i kontaktowe stowarzyszenia.',
			buttonLabel: 'Zobacz dane',
			icon: 'business'
		}
	];

	function scrollTo(href: string) {
		const el = document.querySelector(href);
		el?.scrollIntoView({ behavior: 'smooth' });
	}

	// IntersectionObserver to update URL hash when sections come into view
	onMount(() => {
		const sections = document.querySelectorAll('[id]');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.getAttribute('id');
						if (id) {
							window.history.replaceState({}, '', `#${id}`);
						}
					}
				});
			},
			{
				threshold: 0.3
			}
		);

		sections.forEach((section) => observer.observe(section));

		return () => {
			sections.forEach((section) => observer.unobserve(section));
		};
	});
</script>

<Navbar />

<main>
	<Hero {scrollTo} />
	<About {howWeWork} />
	<AreasGrid {areas} />
	<ActionsSection {actions} />
	<TeamSection {boardMembers} {revisionMembers} />
	<DocumentsContact {documents} />
</main>

<Footer />
