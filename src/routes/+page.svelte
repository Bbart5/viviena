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
			description: 'Tworzymy działania odpowiadające na realne wyzwania młodych ludzi.',
			icon: 'visibility'
		},
		{
			title: 'Uczymy praktycznie',
			description: 'Przekładamy teorię na konkret: decyzje, nawyki i codzienne wybory finansowe.',
			icon: 'rocket_launch'
		},
		{
			title: 'Budujemy świadome postawy',
			description: 'Pokazujemy finanse i bezpieczeństwo bez uproszczeń oraz bez straszenia.',
			icon: 'balance'
		},
		{
			title: 'Budujemy współpracę',
			description: 'Łączymy młodzież, ekspertów, uczelnie i instytucje wokół edukacji finansowej.',
			icon: 'handshake'
		}
	];

	const areas: Area[] = [
		{
			title: 'Edukacja finansowa',
			description:
				'Tworzymy wydarzenia i materiały, które pomagają młodym ludziom lepiej rozumieć pieniądze, inwestowanie, bezpieczeństwo finansowe i codzienne decyzje ekonomiczne. Pokazujemy finanse w praktyczny, przystępny i ciekawy sposób.',
			icon: 'school',
			span: 3
		},
		{
			title: 'Rynek kapitałowy i inwestycje',
			description:
				'Przybliżamy podstawy inwestowania, działanie rynku kapitałowego oraz różnice między bezpiecznymi i ryzykownymi instrumentami finansowymi. Chcemy, żeby młodzi ludzie podejmowali decyzje świadomie, a nie pod wpływem przypadkowych treści z internetu.',
			icon: 'trending_up',
			span: 1
		},
		{
			title: 'Cyberbezpieczeństwo',
			description:
				'Edukujemy o bezpieczeństwie w sieci, ochronie danych i zagrożeniach cyfrowych, szczególnie w kontekście finansów, bankowości, płatności online i oszustw internetowych.',
			icon: 'shield_lock',
			span: 1
		},
		{
			title: 'Oszczędzanie i budżet',
			description:
				'Pokazujemy, jak planować wydatki, budować dobre nawyki finansowe, rozumieć budżet osobisty i podejmować codzienne decyzje, które mają realny wpływ na przyszłość.',
			icon: 'savings',
			span: 1
		}
	];

	// TODO - photo: dodaj plik /static/events/finance-academy-2026-cover.jpg
	const actions: Action[] = [
		{
			title: 'Finance Academy, VII edycja, 2026',
			date: '22-24 kwietnia 2026',
			tag: 'Zakończone',
			tagColor: 'green',
			ctaLabel: 'Zobacz relację',
			showCta: false,
			image: '/events/finance-academy-2026-cover.jpg',
			description:
				'Finance Academy to konferencja edukacyjna dla licealistów i studentów, której celem jest pokazanie finansów w praktyczny, ciekawy i przystępny sposób. Wydarzenie łączy konferencję stacjonarną z webinarami online i odpowiada na realny problem: młodzi ludzie często znają ryzykowne aktywa z internetu, ale brakuje im rzetelnych podstaw dotyczących oszczędzania, inwestowania i bezpieczeństwa finansowego.',
			details: [
				'Organizatorzy: Stowarzyszenie VIVIENA we współpracy z SKN Inwestor',
				'Format: wydarzenie hybrydowe (konferencja stacjonarna + webinary online)',
				'22 kwietnia: konferencja dla uczniów szkół średnich',
				'23-24 kwietnia: webinary online, bardziej skierowane do studentów'
			],
			relation:
				'Wydarzenie było odpowiedzią na wyniki ankiety: młodzież częściej deklarowała znajomość ryzykownych aktywów (krypto, CFD, Forex) niż podstaw takich jak ETF-y, obligacje, oszczędzanie i bezpieczeństwo finansowe.',
			people: [
				'Prof. Joanna Senyszyn',
				'Emil Łobodziński',
				'Hubert Świerczewski (Pankracy)',
				'dr hab. prof. UŁ Artur Sajnóg',
				'Agata Kobylińska',
				'Jakub Petera (@k.b.a_p.t.r)',
				'Mikołaj Światowy (@mikolaj_swiatowy)',
				'Natalia Śliwka (@natalia.sliwka.180)',
				'Młodzieżowa Rada Miasta',
				'Młodzieżowy Sejmik Województwa Łódzkiego'
			],
			partners: ['PwC', 'PKOBP', 'MRM', 'Politechnika Łódzka', 'Uniwersytet Łódzki', 'inni partnerzy']
		}
	];

	// TODO - photo: dodaj zdjęcia do /static/team/
	const boardMembers: Member[] = [
		{
			name: 'Aleksander Karol Sęk',
			role: 'Prezes Zarządu (od 11 grudnia 2025 r.)',
			img: '/team/aleksander-karol-sek.jpg'
		},
		{
			name: 'Bartosz Tomasz Błaszczyk',
			role: 'Wiceprezes Zarządu (od 11 grudnia 2025 r.)',
			img: '/team/bartosz-tomasz-blaszczyk.jpg'
		},
		{
			name: 'Szymon Piotr Rudecki',
			role: 'Skarbnik (od 11 grudnia 2025 r.)',
			img: '/team/szymon-piotr-rudecki.jpg'
		},
		{
			name: 'Wiktor Trześniowski',
			role: 'Sekretarz (od 11 grudnia 2025 r.)',
			img: '/team/wiktor-trzesniowski.jpg'
		}
	];

	const revisionMembers: Member[] = [
		{
			name: 'Filip Paweł Rolczak',
			role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
			img: '/team/filip-pawel-rolczak.jpg'
		},
		{
			name: 'Maciej Grzegorz Maj',
			role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
			img: '/team/maciej-grzegorz-maj.jpg'
		},
		{
			name: 'Sebastian Waldemar Matusiak',
			role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
			img: '/team/sebastian-waldemar-matusiak.jpg'
		}
	];

	const documents: OurDocument[] = [
		{
			title: 'Polityka prywatności',
			description:
				'Informacje dotyczące zasad przetwarzania danych, cookies oraz analityki strony internetowej.',
			href: '/documents/polityka-prywatnosci.html',
			icon: 'privacy_tip'
		},
		{
			title: 'Regulamin strony',
			description: 'Zasady korzystania ze strony internetowej Stowarzyszenia VIVIENA.',
			href: '/documents/regulamin-strony.html',
			icon: 'description'
		},
		{
			title: 'Dane organizacyjne',
			description: 'Podstawowe dane formalne i kontaktowe stowarzyszenia.',
			href: '/documents/dane-organizacyjne.html',
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
