<script lang="ts">
	import type { Member } from '../../types';

	interface Props {
		boardMembers: Member[];
		revisionMembers: Member[];
	}

	let { boardMembers, revisionMembers }: Props = $props();
</script>

<section id="zespol" class="px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				Ludzie Vivieny
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-brand-text md:text-5xl">Zespół</h2>
			<p class="mx-auto max-w-2xl text-lg text-brand-muted">
				Przedstawiamy aktualny skład Zarządu i Komisji Rewizyjnej.
			</p>
		</div>

		<!-- Zarząd -->
		<div class="mb-16">
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-brand-text">Zarząd</h3>
			<div class="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
				{#each boardMembers as member (member.name)}
					<div class="group text-center">
						<div class="relative mx-auto mb-6 h-36 w-36 md:h-44 md:w-44">
							<div
								class="absolute inset-0 scale-0 rounded-full bg-primary opacity-20 transition-transform duration-500 group-hover:scale-105"
							></div>
							<div class="flex h-full w-full items-center justify-center rounded-full bg-surface-container-low text-primary/40 transition-all duration-500 group-hover:bg-surface-container">
								<img src={member.img} alt={member.name} class="rounded-full" />
							</div>
						</div>
						<h4 class="font-headline text-lg font-bold text-brand-text">{member.name}</h4>
						<p class="mt-1 text-xs tracking-widest text-on-surface-variant uppercase">
							{member.role}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Komisja Rewizyjna -->
		<div>
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-brand-text">
				Komisja rewizyjna
			</h3>
			<div class="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
				{#each revisionMembers as member (member.name)}
					<div class="group text-center">
						<div class="relative mx-auto mb-6 h-36 w-36">
							<div
								class="absolute inset-0 scale-0 rounded-full bg-tertiary opacity-20 transition-transform duration-500 group-hover:scale-105"
							></div>
							<div class="flex h-full w-full items-center justify-center rounded-full bg-surface-container-low text-primary/40 transition-all duration-500 group-hover:bg-surface-container">
								<img src={member.img} alt={member.name} class="rounded-full" />
							</div>
						</div>
						<h4 class="font-headline text-lg font-bold text-brand-text">{member.name}</h4>
						<p class="mt-1 text-xs tracking-widest text-on-surface-variant uppercase">
							{member.role}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Sekcja "Tworzymy VIVIENĘ wspólnie" ukryta na wersji produkcyjnej -->
	</div>
</section>
