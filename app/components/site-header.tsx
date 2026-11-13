import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from 'react';
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
 * 760px, where the sections and search move into the site menu at the end. `start` holds an extra control before the
 * brand, such as the docs' menu button on a phone.
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
        <SiteMenu />
      </div>
    </header>
  );
}

/** Looks like a field, opens the search dialog; Ctrl K (⌘K on a Mac) opens it too. */
function SearchButton() {
  const { setOpenSearch, enabled } = useSearchContext();
  const shortcut = useSearchShortcut();
  if (!enabled) return null;
  return (
    <button type="button" className="yk-search" onClick={() => setOpenSearch(true)}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      Search
      <kbd>{shortcut}</kbd>
    </button>
  );
}

/**
 * The search shortcut as this computer writes it: ⌘K on Apple's platforms, Ctrl K elsewhere. The server cannot know,
 * so it renders Ctrl K, React hydrates with that, then re-renders with the client's label: no mismatch. Fumadocs takes either key.
 */
function useSearchShortcut() {
  return useSyncExternalStore(subscribeNever, clientShortcut, () => 'Ctrl K');
}
const subscribeNever = () => () => {};
function clientShortcut() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || '';
  return /mac|iphone|ipad|ipod/i.test(platform) ? '⌘K' : 'Ctrl K';
}

/**
 * The site menu, below 760px only, where the header has no room for the sections and the search box: an icon button at
 * the end of the header that opens the sections and Search. It is a native popover, so Escape and a click outside close
 * it and the browser puts focus back on the button; choosing an item closes it too. It drops down from the header's
 * bottom edge, measured as it opens, at the window's right gutter.
 */
function SiteMenu() {
  const { setOpenSearch, enabled } = useSearchContext();
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const place = (e: Event) => {
      if ((e as ToggleEvent).newState !== 'open') return;
      const header = button.current?.closest('.yk-header');
      const bottom = (header ?? button.current)?.getBoundingClientRect().bottom ?? 0;
      el.style.top = `${Math.round(bottom) + 6}px`;
    };
    el.addEventListener('beforetoggle', place);
    return () => el.removeEventListener('beforetoggle', place);
  }, []);
  const close = () => menu.current?.hidePopover();
  return (
    <>
      <button
        ref={button}
        type="button"
        className="yk-icon-btn yk-site-menu-btn"
        popoverTarget={id}
        aria-label="Menu"
        title="Menu"
      >
        <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </svg>
      </button>
      <div ref={menu} id={id} popover="auto" className="yk-site-menu">
        <nav aria-label="Site">
          {sections.map((s) =>
            s.to ? (
              <Link key={s.text} to={s.to} onClick={close}>
                {s.text}
              </Link>
            ) : (
              <a key={s.text} href={s.href} onClick={close}>
                {s.text}
              </a>
            ),
          )}
          {enabled && (
            <button
              type="button"
              onClick={() => {
                close();
                setOpenSearch(true);
              }}
            >
              <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              Search
            </button>
          )}
        </nav>
      </div>
    </>
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
