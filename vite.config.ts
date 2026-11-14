import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';

export default defineConfig({
  plugins: [fumadocsMdx(), tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  // The design system ships its theme module as TypeScript, which Node will not run from node_modules: bundle it.
  ssr: { noExternal: ['@yukibana/design'] },
});
