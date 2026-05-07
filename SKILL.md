---
name: gql-scaffold-yoga-backend
description: Scaffold a new Node.js GraphQL backend project using the sg-style tech stack — uWebSockets.js + graphql-yoga + graphql-modules + PGTyped + PostgreSQL + Redis + Pino + Vitest, ESM TypeScript, tabs/single-quotes. Installs latest versions of all dependencies. Use when the user asks to scaffold/bootstrap/create a new backend project, set up a new GraphQL server, start a new project with this stack, or clone the sg architecture.
argument-hint: <project-name> [target-dir]
allowed-tools: Read Write Edit Bash Glob
---

# gql-scaffold-yoga-backend

Scaffold a new GraphQL backend project that mirrors the sg stack:

- **Runtime:** Node.js 24, TypeScript, ES modules
- **Server:** uWebSockets.js + GraphQL Yoga + graphql-modules
- **DB:** PostgreSQL (pg + PGTyped) + Redis (ioredis)
- **Subs:** graphql-ws over uWS, Redis-backed PubSub
- **Logging:** Pino
- **Tests:** Vitest
- **Style:** tabs, single quotes, no trailing semicolons, 2 blank lines after imports, `.js` ESM imports

**Install latest versions of every package** — never pin versions in `package.json`. Use `npm install <pkg>@latest` so the user always gets current releases.

## Step 1 — Collect and validate args

Parse `$ARGUMENTS` as: `<project-name> [target-dir]`.

- `project-name`: must match `^[a-z][a-z0-9-]*$`. Required.
- `target-dir`: optional, defaults to `./<project-name>` relative to CWD.

Stop and ask the user if:
- project-name is missing or invalid
- target-dir already exists AND is non-empty (use `ls -A`) — do not overwrite

Derive:
- `$NAME` = project-name
- `$DIR` = absolute target dir

## Step 2 — Create directory tree and copy templates

Template location: `~/.claude/skills/gql-scaffold-yoga-backend/templates/`.

Create `$DIR` and copy every file from `templates/` into `$DIR`, preserving subdirectories. Rename on copy:

| Template filename | Final filename |
|---|---|
| `_gitignore` | `.gitignore` |
| `_dockerignore` | `.dockerignore` |
| `_env.example` | `.env.example` |
| `package.json.template` | `package.json` |

Use `cp -R` for directories. Do **not** copy `SKILL.md` itself.

Then substitute `{{PROJECT_NAME}}` with `$NAME` in `package.json`, `docker-compose.yml`, `deploy/create.sql`, and `pgtyped.json`. Use `sed -i ''` on macOS, `sed -i` on Linux — detect via `uname`.

## Step 3 — Install dependencies at latest versions

Run each as a separate install command so npm resolves `@latest` for each individually. Sequential Bash from inside `$DIR`:

```bash
# Runtime
npm install \
  @envelop/depth-limit@latest \
  @envelop/graphql-modules@latest \
  @envelop/rate-limiter@latest \
  @graphql-tools/load-files@latest \
  @graphql-tools/schema@latest \
  @graphql-tools/utils@latest \
  @graphql-yoga/redis-event-target@latest \
  @graphql-yoga/subscription@latest \
  @pgtyped/runtime@latest \
  graphql@latest \
  graphql-modules@latest \
  graphql-scalars@latest \
  graphql-ws@latest \
  graphql-yoga@latest \
  ioredis@latest \
  pg@latest \
  pino@latest

# uWebSockets.js is GitHub-only — resolves to latest semver tag at install time
npm install "github:uNetworking/uWebSockets.js#semver:*"

# Dev
npm install -D \
  @eslint/js@latest \
  @graphql-codegen/cli@latest \
  @graphql-codegen/graphql-modules-preset@latest \
  @graphql-codegen/typescript@latest \
  @graphql-codegen/typescript-resolvers@latest \
  @pgtyped/cli@latest \
  @types/node@latest \
  @types/pg@latest \
  eslint@latest \
  eslint-plugin-import-x@latest \
  globals@latest \
  pino-pretty@latest \
  tsx@latest \
  typescript@latest \
  typescript-eslint@latest \
  vitest@latest
```

If any install fails, stop and report — do not retry blindly. Common causes: network, npm registry auth, Node version too old. The scaffold targets Node.js ≥ 22; ideally 24.

**ERESOLVE on TypeScript:** `@pgtyped/cli` caps its `typescript` peer at v5 but TS 6 is now current. The template `package.json` ships with `"overrides": { "typescript": "$typescript" }` which forces every transitive TS peer to match the root version, so npm accepts TS 6. **Do not remove this block.** If you ever hit a similar ERESOLVE for another peer, add a matching override (e.g. `"graphql": "$graphql"`) rather than reaching for `--legacy-peer-deps` — overrides leave the lockfile clean.

## Step 4 — Initialize git

From inside `$DIR`:

```bash
git init -b main
git add -A
git commit -m "Initial scaffold"
```

Skip if `git` is unavailable — warn but do not fail.

## Step 5 — Report back

Compact summary:

- Target dir.
- Dependencies installed (don't list every package — just "17 runtime, 16 dev, all @latest").
- Next steps for the user:
  1. `cp .env.example .env` and fill values.
  2. `docker compose up -d` to start Postgres + Redis.
  3. `psql -h localhost -U root -d postgres_db -f deploy/create.sql` to apply schema.
  4. `npm run pgtyped` in one terminal (watcher for `.sql` files).
  5. `npm start` in another (server with `--watch`).
  6. Add new feature modules under `src/modules/<name>/` following the common module as a template, then register in `src/modules/schema.ts`.

## Conventions enforced by templates

- Tabs, single quotes, no trailing semicolons (TS/GQL).
- ESM imports with `.js` extension.
- Two blank lines after import block (`import-x/newline-after-import: 2`).
- Spaces inside braces.
- Auto-generated files excluded from ESLint: `**/.dist/**/*`, `**/*.queries.ts`.
- Module pattern: `<name>.gql` + `<name>.schema.ts` + `<name>.sql` (+ auto-generated `<name>.queries.ts` and `generated-types/module-types.ts`).
- PGTyped output: `{{dir}}/{{name}}.queries.ts` next to each `.sql`.
- Codegen output: `src/modules/<mod>/generated-types/module-types.ts` with shared base at `src/generated-types/graphql.ts`.

## What's included in the scaffold

- Minimal runnable server: healthz + /graphql endpoint + WS subscriptions.
- `common` module with `Timestamp`, `BigInt`, `JSON` scalars, `@atLeastModer` and `@rateLimit` directives.
- `db/pg.ts` with `pgTx` helper and NUMERIC→number type parser.
- `db/redis.ts` with error logging.
- `pubsub.ts` with Redis event target and empty `PubSubTopics`.
- `logger/logger.ts` with pino-pretty in dev, GCP severity mapping in prod.
- Dockerfile (multi-stage, Node 24 slim) + docker-compose.yml (Postgres 17, Redis 7).
- Vitest config with `.env`/`.env.test` loading.
- ESLint 9 flat config.
- `CLAUDE.md` describing the stack for future Claude sessions in the new repo.

## What's NOT included (user adds as needed)

- Auth (Steam OpenID, JWT, etc.) — domain-specific.
- Payment/webhook routes — domain-specific.
- Business feature modules — use the `new-graphql-module` skill inside the new repo once it exists.
- A `.model.ts` pattern — add when a module needs domain methods.
