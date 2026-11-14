import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { ideReleaseOf, releasesApiUrl } from './app/lib/ide-release.ts';

/**
 * `virtual:ide-release`: the newest IDE release, resolved from GitHub when a build or `pnpm dev` first imports it (not
 * when the config is merely loaded, as `react-router typegen` does) and written into every page, so that the download
 * buttons work without JavaScript. A page looks again when it opens (app/lib/use-ide-release.ts), so a release made
 * after the deploy is offered too. GITHUB_TOKEN, which CI sets, lifts the API's limit of 60 requests an hour that a
 * shared runner's address can have spent. A build that cannot resolve the release fails, rather than ship download
 * buttons that go nowhere.
 */
function ideRelease(): Plugin {
  const id = 'virtual:ide-release';
  let json: Promise<string> | undefined;
  const resolve = async () => {
    const token = process.env['GITHUB_TOKEN'];
    const response = await fetch(releasesApiUrl, {
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!response.ok) {
      throw new Error(`GitHub answered ${response.status} to ${releasesApiUrl}: ${await response.text()}`);
    }
    return JSON.stringify(ideReleaseOf(await response.json()));
  };
  return {
    name: 'ide-release',
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load: async (resolved) => (resolved === `\0${id}` ? `export default ${await (json ??= resolve())};` : undefined),
  };
}

export default defineConfig({
  plugins: [ideRelease(), fumadocsMdx(), tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
