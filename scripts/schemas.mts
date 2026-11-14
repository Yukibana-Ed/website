// After `react-router build`: puts the JSON Schema of every version of yukibana.json and yukibana.release.json at
// https://yukibana.dev/schema/<file>/v<N>.json, the URL a file of that version names as `$schema`. They are generated
// in the Yukibana repository (packages/project-schema/schemas/), and fetched here from one pinned commit of it, so
// what the site serves changes only when `COMMIT` does, in a reviewed change, and only CI deploys it.
//
// A released version (`"released": true` in the package's schemas/index.json) is served as immutable: files name it
// forever and it never changes. An unreleased one may still change, so it is cached for minutes. Every schema is
// readable from any origin, since editors and the IDE fetch it from wherever they run.
import { mkdir, readFile, writeFile } from 'node:fs/promises';

/** The commit of Yukibana-Ed/Yukibana whose packages/project-schema/schemas/ the site serves. Move it to a commit of
 *  `main` to publish a new version, or a version's release; see README.md. */
export const COMMIT = '378d5c45a9b189d1c553e5a70c2d896a0843c3b2';

/** Where the files of `COMMIT` are fetched from. */
const SOURCE = `https://raw.githubusercontent.com/Yukibana-Ed/Yukibana/${COMMIT}/packages/project-schema/schemas/`;

/** Where the site serves them, and so what each file's `$id` must be. */
const BASE = 'https://yukibana.dev/schema/';

/** One entry of the package's schemas/index.json. */
interface Entry {
  /** The file's path under schemas/ and under `BASE`: `yukibana/v1.json`. */
  readonly path: string;
  /** `true` iff the version is released: the file never changes again. */
  readonly released: boolean;
}

/** Returns `value`, the parsed schemas/index.json, as its entries, or throws naming what is wrong. A path must be
 *  `<name>/v<N>.json`, so nothing in the index can write outside build/client/schema/. */
export function entriesOf(value: unknown): readonly Entry[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('schemas/index.json must be a non-empty list');
  return value.map((entry: unknown, i): Entry => {
    if (typeof entry !== 'object' || entry === null) throw new Error(`schemas/index.json[${i}] must be an object`);
    const { path, released } = entry as Record<string, unknown>;
    if (typeof path !== 'string' || !/^[a-z][a-z-]*\/v[1-9][0-9]*\.json$/.test(path))
      throw new Error(`schemas/index.json[${i}].path must be <name>/v<N>.json, not ${JSON.stringify(path)}`);
    if (typeof released !== 'boolean') throw new Error(`schemas/index.json[${i}].released must be true or false`);
    return { path, released };
  });
}

/** Returns the rules of Workers static assets' `_headers` file for `entries`. Cache-Control is set per file, never
 *  on the wildcard, because the headers of every rule that matches a path are joined. */
export function headersFor(entries: readonly Entry[]): string {
  const rules = ['/schema/*', '  Access-Control-Allow-Origin: *'];
  for (const { path, released } of entries)
    rules.push(
      `/schema/${path}`,
      `  Cache-Control: ${released ? 'public, max-age=31536000, immutable' : 'public, max-age=300'}`,
    );
  return rules.join('\n') + '\n';
}

/** Returns the text at `url`, or throws naming it and the status. */
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} answered ${response.status}`);
  return response.text();
}

/** Fetches every schema of `COMMIT` into `client`, the build's output, and adds their headers to its `_headers`. */
export async function publishSchemas(client: URL): Promise<void> {
  const entries = entriesOf(JSON.parse(await fetchText(`${SOURCE}index.json`)));
  for (const { path } of entries) {
    const text = await fetchText(SOURCE + path);
    const id = (JSON.parse(text) as { $id?: unknown }).$id;
    // The file says where it lives; serving it anywhere else would make every file that names it check against nothing.
    if (id !== BASE + path)
      throw new Error(`schemas/${path} has $id ${JSON.stringify(id)}, but is served at ${BASE + path}`);
    const at = new URL(`schema/${path}`, client);
    await mkdir(new URL('.', at), { recursive: true });
    await writeFile(at, text);
  }
  const headers = new URL('_headers', client);
  const existing = await readFile(headers, 'utf8').catch(() => '');
  await writeFile(headers, existing + headersFor(entries));
  console.log(`Schemas of Yukibana-Ed/Yukibana@${COMMIT.slice(0, 7)}: ${entries.map((e) => e.path).join(', ')}`);
}
