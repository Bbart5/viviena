<script lang="ts">
	import type { HowWeWorkCard } from "../../types";

	

	interface Props {
		howWeWork: HowWeWorkCard[];
	}

	let { howWeWork }: Props = $props();
</script>

<section id="o-nas" class="bg-surface-container-low px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16">
			<span class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] uppercase text-primary">
				O stowarzyszeniu
			</span>
			<h2 class="font-headline text-4xl font-black text-brand-text md:text-5xl">
				Kim jesteśmy
			</h2>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
			<!-- Text Column -->
			<div class="space-y-6 text-lg leading-relaxed text-brand-muted">
				<p>
					VIVIENA powstała z potrzeby tworzenia działań, które realnie wspierają młodych ludzi w
					edukacji i rozwoju. Skupiamy się na tematach, które mają bezpośredni wpływ na codzienne
					decyzje i przyszłość.
				</p>
				<p>
					Najmocniej akcentujemy edukację finansową: oszczędzanie, inwestowanie, bezpieczeństwo
					finansowe i świadome poruszanie się po informacjach z internetu. Pokazujemy wiedzę
					praktycznie, językiem zrozumiałym dla młodzieży i studentów.
				</p>
				<p>
					Współpracujemy z ekspertami, uczelniami i partnerami społecznymi, żeby dawać młodym
					ludziom praktyczny dostęp do rzetelnej wiedzy oraz narzędzi potrzebnych w dorosłym życiu.
				</p>
			</div>

			<!-- How We Work Cards -->
			<div>
				<h3 class="mb-8 font-headline text-2xl font-bold text-brand-text">Jak działamy</h3>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{#each howWeWork as card (card.title)}
						<div class="group rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md">
							<span class="material-symbols-outlined mb-4 block text-3xl text-primary">
								{card.icon}
							</span>
							<h4 class="mb-2 font-headline text-base font-bold text-brand-text">
								{card.title}
							</h4>
							<p class="text-sm leading-relaxed text-brand-muted">
								{card.description}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
