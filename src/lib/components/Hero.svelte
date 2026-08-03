<script lang="ts">
	import type { Media } from '../../../generated/prisma/client';
	import { ACCEPTED_IMAGE_MIME_TYPES, PLACEHOLDER_IMAGE_URL } from '$lib/consts/storage';
	import { getHero, updateHero } from '$lib/remote/hero.remote';
	import { commandErrorMessage, requestJson } from '$lib/utils/api';
	import FileDropInput from './FileDropInput.svelte';

	interface Props {
		scrollTo: (href: string) => void;
		admin?: boolean;
	}

	let { scrollTo, admin = false }: Props = $props();

	const hero = $derived(await getHero());

	const displayedImageUrl = $derived(hero.imageUrl ?? PLACEHOLDER_IMAGE_URL);

	let editing = $state(false);

	let saving = $state(false);

	let stagedImage = $state<File | null>(null);

	let removeImage = $state(false);

	let imageError = $state<string | null>(null);

	let editedHero = $state({
		id: '',
		title: '',
		header1: '',
		header2: '',
		header3: '',
		description: ''
	});

	function startEditing() {
		stagedImage = null;
		removeImage = false;
		imageError = null;

		editedHero = {
			id: hero.id,
			title: hero.title,
			header1: hero.header1,
			header2: hero.header2,
			header3: hero.header3,
			description: hero.description
		};

		editing = true;
	}

	function cancelEditing() {
		editing = false;
		stagedImage = null;
		removeImage = false;
		imageError = null;
	}

	async function uploadImage(file: File): Promise<Media> {
		const formData = new FormData();
		formData.append('files', file);

		const body = await requestJson<{ media: Media }>(
			'/api/admin/hero/image',
			'Nie udało się przesłać obrazu.',
			{ method: 'POST', body: formData }
		);

		return body.media;
	}

	async function saveEditing() {
		if (saving) return;

		const fields = $state.snapshot(editedHero);
		const staged = stagedImage;
		const remove = removeImage;

		saving = true;

		try {
			// Upload first (the form stays open with a busy button) so the command's
			// single-flight refresh already contains the new image.
			const uploaded = staged ? await uploadImage(staged) : null;

			cancelEditing();

			await updateHero({ ...fields, removeImage: remove && !staged }).updates(
				getHero().withOverride((h) => ({
					...h,
					...fields,
					imageUrl: uploaded ? uploaded.url : remove ? null : h.imageUrl
				}))
			);
		} catch (error) {
			console.error(error);
			editedHero = fields;
			stagedImage = staged;
			removeImage = remove;
			editing = true;
			alert(commandErrorMessage(error, 'Wystąpił błąd podczas zapisywania.'));
		} finally {
			saving = false;
		}
	}
</script>

{#snippet imageUploadCard()}
	<div class="relative w-full rounded-2xl border border-outline-variant/25 bg-white p-4">
		<FileDropInput
			bind:file={stagedImage}
			accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
			maxSizeMb={10}
			label="Przeciągnij i upuść obraz lub kliknij, aby wybrać"
			hint="AVIF, PNG, JPEG, WebP lub GIF (maks. 10 MB)"
			previewUrl={removeImage ? null : hero.imageUrl}
			previewKind="image"
			disabled={saving}
			onselect={() => (imageError = null)}
			onerror={(message) => (imageError = message)}
			ondeleterequest={hero.imageUrl && !removeImage ? () => (removeImage = true) : undefined}
		/>

		{#if imageError}
			<p class="mt-2 text-sm text-error">{imageError}</p>
		{/if}
	</div>
{/snippet}

<section id="start" class="relative flex flex-col overflow-hidden lg:flex-row lg:items-center">
	<!-- Mobile Hero Image (top, 21:9, edge-to-edge) -->
	<div class="relative w-full lg:hidden">
		{#if admin && editing}
			<div class="px-6 pt-6">{@render imageUploadCard()}</div>
		{:else}
			<div class="aspect-21/9 w-full overflow-hidden">
				<img src={displayedImageUrl} alt="VIVIENA" class="h-full w-full object-cover" />
			</div>
			<div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white"></div>
		{/if}
	</div>

	<div
		class="z-10 mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-6 py-16 md:px-8 lg:grid-cols-12 lg:gap-6 lg:py-12"
	>
		<!-- Text Column -->
		<div class="flex flex-col justify-center lg:col-span-6">
			<span class="mb-6 font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase">
				{#if admin && editing}
					<input
						bind:value={editedHero.title}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{hero.title}
				{/if}
			</span>
			{#if admin && editing}
				<div class="mb-8 space-y-3">
					<input
						bind:value={editedHero.header1}
						class="w-full rounded-xl border border-outline bg-white p-3 text-3xl font-black"
					/>

					<input
						bind:value={editedHero.header2}
						class="w-full rounded-xl border border-primary bg-white p-3 text-3xl font-black"
					/>

					<input
						bind:value={editedHero.header3}
						class="w-full rounded-xl border border-outline bg-white p-3 text-3xl font-black"
					/>
				</div>
			{:else}
				<h1
					class="mb-8 font-headline text-5xl leading-[1.05] font-black tracking-tighter text-brand-text md:text-7xl lg:text-8xl"
				>
					{hero.header1}

					<span
						class="bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent"
					>
						{hero.header2}
					</span>

					{hero.header3}
				</h1>
			{/if}
			<p class="mb-10 max-w-xl text-lg leading-relaxed text-brand-muted md:text-xl">
				{#if admin && editing}
					<textarea
						bind:value={editedHero.description}
						rows="5"
						class="w-full rounded-xl border border-outline bg-white p-4"
					></textarea>
				{:else}
					{hero.description}
				{/if}
			</p>
			<div class="flex gap-3 md:gap-4">
				<a
					href="#o-nas"
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo('#o-nas');
					}}
					class="rounded-full bg-linear-to-br from-primary to-primary-container px-5 py-3 font-headline text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 md:px-8 md:py-4 md:text-lg"
				>
					Poznaj nas
				</a>
				<a
					href="#dzialania"
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo('#dzialania');
					}}
					class="rounded-full border border-outline-variant/40 bg-transparent px-5 py-3 font-headline text-sm font-bold text-brand-text transition-all hover:bg-surface-container-low md:px-8 md:py-4 md:text-lg"
				>
					Zobacz działania
				</a>
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

		<!-- Desktop Visual Column -->
		<div class="relative hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center">
			<div
				class="absolute inset-0 rounded-full bg-linear-to-tr from-primary/15 to-primary-container/20 blur-3xl"
			></div>
			{#if admin && editing}
				{@render imageUploadCard()}
			{:else}
				<div class="relative w-full overflow-hidden rounded-2xl">
					<img
						src={displayedImageUrl}
						alt="VIVIENA"
						class="h-auto w-full rounded-2xl border border-outline-variant/25 transition-all duration-700 hover:opacity-100"
					/>
				</div>
			{/if}
		</div>
	</div>
</section>
