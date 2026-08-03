<script lang="ts">
	import { PRISMA_POSTGRES_FREE_TIER_LIMITS, R2_FREE_TIER_LIMITS } from '$lib/consts/storage';
	import { getStorageUsage, refreshStorageUsage } from '$lib/remote/storage.remote';
	import { commandErrorMessage } from '$lib/utils/api';
	import { formatBytes } from '$lib/utils/format-bytes';

	type ResourceUsage = Awaited<ReturnType<typeof getStorageUsage>>;

	interface UsageRow {
		label: string;
		icon: string;
		used: number | null;
		limit: number;
		usedLabel: string;
		limitLabel: string;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const refreshing = $derived(refreshStorageUsage.pending > 0);

	async function refresh() {
		try {
			await refreshStorageUsage();
		} catch (error) {
			console.error(error);
			alert(commandErrorMessage(error, 'Nie udało się pobrać statystyk magazynu.'));
		}
	}

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

	function buildRows(usage: ResourceUsage): UsageRow[] {
		return [
			{
				label: 'Pamięć (R2)',
				icon: 'hard_drive',
				used: usage.storageBytes,
				limit: R2_FREE_TIER_LIMITS.storageBytes,
				usedLabel: formatBytes(usage.storageBytes, 2),
				limitLabel: formatBytes(R2_FREE_TIER_LIMITS.storageBytes, 2)
			},
			{
				label: 'Operacje klasy A (R2)',
				icon: 'upload',
				used: usage.classAOps,
				limit: R2_FREE_TIER_LIMITS.classAOps,
				usedLabel: usage.classAOps?.toLocaleString('pl-PL') ?? '',
				limitLabel: R2_FREE_TIER_LIMITS.classAOps.toLocaleString('pl-PL')
			},
			{
				label: 'Operacje klasy B (R2)',
				icon: 'download',
				used: usage.classBOps,
				limit: R2_FREE_TIER_LIMITS.classBOps,
				usedLabel: usage.classBOps?.toLocaleString('pl-PL') ?? '',
				limitLabel: R2_FREE_TIER_LIMITS.classBOps.toLocaleString('pl-PL')
			},
			{
				label: 'Baza danych (Postgres)',
				icon: 'database',
				used: usage.databaseBytes,
				limit: PRISMA_POSTGRES_FREE_TIER_LIMITS.databaseBytes,
				usedLabel: formatBytes(usage.databaseBytes, 2),
				limitLabel: formatBytes(PRISMA_POSTGRES_FREE_TIER_LIMITS.databaseBytes, 2)
			}
		];
	}
</script>

<div class="rounded-2xl border border-outline-variant/30 bg-white p-4 {className}">
	<div class="mb-3 flex items-center justify-between gap-4">
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-xl text-primary">database</span>
			<h2 class="font-headline text-base font-bold text-brand-text">Wykorzystanie serwisów</h2>
		</div>
		<button
			type="button"
			onclick={refresh}
			disabled={refreshing}
			aria-label="Odśwież statystyki"
			class="flex cursor-pointer items-center gap-1 rounded-lg border border-outline-variant/30 px-2.5 py-1 text-xs font-semibold text-brand-muted transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
		>
			<span class="material-symbols-outlined text-sm {refreshing ? 'animate-spin' : ''}">
				refresh
			</span>
			Odśwież
		</button>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p class="text-sm text-brand-muted">Ładowanie statystyk...</p>
		{/snippet}

		{#snippet failed(error, reset)}
			<div class="flex items-center gap-3">
				<p class="text-sm text-error">
					{commandErrorMessage(error, 'Nie udało się pobrać statystyk magazynu.')}
				</p>
				<button
					type="button"
					onclick={reset}
					class="cursor-pointer rounded-lg border border-outline-variant/30 px-2.5 py-1 text-xs font-semibold text-brand-muted transition hover:border-primary/40 hover:text-primary"
				>
					Spróbuj ponownie
				</button>
			</div>
		{/snippet}

		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{#each buildRows(await getStorageUsage()) as row (row.label)}
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
						<p class="mt-1.5 text-xs text-brand-muted">Brak danych</p>
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
	</svelte:boundary>
</div>
