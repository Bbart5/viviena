<script lang="ts">
	import { R2_FREE_TIER_LIMITS, STORAGE_USAGE_ENDPOINT } from '$lib/consts/storage';

	interface StorageUsage {
		storageBytes: number;
		classAOps: number | null;
		classBOps: number | null;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let usage = $state<StorageUsage | null>(null);
	let loading = $state(true);
	let errorMessage = $state<string | null>(null);

	async function loadUsage(fresh = false) {
		loading = true;
		errorMessage = null;

		try {
			const response = await fetch(`${STORAGE_USAGE_ENDPOINT}${fresh ? '?fresh=1' : ''}`);
			const body = await response.json();

			if (!body.success) {
				throw new Error(body.message);
			}

			usage = body.usage;
		} catch {
			errorMessage = 'Nie udało się pobrać statystyk magazynu.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadUsage();
	});

	function percentage(used: number, limit: number): number {
		return (used / limit) * 100;
	}

	function formatPercentage(used: number, limit: number): string {
		return `${percentage(used, limit).toLocaleString('pl-PL', { maximumFractionDigits: 1 })}%`;
	}

	function barColor(pct: number): string {
		if (pct >= 90) return 'bg-error';
		if (pct >= 70) return 'bg-amber-500';
		return 'bg-primary';
	}

	function formatBytes(bytes: number): string {
		if (bytes >= 1000 ** 3) {
			return `${(bytes / 1000 ** 3).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} GB`;
		}
		if (bytes >= 1000 ** 2) {
			return `${(bytes / 1000 ** 2).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} MB`;
		}
		if (bytes >= 1000) {
			return `${(bytes / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} kB`;
		}
		return `${bytes} B`;
	}

	const rows = $derived(
		usage
			? [
					{
						label: 'Pamięć',
						icon: 'hard_drive',
						used: usage.storageBytes as number | null,
						limit: R2_FREE_TIER_LIMITS.storageBytes as number,
						usedLabel: formatBytes(usage.storageBytes),
						limitLabel: formatBytes(R2_FREE_TIER_LIMITS.storageBytes)
					},
					{
						label: 'Operacje klasy A',
						icon: 'upload',
						used: usage.classAOps,
						limit: R2_FREE_TIER_LIMITS.classAOps as number,
						usedLabel: usage.classAOps?.toLocaleString('pl-PL') ?? '',
						limitLabel: R2_FREE_TIER_LIMITS.classAOps.toLocaleString('pl-PL')
					},
					{
						label: 'Operacje klasy B',
						icon: 'download',
						used: usage.classBOps,
						limit: R2_FREE_TIER_LIMITS.classBOps as number,
						usedLabel: usage.classBOps?.toLocaleString('pl-PL') ?? '',
						limitLabel: R2_FREE_TIER_LIMITS.classBOps.toLocaleString('pl-PL')
					}
				]
			: []
	);
</script>

<div class="rounded-2xl border border-outline-variant/30 bg-white p-6 {className}">
	<div class="mb-6 flex items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<span class="material-symbols-outlined text-primary">database</span>
			<h2 class="font-headline text-lg font-bold text-brand-text">Wykorzystanie magazynu (R2)</h2>
		</div>
		<button
			type="button"
			onclick={() => loadUsage(true)}
			disabled={loading}
			aria-label="Odśwież statystyki"
			class="flex items-center gap-1 rounded-lg border border-outline-variant/30 px-3 py-1.5 text-sm font-semibold text-brand-muted transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
		>
			<span class="material-symbols-outlined text-base {loading ? 'animate-spin' : ''}"
				>refresh</span
			>
			Odśwież
		</button>
	</div>

	{#if loading && !usage}
		<p class="text-sm text-brand-muted">Ładowanie statystyk...</p>
	{:else if errorMessage}
		<p class="text-sm text-error">{errorMessage}</p>
	{:else if usage}
		<div class="space-y-5">
			{#each rows as row (row.label)}
				<div>
					<div class="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
						<span class="flex items-center gap-2 font-semibold text-brand-text">
							<span class="material-symbols-outlined text-base text-brand-muted">{row.icon}</span>
							{row.label}
						</span>
						{#if row.used === null}
							<span class="text-brand-muted">Niedostępne w trybie deweloperskim</span>
						{:else}
							<span class="text-brand-muted">
								{row.usedLabel} / {row.limitLabel}
								<span class="font-semibold text-brand-text">
									({formatPercentage(row.used, row.limit)})
								</span>
							</span>
						{/if}
					</div>
					{#if row.used === null}
						<div class="h-2 rounded-full bg-surface-container-highest opacity-50"></div>
					{:else}
						<div class="h-2 overflow-hidden rounded-full bg-surface-container-highest">
							<div
								class="h-full rounded-full transition-all duration-500 {barColor(
									percentage(row.used, row.limit)
								)}"
								style="width: {Math.min(percentage(row.used, row.limit), 100)}%"
							></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
