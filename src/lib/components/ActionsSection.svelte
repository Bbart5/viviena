<script lang="ts">
	import type { Action } from '../../types';

	interface Props {
		actions: Action[];
	}

	let { actions }: Props = $props();
</script>

<section
	id="dzialania"
	class="relative overflow-hidden bg-surface-container-low px-6 py-24 md:px-8"
>
	<!-- Background Glow -->
	<div
		class="absolute top-1/2 left-1/2 h-250 w-250 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]"
	></div>

	<div class="relative z-10 mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<span
					class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
				>
					Projekty i wydarzenia
				</span>
				<h2
					class="font-headline text-4xl leading-tight font-black text-brand-text md:text-5xl lg:text-6xl"
				>
					Nasze działania
				</h2>
				<p class="mt-6 text-lg leading-relaxed text-brand-muted">
					Obecnie prezentujemy relację z zakończonej edycji Finance Academy - naszego kluczowego
					projektu w obszarze edukacji finansowej.
				</p>
			</div>
		</div>

		<!-- Action Cards -->
		<div class="grid grid-cols-1 gap-8">
			{#each actions as action (action.title)}
				<div
					class="group flex flex-col rounded-2xl border border-outline-variant/30 bg-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,81,193,0.12)]"
				>
					<div
						class="flex h-56 items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-br from-primary/10 to-primary-container/25"
					>
						<img src={action.image} alt={action.title} class="h-full w-full object-cover" />
					</div>

					<div class="flex flex-1 flex-col px-4 py-8">
						<!-- Tag & Date -->
						<div class="mb-6 flex items-start justify-between">
							<span
								class="rounded px-3 py-1 text-xs font-bold tracking-widest uppercase {action.tagColor ===
								'green'
									? 'bg-green-100 text-green-700'
									: 'bg-primary/20 text-primary'}"
							>
								{action.tag}
							</span>
							<span class="text-sm text-brand-muted italic">{action.date}</span>
						</div>

						<h3
							class="mb-4 font-headline text-2xl font-bold text-brand-text transition-colors group-hover:text-primary"
						>
							{action.title}
						</h3>

						<p class="mb-6 text-sm leading-relaxed text-brand-muted">
							{action.description}
						</p>

						<!-- Details -->
						<div class="mb-8 space-y-1">
							{#each action.details as detail, idx (idx)}
								<p class="text-xs text-brand-muted">• {detail}</p>
							{/each}
						</div>

						<div
							class="mb-8 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
						>
							<h4
								class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
							>
								Relacja
							</h4>
							<p class="text-sm leading-relaxed text-brand-muted">{action.relation}</p>
						</div>

						<div class="mb-8 grid gap-6 md:grid-cols-2">
							<div>
								<h4
									class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
								>
									Goście i grupy
								</h4>
								<ul class="space-y-1 text-sm text-brand-muted">
									{#each action.people as person (person)}
										<li>• {person}</li>
									{/each}
								</ul>
							</div>
							<div>
								<h4
									class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
								>
									Partnerzy
								</h4>
								<ul class="space-y-1 text-sm text-brand-muted">
									{#each action.partners as partner (partner)}
										<li>• {partner}</li>
									{/each}
								</ul>
							</div>
						</div>

						<!-- Button -->
						<div class="mt-auto">
							{#if action.showCta}
								<button
									class="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-text uppercase transition-transform group-hover:translate-x-2"
								>
									{action.ctaLabel}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<p class="mt-16 text-center text-lg text-brand-muted">
			Kolejne wydarzenia będą publikowane po zakończeniu realizacji.
		</p>
	</div>
</section>
