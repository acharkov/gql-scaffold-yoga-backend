# gql-scaffold-yoga-backend

A [Claude Code skill](https://docs.anthropic.com/claude/docs/claude-code) that scaffolds a new Node.js GraphQL backend with an opinionated stack — copies templates, substitutes the project name, and installs every dependency at `@latest`.

## Stack

- **Runtime:** Node.js 24, TypeScript, ES modules
- **Server:** [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) + [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) + [graphql-modules](https://the-guild.dev/graphql/modules)
- **DB:** PostgreSQL (`pg` + [PGTyped](https://pgtyped.dev/))
- **Cache / PubSub:** Redis (`ioredis`)
- **Subscriptions:** `graphql-ws` over uWS, Redis-backed PubSub
- **Logging:** [Pino](https://getpino.io/)
- **Tests:** [Vitest](https://vitest.dev/)
- **Style:** tabs, single quotes, no trailing semicolons, ESM `.js` imports

Latest versions are installed individually (no pinning in `package.json`) so a fresh scaffold always tracks current releases.

## What it produces

A project directory containing:

- `src/` — Yoga server, modules barrel, db/redis/pino setup, auth helper
- `deploy/` — initial SQL migration, Dockerfile bits
- `docker-compose.yml` — local Postgres + Redis
- `package.json`, `tsconfig.json`, `eslint.config.js`, `vitest.config.ts`, `pgtyped.json`, `codegen.ts`
- `.gitignore`, `.dockerignore`, `.env.example`
- A `CLAUDE.md` documenting the conventions for future Claude Code sessions

After copying templates and substituting `{{PROJECT_NAME}}`, the skill runs `npm install <pkg>@latest` for each dependency.

## Install

```bash
git clone https://github.com/acharkov/gql-scaffold-yoga-backend ~/.claude/skills/gql-scaffold-yoga-backend
```

Skills must live one level deep under `~/.claude/skills/` — Claude Code does not recurse into subfolders.

## Usage

In Claude Code:

> scaffold a new backend called my-api

> bootstrap a graphql server in ./services/orders

The skill takes `<project-name> [target-dir]`:

- `project-name` — kebab-case, required (e.g. `my-api`)
- `target-dir` — optional, defaults to `./<project-name>`

It refuses to overwrite a non-empty target directory.

## Companion skill

Pair with [`gql-new-module`](https://github.com/acharkov/gql-new-module) to scaffold individual feature modules inside the project once it's running.
