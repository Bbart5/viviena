<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { LoginRequestDto } from './+server';

	let showPassword = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		const response = await fetch(resolve('/admin/login'), {
			method: 'POST',
			body: JSON.stringify({ username, password } satisfies LoginRequestDto)
		});

		if (response.ok) {
			goto(resolve('/admin'));
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-surface-container-low">
	<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
		<h1 class="mb-8 text-center font-headline text-3xl font-bold text-brand-text">Logowanie</h1>

		<form class="space-y-6" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<label
					for="username"
					class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
				>
					Login
				</label>

				<input
					id="username"
					name="username"
					type="text"
					placeholder="Podaj login"
					class="w-full rounded-lg border border-outline-variant/20 p-4 transition-colors outline-none focus:border-primary"
				/>
			</div>

			<div class="space-y-2">
				<label
					for="password"
					class="text-xs font-bold tracking-widest text-on-surface-variant uppercase"
				>
					Hasło
				</label>

				<div class="relative">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="Podaj hasło"
						class="w-full rounded-lg border border-outline-variant/20 p-4 pr-12 transition-colors outline-none focus:border-primary"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
						class="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1 text-on-surface-variant transition hover:text-primary"
					>
						<span class="material-symbols-outlined">
							{showPassword ? 'visibility_off' : 'visibility'}
						</span>
					</button>
				</div>
			</div>

			<button
				type="submit"
				class="w-full cursor-pointer rounded-full bg-primary py-3 font-semibold text-white transition hover:opacity-90"
			>
				Zaloguj
			</button>
		</form>
	</div>
</div>
