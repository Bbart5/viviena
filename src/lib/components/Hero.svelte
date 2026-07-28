<script lang="ts">
	import { asset } from '$app/paths';
	import type { Hero } from '../../../generated/prisma/client';

	interface Props {
		scrollTo: (href: string) => void;
		hero: Hero;
		admin?: boolean;
	}

	let { scrollTo, hero, admin = false }: Props = $props();

	let editing = $state(false);

	let editedHero = $state({
		id: hero.id,
		title: hero.title,
		header1: hero.header1,
		header2: hero.header2,
		header3: hero.header3,
		description: hero.description
	});

	function startEditing() {
		editedHero = {
			id: hero.id,
			title: hero.title,
			header1: hero.header1,
			header2: hero.header2,
			header3: hero.header3,
			description: hero.description
		};

		editing = true;
	}

	function cancelEditing() {
		editedHero = {
			id: hero.id,
			title: hero.title,
			header1: hero.header1,
			header2: hero.header2,
			header3: hero.header3,
			description: hero.description
		};

		editing = false;
	}

	async function saveEditing() {
		try {
			const response = await fetch('/api/admin/hero', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedHero)
			});

			const result = await response.json();

			if (!result.success) {
				alert(result.message);
				return;
			}

			Object.assign(hero, editedHero);

			editing = false;
		} catch (error) {
			console.error(error);
			alert('Wystąpił błąd podczas zapisywania.');
		}
	}
</script>

<section id="start" class="relative flex flex-col overflow-hidden lg:flex-row lg:items-center">
	<!-- Mobile Hero Image (top, 21:9, edge-to-edge) -->
	<div class="relative w-full lg:hidden">
		<div class="aspect-21/9 w-full overflow-hidden">
			<img src={asset('/hero/hero.jpg')} alt="VIVIENA" class="h-full w-full object-cover" />
		</div>
		<div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white"></div>
	</div>

	<div
		class="z-10 mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-6 py-16 md:px-8 lg:grid-cols-12 lg:gap-6 lg:py-12"
	>
		<!-- Text Column -->
		<div class="flex flex-col justify-center lg:col-span-6">
			<span class="mb-6 font-label text-sm font-semibold tracking-[0.2em] text-primary uppercase">
				{#if admin && editing}
					<input
						bind:value={editedHero.title}
						class="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold"
					/>
				{:else}
					{hero.title}
				{/if}
			</span>
			{#if admin && editing}
				<div class="mb-8 space-y-3">
					<input
						bind:value={editedHero.header1}
						class="w-full rounded-xl border border-outline bg-white p-3 text-3xl font-black"
					/>

					<input
						bind:value={editedHero.header2}
						class="w-full rounded-xl border border-primary bg-white p-3 text-3xl font-black"
					/>

					<input
						bind:value={editedHero.header3}
						class="w-full rounded-xl border border-outline bg-white p-3 text-3xl font-black"
					/>
				</div>
			{:else}
				<h1
					class="mb-8 font-headline text-5xl leading-[1.05] font-black tracking-tighter text-brand-text md:text-7xl lg:text-8xl"
				>
					{hero.header1}

					<span
						class="bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent"
					>
						{hero.header2}
					</span>

					{hero.header3}
				</h1>
			{/if}
			<p class="mb-10 max-w-xl text-lg leading-relaxed text-brand-muted md:text-xl">
				{#if admin && editing}
					<textarea
						bind:value={editedHero.description}
						rows="5"
						class="w-full rounded-xl border border-outline bg-white p-4"
					></textarea>
				{:else}
					{hero.description}
				{/if}
			</p>
			<div class="flex gap-3 md:gap-4">
				<a
					href="#o-nas"
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo('#o-nas');
					}}
					class="rounded-full bg-linear-to-br from-primary to-primary-container px-5 py-3 font-headline text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 md:px-8 md:py-4 md:text-lg"
				>
					Poznaj nas
				</a>
				<a
					href="#dzialania"
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo('#dzialania');
					}}
					class="rounded-full border border-outline-variant/40 bg-transparent px-5 py-3 font-headline text-sm font-bold text-brand-text transition-all hover:bg-surface-container-low md:px-8 md:py-4 md:text-lg"
				>
					Zobacz działania
				</a>
			</div>

			{#if admin}
				<div class="mt-8 flex gap-3">
					{#if admin && editing}
						<button
							onclick={saveEditing}
							class="cursor-pointer rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
						>
							Zapisz
						</button>

						<button
							onclick={cancelEditing}
							class="cursor-pointer rounded-xl border border-outline px-5 py-2 font-semibold transition hover:bg-surface-container"
						>
							Anuluj
						</button>
					{:else}
						<button
							onclick={startEditing}
							class="cursor-pointer rounded-xl bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90"
						>
							Edytuj
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Desktop Visual Column -->
		<div class="relative hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center">
			<div
				class="absolute inset-0 rounded-full bg-linear-to-tr from-primary/15 to-primary-container/20 blur-3xl"
			></div>
			<div class="relative w-full overflow-hidden rounded-2xl">
				<img
					src={asset('/hero/hero.jpg')}
					alt="VIVIENA"
					class="h-auto w-full rounded-2xl border border-outline-variant/25 transition-all duration-700 hover:opacity-100"
				/>
			</div>
		</div>
	</div>
</section>
