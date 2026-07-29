<script lang="ts">
	import { formatBytes } from '$lib/utils/format-bytes';

	interface Props {
		/** Staged file — bind with `bind:file` to consume it from outside. */
		file?: File | null;
		accept?: string;
		maxSizeMb?: number;
		label?: string;
		hint?: string;
		disabled?: boolean;
		/** Existing media shown as the preview until a new file is staged. */
		previewUrl?: string | null;
		previewKind?: 'image' | 'video' | 'audio';
		class?: string;
		onselect?: (file: File) => void;
		onerror?: (message: string) => void;
		/** When provided, the existing preview gets a delete button calling this. */
		ondeleterequest?: () => void;
	}

	let {
		file = $bindable(null),
		accept = 'image/*,video/*,audio/*',
		maxSizeMb = 100,
		label = 'Przeciągnij i upuść plik lub kliknij, aby wybrać',
		hint = '',
		disabled = false,
		previewUrl = null,
		previewKind = 'image',
		class: className = '',
		onselect,
		onerror,
		ondeleterequest
	}: Props = $props();

	interface StagedPreview {
		file: File;
		previewUrl: string;
		kind: 'image' | 'video' | 'audio' | 'other';
	}

	let inputEl: HTMLInputElement;
	let dragActive = $state(false);
	let staged = $state<StagedPreview | null>(null);

	function kindOf(file: File): StagedPreview['kind'] {
		if (file.type.startsWith('image/')) return 'image';
		if (file.type.startsWith('video/')) return 'video';
		if (file.type.startsWith('audio/')) return 'audio';
		return 'other';
	}

	$effect(() => {
		if (!file) {
			staged = null;
			return;
		}

		const preview = { file, previewUrl: URL.createObjectURL(file), kind: kindOf(file) };
		staged = preview;

		return () => URL.revokeObjectURL(preview.previewUrl);
	});

	function matchesAccept(candidate: File): boolean {
		const patterns = accept
			.split(',')
			.map((pattern) => pattern.trim())
			.filter(Boolean);

		if (!patterns.length) {
			return true;
		}

		return patterns.some((pattern) => {
			if (pattern.startsWith('.')) {
				return candidate.name.toLowerCase().endsWith(pattern.toLowerCase());
			}
			if (pattern.endsWith('/*')) {
				return candidate.type.startsWith(pattern.slice(0, -1));
			}
			return candidate.type === pattern;
		});
	}

	function stageFile(incoming: FileList | null | undefined) {
		if (disabled || !incoming?.length) {
			return;
		}

		for (const candidate of incoming) {
			if (!matchesAccept(candidate)) {
				onerror?.(`Nieobsługiwany typ pliku: ${candidate.name}.`);
				continue;
			}
			if (candidate.size > maxSizeMb * 1000 * 1000) {
				onerror?.(`Plik ${candidate.name} jest zbyt duży (maks. ${maxSizeMb} MB).`);
				continue;
			}

			file = candidate;
			onselect?.(candidate);
			return;
		}
	}

	function openPicker() {
		if (!disabled) {
			inputEl.click();
		}
	}

	function handlePick(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		stageFile(input.files);
		input.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
		stageFile(event.dataTransfer?.files);
	}
</script>

<div class={className}>
	<input bind:this={inputEl} type="file" {accept} {disabled} onchange={handlePick} class="hidden" />

	{#if staged}
		<div class="mb-4 rounded-2xl border border-outline-variant/30 bg-white p-3">
			{#if staged.kind === 'image'}
				<img src={staged.previewUrl} alt={staged.file.name} class="h-auto w-full rounded-lg" />
			{:else if staged.kind === 'video'}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={staged.previewUrl} controls class="h-auto w-full rounded-lg bg-black"></video>
			{:else if staged.kind === 'audio'}
				<audio src={staged.previewUrl} controls class="w-full"></audio>
			{:else}
				<div
					class="flex h-32 items-center justify-center rounded-lg bg-surface-container-low text-brand-muted"
				>
					<span class="material-symbols-outlined text-4xl">draft</span>
				</div>
			{/if}
			<div class="mt-2 flex items-center justify-between gap-2">
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold text-brand-text" title={staged.file.name}>
						{staged.file.name}
					</p>
					<p class="text-xs text-brand-muted">{formatBytes(staged.file.size)}</p>
				</div>
				<button
					type="button"
					onclick={() => (file = null)}
					aria-label="Usuń plik {staged.file.name}"
					class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-muted transition hover:bg-error/10 hover:text-error"
				>
					<span class="material-symbols-outlined text-base">close</span>
				</button>
			</div>
		</div>
	{:else if previewUrl}
		<div class="relative mb-4 overflow-hidden rounded-2xl border border-outline-variant/30">
			{#if previewKind === 'image'}
				<img src={previewUrl} alt="Podgląd" class="h-auto w-full" />
			{:else if previewKind === 'video'}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={previewUrl} controls class="w-full bg-black"></video>
			{:else}
				<audio src={previewUrl} controls class="w-full p-3"></audio>
			{/if}
			{#if ondeleterequest}
				<button
					type="button"
					onclick={ondeleterequest}
					{disabled}
					aria-label="Usuń obecny plik"
					class="absolute top-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-muted shadow-md transition hover:bg-error/10 hover:text-error disabled:opacity-50"
				>
					<span class="material-symbols-outlined text-base">delete</span>
				</button>
			{/if}
		</div>
	{/if}

	<div
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-label={label}
		aria-disabled={disabled}
		onclick={openPicker}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openPicker();
			}
		}}
		ondragover={(event) => {
			event.preventDefault();
			if (!disabled) {
				dragActive = true;
			}
		}}
		ondragleave={() => (dragActive = false)}
		ondrop={handleDrop}
		class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors outline-none focus:border-primary
			{dragActive ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-white'}
			{disabled
			? 'cursor-not-allowed opacity-50'
			: 'hover:border-primary/60 hover:bg-surface-container-low'}"
	>
		<span class="material-symbols-outlined text-4xl text-primary">upload_file</span>
		<p class="text-sm font-semibold text-brand-text">{label}</p>
		{#if hint}
			<p class="text-xs text-brand-muted">{hint}</p>
		{/if}
	</div>
</div>
