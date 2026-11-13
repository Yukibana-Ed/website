import { useSyncExternalStore } from 'react';

/** One choice in a review switcher: its id (the address carries it) and its name. */
export type Variant<Id extends string> = { id: Id; name: string };

/**
 * A choice between design variants, for review: the landing hero (hero/hero-switcher.tsx) and the docs' header and
 * navigation (docs-variants/). The choice lives in the address (`?<param>=`) and in this browser's storage; this is a
 * small store over the two, read with useSyncExternalStore. Pages are prerendered, so they hydrate with the server's
 * answer (`fallback`, no switcher) and React then renders the browser's.
 *
 * The switcher shows in development, and anywhere the address has the parameter. Without it (a production build with no
 * parameter), the choice is always `fallback`.
 */
export function createVariantStore<Id extends string>({
  param,
  storageKey,
  variants,
  fallback,
}: {
  param: string;
  storageKey: string;
  variants: readonly Variant<Id>[];
  fallback: Id;
}) {
  const listeners = new Set<() => void>();

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function isId(value: unknown): value is Id {
    return variants.some((v) => v.id === value);
  }

  function paramValue() {
    return new URLSearchParams(window.location.search).get(param);
  }

  function switcherShown() {
    return import.meta.env.DEV || paramValue() !== null;
  }

  /** The parameter first, then, where the switcher shows, the last choice saved here; otherwise `fallback`. */
  function currentId(): Id {
    const value = paramValue();
    if (isId(value)) return value;
    if (switcherShown()) {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (isId(saved)) return saved;
      } catch {
        // Storage can be blocked; the parameter alone then carries the choice.
      }
    }
    return fallback;
  }

  /** Shows `id` at once, and remembers it in this browser and in the address, with no navigation or scrolling. */
  function choose(id: Id) {
    try {
      window.localStorage.setItem(storageKey, id);
    } catch {
      // As above.
    }
    const url = new URL(window.location.href);
    url.searchParams.set(param, id);
    // React Router keeps its own entry state in history.state; it is passed on unchanged.
    window.history.replaceState(window.history.state, '', url);
    for (const listener of listeners) listener();
  }

  /** The current choice, and whether to show the switcher. */
  function useVariant() {
    const id = useSyncExternalStore(subscribe, currentId, () => fallback);
    const switcher = useSyncExternalStore(subscribe, switcherShown, () => false);
    return { id, switcher, choose };
  }

  return { useVariant, isId };
}

/**
 * The review switcher: a small segmented control floating at the bottom right, "<label>: <name>" and one button per
 * variant, labelled with its id. `stack` lifts it above the switchers below it, where a page shows more than one.
 */
export function VariantSwitcher<Id extends string>({
  label,
  variants,
  current,
  onChoose,
  stack = 0,
}: {
  label: string;
  variants: readonly Variant<Id>[];
  current: Id;
  onChoose: (id: Id) => void;
  stack?: number;
}) {
  const name = variants.find((v) => v.id === current)?.name;
  return (
    <div
      role="group"
      aria-label={`${label} variant`}
      style={{ bottom: `calc(1rem + ${stack} * 3rem)` }}
      className="fixed right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-(--yk-radius-lg) border border-(--yk-line) bg-(--yk-surface) p-1 pl-3 text-(length:--yk-font-size-sm)"
    >
      <span className="truncate text-(--yk-soft) max-[479.98px]:hidden">
        {label}: <span className="text-(--yk-ink)">{name}</span>
      </span>
      <div className="flex flex-none flex-wrap justify-end gap-0.5 rounded-[10px] bg-(--yk-sunken) p-[3px]">
        {variants.map((v) => (
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
