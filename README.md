# Stowarzyszenie VIVIENA - website

Public site and admin panel for the VIVIENA association: SvelteKit 2 (Svelte 5 runes, experimental
[remote functions](https://svelte.dev/docs/kit/remote-functions) + `await` in components), Prisma 7
on PostgreSQL, S3-compatible media storage (MinIO in development, Cloudflare R2 in production) and
Tailwind CSS 4.

## Requirements

- Node.js >= 24 (see `shell.nix` for the Nix environment)
- Docker with Compose (local PostgreSQL + MinIO)

## First-time setup

1. **Environment** - copy the example file and set at least `JWT_SECRET` (any long random string).
   The remaining defaults work for local development; `GMAIL_USER`/`GMAIL_APP_PASSWORD` are only
   needed for the contact form to actually send e-mail.

   ```sh
   cp .env.example .env
   ```

2. **Infrastructure** - starts PostgreSQL, MinIO and a one-shot job that creates the public
   `viviena-media` bucket. The MinIO console runs at <http://localhost:9001> (`viviena` /
   `viviena-dev`).

   ```sh
   docker compose up -d
   ```

3. **Dependencies** - `npm install` also generates the Prisma client (`prepare` script). The
   generated client lives in `generated/` and is gitignored, so this step is required on every
   fresh clone.

4. **Admin accounts** - create a gitignored `users.json` with your admin credentials and encode it
   into `SEED_USERS` in `.env`:

   ```json
   [{ "username": "admin", "password": "change-me" }]
   ```

   ```sh
   npm run encode-users -- users.json
   ```

5. **Database** - apply migrations, then seed. **Seeding is mandatory**: the site renders singleton
   content (hero/about/areas) with `findFirstOrThrow`, so an unseeded database means a 500 on the
   home page.

   ```sh
   npm run prisma:migrate:dev
   npm run prisma:seed
   ```

6. **Run it**:

   ```sh
   npm run dev
   ```

   Public site: <http://localhost:5173> - admin panel: <http://localhost:5173/admin> (log in with a
   seeded user).

## Scripts

| Script                                      | Purpose                                            |
| ------------------------------------------- | -------------------------------------------------- |
| `npm run dev` / `build` / `preview`         | Vite dev server / production build / preview       |
| `npm run check`                             | `svelte-kit sync` + `svelte-check`                 |
| `npm run lint` / `lint:fix`                 | Prettier + ESLint check / auto-fix                 |
| `npm run format`                            | Prettier write                                     |
| `npm run encode-users -- <users.json>`      | Encode admin accounts for `SEED_USERS`             |
| `npm run prisma:migrate:dev` / `seed` / ... | Prisma workflows (`generate`, `studio`, `format`…) |

## Architecture notes

- **Data access** - components call remote functions from `src/lib/remote/*.remote.ts` (`query` for
  reads, `command` for mutations with optimistic UI via
  `command(...).updates(query().withOverride(...))`). The experimental flags live in
  `svelte.config.js`.
- **Remaining REST endpoints** - only multipart image uploads (`/api/admin/hero/image`,
  `/api/admin/actions/[id]/image`; command arguments are devalue-serialized JSON and cannot carry a
  `File`), auth (`/admin/login`, `/admin/logout` - cookie mutations) and the public
  `/api/contact` form.
- **Auth** - JWT session cookie verified in `hooks.server.ts`, which guards `/admin` and
  `/api/admin` paths. Remote function requests bypass path guards, so every admin command/query
  re-checks `locals.session` via `requireAdmin()` (`src/lib/server/auth.ts`).
- **Media** - `MediaService` + `BucketService` store uploads in S3-compatible storage and track
  them in the `Media` table; deleting an owner cleans up both the row and the object.

## Deployment

The project uses `@sveltejs/adapter-auto`, which detects Vercel, Netlify and Cloudflare Pages.
Before the first production deploy:

- set the production `S3_*` values (R2 endpoint, `S3_FORCE_PATH_STYLE='false'`, public bucket URL)
  and `CLOUDFLARE_*` (analytics for the storage widget),
- verify the Cloudflare GraphQL dataset/field names flagged in
  `src/lib/server/storage/stats.ts` (TODO) - the admin storage widget queries them,
- provide real team photos in `static/team/` (a local fallback avatar is shown meanwhile).

## Design reference

The original design references live in `DESIGN.md`, `REFERENCE.html` and `TAILWIND_SPEC.md`
(initial mockups generated with Google Stitch:
<https://stitch.withgoogle.com/projects/15770451649550650167>).
