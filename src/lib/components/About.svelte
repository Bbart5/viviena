<script lang="ts">
	import { getAbout, updateAbout } from '$lib/remote/about.remote';
	import { commandErrorMessage } from '$lib/utils/api';

	interface Props {
		admin?: boolean;
	}

	let { admin }: Props = $props();

	const about = $derived(await getAbout());

	let editing = $state(false);

	let saving = $state(false);

	let editedAbout = $state({
		id: 0,
		title: '',
		header: '',
		paragraph1: '',
		paragraph2: '',
		paragraph3: '',
		card1Title: '',
		card1Description: '',
		card2Title: '',
		card2Description: '',
		card3Title: '',
		card3Description: '',
		card4Title: '',
		card4Description: ''
	});

	function startEditing() {
		editedAbout = {
			id: about.id,
			title: about.title,
			header: about.header,
			paragraph1: about.paragraph1,
			paragraph2: about.paragraph2,
			paragraph3: about.paragraph3,
			card1Title: about.card1Title,
			card1Description: about.card1Description,
			card2Title: about.card2Title,
			card2Description: about.card2Description,
			card3Title: about.card3Title,
			card3Description: about.card3Description,
			card4Title: about.card4Title,
			card4Description: about.card4Description
		};

		editing = true;
	}

	function cancelEditing() {
		editing = false;
	}

	async function saveEditing() {
		if (saving) return;

		const fields = $state.snapshot(editedAbout);

		saving = true;
		// Close the form right away — the override shows the new content instantly.
		editing = false;

		try {
			await updateAbout(fields).updates(getAbout().withOverride((a) => ({ ...a, ...fields })));
		} catch (error) {
			console.error(error);
			editedAbout = fields;
			editing = true;
			alert(commandErrorMessage(error, 'Wystąpił błąd podczas zapisywania.'));
		} finally {
			saving = false;
		}
	}
</script>

<section id="o-nas" class="bg-surface-container-low px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				{#if admin && editing}
					<input
						bind:value={editedAbout.title}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{about.title}
				{/if}
			</span>
			<h2 class="font-headline text-4xl font-black text-brand-text md:text-5xl">
				{#if admin && editing}
					<input
						bind:value={editedAbout.header}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{about.header}
				{/if}
			</h2>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
			<!-- Text Column -->
			<div class="space-y-6 text-lg leading-relaxed text-brand-muted">
				<p>
					{#if admin && editing}
						<textarea
							bind:value={editedAbout.paragraph1}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-4"
						></textarea>
					{:else}
						{about.paragraph1}
					{/if}
				</p>
				<p>
					{#if admin && editing}
						<textarea
							bind:value={editedAbout.paragraph2}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-4"
						></textarea>
					{:else}
						{about.paragraph2}
					{/if}
				</p>
				<p>
					{#if admin && editing}
						<textarea
							bind:value={editedAbout.paragraph3}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-4"
						></textarea>
					{:else}
						{about.paragraph3}
					{/if}
				</p>
			</div>

			<!-- How We Work Cards -->
			<div>
				<h3 class="mb-8 font-headline text-2xl font-bold text-brand-text">Jak działamy</h3>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<!-- Karta 1 -->
					<div
						class="group rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
					>
						<span class="material-symbols-outlined mb-4 block text-3xl text-primary">
							visibility
						</span>

						<h4 class="mb-2 font-headline text-base font-bold text-brand-text">
							{#if admin && editing}
								<input
									bind:value={editedAbout.card1Title}
									class="w-full rounded-xl border border-outline bg-white px-3 py-2"
								/>
							{:else}
								{about.card1Title}
							{/if}
						</h4>

						<p class="text-sm leading-relaxed text-brand-muted">
							{#if admin && editing}
								<textarea
									bind:value={editedAbout.card1Description}
									rows="3"
									class="w-full rounded-xl border border-outline bg-white p-3"
								></textarea>
							{:else}
								{about.card1Description}
							{/if}
						</p>
					</div>

					<!-- Karta 2 -->
					<div
						class="group rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
					>
						<span class="material-symbols-outlined mb-4 block text-3xl text-primary">
							rocket_launch
						</span>

						<h4 class="mb-2 font-headline text-base font-bold text-brand-text">
							{#if admin && editing}
								<input
									bind:value={editedAbout.card2Title}
									class="w-full rounded-xl border border-outline bg-white px-3 py-2"
								/>
							{:else}
								{about.card2Title}
							{/if}
						</h4>

						<p class="text-sm leading-relaxed text-brand-muted">
							{#if admin && editing}
								<textarea
									bind:value={editedAbout.card2Description}
									rows="3"
									class="w-full rounded-xl border border-outline bg-white p-3"
								></textarea>
							{:else}
								{about.card2Description}
							{/if}
						</p>
					</div>

					<!-- Karta 3 -->
					<div
						class="group rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
					>
						<span class="material-symbols-outlined mb-4 block text-3xl text-primary">
							balance
						</span>

						<h4 class="mb-2 font-headline text-base font-bold text-brand-text">
							{#if admin && editing}
								<input
									bind:value={editedAbout.card3Title}
									class="w-full rounded-xl border border-outline bg-white px-3 py-2"
								/>
							{:else}
								{about.card3Title}
							{/if}
						</h4>

						<p class="text-sm leading-relaxed text-brand-muted">
							{#if admin && editing}
								<textarea
									bind:value={editedAbout.card3Description}
									rows="3"
									class="w-full rounded-xl border border-outline bg-white p-3"
								></textarea>
							{:else}
								{about.card3Description}
							{/if}
						</p>
					</div>

					<!-- Karta 4 -->
					<div
						class="group rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
					>
						<span class="material-symbols-outlined mb-4 block text-3xl text-primary">
							handshake
						</span>

						<h4 class="mb-2 font-headline text-base font-bold text-brand-text">
							{#if admin && editing}
								<input
									bind:value={editedAbout.card4Title}
									class="w-full rounded-xl border border-outline bg-white px-3 py-2"
								/>
							{:else}
								{about.card4Title}
							{/if}
						</h4>

						<p class="text-sm leading-relaxed text-brand-muted">
							{#if admin && editing}
								<textarea
									bind:value={editedAbout.card4Description}
									rows="3"
									class="w-full rounded-xl border border-outline bg-white p-3"
								></textarea>
							{:else}
								{about.card4Description}
							{/if}
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if admin}
			<div class="mt-8 flex gap-3">
				{#if admin && editing}
					<button
						onclick={saveEditing}
						class="cursor-pointer rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
					>
						Zapisz
					</button>

					<button
						onclick={cancelEditing}
						class="cursor-pointer rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container"
					>
						Anuluj
					</button>
				{:else}
					<button
						onclick={startEditing}
						class="cursor-pointer rounded-xl bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90"
					>
						Edytuj
					</button>
				{/if}
			</div>
		{/if}
	</div>
</section>
