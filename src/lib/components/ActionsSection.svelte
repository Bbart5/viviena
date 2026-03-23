<script lang="ts">
	import type { Action } from '../../types';

	interface Props {
		actions: Action[];
	}

	let { actions }: Props = $props();
</script>

<section id="dzialania" class="relative overflow-hidden bg-[#1a1a1a] px-6 py-24 md:px-8">
	<!-- Background Glow -->
	<div
		class="absolute top-1/2 left-1/2 h-250 w-250 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]"
	></div>

	<div class="relative z-10 mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<span
					class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-tertiary-fixed uppercase"
				>
					Projekty i wydarzenia
				</span>
				<h2
					class="font-headline text-4xl leading-tight font-black text-surface-bright md:text-5xl lg:text-6xl"
				>
					Nasze działania
				</h2>
				<p class="mt-6 text-lg leading-relaxed text-brand-muted">
					Tworzymy wydarzenia i programy, które odpowiadają na aktualne potrzeby edukacyjne i
					społeczne. Poniżej znajdują się ostatnie wydarzenia, które organizowaliśmy.
				</p>
			</div>
		</div>

		<!-- Action Cards -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			{#each actions as action (action.title)}
				<div
					class="group flex flex-col rounded-2xl border border-outline-variant/10 bg-surface-container-lowest/5 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,81,193,0.12)]"
				>
					<!-- Placeholder Image -->
					<div
						class="flex h-56 items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-br from-brand-surface to-[#2a2a2a]"
					>
						<img
							src="https://placehold.co/1600x900"
							alt={action.title}
							class="h-full w-full object-cover"
						/>
					</div>

					<div class="flex flex-1 flex-col px-4 py-8">
						<!-- Tag & Date -->
						<div class="mb-6 flex items-start justify-between">
							<span
								class="rounded bg-primary/20 px-3 py-1 text-xs font-bold tracking-widest uppercase {action.tagColor ===
								'primary'
									? 'text-primary-fixed'
									: 'text-tertiary-fixed'}"
							>
								{action.tag}
							</span>
							<span class="text-sm text-on-surface-variant italic">{action.date}</span>
						</div>

						<h3
							class="mb-4 font-headline text-xl font-bold text-surface-bright transition-colors group-hover:text-primary-fixed"
						>
							{action.title}
						</h3>

						<p class="mb-6 text-sm leading-relaxed text-on-surface-variant">
							{action.description}
						</p>

						<!-- Details -->
						<div class="mb-8 space-y-1">
							{#each action.details as detail, idx (idx)}
								<p class="text-xs text-brand-muted">• {detail}</p>
							{/each}
						</div>

						<!-- Button -->
						<div class="mt-auto">
							<button
								class="flex items-center gap-2 text-xs font-bold tracking-widest text-surface-bright uppercase transition-transform group-hover:translate-x-2"
							>
								Wkrótce więcej informacji
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
						</div>
					</div>
				</div>
			{/each}
		</div>

		<p class="mt-16 text-center text-lg text-brand-muted">
			W kolejnych miesiącach będziemy rozwijać następne inicjatywy odpowiadające na pojawiające się
			potrzeby społeczne i edukacyjne.
		</p>
	</div>
</section>
