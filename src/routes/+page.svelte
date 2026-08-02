<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		Navbar,
		Hero,
		About,
		AreasGrid,
		ActionsSection,
		TeamSection,
		Documents,
		Footer
	} from '$lib';
	import type { Member, OurDocument } from '../types';
	import { asset } from '$app/paths';
	import type { Action } from '../../generated/prisma/client';

	let { data }: { data: PageData } = $props();

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
	<Hero {scrollTo} hero={data.hero} />
	<About about={data.about} />
	<AreasGrid areas={data.areas} />
	<ActionsSection actions={data.actions} />
	<TeamSection {boardMembers} {revisionMembers} />
	<Documents {documents} />
</main>

<Footer />
