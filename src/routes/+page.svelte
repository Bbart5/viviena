<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Navbar,
		Hero,
		About,
		AreasGrid,
		ActionsSection,
		TeamSection,
		Documents,
		Footer,
		Seo
	} from '$lib';
	import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '$lib/consts/site';
	import { documents } from '$lib/data/site-content';
	import { observeSectionHashes, scrollToSection } from '$lib/utils/sections';

	onMount(observeSectionHashes);

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'NGO',
			name: SITE_NAME,
			url: SITE_URL,
			description: SITE_DESCRIPTION,
			logo: `${SITE_URL}/brand/logo.svg`,
			sameAs: ['https://www.instagram.com/viviena.pl/']
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: SITE_NAME,
			url: SITE_URL,
			inLanguage: 'pl'
		}
	];
</script>

<Seo {jsonLd} />

<Navbar />

<main>
	<Hero scrollTo={scrollToSection} />
	<About />
	<AreasGrid />
	<ActionsSection />
	<TeamSection />
	<Documents {documents} />
</main>

<Footer />
