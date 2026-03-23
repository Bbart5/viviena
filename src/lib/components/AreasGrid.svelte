<script lang="ts">
	import type { Area } from "../../types";

	interface Props {
		areas: Area[];
	}

	let { areas }: Props = $props();
</script>

<section id="obszary" class="px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary-fixed uppercase"
			>
				Zakres wpływu
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-surface-bright md:text-5xl">
				Obszary działań
			</h2>
			<p class="max-w-2xl text-lg leading-relaxed text-brand-muted">
				Nasze działania rozwijają się razem z potrzebami odbiorców i tematami, które mają dziś
				szczególne znaczenie. Skupiamy się na obszarach, w których edukacja i zaangażowanie
				społeczne mogą realnie przełożyć się na zmianę.
			</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each areas as area (area.title)}
				<div
					class="group relative overflow-hidden rounded-2xl border border-outline-variant/5 bg-surface-container-low/5 p-10 transition-all duration-500 md:p-12 {area.span ===
					2
						? 'md:col-span-2'
						: ''}"
				>
					{#if area.span === 2}
						<div
							class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"
						></div>
					{/if}
					<span class="material-symbols-outlined mb-8 text-5xl text-primary-fixed">
						{area.icon}
					</span>
					<h3
						class="mb-4 font-headline font-bold text-surface-bright {area.span === 2
							? 'text-3xl'
							: 'text-2xl'}"
					>
						{area.title}
					</h3>
					<p
						class="max-w-md leading-relaxed text-on-surface-variant {area.span === 2
							? 'text-lg'
							: 'text-base'}"
					>
						{area.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
