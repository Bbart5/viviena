<script lang="ts">
	import type { Media } from '../../../generated/prisma/client';
	import { ACCEPTED_IMAGE_MIME_TYPES } from '$lib/consts/storage';
	import { createAction, deleteAction, getActions, updateAction } from '$lib/remote/actions.remote';
	import { beginGlobalSaving, endGlobalSaving } from '$lib/state/global-saving.svelte';
	import { commandErrorMessage, requestJson } from '$lib/utils/api';
	import FileDropInput from './FileDropInput.svelte';

	type ActionWithMedia = Awaited<ReturnType<typeof getActions>>[number];

	type EditableAction = {
		id: string;
		title: string;
		date: string;
		tag: string;
		tagColor: string;
		description: string;
		details: string[];
		relation: string;
		people: string[];
		partners: string[];
		showCta: boolean;
		ctaLabel: string;
	};

	interface Props {
		admin?: boolean;
	}

	let { admin }: Props = $props();

	/** Placeholder id of the optimistic card shown while createAction is in flight. */
	const TEMP_ID = 'temp_id';

	let creating = $state(false);
	let editingId = $state<string | null>(null);
	let editedAction = $state<EditableAction | null>(null);
	let stagedImage = $state<File | null>(null);
	let removeImage = $state(false);
	let imageError = $state<string | null>(null);
	let saving = $state(false);

	/** Locally previewed image (object URL) shown on a card while its upload is in flight. */
	let pendingImage = $state<{ actionId: string; url: string } | null>(null);

	function startEditing(action: ActionWithMedia) {
		creating = false;
		editingId = action.id;
		stagedImage = null;
		removeImage = false;
		imageError = null;

		editedAction = {
			id: action.id,
			title: action.title,
			date: action.date,
			tag: action.tag,
			tagColor: action.tagColor,
			description: action.description,
			details: [...action.details],
			relation: action.relation,
			people: [...action.people],
			partners: [...action.partners],
			showCta: action.showCta,
			ctaLabel: action.ctaLabel
		};
	}

	function startCreating() {
		creating = true;
		editingId = null;
		stagedImage = null;
		removeImage = false;
		imageError = null;

		editedAction = {
			id: TEMP_ID,
			title: '',
			date: '',
			tag: '',
			tagColor: 'green',
			description: '',
			details: [],
			relation: '',
			people: [],
			partners: [],
			showCta: false,
			ctaLabel: ''
		};
	}

	function cancelEditing() {
		creating = false;
		editingId = null;
		editedAction = null;
		stagedImage = null;
		removeImage = false;
		imageError = null;
	}

	/** Restores the form after a failed save so the typed content isn't lost. */
	function reopenForm(
		fields: EditableAction,
		staged: File | null,
		remove: boolean,
		wasCreating: boolean
	) {
		creating = wasCreating;
		editingId = wasCreating ? null : fields.id;
		editedAction = fields;
		stagedImage = staged;
		removeImage = remove;
	}

	function payloadOf(fields: EditableAction) {
		return {
			title: fields.title,
			date: fields.date,
			tag: fields.tag,
			tagColor: fields.tagColor,
			description: fields.description,
			details: fields.details,
			relation: fields.relation,
			people: fields.people,
			partners: fields.partners,
			showCta: fields.showCta,
			ctaLabel: fields.ctaLabel
		};
	}

	async function uploadImage(actionId: string, file: File): Promise<Media> {
		const formData = new FormData();
		formData.append('files', file);

		const body = await requestJson<{ media: Media }>(
			`/api/admin/actions/${actionId}/image`,
			'Nie udało się przesłać obrazu.',
			{ method: 'POST', body: formData }
		);

		return body.media;
	}

	async function saveNew(fields: EditableAction, staged: File | null) {
		const data = payloadOf(fields);
		const optimisticUrl = staged ? URL.createObjectURL(staged) : null;

		if (optimisticUrl) {
			pendingImage = { actionId: TEMP_ID, url: optimisticUrl };
		}

		// Close the form right away - the override below shows the new card instantly.
		cancelEditing();

		try {
			const created = await createAction(data).updates(
				getActions().withOverride((current) => [
					{
						...data,
						id: TEMP_ID,
						imageMediaId: null,
						imageMedia: null,
						createdAt: new Date(),
						updatedAt: new Date()
					},
					...current
				])
			);

			// The image needs the real id, so it can only be uploaded afterwards; the
			// object URL keeps covering the card until the refreshed data lands.
			if (staged && optimisticUrl) {
				pendingImage = { actionId: created.id, url: optimisticUrl };

				try {
					await uploadImage(created.id, staged);
					await getActions().refresh();
				} catch (err) {
					// The action itself was created - reopening the form here would
					// invite a duplicate, so only report the failed image upload.
					console.error(err);
					alert(commandErrorMessage(err, 'Nie udało się przesłać obrazu.'));
				}
			}
		} finally {
			if (optimisticUrl) {
				URL.revokeObjectURL(optimisticUrl);
			}

			pendingImage = null;
		}
	}

	async function saveExisting(fields: EditableAction, staged: File | null, remove: boolean) {
		// Upload first (the form stays open with a busy button) so the command's
		// single-flight refresh already contains the new image.
		const uploaded = staged ? await uploadImage(fields.id, staged) : null;

		cancelEditing();

		await updateAction({
			...payloadOf(fields),
			id: fields.id,
			removeImage: remove && !staged
		}).updates(
			getActions().withOverride((current) =>
				current.map((action) =>
					action.id === fields.id
						? {
								...action,
								...payloadOf(fields),
								imageMedia: uploaded ?? (remove ? null : action.imageMedia),
								imageMediaId: uploaded ? uploaded.id : remove ? null : action.imageMediaId
							}
						: action
				)
			)
		);
	}

	async function saveEditing() {
		if (!editedAction || saving) return;

		const fields = $state.snapshot(editedAction);
		const staged = stagedImage;
		const remove = removeImage;
		const wasCreating = creating;

		saving = true;
		beginGlobalSaving();

		try {
			if (wasCreating) {
				await saveNew(fields, staged);
			} else {
				await saveExisting(fields, staged, remove);
			}
		} catch (err) {
			console.error(err);
			reopenForm(fields, staged, remove, wasCreating);
			alert(commandErrorMessage(err, 'Wystąpił błąd podczas zapisywania.'));
		} finally {
			saving = false;
			endGlobalSaving();
		}
	}

	async function removeAction(id: string) {
		if (!confirm('Czy na pewno chcesz usunąć to wydarzenie? Tej operacji nie można cofnąć.')) {
			return;
		}

		beginGlobalSaving();

		try {
			await deleteAction(id).updates(
				getActions().withOverride((current) => current.filter((action) => action.id !== id))
			);
		} catch (err) {
			console.error(err);
			alert(commandErrorMessage(err, 'Wystąpił błąd podczas usuwania.'));
		} finally {
			endGlobalSaving();
		}
	}
</script>

{#snippet imagePicker(currentUrl: string | null)}
	<FileDropInput
		bind:file={stagedImage}
		accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
		maxSizeMb={10}
		label="Przeciągnij i upuść obraz lub kliknij, aby wybrać"
		hint="AVIF, PNG, JPEG, WebP lub GIF (maks. 10 MB)"
		previewUrl={removeImage ? null : currentUrl}
		previewKind="image"
		disabled={saving}
		onselect={() => (imageError = null)}
		onerror={(message) => (imageError = message)}
		ondeleterequest={currentUrl && !removeImage ? () => (removeImage = true) : undefined}
	/>

	{#if imageError}
		<p class="mt-2 text-sm text-error">{imageError}</p>
	{/if}
{/snippet}

<section
	id="dzialania"
	class="relative overflow-hidden bg-surface-container-low px-6 py-24 md:px-8"
>
	<!-- Background Glow -->
	<div
		class="absolute top-1/2 left-1/2 h-250 w-250 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]"
	></div>

	<div class="relative z-10 mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<span
					class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
				>
					Projekty i wydarzenia
				</span>
				<h2
					class="font-headline text-4xl leading-tight font-black text-brand-text md:text-5xl lg:text-6xl"
				>
					Nasze działania
				</h2>
				<p class="mt-6 text-lg leading-relaxed text-brand-muted">
					Tutaj prezentujemy relacje z wydarzeń, które organizujemy.
				</p>
			</div>
		</div>

		{#if admin}
			<div class="mb-8">
				<button
					onclick={startCreating}
					class="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
				>
					+ Dodaj wydarzenie
				</button>
			</div>
		{/if}

		<!-- szablon nowego postu -->

		{#if creating && editedAction}
			<div class="mb-8 rounded-2xl border border-outline-variant/30 bg-white p-8">
				<h3 class="mb-8 text-2xl font-bold">Nowe wydarzenie</h3>

				<div class="mb-6">
					{@render imagePicker(null)}
				</div>

				<div class="mb-6 flex items-start justify-between gap-4">
					<input
						bind:value={editedAction.tag}
						placeholder="Tag"
						class="rounded-xl border border-outline px-3 py-2 text-xs font-bold uppercase"
					/>

					<input
						bind:value={editedAction.date}
						placeholder="Data"
						class="rounded-xl border border-outline px-3 py-2 text-sm"
					/>
				</div>

				<input
					bind:value={editedAction.title}
					placeholder="Tytuł"
					class="mb-6 w-full rounded-xl border border-outline px-4 py-2"
				/>

				<textarea
					bind:value={editedAction.description}
					rows="5"
					placeholder="Opis"
					class="mb-8 w-full rounded-xl border border-outline p-4"
				></textarea>

				<div class="mb-8">
					<h4 class="mb-3 font-headline text-sm font-bold uppercase">Szczegóły</h4>

					<textarea
						value={editedAction.details.join('\n')}
						oninput={(e) => {
							editedAction!.details = e.currentTarget.value
								.split('\n')
								.map((x) => x.trim())
								.filter(Boolean);
						}}
						rows="6"
						placeholder="Każdy szczegół w nowej linii"
						class="w-full rounded-xl border border-outline p-4"
					></textarea>
				</div>

				<div class="mb-8 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
					<h4 class="mb-3 font-headline text-sm font-bold uppercase">Relacja</h4>

					<textarea
						bind:value={editedAction.relation}
						rows="5"
						class="w-full rounded-xl border border-outline p-4"
					></textarea>
				</div>

				<div class="mb-8 grid gap-6 md:grid-cols-2">
					<div>
						<h4 class="mb-3 font-headline text-sm font-bold uppercase">Goście i grupy</h4>

						<textarea
							value={editedAction.people.join('\n')}
							oninput={(e) => {
								editedAction!.people = e.currentTarget.value
									.split('\n')
									.map((x) => x.trim())
									.filter(Boolean);
							}}
							rows="8"
							placeholder="Jedna osoba w jednej linii"
							class="w-full rounded-xl border border-outline p-4"
						></textarea>
					</div>

					<div>
						<h4 class="mb-3 font-headline text-sm font-bold uppercase">Partnerzy</h4>

						<textarea
							value={editedAction.partners.join('\n')}
							oninput={(e) => {
								editedAction!.partners = e.currentTarget.value
									.split('\n')
									.map((x) => x.trim())
									.filter(Boolean);
							}}
							rows="8"
							placeholder="Jeden partner w jednej linii"
							class="w-full rounded-xl border border-outline p-4"
						></textarea>
					</div>
				</div>

				<div class="flex gap-3">
					<button
						onclick={saveEditing}
						disabled={saving}
						class="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{saving ? 'Tworzenie...' : 'Utwórz'}
					</button>

					<button
						onclick={cancelEditing}
						disabled={saving}
						class="rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
					>
						Anuluj
					</button>
				</div>
			</div>
		{/if}

		<!-- Action Cards -->
		<div class="grid grid-cols-1 gap-8">
			{#each await getActions() as action (action.id)}
				{@const imageUrl =
					pendingImage?.actionId === action.id
						? pendingImage.url
						: (action.imageMedia?.url ?? null)}
				<div
					class="group flex flex-col rounded-2xl border border-outline-variant/30 bg-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,81,193,0.12)]"
				>
					{#if admin}
						<div class="flex gap-3 border-b border-outline-variant/20 p-4">
							{#if editingId === action.id}
								<button
									onclick={saveEditing}
									disabled={saving}
									class="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{saving ? 'Zapisywanie...' : 'Zapisz'}
								</button>

								<button
									onclick={cancelEditing}
									disabled={saving}
									class="rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
								>
									Anuluj
								</button>
							{:else}
								<button
									onclick={() => startEditing(action)}
									disabled={action.id === TEMP_ID}
									class="rounded-xl bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Edytuj
								</button>

								<button
									onclick={() => removeAction(action.id)}
									disabled={action.id === TEMP_ID}
									class="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Usuń
								</button>
							{/if}
						</div>
					{/if}

					{#if editingId === action.id && editedAction}
						<div class="border-b border-outline-variant/20 bg-surface-container-low p-4">
							{@render imagePicker(action.imageMedia?.url ?? null)}
						</div>
					{:else if imageUrl}
						<div class="h-56 overflow-hidden {admin ? '' : 'rounded-t-2xl'}">
							<img src={imageUrl} alt={action.title} class="h-full w-full object-cover" />
						</div>
					{:else}
						<div
							class="flex h-56 items-center justify-center overflow-hidden bg-linear-to-br from-primary/10 to-primary-container/25 {admin
								? ''
								: 'rounded-t-2xl'}"
						></div>
					{/if}

					<div class="flex flex-1 flex-col px-4 py-8">
						<div class="mb-6 flex items-start justify-between gap-4">
							{#if editingId === action.id && editedAction}
								<input
									bind:value={editedAction.tag}
									class="rounded-xl border border-outline px-3 py-2 text-xs font-bold uppercase"
								/>

								<input
									bind:value={editedAction.date}
									class="rounded-xl border border-outline px-3 py-2 text-sm"
								/>
							{:else}
								<span
									class="rounded px-3 py-1 text-xs font-bold tracking-widest uppercase {action.tagColor ===
									'green'
										? 'bg-green-100 text-green-700'
										: 'bg-primary/20 text-primary'}"
								>
									{action.tag}
								</span>

								<span class="text-sm text-brand-muted italic">
									{action.date}
								</span>
							{/if}
						</div>

						{#if editingId === action.id && editedAction}
							<input
								bind:value={editedAction.title}
								class="mb-4 w-full rounded-xl border border-outline bg-white px-4 py-2"
							/>
						{:else}
							<h3
								class="mb-4 font-headline text-2xl font-bold text-brand-text transition-colors group-hover:text-primary"
							>
								{action.title}
							</h3>
						{/if}

						{#if editingId === action.id && editedAction}
							<textarea
								bind:value={editedAction.description}
								rows="5"
								class="mb-6 w-full rounded-xl border border-outline p-4"
							></textarea>
						{:else}
							<p class="mb-6 text-sm leading-relaxed text-brand-muted">
								{action.description}
							</p>
						{/if}

						<div class="mb-8">
							{#if editingId === action.id && editedAction}
								<h4
									class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
								>
									Szczegóły
								</h4>

								<textarea
									value={editedAction.details.join('\n')}
									oninput={(e) => {
										editedAction!.details = e.currentTarget.value
											.split('\n')
											.map((x) => x.trim())
											.filter(Boolean);
									}}
									rows="6"
									class="w-full rounded-xl border border-outline p-4"
								></textarea>

								<p class="mt-2 text-xs text-brand-muted">
									Każda linia będzie jednym punktem listy.
								</p>
							{:else}
								<div class="space-y-1">
									{#each action.details as detail, idx (idx)}
										<p class="text-xs text-brand-muted">• {detail}</p>
									{/each}
								</div>
							{/if}
						</div>

						<div
							class="mb-8 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
						>
							<h4
								class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
							>
								Relacja
							</h4>

							{#if editingId === action.id && editedAction}
								<textarea
									bind:value={editedAction.relation}
									rows="5"
									class="w-full rounded-xl border border-outline p-4"
								></textarea>
							{:else}
								<p class="text-sm leading-relaxed text-brand-muted">
									{action.relation}
								</p>
							{/if}
						</div>

						<div class="mb-8 grid gap-6 md:grid-cols-2">
							<div>
								<h4
									class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
								>
									Goście i grupy
								</h4>

								{#if editingId === action.id && editedAction}
									<textarea
										value={editedAction.people.join('\n')}
										oninput={(e) => {
											editedAction!.people = e.currentTarget.value
												.split('\n')
												.map((x) => x.trim())
												.filter(Boolean);
										}}
										rows="8"
										class="w-full rounded-xl border border-outline p-4"
									></textarea>

									<p class="mt-2 text-xs text-brand-muted">
										Każda linia będzie jednym punktem listy.
									</p>
								{:else}
									<ul class="space-y-1 text-sm text-brand-muted">
										{#each action.people as person (person)}
											<li>• {person}</li>
										{/each}
									</ul>
								{/if}
							</div>

							<div>
								<h4
									class="mb-3 font-headline text-sm font-bold tracking-wide text-brand-text uppercase"
								>
									Partnerzy
								</h4>

								{#if editingId === action.id && editedAction}
									<textarea
										value={editedAction.partners.join('\n')}
										oninput={(e) => {
											editedAction!.partners = e.currentTarget.value
												.split('\n')
												.map((x) => x.trim())
												.filter(Boolean);
										}}
										rows="8"
										class="w-full rounded-xl border border-outline p-4"
									></textarea>

									<p class="mt-2 text-xs text-brand-muted">
										Każda linia będzie jednym punktem listy.
									</p>
								{:else}
									<ul class="space-y-1 text-sm text-brand-muted">
										{#each action.partners as partner (partner)}
											<li>• {partner}</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>

						<!-- Button -->
						<div class="mt-auto">
							{#if action.showCta}
								<button
									class="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-widest text-brand-text uppercase transition-transform group-hover:translate-x-2"
								>
									{action.ctaLabel}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							{/if}
						</div>
					</div>

				</div>
			{/each}
		</div>

		<p class="mt-16 text-center text-lg text-brand-muted">
			Kolejne wydarzenia będą publikowane po zakończeniu realizacji.
		</p>
	</div>
</section>
