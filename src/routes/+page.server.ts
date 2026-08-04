import type { Config } from '@sveltejs/adapter-vercel';

// The homepage SSR runs several database queries (hero, about, actions, team),
// which made every request a cold ~1s render. ISR caches the rendered HTML at
// the edge and regenerates it in the background at most once per minute, so
// visitors get a fast cached response and admin edits go live within ~60s.
export const config: Config = {
	isr: {
		expiration: 60
	}
};
