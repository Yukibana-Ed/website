import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { THEMES, applyTheme, readTheme, writeTheme, type Theme } from '@yukibana/design/theme';
import { cn } from '@/lib/cn';

/** Where next-themes kept the choice before the shared cookie; the first page that finds one there moves it over. */
export const LEGACY_THEME_KEY = 'theme';

const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON: Record<Theme, LucideIcon> = { system: Monitor, light: Sun, dark: Moon };

/** The cookie, as a store React reads: on the server, and in the render that hydrates, nothing is chosen yet, so the
 *  server's HTML and that render agree; then the cookie. A choice made here tells the readers. */
const readers = new Set<() => void>();
const subscribe = (reader: () => void) => {
  readers.add(reader);
  return () => void readers.delete(reader);
};
const chosen = (): Theme => readTheme({ legacyKey: LEGACY_THEME_KEY });
const nothingYet = (): null => null;

/**
 * The theme switch in the docs' sidebar: Fumadocs' tray of icon buttons, offering System, Light and Dark as the cloud's
 * account menu does. The choice is the design system's (@yukibana/design/theme), one cookie shared by every site under
 * yukibana.dev; the boot script in root.tsx applied it before the page painted, and this only reads it back.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, chosen, nothingYet);

  function choose(next: Theme) {
    const change = () => {
      writeTheme(next);
      applyTheme(next);
      flushSync(() => readers.forEach((read) => read()));
    };
    if (document.startViewTransition) document.startViewTransition(change);
    else change();
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      data-theme-toggle=""
      className={cn('inline-flex items-center rounded-full border p-1 overflow-hidden *:rounded-full', className)}
    >
      {THEMES.map((t) => {
        const Icon = ICON[t];
        return (
          <button
            key={t}
            type="button"
            aria-label={LABEL[t]}
            title={LABEL[t]}
            aria-pressed={theme === t}
            className={cn(
              'size-6.5 p-1.5',
              theme === t ? 'bg-fd-accent text-fd-accent-foreground' : 'text-fd-muted-foreground',
            )}
            onClick={() => choose(t)}
          >
            <Icon className="size-full" fill="currentColor" />
          </button>
        );
      })}
    </div>
  );
}
