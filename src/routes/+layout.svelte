<script lang="ts">
	import { asset } from '$app/paths';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<!-- SVG for modern browsers; .ico/.png fallbacks because Google Search
	     and iOS don't support SVG favicons. -->
	<link rel="icon" href={asset('/favicon.svg')} type="image/svg+xml" />
	<link rel="icon" href={asset('/favicon.ico')} sizes="48x48" />
	<link rel="icon" href={asset('/favicon-32x32.png')} type="image/png" sizes="32x32" />
	<link rel="icon" href={asset('/favicon-16x16.png')} type="image/png" sizes="16x16" />
	<link rel="apple-touch-icon" sizes="180x180" href={asset('/apple-touch-icon.png')} />
	<link rel="manifest" href={asset('/site.webmanifest')} />
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
	<!-- TODO - GA4: po potwierdzeniu z zespołem dodaj skrypt gtag i identyfikator pomiaru -->
</svelte:head>
{@render children()}
