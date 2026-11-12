import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Yukibana';
export const siteUrl = 'https://yukibana.dev';
export const cloudUrl = 'https://cloud.yukibana.dev';
export const lightUrl = 'https://light.yukibana.dev';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Where this site's own sources live, for "edit on GitHub". */
export const gitConfig = {
  user: 'Yukibana-Ed',
  repo: 'website',
  branch: 'main',
};

/** The IDE, the cloud and the CLI. */
export const mainRepo = 'https://github.com/Yukibana-Ed/Yukibana';
export const releasesUrl = `${mainRepo}/releases/latest`;

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.webp'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
