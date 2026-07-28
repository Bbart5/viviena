<script lang="ts">
	import {
		PRISMA_POSTGRES_FREE_TIER_LIMITS,
		R2_FREE_TIER_LIMITS,
		STORAGE_USAGE_ENDPOINT
	} from '$lib/consts/storage';

	interface ResourceUsage {
		storageBytes: number;
		databaseBytes: number;
		classAOps: number | null;
		classBOps: number | null;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let usage = $state<ResourceUsage | null>(null);
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
						label: 'Pamięć (R2)',
						icon: 'hard_drive',
						used: usage.storageBytes as number | null,
						limit: R2_FREE_TIER_LIMITS.storageBytes as number,
						usedLabel: formatBytes(usage.storageBytes),
						limitLabel: formatBytes(R2_FREE_TIER_LIMITS.storageBytes)
					},
					{
						label: 'Operacje klasy A (R2)',
						icon: 'upload',
						used: usage.classAOps,
						limit: R2_FREE_TIER_LIMITS.classAOps as number,
						usedLabel: usage.classAOps?.toLocaleString('pl-PL') ?? '',
						limitLabel: R2_FREE_TIER_LIMITS.classAOps.toLocaleString('pl-PL')
					},
					{
						label: 'Operacje klasy B (R2)',
						icon: 'download',
						used: usage.classBOps,
						limit: R2_FREE_TIER_LIMITS.classBOps as number,
						usedLabel: usage.classBOps?.toLocaleString('pl-PL') ?? '',
						limitLabel: R2_FREE_TIER_LIMITS.classBOps.toLocaleString('pl-PL')
					},
					{
						label: 'Baza danych (Postgres)',
						icon: 'database',
						used: usage.databaseBytes as number | null,
						limit: PRISMA_POSTGRES_FREE_TIER_LIMITS.databaseBytes as number,
						usedLabel: formatBytes(usage.databaseBytes),
						limitLabel: formatBytes(PRISMA_POSTGRES_FREE_TIER_LIMITS.databaseBytes)
					}
				]
			: []
	);
</script>

<div class="rounded-2xl border border-outline-variant/30 bg-white p-4 {className}">
	<div class="mb-3 flex items-center justify-between gap-4">
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-xl text-primary">database</span>
			<h2 class="font-headline text-base font-bold text-brand-text">Wykorzystanie magazynu</h2>
		</div>
		<button
			type="button"
			onclick={() => loadUsage(true)}
			disabled={loading}
			aria-label="Odśwież statystyki"
			class="flex cursor-pointer items-center gap-1 rounded-lg border border-outline-variant/30 px-2.5 py-1 text-xs font-semibold text-brand-muted transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
		>
			<span class="material-symbols-outlined text-sm {loading ? 'animate-spin' : ''}">refresh</span>
			Odśwież
		</button>
	</div>

	{#if loading && !usage}
		<p class="text-sm text-brand-muted">Ładowanie statystyk...</p>
	{:else if errorMessage}
		<p class="text-sm text-error">{errorMessage}</p>
	{:else if usage}
		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{#each rows as row (row.label)}
				<div
					class="rounded-lg border border-outline-variant/20 bg-surface-container-low/60 px-3 py-2"
				>
					<div class="flex items-start justify-between gap-2">
						<span class="flex items-center gap-1.5 text-xs font-semibold text-brand-text">
							<span class="material-symbols-outlined text-sm text-brand-muted">{row.icon}</span>
							{row.label}
						</span>
						{#if row.used !== null}
							<span class="text-xs font-bold text-brand-text">
								{formatPercentage(row.used, row.limit)}
							</span>
						{/if}
					</div>
					{#if row.used === null}
						<div class="mt-2 h-1.5 rounded-full bg-surface-container-highest opacity-50"></div>
						<p class="mt-1.5 text-xs text-brand-muted">Brak danych (dev)</p>
					{:else}
						<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
							<div
								class="h-full rounded-full transition-all duration-500 {barColor(
									percentage(row.used, row.limit)
								)}"
								style="width: {Math.min(percentage(row.used, row.limit), 100)}%"
							></div>
						</div>
						<p class="mt-1.5 text-xs text-brand-muted">{row.usedLabel} / {row.limitLabel}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
