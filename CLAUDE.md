## Commands

- `npm run dev` — develop; `npm run build` — production build.
- `npx eslint .` — lint; `npx tsc --noEmit` — type-check.

## Conventions

- Keep routes in `src/app`, feature logic in `src/features`, shared UI in `src/components`.
- Use strict TypeScript, `type` aliases, kebab-case filenames, and `@/` imports.
- Follow existing patterns and Prettier/ESLint rules; reuse shared UI.

## Never

- Commit secrets or `.env` files.
- Add `console.log`, circular imports, or unrelated changes.
