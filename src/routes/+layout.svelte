<script lang="ts">
	import { asset } from '$app/paths';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('./favicon.svg')} />
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
	<!-- TODO - GA4: po potwierdzeniu z zespołem dodaj skrypt gtag i identyfikator pomiaru -->
</svelte:head>
{@render children()}
