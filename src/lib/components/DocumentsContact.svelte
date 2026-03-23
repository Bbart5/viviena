<script lang="ts">
	import type { OurDocument } from '../../types';

	interface Props {
		documents: OurDocument[];
	}

	let { documents }: Props = $props();
</script>

<section class="bg-[#1a1a1a] px-6 py-24 md:px-8">
	<div class="mx-auto grid max-w-360 grid-cols-1 gap-24 lg:grid-cols-2">
		<!-- Documents -->
		<div id="dokumenty">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary-fixed uppercase"
			>
				Transparentność
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-surface-bright">Dokumenty</h2>
			<p class="mb-10 text-lg leading-relaxed text-brand-muted">
				Stawiamy na przejrzystość i dostęp do podstawowych informacji o naszej działalności. W tej
				sekcji znajdują się najważniejsze dokumenty związane z funkcjonowaniem stowarzyszenia.
			</p>
			<div class="space-y-4">
				{#each documents as doc (doc.title)}
					<button
						class="group flex w-full items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-low/5 p-6 text-left transition-all hover:bg-surface-container-low/10"
					>
						<div class="flex items-center gap-4">
							<span class="material-symbols-outlined text-primary-fixed">{doc.icon}</span>
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
					</button>
				{/each}
			</div>
		</div>

		<!-- Contact -->
		<div id="kontakt">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-tertiary-fixed uppercase"
			>
				Bądźmy w kontakcie
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-surface-bright">Kontakt</h2>
			<p class="mb-10 text-lg leading-relaxed text-brand-muted">
				Chcesz porozmawiać o współpracy, wydarzeniu, działaniach w szkole albo partnerstwie? Napisz
				do nas lub odezwij się przez nasze media społecznościowe.
			</p>

			<!-- Contact Info -->
			<div class="mb-10 space-y-4">
				<div class="flex items-center gap-4 text-brand-muted">
					<span class="material-symbols-outlined text-primary-fixed">email</span>
					<a href="mailto:kontakt@viviena.org">kontakt@viviena.org</a>
				</div>
				<div class="flex items-center gap-4 text-brand-muted">
					<span class="material-symbols-outlined text-primary-fixed">phone</span>
					<span>Wkrótce</span>
				</div>
				<div class="flex gap-4">
					<a href="#" target="_blank" class="flex items-center gap-2 text-sm text-brand-muted">
						Instagram
					</a>
					<a href="#" target="_blank" class="flex items-center gap-2 text-sm text-brand-muted">
						Facebook
					</a>
					<a href="#" target="_blank" class="flex items-center gap-2 text-sm text-brand-muted">
						LinkedIn
					</a>
				</div>
			</div>

			<p class="mb-8 text-sm leading-relaxed text-brand-muted">
				Najchętniej rozmawiamy o współpracy z instytucjami, szkołami, partnerami i osobami, które
				chcą tworzyć wartościowe działania społeczne i edukacyjne.
			</p>

			<!-- Contact Form -->
			<form class="space-y-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<label
							for="contact-name"
							class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
							>Imię</label
						>
						<input
							id="contact-name"
							type="text"
							placeholder="Twoje imię"
							class="w-full rounded-lg border border-transparent bg-brand-dark/80 p-4 text-surface-bright transition-colors outline-none focus:border-surface-bright"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="contact-email"
							class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
							>Email</label
						>
						<input
							id="contact-email"
							type="email"
							placeholder="Twój email"
							class="w-full rounded-lg border border-transparent bg-brand-dark/80 p-4 text-surface-bright transition-colors outline-none focus:border-surface-bright"
						/>
					</div>
				</div>
				<div class="space-y-2">
					<label
						for="contact-message"
						class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
						>Wiadomość</label
					>
					<textarea
						id="contact-message"
						placeholder="W czym możemy pomóc?"
						rows="4"
						class="w-full rounded-lg border border-transparent bg-brand-dark/80 p-4 text-surface-bright transition-colors outline-none focus:border-surface-bright"
					></textarea>
				</div>
				<button
					type="submit"
					class="w-full rounded-full bg-linear-to-r from-primary to-primary-container py-3 font-headline text-base font-bold text-on-primary-container shadow-lg transition-all hover:shadow-primary/20 md:py-4 md:text-lg"
				>
					Napisz do nas
				</button>
			</form>
		</div>
	</div>
</section>
