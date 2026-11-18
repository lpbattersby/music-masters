# Music Masters

[![CI](https://github.com/lpbattersby/music-masters/actions/workflows/tests.yml/badge.svg)](https://github.com/lpbattersby/music-masters/actions/workflows/tests.yml)

Music Masters is a group game built around themed music rounds: players submit songs and vote on each other's picks.

> **Status:** Early development. Users can create accounts, create and join groups via invite links, and create rounds with submission and voting deadlines. Song submission, voting, and results are not implemented yet.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm

If you use [nvm](https://github.com/nvm-sh/nvm), install and select the project version:

```bash
nvm install
nvm use
```

## Local setup

```bash
npm ci
cp .env.example .env
```

Replace `SESSION_PASSWORD` in `.env` with a fresh secret. Generate one with:

```bash
openssl rand -base64 32
```

`DATABASE_URL` defaults to `file:./data/app.db`; the local database directory is created automatically and is git-ignored. The app applies the Drizzle migrations when it first connects to the database.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common commands

| Command               | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Start the development server                       |
| `npm run lint`        | Run ESLint and check Prettier formatting           |
| `npm run lint:fix`    | Apply ESLint fixes and format the repository       |
| `npm run format`      | Format the repository with Prettier                |
| `npm run typecheck`   | Run the TypeScript compiler without emitting files |
| `npm test`            | Run unit tests                                     |
| `npm run test:e2e`    | Run Playwright end-to-end tests                    |
| `npm run build`       | Create a production build                          |
| `npm run db:generate` | Generate a Drizzle migration after schema changes  |
| `npm run db:migrate`  | Apply database migrations                          |
| `npm run db:studio`   | Open Drizzle Studio                                |

For the first E2E run, install Playwright's Chromium browser:

```bash
npx playwright install chromium
```

The E2E configuration starts its own server on port 3001 and uses a separate `data/e2e.db` database, which is reset between tests. Do not point E2E tests at a development or production database.

## Project layout

- `src/app/(app)/`: authenticated dashboard and group routes.
- `src/app/actions/`: Next.js Server Actions.
- `src/app/lib/`: Drizzle schema and data-access helpers, form schemas, and authentication.
- `src/app/form/`: shared form rendering and authentication form.
- `e2e/`: Playwright user journeys.
- `src/test/`: shared test fixtures and helpers.
- `drizzle/`: SQL migrations and generated migration metadata.
- `AGENTS.md`: project-specific guidance for AI coding agents, including architecture decisions and planned behavior.

## Architecture notes

- Validate all submitted data on the server with the relevant Zod schema. Client-side checks are not a security boundary.
- Authenticate and authorize each protected Server Action; use the shared auth/data-access helpers rather than parsing sessions in individual actions.
- Keep database reads and writes in `src/app/lib/`, not in UI components.
- The GitHub Actions workflow runs CodeQL, production dependency auditing, linting, a production build, unit tests, and E2E tests.

Before making code changes, read [AGENTS.md](./AGENTS.md) for project conventions and current design decisions.
