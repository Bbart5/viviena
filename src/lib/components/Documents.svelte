<script lang="ts">
	import { asset } from '$app/paths';
	import type { OurDocument } from '../../types';
	import Contact from './Contact.svelte';

	interface Props {
		documents: OurDocument[];
	}

	let { documents }: Props = $props();
</script>

<section class="bg-surface-container-low px-6 py-24 md:px-8">
	<div class="mx-auto grid max-w-360 grid-cols-1 gap-24 lg:grid-cols-2">
		<!-- Documents -->
		<div id="dokumenty">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				Transparentność
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-brand-text">Dokumenty</h2>
			<p class="mb-10 text-lg leading-relaxed text-brand-muted">
				Stawiamy na przejrzystość i dostęp do podstawowych informacji o naszej działalności. W tej
				sekcji znajdują się najważniejsze dokumenty związane z funkcjonowaniem stowarzyszenia.
			</p>
			<div class="space-y-4">
				{#each documents as doc (doc.title)}
					<a
						href={asset(doc.href)}
						target="_blank"
						rel="noreferrer"
						class="group flex w-full items-center justify-between rounded-xl border border-outline-variant/30 bg-white p-6 text-left transition-all hover:border-primary/40 hover:bg-surface-container-low"
					>
						<div class="flex items-center gap-4">
							<span class="material-symbols-outlined text-primary">{doc.icon}</span>
							<div>
								<span class="block font-medium text-brand-text">{doc.title}</span>
								<span class="text-sm text-brand-muted">{doc.description}</span>
							</div>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 shrink-0 text-on-surface-variant transition-colors group-hover:text-surface-bright"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{/each}
			</div>
		</div>

		<!-- Contact -->
		<Contact />
	</div>
</section>
