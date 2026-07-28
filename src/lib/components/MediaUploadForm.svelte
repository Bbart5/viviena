<script lang="ts">
	import FileDropInput from './FileDropInput.svelte';

	interface Props {
		/** Endpoint the staged files are POSTed to as multipart FormData. */
		action: string;
		fieldName?: string;
		accept?: string;
		multiple?: boolean;
		maxSizeMb?: number;
		label?: string;
		hint?: string;
		submitLabel?: string;
		/** Existing media shown as the preview until a new file is staged. */
		previewUrl?: string | null;
		previewKind?: 'image' | 'video' | 'audio';
		/** Endpoint receiving DELETE for the existing media; enables the delete button. */
		deleteAction?: string | null;
		class?: string;
		onuploaded?: (response: unknown) => void;
		ondeleted?: () => void;
		onerror?: (message: string) => void;
	}

	let {
		action,
		fieldName = 'files',
		accept = 'image/*,video/*,audio/*',
		multiple = false,
		maxSizeMb = 100,
		label = 'Przeciągnij i upuść plik lub kliknij, aby wybrać',
		hint = '',
		submitLabel = 'Prześlij',
		previewUrl = null,
		previewKind = 'image',
		deleteAction = null,
		class: className = '',
		onuploaded,
		ondeleted,
		onerror
	}: Props = $props();

	let files = $state<File[]>([]);
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

		busy = true;
		errorMessage = null;

		try {
			const response = await fetch(deleteAction, { method: 'DELETE' });
			const body = await response.json();

			if (!response.ok || !body.success) {
				throw new Error(body.message ?? 'Nie udało się usunąć pliku.');
			}

			ondeleted?.();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Nie udało się usunąć pliku.';
			errorMessage = message;
			onerror?.(message);
		} finally {
			busy = false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!files.length || busy) {
			return;
		}

		busy = true;
		errorMessage = null;

		try {
			const formData = new FormData();
			for (const file of files) {
				formData.append(fieldName, file);
			}

			const response = await fetch(action, { method: 'POST', body: formData });
			const body = await response.json();

			if (!response.ok || !body.success) {
				throw new Error(body.message ?? 'Nie udało się przesłać plików.');
			}

			files = [];
			onuploaded?.(body);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Nie udało się przesłać plików.';
			errorMessage = message;
			onerror?.(message);
		} finally {
			busy = false;
		}
	}
</script>

<form class={className} onsubmit={handleSubmit}>
	<FileDropInput
		bind:files
		{accept}
		{multiple}
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
		disabled={busy || files.length === 0}
		class="mt-4 cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{busy ? 'Przesyłanie...' : submitLabel}
	</button>
</form>
