# yukibana.dev

The documentation website of [Yukibana](https://github.com/Yukibana-Ed/Yukibana), an IDE for education.

It is [Fumadocs](https://fumadocs.dev/) on React Router and Vite, prerendered to static files at build time and served
by a Cloudflare Worker (static assets only, no code per request), like the cloud at `cloud.yukibana.dev`.

## Develop

Needs Node.js 24 and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:5173
```

Pages are MDX in `content/docs/`. Each folder's `meta.json` orders its pages, and `content/docs/meta.json` the sidebar.
The landing page is `app/routes/home.tsx`.

The look is Yukibana's design system (see [Design system](#design-system)); `app/app.css` maps Fumadocs' colours
onto it.

|                                                    |                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                                         | The site with hot reload.                                                             |
| `pnpm build`                                       | Prerender every page, the search index, OG images and `llms.txt` into `build/client`. |
| `pnpm preview`                                     | Build, then serve `build/client` exactly as production does (`wrangler dev`).         |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check` | oxlint, TypeScript, oxfmt.                                                            |

## Design system

The tokens, the shared component styles and the fonts come from `@yukibana/design`, which lives in the
[Yukibana repository](https://github.com/Yukibana-Ed/Yukibana) in `packages/design`. It is a git dependency pinned to
one commit of that repository's `main` branch (`package.json`), and `app/app.css` imports its `tokens.css`,
`fonts.css` and `base.css`. The fonts are self-hosted: Vite bundles the package's woff2 files with the site.

To take a newer version of the design:

1. Change the commit after `#` in the `@yukibana/design` entry of `package.json` to the new one.
2. Run `pnpm install`, which updates `pnpm-lock.yaml`.
3. Check the site with `pnpm dev` (the landing page and a docs page, light and dark) and run `pnpm typecheck`,
   `pnpm lint` and `pnpm build`.
4. Commit `package.json` and `pnpm-lock.yaml` together.

## JSON Schemas of yukibana.json

The site serves the JSON Schema of every version of `yukibana.json` and `yukibana.release.json` at
`https://yukibana.dev/schema/<file>/v<N>.json` (`https://yukibana.dev/schema/yukibana/v1.json` is the `$schema` of a
version 1 file). They are generated in the Yukibana repository, in `packages/project-schema/schemas/`, and
`scripts/schemas.mts` fetches them, during `pnpm build`, from the one commit of that repository named by its `COMMIT`.
A released version is served as immutable, an unreleased one with a five-minute cache, and all of them to any origin
(`_headers`).

To publish a new version, or a version's release:

1. Change `COMMIT` in `scripts/schemas.mts` to the commit of the Yukibana repository's `main` that has it.
2. Run `pnpm build` and look at what it prints: every schema it fetched.
3. Commit, and let CI deploy it.

## Deploy

CI (`.github/workflows/ci.yml`, GitHub Actions) checks and builds every change. A push to `main` deploys with
`wrangler deploy`, which also keeps the custom domains `yukibana.dev` and `www.yukibana.dev` attached
(`wrangler.jsonc`). A pull request from a branch of this repository is uploaded as a preview at
`pr-<n>-yukibana-website.<subdomain>.workers.dev`.

The repository needs one Actions secret, `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with Account > Workers
Scripts: Edit, and Zone > Workers Routes: Edit on `yukibana.dev`. The account ID is in `wrangler.jsonc`.

By hand: `pnpm run deploy` (after `pnpm exec wrangler login`).
