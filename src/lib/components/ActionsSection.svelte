<script lang="ts">
	// import type { Action } from '../../types';
	import type { Action } from '../../../generated/prisma/client';

	type EditableAction = {
		id: number;
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
		actions: Action[];
		admin?: boolean;
	}

	let { actions, admin }: Props = $props();

	let creating = $state(false);

	let editingId = $state<number | null>(null);

	let editedAction = $state<EditableAction | null>(null);

	function startEditing(action: Action) {
		editingId = action.id;

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

		editedAction = {
			id: 0,
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
		editingId = null;
		editedAction = null;
	}

	async function saveEditing() {
		if (!editedAction) return;

		const action = editedAction;

		try {
			const response = await fetch('/api/admin/actions', {
				method: creating ? 'POST' : 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(action)
			});

			const result = await response.json();

			if (!result.success) {
				alert(result.message);
				return;
			}

			if (creating) {
				actions = [result.action, ...actions];

				creating = false;
			} else {
				const index = actions.findIndex((a) => a.id === action.id);

				if (index !== -1) {
					Object.assign(actions[index], action);
				}
			}

			editingId = null;
			editedAction = null;
		} catch (error) {
			console.error(error);
			alert('Wystąpił błąd podczas zapisywania.');
		}
	}

	async function deleteAction(id: number) {
		try {
			const response = await fetch('/api/admin/actions', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			});

			const result = await response.json();

			if (!result.success) {
				alert(result.message);
				return;
			}

			actions = actions.filter((action) => action.id !== id);
		} catch (error) {
			console.error(error);
			alert('Wystąpił błąd podczas usuwania.');
		}
	}
</script>

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
						class="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
					>
						Utwórz
					</button>

					<button
						onclick={() => {
							creating = false;
							editedAction = null;
						}}
						class="rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container"
					>
						Anuluj
					</button>
				</div>
			</div>
		{/if}

		<!-- Action Cards -->
		<div class="grid grid-cols-1 gap-8">
			{#each actions as action (action.id)}
				<div
					class="group flex flex-col rounded-2xl border border-outline-variant/30 bg-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,81,193,0.12)]"
				>
					<div
						class="flex h-56 items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-br from-primary/10 to-primary-container/25"
					>
						<!-- <img src={action.image} alt={action.title} class="h-full w-full object-cover" /> -->
					</div>

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

					{#if admin}
						<div class="mt-6 flex gap-3">
							{#if editingId === action.id}
								<button
									onclick={saveEditing}
									class="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
								>
									Zapisz
								</button>

								<button
									onclick={cancelEditing}
									class="rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container"
								>
									Anuluj
								</button>
							{:else}
								<button
									onclick={() => startEditing(action)}
									class="rounded-xl bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90"
								>
									Edytuj
								</button>

								<button
									onclick={() => deleteAction(action.id)}
									class="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
								>
									Usuń
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<p class="mt-16 text-center text-lg text-brand-muted">
			Kolejne wydarzenia będą publikowane po zakończeniu realizacji.
		</p>
	</div>
</section>
