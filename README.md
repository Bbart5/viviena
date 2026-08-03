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
| `npm run dev` / `preview`                   | Vite dev server / preview of the production build  |
| `npm run build`                             | `svelte-kit sync` + `prisma generate` + Vite build |
| `npm run check`                             | `svelte-kit sync` + `svelte-check`                 |
| `npm run lint` / `lint:fix`                 | Prettier + ESLint check / auto-fix                 |
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

## Deployment (Vercel)

The project uses `@sveltejs/adapter-vercel`. The Node version comes from the `engines` field in
`package.json`; the build command is the default `npm run build`.

### Build order on a fresh clone

`generated/` (Prisma client) and `.svelte-kit/` are gitignored, so CI has to produce both before
Vite runs. `tsconfig.json` extends `.svelte-kit/tsconfig.json`, which only exists after
`svelte-kit sync` - that is why both the `prepare` (runs on `npm install`) and `build` scripts run
`svelte-kit sync` **first**, then `prisma generate`, then `vite build`. Do not remove the
`extends` from `tsconfig.json`; without it every `$lib`/`$env` import loses its types.

### Environment variables

Every variable from `.env.example` must be defined in the Vercel project settings - they are read
through `$env/static/private` at **build time**, and a missing one fails the build. Production
values:

| Variable                              | Production value                                 |
| ------------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`                        | Prisma Accelerate URL (`prisma+postgres://...`)  |
| `ENVIRONMENT`                         | `production`                                     |
| `S3_ENDPOINT`                         | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`  |
| `S3_REGION` / `S3_FORCE_PATH_STYLE`   | `auto` / `false`                                 |
| `S3_PUBLIC_BASE_URL`                  | r2.dev URL or custom domain of the public bucket |
| `CLOUDFLARE_ACCOUNT_ID` / `..._TOKEN` | R2 analytics for the storage widget (see below)  |
| `JWT_SECRET`, `SEED_USERS`, `GMAIL_*` | same meaning as in development                   |

The app picks the database driver from the `DATABASE_URL` protocol: `prisma+postgres://` goes
through Prisma Accelerate (`withAccelerate`), a direct `postgres://` URL uses the `pg` driver
adapter. The same detection applies to `prisma/seed.ts`.

### Database

Deploys do **not** run migrations. Apply them (and seed once - see First-time setup) against the
production database yourself:

```sh
DATABASE_URL='<accelerate url>' npx prisma migrate deploy
DATABASE_URL='<accelerate url>' SEED_USERS='<encoded>' npm run prisma:seed
```

### Storage widget analytics

The admin storage widget reads month-to-date R2 usage from the Cloudflare GraphQL API; the token
in `CLOUDFLARE_API_TOKEN` needs the **Account Analytics: Read** permission (a bucket-scoped R2
token is not enough). Without it the widget falls back to listing the bucket over S3 - storage
size still shows, the class A/B operation counters show "Brak danych".

### Before the first deploy

- provide real team photos in `static/team/` (a local fallback avatar is shown meanwhile).

## Design reference

The original design references live in `DESIGN.md`, `REFERENCE.html` and `TAILWIND_SPEC.md`
(initial mockups generated with Google Stitch:
<https://stitch.withgoogle.com/projects/15770451649550650167>).
