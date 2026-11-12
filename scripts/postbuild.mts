// After `react-router build`: Workers static assets serve `404.html` for a path
// that matches no file (`not_found_handling: "404-page"` in wrangler.jsonc), but
// React Router prerenders /404 as 404/index.html. Copy it into place.
import { copyFile, rm } from 'node:fs/promises';

const client = new URL('../build/client/', import.meta.url);

await copyFile(new URL('404/index.html', client), new URL('404.html', client));
await rm(new URL('404/', client), { recursive: true });
// Nothing in build/server is deployed: the site is static.
await rm(new URL('../build/server/', import.meta.url), { recursive: true, force: true });
