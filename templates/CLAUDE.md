# {{PROJECT_NAME}}

GraphQL backend scaffolded from the sg-style stack.

## Tech Stack

- **Runtime:** Node.js 24, TypeScript, ES modules
- **Server:** uWebSockets.js (HTTP + WebSocket)
- **API:** GraphQL Yoga + graphql-modules
- **Database:** PostgreSQL (pg + PGTyped), Redis (ioredis)
- **Subscriptions:** graphql-ws over uWS, Redis-backed PubSub
- **Logging:** Pino
- **Testing:** Vitest (sequential)

## Commands

```bash
npm start           # Dev server with --watch
npm run build       # TypeScript compile to .dist/
npm test            # Vitest (--no-file-parallelism)
npm run pgtyped     # Watch .sql → generate typed .queries.ts
npm run cg          # GraphQL codegen (schema → resolver types)
npm run eslint:fix  # Lint + fix
```

## Module Structure

```
src/modules/<name>/
├── <name>.gql             # Schema
├── <name>.schema.ts       # Resolvers + createModule()
├── <name>.sql             # PGTyped queries
├── <name>.queries.ts      # AUTO-GENERATED
└── generated-types/module-types.ts  # AUTO-GENERATED
```

Never edit `*.queries.ts` or `generated-types/module-types.ts` — run `npm run pgtyped` and `npm run cg`.

Register new modules in `src/modules/schema.ts`.

## Code Style

- Tabs, single quotes, no trailing semicolons
- ESM imports with `.js` extension
- Two blank lines after import block
- Spaces inside braces: `{ foo }` not `{foo}`

## Patterns

### Resolver
```typescript
getData: async (obj, args, context: ContextType, info) => {
  checkAuth(context.user)
  const [row] = await queries.getData.run({ id: args.input.id }, pg)
  return row
}
```

### Transaction
```typescript
const result = await pgTx(async (pgClient) => {
  await queries.a.run({ ... }, pgClient)
  await queries.b.run({ ... }, pgClient)
})
```

### Pagination (limit+1 trick)
```typescript
const rows = await queries.list.run({ limit: limit + 1, offset }, pg)
const haveMore = rows.length > limit
return { haveMore, items: rows.slice(0, limit) }
```
