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

|                                                    |                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                                         | The site with hot reload.                                                             |
| `pnpm build`                                       | Prerender every page, the search index, OG images and `llms.txt` into `build/client`. |
| `pnpm preview`                                     | Build, then serve `build/client` exactly as production does (`wrangler dev`).         |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check` | oxlint, TypeScript, oxfmt.                                                            |

## Deploy

[Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (the Cloudflare GitHub app,
connected to this repository on the `yukibana-website` Worker) builds every push with `pnpm build` and deploys it with
`npx wrangler deploy`. A push to `main` goes live at `yukibana.dev` and `www.yukibana.dev` (the custom domains in
`wrangler.jsonc`), and a push to any other branch is uploaded as a preview version with its own `workers.dev` URL.

GitHub Actions (`.github/workflows/ci.yml`) only checks: format, lint, typecheck and build.

By hand: `pnpm run deploy` (after `pnpm exec wrangler login`).
