# Plan: magazyn obiektów (MinIO dev / Cloudflare R2 prod)

Refined proposition — the original idea was good, with three corrections:

1. **R2 usage stats are NOT available via the S3 API.** In production the storage / class A / class B
   numbers come from the Cloudflare GraphQL Analytics API (`r2StorageAdaptiveGroups`,
   `r2OperationsAdaptiveGroups`), which requires `CLOUDFLARE_ACCOUNT_ID` and a `CLOUDFLARE_API_TOKEN`
   with the **Account Analytics: Read** scope. MinIO has no class A/B counters at all, so in
   development the widget shows the real storage percentage (computed by listing the bucket) and
   "Niedostępne w trybie deweloperskim" for both operation rows.
2. **Auth gap fix (approved):** `src/hooks.server.ts` protected only the exact path `/admin`, leaving
   `/api/admin/*` endpoints unauthenticated, and crashed (500) on invalid JWTs. Fixed as part of this
   work: prefix matching for `/admin` and `/api/admin` (with `/admin/login` + `/admin/logout`
   excluded so login keeps working), `jwt.verify` wrapped in try/catch, API paths get 401 JSON
   instead of a redirect.
3. Everything except the usage widget on `/admin` stays **unwired** from the rest of the app.

## Architecture

- **docker-compose**: `minio` service (S3 API :9000, console :9001) + one-shot `minio-init` that
  creates the `viviena-media` bucket and sets anonymous read. Production points the same code at R2
  via env vars only (`S3_ENDPOINT`, `S3_REGION='auto'`, `S3_FORCE_PATH_STYLE='false'`).
- **`prisma/media.prisma`**: standalone `Media` model (`MediaType` enum IMAGE/VIDEO/AUDIO, unique
  bucket `key`, public `url`, `filename`, `mimeType`, `size`, timestamps). No relations.
- **`src/lib/server/storage/BucketService.ts`**: singleton over `@aws-sdk/client-s3` —
  `upload`, `get`, `delete`, `listAll`, `getPublicUrl`, and `overwrite(oldKey, ...)` which **always
  deletes the old object first, then uploads** the staged file (vital invariant).
- **`src/lib/server/storage/MediaService.ts`**: singleton facade combining the `Media` table with
  `BucketService` (`create`, `get`, `replace` — delete-old-first, `remove`). Not wired anywhere yet.
- **`src/lib/server/storage/stats/`**: `StorageStatsProvider` interface with two implementations —
  `MinioStatsProvider` (dev: bucket listing, ops = null) and `R2StatsProvider` (prod: Cloudflare
  GraphQL, month-to-date) — picked by `ENVIRONMENT`, with a 60 s cache.
- **`GET /api/admin/storage/usage`**: JWT-protected endpoint returning
  `{ storageBytes, classAOps, classBOps }`; `?fresh=1` bypasses the cache.
- **`src/lib/components/StorageUsageWidget.svelte`**: card on `/admin` with three progress bars
  (10 GB / 1 M class A / 10 M class B) as percentages, refresh button, loading/error states.
- **`src/lib/components/FileDropInput.svelte`**: reusable drag&drop + click-to-pick input with
  client-side previews (img/video/audio) of staged files, `$bindable` files, validation props.
- **`src/lib/components/MediaUploadForm.svelte`**: thin form wrapper around `FileDropInput`
  (configurable `action`, posts `FormData`). Exported, referenced nowhere.

## Production checklist (later)

- Create the R2 bucket + S3 API token; fill `S3_*` vars (endpoint
  `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`, region `auto`, path style off).
- Expose the bucket publicly (r2.dev or custom domain) and set `S3_PUBLIC_BASE_URL`.
- Create a Cloudflare API token with Account Analytics: Read; set `CLOUDFLARE_ACCOUNT_ID` and
  `CLOUDFLARE_API_TOKEN`; set `ENVIRONMENT='production'`.
- Verify the GraphQL dataset/field names in `R2StatsProvider.ts` against current Cloudflare docs
  (marked with TODO).
