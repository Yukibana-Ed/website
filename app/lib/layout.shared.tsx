import type { ComponentProps, CSSProperties } from 'react';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { Container } from 'fumadocs-ui/layouts/docs/slots/container';
import { SiteHeader } from '@/components/site-header';

/** The site header's height in the docs, which the sidebar and the table of contents stick below. */
const headerHeight = '49px';

/**
 * Fumadocs' docs layout with the site header across the full width on top, instead of its own header (which it only
 * shows on a phone). The brand, search and links live in that header, so the sidebar holds only the pages and the
 * theme switch.
 */
export function docsOptions(): Omit<DocsLayoutProps, 'tree'> {
  return {
    searchToggle: { enabled: false },
    sidebar: { collapsible: false },
    slots: {
      navTitle: () => null,
      header: DocsHeader,
      container: DocsContainer,
    },
  };
}

/** The site header, with the button that opens the sidebar's drawer where the sidebar is hidden. */
function DocsHeader() {
  const { slots } = useDocsLayout();
  const Trigger = slots.sidebar.trigger;
  return (
    <div className="sticky top-0 z-30 [grid-area:header]">
      <SiteHeader
        start={
          <Trigger className="yk-icon-btn md:hidden" aria-label="Pages">
            <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Trigger>
        }
      />
    </div>
  );
}

/**
 * Fumadocs' grid, with the header's row spanning every column. The outer columns, beyond the reading width, are the
 * rails that carry the lattice (see app.css).
 */
function DocsContainer(props: ComponentProps<'div'>) {
  const style = {
    gridTemplate: `"header header header header header"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar tabs toc toc"
"sidebar sidebar main toc toc" 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) minmax(min-content, 1fr)`,
    '--fd-layout-width': '84rem',
    '--fd-docs-row-1': headerHeight,
    '--fd-docs-row-2': headerHeight,
    '--fd-docs-row-3': `calc(${headerHeight} + var(--fd-toc-popover-height))`,
    ...props.style,
  } as CSSProperties;
  return <Container {...props} style={style} />;
}
