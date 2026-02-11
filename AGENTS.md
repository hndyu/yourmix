# Repository Guidelines

## Project Structure & Module Organization
- `app/` is the Next.js App Router source. Feature areas live in route folders like `app/recipes/`, shared UI in `app/_components/`, server utilities in `app/lib/` and `app/utils/`, and API routes under `app/api/`.
- `public/` holds static assets.
- `drizzle/` contains database migrations/schema artifacts.
- `scripts/` includes one-off tooling such as seed scripts.
- Tests are split into `tests/unit/` (Vitest) and `tests/e2e/` (Playwright).

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server (Turbopack).
- `npm run dev:test` builds the OpenNext Cloudflare bundle and runs a local Wrangler dev server for E2E.
- `npm run build` builds the Next.js production bundle.
- `npm run preview` or `npm run deploy` builds + previews/deploys via OpenNext Cloudflare.
- `npm run test` / `npm run test:run` runs Vitest in watch or one-shot mode; `npm run test:ui` opens the UI.
- `npm run db:generate` runs Drizzle migrations generation.
- `npm run seed:local` or `npm run seed:remote` seeds data (see `scripts/seed-worker.ts`).

## Coding Style & Naming Conventions
- Formatting and linting are enforced by Biome (`biome.json`).
- Indentation is tabs; string quotes are double quotes.
- Import organization is enabled via Biome.
- Pre-commit hooks run `npx @biomejs/biome check --write` and `npx tsc --noEmit` via Lefthook.

## Testing Guidelines
- Unit tests use Vitest with `jsdom`. Files match `**/*.{test,spec}.{js,ts,jsx,tsx}`.
- E2E tests live in `tests/e2e/` and run with Playwright (`playwright.config.ts`).
- Coverage uses the V8 provider with `text`, `json`, and `html` reporters.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (enforced by `commitlint`), e.g. `feat: ...`, `fix: ...`, `chore: ...`.
- Recent history also includes scoped prefixes like `⚡ Bolt:` or `🛡️ Sentinel:`; keep those patterns if relevant to your change.
- No PR template is present. Include a short summary, testing notes (commands + results), and UI screenshots when changes affect visuals.

## Configuration & Secrets
- Local settings live in `.env.local` and `.dev.vars`. Keep secrets out of git and prefer `wrangler`/Cloudflare envs for deploys.
