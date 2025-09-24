# Repository Guidelines

## Project Structure & Module Organization
Keep server-side code under `backend/` with Express entrypoints in `app.js` and `server.js`. Route, controller, and service layers follow the `feature.layer.js` pattern (for example, `employees.controller.js`). Shared database access lives in `backend/lib/supabaseClient.js`. Static assets and the HTML shell ship from `public/`. Supabase SQL migrations reside in `supabase/migrations/`, while generated typings land in `src/types/db.ts`. Utility scripts such as `seed.js` and `pipeline.ps1` stay in `scripts/`.

## Build, Test, and Development Commands
Use `npm run dev` for local development on port 3001. Run the production build with `npm start`. Execute the Jest + Supertest suite via `npm test`. Populate demo content using `npm run seed` once `SUPABASE_URL` and `SUPABASE_ANON_KEY` are exported. Refresh Supabase typings with `npm run typegen`, and push pending migrations through `npm run dbpush`.

## Coding Style & Naming Conventions
Author code in modern Node.js ESM—stick to `import`/`export`. Apply two-space indentation and avoid tabs. File names use kebab-case with layer suffixes, such as `reports.route.js` or `reports.service.js`. Keep modules cohesive, routing thin, and push database logic into services that consume the shared Supabase client.

## Testing Guidelines
Tests live beside their targets or within `backend/` using the `.test.js` suffix (for example, `server.test.js`). Rely on Jest with Supertest for HTTP coverage, and prefer `jest.unstable_mockModule` with dynamic `import()` when mocking ESM dependencies. Run `npm test` before submitting changes; add focused cases for new routes or services.

## Commit & Pull Request Guidelines
Write commits in imperative, single-sentence form like `Add employees list endpoint`. In pull requests, describe the change, motivation, and verification steps, and attach screenshots for UI-facing updates. Reference related issues with `#123` syntax. Call out config or migration impacts so reviewers can plan database operations.

## Security & Configuration Tips
Never commit secrets—load Supabase keys through a local `.env`. Review `config/` and deployment descriptors (for example, `render.yaml`) whenever infrastructure changes. Favor parameterized queries and validate inputs in services to keep Supabase interactions safe.
