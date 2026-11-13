import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { appName, cloudUrl, lightUrl, mainRepo } from '@/lib/shared';

/** The sections, centred in the header. None is ever drawn as selected: Playground leads to another site. */
const sections = [
  { text: 'Docs', to: '/docs' },
  { text: 'Playground', href: lightUrl },
  { text: 'Embed', to: '/docs/light' },
];

/**
 * The site's header, one row of three columns: the brand, the sections, then search, GitHub and Sign in.
 *
 * `float` is the landing page's bar, lifted off the edge and rounded; it turns back into the full-width bar below
 * 760px. `start` holds an extra control before the brand, such as the docs' menu button on a phone.
 */
export function SiteHeader({ float = false, start }: { float?: boolean; start?: ReactNode }) {
  return (
    <header className={float ? 'yk-header yk-header--float' : 'yk-header'}>
      <div className="flex min-w-0 items-center gap-1">
        {start}
        <Link to="/" className="yk-header__brand">
          <img src="/logo.svg" alt="" width={24} height={24} />
          {appName}
        </Link>
      </div>
      <nav aria-label="Sections">
        {sections.map((s) =>
          s.to ? (
            <Link key={s.text} to={s.to}>
              {s.text}
            </Link>
          ) : (
            <a key={s.text} href={s.href}>
              {s.text}
            </a>
          ),
        )}
      </nav>
      <div className="yk-header__end">
        <SearchButton />
        <a className="yk-icon-btn" href={mainRepo} aria-label="Yukibana on GitHub">
          <GitHubMark />
        </a>
        <a className="yk-btn yk-btn--secondary" href={cloudUrl}>
          Sign in
        </a>
      </div>
    </header>
  );
}

/** Looks like a field, opens the search dialog; Ctrl K (⌘K on a Mac) opens it too. */
function SearchButton() {
  const { setOpenSearch, enabled } = useSearchContext();
  if (!enabled) return null;
  return (
    <button type="button" className="yk-search" onClick={() => setOpenSearch(true)}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      Search
      <kbd>Ctrl K</kbd>
    </button>
  );
}

/** GitHub's mark, filled, as GitHub draws it. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}
