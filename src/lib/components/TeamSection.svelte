<script lang="ts">
	import type { Media } from '../../../generated/prisma/client';
	import { asset } from '$app/paths';
	import { ACCEPTED_IMAGE_MIME_TYPES } from '$lib/consts/storage';
	import {
		createTeamMember,
		deleteTeamMember,
		getTeamMembers,
		updateTeamMember
	} from '$lib/remote/team.remote';
	import { commandErrorMessage, requestJson } from '$lib/utils/api';
	import FileDropInput from './FileDropInput.svelte';

	type TeamMemberWithMedia = Awaited<ReturnType<typeof getTeamMembers>>[number];
	type TeamGroup = TeamMemberWithMedia['group'];

	interface Props {
		admin?: boolean;
	}

	let { admin }: Props = $props();

	/** Placeholder id of the optimistic card shown while createTeamMember is in flight. */
	const TEMP_ID = 'temp-id';

	const FALLBACK_AVATAR = asset('/team/avatar-fallback.svg');

	const members = $derived(await getTeamMembers());
	const boardMembers = $derived(members.filter((member) => member.group === 'BOARD'));
	const revisionMembers = $derived(members.filter((member) => member.group === 'REVISION'));

	let creatingGroup = $state<TeamGroup | null>(null);

	let editingId = $state<string | null>(null);

	let editedMember = $state<{ id: string; name: string; role: string; group: TeamGroup }>({
		id: '',
		name: '',
		role: '',
		group: 'BOARD'
	});

	let stagedImage = $state<File | null>(null);

	let removeImage = $state(false);

	let imageError = $state<string | null>(null);

	let saving = $state(false);

	/** Locally previewed photo (object URL) shown on a card while its upload is in flight. */
	let pendingImage = $state<{ memberId: string; url: string } | null>(null);

	/**
	 * Swaps a missing photo for the local fallback avatar. An action (not just
	 * onerror) so photos that already failed before hydration are covered too.
	 */
	function fallbackSrc(img: HTMLImageElement) {
		const apply = () => {
			if (img.dataset.fallback) return;

			img.dataset.fallback = 'true';
			img.src = FALLBACK_AVATAR;
		};

		if (img.complete && img.naturalWidth === 0) {
			apply();
		}

		img.addEventListener('error', apply);

		return {
			destroy: () => img.removeEventListener('error', apply)
		};
	}

	function startCreating(group: TeamGroup) {
		creatingGroup = group;
		editingId = null;
		stagedImage = null;
		removeImage = false;
		imageError = null;

		editedMember = { id: TEMP_ID, name: '', role: '', group };
	}

	function startEditing(member: TeamMemberWithMedia) {
		creatingGroup = null;
		editingId = member.id;
		stagedImage = null;
		removeImage = false;
		imageError = null;

		editedMember = { id: member.id, name: member.name, role: member.role, group: member.group };
	}

	function cancelEditing() {
		creatingGroup = null;
		editingId = null;
		stagedImage = null;
		removeImage = false;
		imageError = null;
	}

	async function uploadImage(memberId: string, file: File): Promise<Media> {
		const formData = new FormData();
		formData.append('files', file);

		const body = await requestJson<{ media: Media }>(
			`/api/admin/team/${memberId}/image`,
			'Nie udało się przesłać zdjęcia.',
			{ method: 'POST', body: formData }
		);

		return body.media;
	}

	async function saveNew(
		fields: typeof editedMember,
		staged: File | null,
		optimisticUrl: string | null
	) {
		const data = { name: fields.name, role: fields.role, group: fields.group };

		if (optimisticUrl) {
			pendingImage = { memberId: TEMP_ID, url: optimisticUrl };
		}

		// Close the form right away - the override below shows the new card instantly.
		cancelEditing();

		const created = await createTeamMember(data).updates(
			getTeamMembers().withOverride((current) => [
				...current,
				{
					...data,
					id: TEMP_ID,
					imageMediaId: null,
					imageMedia: null,
					createdAt: new Date(),
					updatedAt: new Date()
				}
			])
		);

		// The photo needs the real id, so it can only be uploaded afterwards; the
		// object URL keeps covering the card until the refreshed data lands.
		if (staged && optimisticUrl) {
			pendingImage = { memberId: created.id, url: optimisticUrl };

			try {
				await uploadImage(created.id, staged);
				await getTeamMembers().refresh();
			} catch (err) {
				// The member itself was created - reopening the form here would
				// invite a duplicate, so only report the failed photo upload.
				console.error(err);
				alert(commandErrorMessage(err, 'Nie udało się przesłać zdjęcia.'));
			}
		}
	}

	async function saveExisting(fields: typeof editedMember, staged: File | null, remove: boolean) {
		// Upload first (the form stays open with a busy button) so the command's
		// single-flight refresh already contains the new photo.
		const uploaded = staged ? await uploadImage(fields.id, staged) : null;

		cancelEditing();

		await updateTeamMember({
			id: fields.id,
			name: fields.name,
			role: fields.role,
			group: fields.group,
			removeImage: remove && !staged
		}).updates(
			getTeamMembers().withOverride((current) =>
				current.map((member) =>
					member.id === fields.id
						? {
								...member,
								name: fields.name,
								role: fields.role,
								imageMedia: uploaded ?? (remove ? null : member.imageMedia),
								imageMediaId: uploaded ? uploaded.id : remove ? null : member.imageMediaId
							}
						: member
				)
			)
		);
	}

	async function saveEditing() {
		if (saving) return;

		const fields = $state.snapshot(editedMember);
		const staged = stagedImage;
		const remove = removeImage;
		const wasCreating = creatingGroup !== null;
		const optimisticUrl = wasCreating && staged ? URL.createObjectURL(staged) : null;

		saving = true;

		try {
			if (wasCreating) {
				await saveNew(fields, staged, optimisticUrl);
			} else {
				await saveExisting(fields, staged, remove);
			}
		} catch (err) {
			console.error(err);
			creatingGroup = wasCreating ? fields.group : null;
			editingId = wasCreating ? null : fields.id;
			editedMember = fields;
			stagedImage = staged;
			removeImage = remove;
			alert(commandErrorMessage(err, 'Wystąpił błąd podczas zapisywania.'));
		} finally {
			if (optimisticUrl) {
				URL.revokeObjectURL(optimisticUrl);
			}

			pendingImage = null;
			saving = false;
		}
	}

	async function removeMember(id: string) {
		if (
			!confirm('Czy na pewno chcesz usunąć tego członka zespołu? Tej operacji nie można cofnąć.')
		) {
			return;
		}

		try {
			await deleteTeamMember(id).updates(
				getTeamMembers().withOverride((current) => current.filter((member) => member.id !== id))
			);
		} catch (err) {
			console.error(err);
			alert(commandErrorMessage(err, 'Wystąpił błąd podczas usuwania.'));
		}
	}
</script>

{#snippet memberForm(currentImageUrl: string | null, isCreate: boolean)}
	<div class="rounded-2xl border border-outline-variant/30 bg-white p-4 text-left">
		<FileDropInput
			bind:file={stagedImage}
			accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
			maxSizeMb={10}
			label="Przeciągnij i upuść zdjęcie lub kliknij, aby wybrać"
			hint="AVIF, PNG, JPEG, WebP lub GIF (maks. 10 MB)"
			previewUrl={removeImage ? null : currentImageUrl}
			previewKind="image"
			disabled={saving}
			onselect={() => (imageError = null)}
			onerror={(message) => (imageError = message)}
			ondeleterequest={currentImageUrl && !removeImage ? () => (removeImage = true) : undefined}
		/>

		{#if imageError}
			<p class="mt-2 text-sm text-error">{imageError}</p>
		{/if}

		<input
			bind:value={editedMember.name}
			placeholder="Imię i nazwisko"
			class="mt-4 w-full rounded-xl border border-outline px-3 py-2 text-sm"
		/>

		<input
			bind:value={editedMember.role}
			placeholder="Rola"
			class="mt-3 w-full rounded-xl border border-outline px-3 py-2 text-sm"
		/>

		<div class="mt-4 flex gap-2">
			<button
				onclick={saveEditing}
				disabled={saving}
				class="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{saving ? 'Zapisywanie...' : isCreate ? 'Utwórz' : 'Zapisz'}
			</button>

			<button
				onclick={cancelEditing}
				disabled={saving}
				class="rounded-xl border border-outline px-4 py-2 text-sm font-semibold transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
			>
				Anuluj
			</button>
		</div>
	</div>
{/snippet}

{#snippet memberCard(member: TeamMemberWithMedia, size: 'board' | 'revision')}
	<div class="group text-center">
		{#if editingId === member.id}
			{@render memberForm(member.imageMedia?.url ?? null, false)}
		{:else}
			{@const photo =
				pendingImage?.memberId === member.id
					? pendingImage.url
					: (member.imageMedia?.url ?? FALLBACK_AVATAR)}
			<div
				class="relative mx-auto mb-6 {size === 'board' ? 'h-36 w-36 md:h-44 md:w-44' : 'h-36 w-36'}"
			>
				<div
					class="absolute inset-0 scale-0 rounded-full {size === 'board'
						? 'bg-primary'
						: 'bg-tertiary'} opacity-20 transition-transform duration-500 group-hover:scale-105"
				></div>
				<div
					class="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-surface-container-low text-primary/40 transition-all duration-500 group-hover:bg-surface-container"
				>
					<img
						use:fallbackSrc
						src={photo}
						alt={member.name}
						class="h-full w-full rounded-full object-cover"
					/>
				</div>
			</div>
			<h4 class="font-headline text-lg font-bold text-brand-text">{member.name}</h4>
			<p class="mt-1 text-xs tracking-widest text-on-surface-variant uppercase">
				{member.role}
			</p>

			{#if admin}
				<div class="mt-3 flex justify-center gap-2">
					<button
						onclick={() => startEditing(member)}
						disabled={member.id === TEMP_ID}
						class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Edytuj
					</button>

					<button
						onclick={() => removeMember(member.id)}
						disabled={member.id === TEMP_ID}
						class="rounded-xl bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Usuń
					</button>
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

<section id="zespol" class="px-6 py-24 md:px-8">
	<div class="mx-auto max-w-360">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<span
				class="mb-4 block font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase"
			>
				Ludzie Vivieny
			</span>
			<h2 class="mb-6 font-headline text-4xl font-black text-brand-text md:text-5xl">Zespół</h2>
			<p class="mx-auto max-w-2xl text-lg text-brand-muted">
				Przedstawiamy aktualny skład Zarządu i Komisji Rewizyjnej.
			</p>
		</div>

		<!-- Zarząd -->
		<div class="mb-16">
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-brand-text">Zarząd</h3>
			<div class="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
				{#each boardMembers as member (member.id)}
					{@render memberCard(member, 'board')}
				{/each}

				{#if creatingGroup === 'BOARD'}
					{@render memberForm(null, true)}
				{/if}
			</div>

			{#if admin && creatingGroup !== 'BOARD'}
				<div class="mt-8 text-center">
					<button
						onclick={() => startCreating('BOARD')}
						class="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
					>
						+ Dodaj członka zarządu
					</button>
				</div>
			{/if}
		</div>

		<!-- Komisja Rewizyjna -->
		<div>
			<h3 class="mb-10 text-center font-headline text-2xl font-bold text-brand-text">
				Komisja rewizyjna
			</h3>
			<div class="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
				{#each revisionMembers as member (member.id)}
					{@render memberCard(member, 'revision')}
				{/each}

				{#if creatingGroup === 'REVISION'}
					{@render memberForm(null, true)}
				{/if}
			</div>

			{#if admin && creatingGroup !== 'REVISION'}
				<div class="mt-8 text-center">
					<button
						onclick={() => startCreating('REVISION')}
						class="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
					>
						+ Dodaj członka komisji
					</button>
				</div>
			{/if}
		</div>

		<!-- Sekcja "Tworzymy VIVIENĘ wspólnie" ukryta na wersji produkcyjnej -->
	</div>
</section>
