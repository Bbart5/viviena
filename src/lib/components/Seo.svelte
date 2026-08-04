<script lang="ts">
	import { page } from '$app/state';
	import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL } from '$lib/consts/site';

	interface Props {
		/** Page title; the site name is appended automatically. Omit for the homepage. */
		title?: string;
		description?: string;
		/** Canonical path (defaults to the current pathname). */
		path?: string;
		/** OG image path, resolved against the production origin. */
		image?: string;
		noindex?: boolean;
		/** One or more JSON-LD objects rendered as application/ld+json. */
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title,
		description = SITE_DESCRIPTION,
		path,
		image = '/og/home.png',
		noindex = false,
		jsonLd
	}: Props = $props();

	const fullTitle = $derived(title ? `${title} | ${SITE_NAME}` : SITE_NAME);
	const canonical = $derived(new URL(path ?? page.url.pathname, SITE_URL).href);
	const imageUrl = $derived(new URL(image, SITE_URL).href);
	// The tag name is split so the Svelte parser never sees a literal
	// "<script"/"</script" sequence inside this <script> block.
	const ldOpen = '<scr' + 'ipt type="application/ld+json">';
	const ldClose = '</scr' + 'ipt>';
	const jsonLdBlocks = $derived(
		jsonLd
			? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map(
					(block) => `${ldOpen}${JSON.stringify(block)}${ldClose}`
				)
			: []
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={fullTitle} />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#each jsonLdBlocks as block (block)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialized via JSON.stringify above -->
		{@html block}
	{/each}
</svelte:head>
