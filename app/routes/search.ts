import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

const server = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

// Prerendered once at build time: the browser downloads the index and searches
// it locally (`type: 'static'` in root.tsx), so the Worker never runs code.
export async function loader() {
  return server.staticGET();
}
