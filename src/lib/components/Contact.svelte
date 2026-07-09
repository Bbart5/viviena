<script lang="ts">
	import { superForm, defaults } from 'sveltekit-superforms';
	import { yup } from 'sveltekit-superforms/adapters';
	import { contactSchema, type ContactSchema } from '$lib/schemas/contact-schema';

	type Status = { type: 'success' | 'error'; text: string };

	const MESSAGE_MAX = 1000;

	let status = $state<Status | null>(null);

	const { form, errors, enhance, submitting } = superForm(defaults(yup(contactSchema)), {
		SPA: true,
		validators: yup(contactSchema),
		resetForm: true,
		onSubmit: () => {
			status = null;
		},
		onUpdate: async ({ form }) => {
			if (!form.valid) return;

			try {
				const response = await fetch('/api/contact', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(form.data)
				});

				const result = await response.json();

				if (result.success) {
					status = { type: 'success', text: 'Wiadomość została wysłana. Dziękujemy!' };
					return;
				}

				// Keep the form invalid so its contents are preserved (no reset).
				form.valid = false;

				const field = result.field as keyof ContactSchema | undefined;
				if (field && result.message) {
					form.errors[field] = [result.message];
				}

				status = { type: 'error', text: result.message ?? 'Nie udało się wysłać wiadomości.' };
			} catch {
				form.valid = false;
				status = { type: 'error', text: 'Nie udało się wysłać wiadomości.' };
			}
		}
	});
</script>

<div id="kontakt">
	<span class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase">
		Bądźmy w kontakcie
	</span>
	<h2 class="mb-6 font-headline text-4xl font-black text-brand-text">Kontakt</h2>
	<p class="mb-10 text-lg leading-relaxed text-brand-muted">
		Chcesz porozmawiać o współpracy, wydarzeniu, działaniach w szkole albo partnerstwie? Napisz do
		nas lub odezwij się przez nasze media społecznościowe.
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
		<div class="rounded-xl border border-outline-variant/30 bg-white p-4 text-sm text-brand-muted">
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
		Najchętniej rozmawiamy o współpracy z instytucjami, szkołami, partnerami i osobami, które chcą
		tworzyć wartościowe działania społeczne i edukacyjne.
	</p>

	<!-- Contact Form -->
	<form class="space-y-6" method="POST" use:enhance>
		{#if status}
			<div
				role={status.type === 'error' ? 'alert' : 'status'}
				class="flex items-start justify-between gap-4 rounded-lg border p-4 text-sm {status.type ===
				'success'
					? 'border-tertiary/40 bg-tertiary-container text-on-tertiary-container'
					: 'border-error/40 bg-error-container/20 text-error'}"
			>
				<span>{status.text}</span>
				<button
					type="button"
					onclick={() => (status = null)}
					aria-label="Zamknij"
					class="-m-1 flex shrink-0 items-center p-1 opacity-70 transition-opacity hover:opacity-100"
				>
					<span class="material-symbols-outlined text-lg leading-none">close</span>
				</button>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<div class="space-y-2">
				<label
					for="contact-name"
					class="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Imię</label
				>
				<input
					id="contact-name"
					name="name"
					type="text"
					placeholder="Twoje imię"
					autocomplete="name"
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					class="w-full rounded-lg border bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary {$errors.name
						? 'border-error'
						: 'border-outline-variant/20'}"
				/>
				{#if $errors.name}
					<p class="text-sm text-error">{$errors.name[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<label
					for="contact-email"
					class="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Email</label
				>
				<input
					id="contact-email"
					name="email"
					type="email"
					placeholder="Twój email"
					autocomplete="email"
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email}
					class="w-full rounded-lg border bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary {$errors.email
						? 'border-error'
						: 'border-outline-variant/20'}"
				/>
				{#if $errors.email}
					<p class="text-sm text-error">{$errors.email[0]}</p>
				{/if}
			</div>
		</div>
		<div class="space-y-2">
			<label
				for="contact-message"
				class="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Wiadomość</label
			>
			<textarea
				id="contact-message"
				name="message"
				placeholder="W czym możemy pomóc?"
				rows="4"
				maxlength={MESSAGE_MAX}
				aria-invalid={$errors.message ? 'true' : undefined}
				bind:value={$form.message}
				class="w-full resize-none rounded-lg border bg-white p-4 text-brand-text transition-colors outline-none focus:border-primary {$errors.message
					? 'border-error'
					: 'border-outline-variant/20'}"
			></textarea>
			<div class="flex items-start justify-between gap-4">
				{#if $errors.message}
					<p class="text-sm text-error">{$errors.message[0]}</p>
				{:else}
					<span></span>
				{/if}
				<span
					class="shrink-0 text-xs tabular-nums {($form.message?.length ?? 0) >= MESSAGE_MAX
						? 'text-error'
						: 'text-on-surface-variant'}"
				>
					{$form.message?.length ?? 0} / {MESSAGE_MAX}
				</span>
			</div>
		</div>
		<button
			type="submit"
			disabled={$submitting}
			class="w-full rounded-full bg-linear-to-r from-primary to-primary-container py-3 font-headline text-base font-bold text-white shadow-lg transition-all hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70 md:py-4 md:text-lg"
		>
			{$submitting ? 'Wysyłanie...' : 'Napisz do nas'}
		</button>
	</form>
</div>
