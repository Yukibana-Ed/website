import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, cloudUrl, lightUrl, mainRepo } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="/logo.svg" alt="" width={24} height={24} className="size-6" />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    links: [
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Cloud', url: cloudUrl, external: true },
      { text: 'Light', url: lightUrl, external: true },
    ],
    githubUrl: mainRepo,
  };
}
