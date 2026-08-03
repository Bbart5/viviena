<script lang="ts">
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import {
		Navbar,
		Hero,
		About,
		AreasGrid,
		ActionsSection,
		TeamSection,
		Documents,
		Footer,
		StorageUsageWidget,
		SavingOverlay
	} from '$lib';
	import { documents } from '$lib/data/site-content';
	import { observeSectionHashes, scrollToSection } from '$lib/utils/sections';

	onMount(observeSectionHashes);
</script>

<LogoutButton />

<SavingOverlay />

<Navbar />

<main>
	<section class="mx-auto max-w-360 px-6 pt-28 pb-4 md:px-8">
		<StorageUsageWidget />
	</section>
	<Hero scrollTo={scrollToSection} admin={true} />
	<About admin={true} />
	<AreasGrid admin={true} />
	<ActionsSection admin={true} />
	<TeamSection admin={true} />
	<Documents {documents} />
</main>

<Footer />
