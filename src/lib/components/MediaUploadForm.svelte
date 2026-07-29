<script lang="ts">
	import { requestJson } from '$lib/utils/api';
	import FileDropInput from './FileDropInput.svelte';

	interface Props {
		/** Endpoint the staged file is POSTed to as multipart FormData. */
		action: string;
		fieldName?: string;
		accept?: string;
		maxSizeMb?: number;
		label?: string;
		hint?: string;
		submitLabel?: string;
		/** Existing media shown as the preview until a new file is staged. */
		previewUrl?: string | null;
		previewKind?: 'image' | 'video' | 'audio';
		/** Endpoint receiving DELETE for the existing media; enables the delete button. */
		deleteAction?: string | null;
		/** Shown in a browser confirm before deleting; pass null to skip the confirmation. */
		deleteConfirmMessage?: string | null;
		class?: string;
		onuploaded?: (response: unknown) => void;
		ondeleted?: () => void;
		onerror?: (message: string) => void;
	}

	let {
		action,
		fieldName = 'files',
		accept = 'image/*,video/*,audio/*',
		maxSizeMb = 100,
		label = 'Przeciągnij i upuść plik lub kliknij, aby wybrać',
		hint = '',
		submitLabel = 'Prześlij',
		previewUrl = null,
		previewKind = 'image',
		deleteAction = null,
		deleteConfirmMessage = 'Czy na pewno chcesz usunąć ten plik? Tej operacji nie można cofnąć.',
		class: className = '',
		onuploaded,
		ondeleted,
		onerror
	}: Props = $props();

	let file = $state<File | null>(null);
	let busy = $state(false);
	let errorMessage = $state<string | null>(null);

	function handleFileError(message: string) {
		errorMessage = message;
		onerror?.(message);
	}

	async function handleDelete() {
		if (busy || !deleteAction) {
			return;
		}

		if (deleteConfirmMessage && !confirm(deleteConfirmMessage)) {
			return;
		}

		busy = true;
		errorMessage = null;

		try {
			await requestJson(deleteAction, 'Nie udało się usunąć pliku.', { method: 'DELETE' });
			ondeleted?.();
		} catch (error) {
			handleFileError((error as Error).message);
		} finally {
			busy = false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!file || busy) {
			return;
		}

		busy = true;
		errorMessage = null;

		try {
			const formData = new FormData();
			formData.append(fieldName, file);

			const body = await requestJson(action, 'Nie udało się przesłać pliku.', {
				method: 'POST',
				body: formData
			});

			file = null;
			onuploaded?.(body);
		} catch (error) {
			handleFileError((error as Error).message);
		} finally {
			busy = false;
		}
	}
</script>

<form class={className} onsubmit={handleSubmit}>
	<FileDropInput
		bind:file
		{accept}
		{maxSizeMb}
		{label}
		{hint}
		{previewUrl}
		{previewKind}
		disabled={busy}
		onselect={() => (errorMessage = null)}
		onerror={handleFileError}
		ondeleterequest={deleteAction ? handleDelete : undefined}
	/>

	{#if errorMessage}
		<p class="mt-2 text-sm text-error">{errorMessage}</p>
	{/if}

	<button
		type="submit"
		disabled={busy || !file}
		class="mt-4 cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{busy ? 'Przesyłanie...' : submitLabel}
	</button>
</form>
