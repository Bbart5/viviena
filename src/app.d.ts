// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { JwtSessionPayload } from '$lib/types/jwt.payload';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: JwtSessionPayload | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
