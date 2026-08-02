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
		Footer
	} from '$lib';
	import { documents } from '$lib/data/site-content';
	import { observeSectionHashes, scrollToSection } from '$lib/utils/sections';

	onMount(observeSectionHashes);
</script>

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
