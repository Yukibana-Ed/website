import { useSyncExternalStore } from 'react';
import { heroVariants, isHeroId, type HeroId } from './variants';

const storageKey = 'yk-landing-hero';

/*
 * The choice lives in the address (`?hero=`) and in this browser's storage; this is a small store over the two, read
 * with useSyncExternalStore. The page is prerendered, so it hydrates with the server's answer (the first variant, no
 * switcher) and React then renders the browser's.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function heroParam() {
  return new URLSearchParams(window.location.search).get('hero');
}

/** The switcher shows in development, and anywhere the address has `?hero=`. */
function switcherShown() {
  return import.meta.env.DEV || heroParam() !== null;
}

/** The parameter first, then, where the switcher shows, the last choice saved here; otherwise the first variant. */
function currentId(): HeroId {
  const param = heroParam();
  if (isHeroId(param)) return param;
  if (switcherShown()) {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isHeroId(saved)) return saved;
    } catch {
      // Storage can be blocked; the parameter alone then carries the choice.
    }
  }
  return 'a';
}

/** Shows `id` at once, and remembers it in this browser and in the address, with no navigation or scrolling. */
function choose(id: HeroId) {
  try {
    window.localStorage.setItem(storageKey, id);
  } catch {
    // As above.
  }
  const url = new URL(window.location.href);
  url.searchParams.set('hero', id);
  // React Router keeps its own entry state in history.state; it is passed on unchanged.
  window.history.replaceState(window.history.state, '', url);
  for (const listener of listeners) listener();
}

/**
 * Which hero the landing page shows, and whether to show the switcher. Without the switcher (a production build with
 * no `?hero=`), it is always the first variant.
 */
export function useHeroVariant() {
  const id = useSyncExternalStore(subscribe, currentId, () => 'a' as const);
  const switcher = useSyncExternalStore(subscribe, switcherShown, () => false);
  return { id, switcher, choose };
}

/** The review switcher: a small segmented control floating at the bottom right, one letter per variant. */
export function HeroSwitcher({ current, onChoose }: { current: HeroId; onChoose: (id: HeroId) => void }) {
  const name = heroVariants.find((v) => v.id === current)?.name;
  return (
    <div
      role="group"
      aria-label="Hero variant"
      className="fixed right-4 bottom-4 z-20 flex items-center gap-2 rounded-(--yk-radius-lg) border border-(--yk-line) bg-(--yk-surface) p-1 pl-3 text-(length:--yk-font-size-sm)"
    >
      <span className="text-(--yk-soft) max-[479.98px]:hidden">
        Hero: <span className="text-(--yk-ink)">{name}</span>
      </span>
      <div className="flex gap-0.5 rounded-[10px] bg-(--yk-sunken) p-[3px]">
        {heroVariants.map((v) => (
          <button
            key={v.id}
            type="button"
            title={v.name}
            aria-label={v.name}
            aria-pressed={v.id === current}
            onClick={() => onChoose(v.id)}
            className="min-w-7 cursor-pointer rounded-[7px] px-2 py-0.5 text-(--yk-soft) uppercase transition-colors duration-(--yk-motion-fast) hover:text-(--yk-ink) aria-pressed:bg-(--yk-surface) aria-pressed:font-(--yk-font-weight-bold) aria-pressed:text-(--yk-ink)"
          >
            {v.id}
          </button>
        ))}
      </div>
    </div>
  );
}
