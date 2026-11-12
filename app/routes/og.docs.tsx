import type { Route } from './+types/og.docs';
import { generateOGImage } from 'fumadocs-ui/og/takumi';
import { source } from '@/lib/source';

export function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*']
    .split('/')
    .filter((v) => v.length > 0)
    .slice(0, -1);
  const page = source.getPage(slugs);

  if (!page) throw new Response(undefined, { status: 404 });

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'yukibana.dev',
    format: 'webp',
  });
}
