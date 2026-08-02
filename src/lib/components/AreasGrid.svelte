<script lang="ts">
	import { getAreas, updateAreas } from '$lib/remote/areas.remote';
	import { commandErrorMessage } from '$lib/utils/api';

	interface Props {
		admin?: boolean;
	}

	let { admin }: Props = $props();

	const areas = $derived(await getAreas());

	let editing = $state(false);

	let saving = $state(false);

	let editedAreas = $state({
		id: 0,
		title: '',
		header1: '',
		paragraph1: '',
		header2: '',
		paragraph2: '',
		header3: '',
		paragraph3: '',
		header4: '',
		paragraph4: '',
		header5: '',
		paragraph5: ''
	});

	function startEditing() {
		editedAreas = {
			id: areas.id,
			title: areas.title,
			header1: areas.header1,
			paragraph1: areas.paragraph1,
			header2: areas.header2,
			paragraph2: areas.paragraph2,
			header3: areas.header3,
			paragraph3: areas.paragraph3,
			header4: areas.header4,
			paragraph4: areas.paragraph4,
			header5: areas.header5,
			paragraph5: areas.paragraph5
		};

		editing = true;
	}

	function cancelEditing() {
		editing = false;
	}

	async function saveEditing() {
		if (saving) return;

		const fields = $state.snapshot(editedAreas);

		saving = true;
		// Close the form right away — the override shows the new content instantly.
		editing = false;

		try {
			await updateAreas(fields).updates(getAreas().withOverride((a) => ({ ...a, ...fields })));
		} catch (error) {
			console.error(error);
			editedAreas = fields;
			editing = true;
			alert(commandErrorMessage(error, 'Wystąpił błąd podczas zapisywania.'));
		} finally {
			saving = false;
		}
	}
</script>

<section id="obszary" class="px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				{#if admin && editing}
					<input
						bind:value={editedAreas.title}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{areas.title}
				{/if}
			</span>

			<h2 class="mb-6 font-headline text-4xl font-black text-brand-text md:text-5xl">
				{#if admin && editing}
					<input
						bind:value={editedAreas.header1}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{areas.header1}
				{/if}
			</h2>

			<p class="max-w-2xl text-lg leading-relaxed text-brand-muted">
				{#if admin && editing}
					<textarea
						bind:value={editedAreas.paragraph1}
						rows="4"
						class="w-full resize-none rounded-xl border border-outline bg-white p-4"
					></textarea>
				{:else}
					{areas.paragraph1}
				{/if}
			</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Karta 1 -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white p-10 transition-all duration-500 hover:border-primary/40 hover:shadow-md md:col-span-3 md:p-12"
			>
				<div
					class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"
				></div>

				<span class="material-symbols-outlined mb-8 text-5xl text-primary"> school </span>

				<h3 class="mb-4 font-headline text-3xl font-bold text-brand-text">
					{#if admin && editing}
						<input
							bind:value={editedAreas.header2}
							class="w-full rounded-xl border border-outline bg-white px-3 py-2"
						/>
					{:else}
						{areas.header2}
					{/if}
				</h3>

				<p class="max-w-md text-lg leading-relaxed text-brand-muted">
					{#if admin && editing}
						<textarea
							bind:value={editedAreas.paragraph2}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-3"
						></textarea>
					{:else}
						{areas.paragraph2}
					{/if}
				</p>
			</div>

			<!-- Karta 2 -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white p-10 transition-all duration-500 hover:border-primary/40 hover:shadow-md md:p-12"
			>
				<span class="material-symbols-outlined mb-8 text-5xl text-primary"> trending_up </span>

				<h3 class="mb-4 font-headline text-2xl font-bold text-brand-text">
					{#if admin && editing}
						<input
							bind:value={editedAreas.header3}
							class="w-full rounded-xl border border-outline bg-white px-3 py-2"
						/>
					{:else}
						{areas.header3}
					{/if}
				</h3>

				<p class="leading-relaxed text-brand-muted">
					{#if admin && editing}
						<textarea
							bind:value={editedAreas.paragraph3}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-3"
						></textarea>
					{:else}
						{areas.paragraph3}
					{/if}
				</p>
			</div>

			<!-- Karta 3 -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white p-10 transition-all duration-500 hover:border-primary/40 hover:shadow-md md:p-12"
			>
				<span class="material-symbols-outlined mb-8 text-5xl text-primary"> shield_lock </span>

				<h3 class="mb-4 font-headline text-2xl font-bold text-brand-text">
					{#if admin && editing}
						<input
							bind:value={editedAreas.header4}
							class="w-full rounded-xl border border-outline bg-white px-3 py-2"
						/>
					{:else}
						{areas.header4}
					{/if}
				</h3>

				<p class="leading-relaxed text-brand-muted">
					{#if admin && editing}
						<textarea
							bind:value={editedAreas.paragraph4}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-3"
						></textarea>
					{:else}
						{areas.paragraph4}
					{/if}
				</p>
			</div>

			<!-- Karta 4 -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white p-10 transition-all duration-500 hover:border-primary/40 hover:shadow-md md:p-12"
			>
				<span class="material-symbols-outlined mb-8 text-5xl text-primary"> savings </span>

				<h3 class="mb-4 font-headline text-2xl font-bold text-brand-text">
					{#if admin && editing}
						<input
							bind:value={editedAreas.header5}
							class="w-full rounded-xl border border-outline bg-white px-3 py-2"
						/>
					{:else}
						{areas.header5}
					{/if}
				</h3>

				<p class="leading-relaxed text-brand-muted">
					{#if admin && editing}
						<textarea
							bind:value={editedAreas.paragraph5}
							rows="4"
							class="w-full resize-none rounded-xl border border-outline bg-white p-3"
						></textarea>
					{:else}
						{areas.paragraph5}
					{/if}
				</p>
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
