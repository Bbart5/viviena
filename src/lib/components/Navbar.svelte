<script lang="ts">
	import { resolve } from '$app/paths';

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Start', hash: '#start' },
		{ label: 'O nas', hash: '#o-nas' },
		{ label: 'Obszary działań', hash: '#obszary' },
		{ label: 'Nasze działania', hash: '#dzialania' },
		{ label: 'Zespół', hash: '#zespol' },
		{ label: 'Dokumenty', hash: '#dokumenty' },
		{ label: 'Kontakt', hash: '#kontakt' }
	] as const;

	function scrollTo(href: string) {
		mobileMenuOpen = false;
		const el = document.querySelector(href);
		el?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<nav class="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-md">
	<div class="mx-auto flex w-full max-w-360 items-center justify-between px-6 py-5 md:px-8">
		<!-- Logo -->
		<a href={resolve('/#start')} class="flex items-center gap-3" onclick={() => scrollTo('#start')}>
			<img alt="VIVIENA Logo" class="h-9 w-auto" src="/logo.svg" />
		</a>

		<!-- Desktop Nav -->
		<div class="hidden items-center gap-8 lg:flex">
			{#each navLinks as { hash, label } (hash)}
				<a
					class="font-headline text-sm font-medium text-brand-text opacity-80 transition-all duration-300 hover:text-primary-fixed hover:opacity-100"
					href={resolve(`/${hash}`)}
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo(hash);
					}}
				>
					{label}
				</a>
			{/each}
		</div>

		<!-- CTA + Mobile Toggle -->
		<div class="flex items-center gap-4">
			<a
				href={resolve('/#kontakt')}
				onclick={(e: MouseEvent) => {
					e.preventDefault();
					scrollTo('#kontakt');
				}}
				class="hidden rounded-full bg-linear-to-br from-primary to-primary-container px-6 py-2.5 font-headline text-sm font-bold text-on-primary-container transition-transform hover:scale-105 sm:inline-block"
			>
				Napisz do nas
			</a>
			<button
				class="text-brand-text lg:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-[#2a2a2a] bg-brand-surface px-6 py-6 lg:hidden">
			<div class="flex flex-col gap-4">
				{#each navLinks as { hash, label } (hash)}
					<a
						class="font-headline text-base font-medium text-brand-text transition-colors hover:text-primary-fixed"
						href={resolve(`/${hash}`)}
						onclick={(e: MouseEvent) => {
							e.preventDefault();
							scrollTo(hash);
						}}
					>
						{label}
					</a>
				{/each}
				<a
					href={resolve('/#kontakt')}
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo('#kontakt');
					}}
					class="mt-4 rounded-full bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-center font-headline text-sm font-bold text-on-primary-container"
				>
					Napisz do nas
				</a>
			</div>
		</div>
	{/if}
</nav>
