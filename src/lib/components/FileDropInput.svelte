<script lang="ts">
	interface Props {
		/** Staged files — bind with `bind:files` to consume them from outside. */
		files?: File[];
		accept?: string;
		multiple?: boolean;
		maxSizeMb?: number;
		label?: string;
		hint?: string;
		disabled?: boolean;
		/** Existing media shown as the preview until a new file is staged. */
		previewUrl?: string | null;
		previewKind?: 'image' | 'video' | 'audio';
		class?: string;
		onselect?: (files: File[]) => void;
		onerror?: (message: string) => void;
		/** When provided, the existing preview gets a delete button calling this. */
		ondeleterequest?: () => void;
	}

	let {
		files = $bindable([]),
		accept = 'image/*,video/*,audio/*',
		multiple = false,
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
	let staged = $state<StagedPreview[]>([]);

	// Previews for staged files; the cleanup revokes the object URLs both when the
	// selection changes and when the component is destroyed.
	$effect(() => {
		const next = files.map((file) => ({
			file,
			previewUrl: URL.createObjectURL(file),
			kind: file.type.startsWith('image/')
				? ('image' as const)
				: file.type.startsWith('video/')
					? ('video' as const)
					: file.type.startsWith('audio/')
						? ('audio' as const)
						: ('other' as const)
		}));

		staged = next;

		return () => {
			for (const preview of next) {
				URL.revokeObjectURL(preview.previewUrl);
			}
		};
	});

	function matchesAccept(file: File): boolean {
		const patterns = accept
			.split(',')
			.map((pattern) => pattern.trim())
			.filter(Boolean);

		if (!patterns.length) {
			return true;
		}

		return patterns.some((pattern) => {
			if (pattern.startsWith('.')) {
				return file.name.toLowerCase().endsWith(pattern.toLowerCase());
			}
			if (pattern.endsWith('/*')) {
				return file.type.startsWith(pattern.slice(0, -1));
			}
			return file.type === pattern;
		});
	}

	function addFiles(incoming: FileList | null | undefined) {
		if (disabled || !incoming?.length) {
			return;
		}

		const accepted: File[] = [];
		for (const file of incoming) {
			if (!matchesAccept(file)) {
				onerror?.(`Nieobsługiwany typ pliku: ${file.name}.`);
				continue;
			}
			if (file.size > maxSizeMb * 1000 * 1000) {
				onerror?.(`Plik ${file.name} jest zbyt duży (maks. ${maxSizeMb} MB).`);
				continue;
			}
			accepted.push(file);
		}

		if (!accepted.length) {
			return;
		}

		files = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
		onselect?.(files);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function openPicker() {
		if (!disabled) {
			inputEl.click();
		}
	}

	function handlePick(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		addFiles(input.files);
		input.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
		addFiles(event.dataTransfer?.files);
	}

	function formatBytes(bytes: number): string {
		if (bytes >= 1000 ** 2) {
			return `${(bytes / 1000 ** 2).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} MB`;
		}
		if (bytes >= 1000) {
			return `${(bytes / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} kB`;
		}
		return `${bytes} B`;
	}
</script>

<div class={className}>
	<input
		bind:this={inputEl}
		type="file"
		{accept}
		{multiple}
		{disabled}
		onchange={handlePick}
		class="hidden"
	/>

	{#if staged.length}
		<ul class="mb-4 grid gap-4 {multiple ? 'sm:grid-cols-2' : ''}">
			{#each staged as preview, index (preview.previewUrl)}
				<li class="rounded-2xl border border-outline-variant/30 bg-white p-3">
					{#if preview.kind === 'image'}
						<img
							src={preview.previewUrl}
							alt={preview.file.name}
							class="w-full rounded-lg {multiple ? 'h-32 object-cover' : 'h-auto'}"
						/>
					{:else if preview.kind === 'video'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={preview.previewUrl}
							controls
							class="w-full rounded-lg bg-black {multiple ? 'h-32' : 'h-auto'}"
						></video>
					{:else if preview.kind === 'audio'}
						<audio src={preview.previewUrl} controls class="w-full"></audio>
					{:else}
						<div
							class="flex h-32 items-center justify-center rounded-lg bg-surface-container-low text-brand-muted"
						>
							<span class="material-symbols-outlined text-4xl">draft</span>
						</div>
					{/if}
					<div class="mt-2 flex items-center justify-between gap-2">
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold text-brand-text" title={preview.file.name}>
								{preview.file.name}
							</p>
							<p class="text-xs text-brand-muted">{formatBytes(preview.file.size)}</p>
						</div>
						<button
							type="button"
							onclick={() => removeFile(index)}
							aria-label="Usuń plik {preview.file.name}"
							class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-muted transition hover:bg-error/10 hover:text-error"
						>
							<span class="material-symbols-outlined text-base">close</span>
						</button>
					</div>
				</li>
			{/each}
		</ul>
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
