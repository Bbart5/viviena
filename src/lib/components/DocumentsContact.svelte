<script lang="ts">
	import { asset } from '$app/paths';
	import type { OurDocument } from '../../types';

	interface Props {
		documents: OurDocument[];
	}

	let { documents }: Props = $props();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;

		const requestData = {
			name,
			email,
			message
		};

		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestData)
		});

		const responseData = await response.json();

		if (responseData.success) {
			alert('Wiadomość została wysłana.');
		} else {
			alert(responseData.message);
		}
	}
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
		<div id="kontakt">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				Bądźmy w kontakcie
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-brand-text">Kontakt</h2>
			<p class="mb-10 text-lg leading-relaxed text-brand-muted">
				Chcesz porozmawiać o współpracy, wydarzeniu, działaniach w szkole albo partnerstwie? Napisz
				do nas lub odezwij się przez nasze media społecznościowe.
			</p>

			<!-- Contact Info -->
			<div class="mb-10 space-y-4">
				<div class="flex items-center gap-4 text-brand-muted">
					<span class="material-symbols-outlined text-primary">email</span>
					<a href="mailto:stowarzyszenieviviena@gmail.com">stowarzyszenieviviena@gmail.com</a>
				</div>
				<div class="flex items-center gap-4 text-brand-muted">
					<span class="material-symbols-outlined text-primary">phone</span>
					<span>+48 500 865 201</span>
				</div>
				<div
					class="rounded-xl border border-outline-variant/30 bg-white p-4 text-sm text-brand-muted"
				>
					<p><strong>Stowarzyszenie VIVIENA</strong></p>
					<p>NIP: 7262717174</p>
					<p>KRS: 0001209507</p>
					<p>REGON: 543483854</p>
					<p>Adres siedziby: ul. Łagiewnicka 80/98 / 152A, 91-456, Łódź</p>
				</div>
				<div class="flex gap-4">
					<a
						href="https://www.instagram.com/viviena.pl/"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-2 text-sm text-brand-muted"
					>
						Instagram
					</a>
					<a
						href="https://www.facebook.com/profile.php?id=61572026964494&locale=pl_PL"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-2 text-sm text-brand-muted"
					>
						Facebook
					</a>
					<a
						href="https://www.linkedin.com/company/stowarzyszenie-viviena"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-2 text-sm text-brand-muted"
					>
						LinkedIn
					</a>
				</div>
			</div>

			<p class="mb-8 text-sm leading-relaxed text-brand-muted">
				Najchętniej rozmawiamy o współpracy z instytucjami, szkołami, partnerami i osobami, które
				chcą tworzyć wartościowe działania społeczne i edukacyjne.
			</p>

			<!-- Contact Form -->
			<form class="space-y-6" onsubmit={handleSubmit}>
				<input type="hidden" name="_subject" value="Nowa wiadomość ze strony VIVIENA" />
				<input type="hidden" name="_captcha" value="false" />
				<input type="hidden" name="_template" value="table" />
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<label
							for="contact-name"
							class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
							>Imię</label
						>
						<input
							id="contact-name"
							name="name"
							type="text"
							placeholder="Twoje imię"
							class="w-full rounded-lg border border-outline-variant/20 bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary"
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
							name="email"
							type="email"
							placeholder="Twój email"
							class="w-full rounded-lg border border-outline-variant/20 bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary"
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
						name="message"
						placeholder="W czym możemy pomóc?"
						rows="4"
						class="w-full resize-none rounded-lg border border-outline-variant/20 bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary"
					></textarea>
				</div>
				<button
					type="submit"
					class="w-full rounded-full bg-linear-to-r from-primary to-primary-container py-3 font-headline text-base font-bold text-white shadow-lg transition-all hover:shadow-primary/20 md:py-4 md:text-lg"
				>
					Napisz do nas
				</button>
			</form>
		</div>
	</div>
</section>
