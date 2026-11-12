import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { getPageImageUrl, getPageMarkdownUrl } from './app/lib/shared';

const getUrl = createGetUrl('/docs');

// The site is fully static: every page, the search index, the OG images and
// the llms.txt files are rendered at build time into build/client, which the
// Worker serves as static assets (wrangler.jsonc). Nothing runs per request.
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths = new Set<string>(getStaticPaths());
    paths.add('/api/search');
    paths.add('/llms.txt');
    paths.add('/llms-full.txt');
    paths.add('/404');

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      // glob yields backslashes on Windows; slugs are URL segments.
      const slugs = getSlugs(entry.replaceAll('\\', '/'));
      paths.add(getUrl(slugs));
      paths.add(getPageImageUrl({ slugs }).url);
      paths.add(getPageMarkdownUrl({ slugs }).url);
    }

    return [...paths];
  },
} satisfies Config;
