<script lang="ts">
	import { asset } from "$app/paths";

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
				src={asset("/hero/hero.png")}
				alt="VIVIENA"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white"></div>
	</div>

	<div class="z-10 mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-6 py-16 md:px-8 lg:grid-cols-12 lg:gap-6 lg:py-12">
		<!-- Text Column -->
		<div class="flex flex-col justify-center lg:col-span-6">
			<span class="mb-6 font-label text-sm font-semibold tracking-[0.2em] uppercase text-primary">
				Stowarzyszenie VIVIENA
			</span>
			<h1 class="mb-8 font-headline text-5xl leading-[1.05] font-black tracking-tighter text-brand-text md:text-7xl lg:text-8xl">
				Edukacja finansowa
				<span class="bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent">
					w praktyce
				</span>
				dla młodych
			</h1>
			<p class="mb-10 max-w-xl text-lg leading-relaxed text-brand-muted md:text-xl">
				VIVIENA działa na rzecz młodych ludzi, edukacji i rozwoju. Pokazujemy finanse w prosty i
				praktyczny sposób, łącząc wiedzę z realnymi decyzjami, które podejmujemy każdego dnia.
			</p>
			<div class="flex gap-3 md:gap-4">
				<a
					href="#o-nas"
					onclick={(e: MouseEvent) => { e.preventDefault(); scrollTo('#o-nas'); }}
					class="rounded-full bg-linear-to-br from-primary to-primary-container px-5 py-3 font-headline text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 md:px-8 md:py-4 md:text-lg"
				>
					Poznaj nas
				</a>
				<a
					href="#dzialania"
					onclick={(e: MouseEvent) => { e.preventDefault(); scrollTo('#dzialania'); }}
					class="rounded-full border border-outline-variant/40 bg-transparent px-5 py-3 font-headline text-sm font-bold text-brand-text transition-all hover:bg-surface-container-low md:px-8 md:py-4 md:text-lg"
				>
					Zobacz działania
				</a>
			</div>
		</div>

		<!-- Desktop Visual Column -->
		<div class="relative hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center">
			<div class="absolute inset-0 rounded-full bg-linear-to-tr from-primary/15 to-primary-container/20 blur-3xl"></div>
			<div class="relative w-full overflow-hidden rounded-2xl">
				<img
					src={asset("/hero/hero.png")}
					alt="VIVIENA"
					class="h-auto w-full rounded-2xl border border-outline-variant/25 transition-all duration-700 hover:opacity-100"
				/>
			</div>
		</div>
	</div>
</section>
