<script lang="ts">
	interface Props {
		scrollTo: (href: string) => void;
	}

	let { scrollTo }: Props = $props();
</script>

<section id="start" class="relative flex flex-col overflow-hidden lg:flex-row lg:items-center">
	<!-- Mobile Hero Image (top, 21:9, edge-to-edge) -->
	<div class="relative w-full lg:hidden">
		<div class="aspect-21/9 w-full overflow-hidden">
			<img
				src="https://placehold.co/2100x900"
				alt="VIVIENA"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-brand-bg"></div>
	</div>

	<div class="z-10 mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-6 py-16 md:px-8 lg:grid-cols-12 lg:gap-6 lg:py-12">
		<!-- Text Column -->
		<div class="flex flex-col justify-center lg:col-span-6">
			<span class="mb-6 font-label text-sm font-semibold tracking-[0.2em] uppercase text-tertiary-fixed">
				Stowarzyszenie VIVIENA
			</span>
			<h1 class="mb-8 font-headline text-5xl leading-[1.05] font-black tracking-tighter text-surface-bright md:text-7xl lg:text-8xl">
				Działamy tam, gdzie dziś
				<span class="bg-linear-to-r from-primary-fixed to-tertiary-fixed bg-clip-text text-transparent">
					potrzeba
				</span>
				najwięcej
			</h1>
			<p class="mb-10 max-w-xl text-lg leading-relaxed text-brand-muted md:text-xl">
				Viviena to młoda organizacja społeczna, która przekłada ważne tematy współczesnego świata na konkretne działania edukacyjne i społeczne. Tworzymy warsztaty, wydarzenia i inicjatywy odpowiadające na realne potrzeby ludzi, szkół i lokalnych społeczności.
			</p>
			<div class="flex gap-3 md:gap-4">
				<a
					href="#o-nas"
					onclick={(e: MouseEvent) => { e.preventDefault(); scrollTo('#o-nas'); }}
					class="rounded-full bg-linear-to-br from-primary to-primary-container px-5 py-3 font-headline text-sm font-bold text-on-primary-container transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 md:px-8 md:py-4 md:text-lg"
				>
					Poznaj nas
				</a>
				<a
					href="#dzialania"
					onclick={(e: MouseEvent) => { e.preventDefault(); scrollTo('#dzialania'); }}
					class="rounded-full border border-outline-variant/20 bg-transparent px-5 py-3 font-headline text-sm font-bold text-surface-bright transition-all hover:bg-surface-container-low/10 md:px-8 md:py-4 md:text-lg"
				>
					Zobacz działania
				</a>
			</div>
		</div>

		<!-- Desktop Visual Column -->
		<div class="relative hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center">
			<div class="absolute inset-0 rounded-full bg-linear-to-tr from-primary/20 to-tertiary/20 blur-3xl"></div>
			<div class="relative w-full overflow-hidden rounded-2xl">
				<img
					src="https://placehold.co/1200x1600"
					alt="VIVIENA"
					class="h-auto w-full rounded-2xl opacity-90 transition-all duration-700 hover:opacity-100"
				/>
			</div>
		</div>
	</div>
</section>
