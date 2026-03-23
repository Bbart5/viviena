<script lang="ts">
	import type { HowWeWorkCard } from "../../types";

	

	interface Props {
		howWeWork: HowWeWorkCard[];
	}

	let { howWeWork }: Props = $props();
</script>

<section id="o-nas" class="bg-[#1a1a1a] px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16">
			<span class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] uppercase text-primary-fixed">
				O stowarzyszeniu
			</span>
			<h2 class="font-headline text-4xl font-black text-surface-bright md:text-5xl">
				Kim jesteśmy
			</h2>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
			<!-- Text Column -->
			<div class="space-y-6 text-lg leading-relaxed text-brand-muted">
				<p>
					Viviena powstała pod koniec 2025 roku z potrzeby tworzenia działań, które odpowiadają na zmieniające się realia współczesnego świata. Jesteśmy młodym zespołem, który uważnie obserwuje to, co dzieje się wokół, i zamienia ważne tematy społeczne oraz edukacyjne w konkretne inicjatywy.
				</p>
				<p>
					Wierzymy, że dobra organizacja społeczna powinna być uważna, elastyczna i odpowiedzialna. Dlatego nie działamy według jednego zamkniętego schematu. Tworzymy projekty dopasowane do aktualnych wyzwań, odbiorców i sytuacji, które naprawdę wymagają reakcji.
				</p>
				<p>
					Naszym celem jest prowadzenie działań społecznie użytecznych w obszarze edukacji, rozwoju osobistego i świadomości społecznej. Działamy z myślą o dzieciach, młodzieży, dorosłych, seniorach oraz grupach, które potrzebują dodatkowego wsparcia.
				</p>
			</div>

			<!-- How We Work Cards -->
			<div>
				<h3 class="mb-8 font-headline text-2xl font-bold text-surface-bright">Jak działamy</h3>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{#each howWeWork as card (card.title)}
						<div class="group rounded-2xl border border-outline-variant/5 bg-brand-dark/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-brand-dark/80">
							<span class="material-symbols-outlined mb-4 block text-3xl text-primary-fixed">
								{card.icon}
							</span>
							<h4 class="mb-2 font-headline text-base font-bold text-surface-bright">
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
