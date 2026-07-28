<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	async function onLogout() {
		await fetch(resolve('/admin/logout'), {
			method: 'POST'
		});

		goto(resolve('/admin/login'));

    // TODO: make a funny joke on bartosz_b account - Math.random - chance 1 in 20 to go to pornhub
		// window.location = 'https://pornhub.com' as any;
	}
</script>

<button
	class="top-4 rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg cursor-pointer"
	onclick={onLogout}>Wyloguj się</button
> -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	async function onLogout() {
		await fetch(resolve('/admin/logout'), {
			method: 'POST'
		});

		goto(resolve('/admin/login'));
	}
</script>

<div class="top-0 z-50 border-b border-outline-variant bg-white shadow-sm">
	<div class="mx-auto flex max-w-360 items-center justify-between px-6 py-4 md:px-8">
		<div>
			<h2 class="font-headline text-lg font-bold text-brand-text">Panel administratora</h2>
		</div>

		<button
			class="cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
			onclick={onLogout}
		>
			Wyloguj się
		</button>
	</div>
</div>
