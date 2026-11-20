<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context

Music Masters is a Next.js App Router application for groups to run music-submission rounds. It uses React 19, MUI, SQLite/libSQL with Drizzle ORM, Zod validation, and Iron Session authentication.

## Where things live

- `src/app/(app)/`: authenticated dashboard and group routes. Keep route-specific UI and forms beside their route.
- `src/app/actions/`: Server Actions. Parse submitted `FormData` with schemas from `src/app/lib/form-schemas.ts`.
- `src/app/lib/`: database access, domain queries, validation schemas, and auth. `schema.ts` is the Drizzle database schema; `auth/dal.ts` and `auth/session.ts` own session and current-user access.
- `src/app/form/`: shared form renderer and auth form. Use `GeneratedForm` for common field rendering, pending state, and validation display; keep domain-specific form configuration near its route rather than adding a global form registry for the current small set of forms.
- `e2e/`: Playwright journeys. Shared E2E fixtures and database setup are in `src/test/fixtures.ts`; unit tests are generally colocated with the code they cover.
- `drizzle/`: SQL migrations and generated migration metadata. Generate migrations with `npm run db:generate` after schema changes; avoid hand-editing generated metadata.

## Important design and data rules

- Treat all submitted values as untrusted. Validate on the server with the relevant Zod schema; client-side validation is not authorization.
- Protected Server Actions must call `getCurrentUser()` and enforce the action-specific access rule. For example, round creation is restricted to the group owner.
- Reuse the auth DAL (`getCurrentUser`, `getCurrentUserGroup`) instead of repeating session parsing and user lookups. Session creation/defaults are centralized in `auth/session.ts`.
- Keep database reads and writes in `src/app/lib/` query helpers, not UI components. Avoid adding generic repository wrappers for one-off queries.
- Round numbers are per group; `createRound` calculates the next number, and the database enforces uniqueness per group. Voting deadlines must be after submission deadlines.
- Deadlines use ISO date strings (`YYYY-MM-DD`). When implementing deadline-sensitive behavior, use trusted server time, never the client clock; see the planned behavior below.
- Dashboard latest-round data is fetched in one grouped query for all groups; do not add per-group round queries in a loop.
- Song submissions are unique per user and round; update the existing row when a member replaces their song.
- E2E database cleanup must delete dependent rows first: rounds, memberships, groups, then users. The fixture uses a dedicated E2E database.

## Implemented round behavior

- Group members can submit a SoundCloud URL for the current round and replace it until the submission deadline. Deadline dates are inclusive through the selected UTC day.

## Planned round behavior

- Derive round state on the server by comparing trusted current time with the deadlines stored in the database. Use that state to gate submissions and voting as well as choose the relevant UI action: Create Round, Submit, Vote, or See Results.
- The next round's creator/chooser is not decided yet. The intended options are random selection or letting the previous winner/loser choose who picks the next creator; do not assume which policy until clarified.
- The round creator can select any number of voting categories from Theme, Song, and Fun. Players rank submitted songs from best to worst with a drag-and-swap UI; persist each rank explicitly.
- A player who did not submit a song cannot vote, but can still listen. Exclude non-voters from the round's ranking calculations when it ends.
- Song search may be added later. The voting view should include an embedded SoundCloud playlist player so players can listen in the app.
- On the results view, show Create Next Round to whoever is eligible to choose the next round. Once a new round starts, keep prior results accessible from Past Rounds.

## Useful commands

- `npm run lint`: ESLint and Prettier check.
- `npm run format`: format the repository with Prettier.
- `npm test`: unit tests; `npm run test:e2e`: Playwright journeys.
- `npm run typecheck`: TypeScript check.
- `npm run db:generate` and `npm run db:migrate`: generate and apply Drizzle migrations.

## Other rules

- Don't leave random comments with code, the code should be self explainatory
- Don't run terminal commands that require interaction or :q to exit
