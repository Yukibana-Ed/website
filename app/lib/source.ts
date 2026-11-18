import { llms, loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { ykShikiTheme } from './shiki-theme';
import { docsRoute } from './shared';

/**
 * A code block in the language `npm` becomes one tab per package manager, and the choice is remembered across pages.
 * The commands are written for npm and rewritten here for the others; a command this does not know fails the build
 * rather than showing a pnpm or Yarn tab that would not work.
 */
function asPackageManager(manager: 'pnpm' | 'yarn') {
  return (commands: string) =>
    commands
      .split('\n')
      .map((line) => {
        if (line.trim() === '' || !/^(npm|npx) /.test(line)) return line;
        const global = /^npm (?:install|i) (?:--global|-g) (.+)$/.exec(line);
        if (global) return manager === 'pnpm' ? `pnpm add --global ${global[1]}` : `yarn global add ${global[1]}`;
        const removal = /^npm (?:uninstall|rm) (?:--global|-g) (.+)$/.exec(line);
        if (removal)
          return manager === 'pnpm' ? `pnpm remove --global ${removal[1]}` : `yarn global remove ${removal[1]}`;
        const once = /^npx (.+)$/.exec(line);
        if (once) return `${manager} dlx ${once[1]}`;
        throw new Error(`No ${manager} equivalent of \`${line}\` in an npm code block: add one in app/lib/source.ts.`);
      })
      .join('\n');
}

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    mdxOptions: applyMdxPreset({
      rehypeCodeOptions: { themes: { light: ykShikiTheme, dark: ykShikiTheme } },
      remarkNpmOptions: {
        persist: { id: 'package-manager' },
        packageManagers: [
          { name: 'npm', command: (commands) => commands },
          { name: 'pnpm', command: asPackageManager('pnpm') },
          { name: 'yarn', command: asPackageManager('yarn') },
        ],
      },
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
