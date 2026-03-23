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
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary-fixed uppercase"
			>
				Ludzie Vivieny
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-surface-bright md:text-5xl">Zespół</h2>
			<p class="mx-auto max-w-2xl text-lg text-brand-muted">
				Za Vivieną stoi młody zespół, który łączy energię, zaangażowanie i chęć tworzenia działań z
				realnym znaczeniem społecznym.
			</p>
		</div>

		<!-- Zarząd -->
		<div class="mb-16">
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-surface-bright">Zarząd</h3>
			<div class="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
				{#each boardMembers as member (member.name)}
					<div class="group text-center">
						<div class="relative mx-auto mb-6 h-36 w-36 md:h-44 md:w-44">
							<div
								class="absolute inset-0 scale-0 rounded-full bg-primary opacity-20 transition-transform duration-500 group-hover:scale-105"
							></div>
							<div
								class="flex h-full w-full items-center justify-center rounded-full bg-brand-surface text-primary-fixed/40 transition-all duration-500 group-hover:bg-[#252525]"
							>
								<img src={member.img} alt={member.name} class="rounded-full" />
							</div>
						</div>
						<h4 class="font-headline text-lg font-bold text-surface-bright">{member.name}</h4>
						<p class="mt-1 text-xs tracking-widest text-on-surface-variant uppercase">
							{member.role}
						</p>
						<p class="mt-2 text-sm leading-relaxed text-brand-muted">{member.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Komisja Rewizyjna -->
		<div>
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-surface-bright">
				Komisja rewizyjna
			</h3>
			<div class="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
				{#each revisionMembers as member (member.name)}
					<div class="group text-center">
						<div class="relative mx-auto mb-6 h-36 w-36">
							<div
								class="absolute inset-0 scale-0 rounded-full bg-tertiary opacity-20 transition-transform duration-500 group-hover:scale-105"
							></div>
							<div
								class="flex h-full w-full items-center justify-center rounded-full bg-brand-surface text-tertiary-fixed/40 transition-all duration-500 group-hover:bg-[#252525]"
							>
								<img src={member.img} alt={member.name} class="rounded-full" />
							</div>
						</div>
						<h4 class="font-headline text-lg font-bold text-surface-bright">{member.name}</h4>
						<p class="mt-1 text-xs tracking-widest text-on-surface-variant uppercase">
							{member.role}
						</p>
						<p class="mt-2 text-sm leading-relaxed text-brand-muted">{member.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Team Photo Placeholder -->
		<div class="mt-20 text-center">
			<div class="mx-auto flex aspect-video max-h-92">
				<img
					src="https://placehold.co/600x600"
					alt="Zdjęcie zespołu"
					class="w-full rounded-2xl border border-outline-variant/10 bg-[#1a1a1a] object-cover"
				/>
			</div>
			<p class="mt-4 font-headline text-lg font-semibold text-surface-bright">
				Tworzymy Vivienę wspólnie
			</p>
		</div>
	</div>
</section>
