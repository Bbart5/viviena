<script lang="ts">
	import { globalSaving } from '$lib/state/global-saving.svelte';

	// Blocks scrolling underneath while the overlay is up.
	$effect(() => {
		if (!globalSaving.active) return;

		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

{#if globalSaving.active}
	<div
		role="alert"
		aria-busy="true"
		class="fixed inset-0 z-[999] flex cursor-wait items-center justify-center bg-white/70 backdrop-blur-sm"
	>
		<div class="flex flex-col items-center gap-6">
			<span class="h-24 w-24 animate-spin rounded-full border-8 border-primary/20 border-t-primary"
			></span>
			<p class="font-headline text-lg font-bold text-brand-text">Zapisywanie...</p>
		</div>
	</div>
{/if}
