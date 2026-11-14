import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { THEMES, chooseTheme, readTheme, type Theme } from '@yukibana/design/theme';
import { cn } from '@/lib/cn';

const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON: Record<Theme, LucideIcon> = { system: Monitor, light: Sun, dark: Moon };

/** The choice, as a store React reads, so that every mounted switch (the sidebar's and the mobile drawer's) shows it: on
 *  the server, and in the render that hydrates, nothing is chosen yet, so the server's HTML and that render agree; then
 *  the shown choice. A choice made here tells the readers. */
const readers = new Set<() => void>();
const subscribe = (reader: () => void) => {
  readers.add(reader);
  return () => void readers.delete(reader);
};
const nothingYet = (): null => null;

/**
 * The theme switch in the docs' sidebar: Fumadocs' tray of icon buttons, offering System, Light and Dark as the cloud's
 * account menu does. The choice is the design system's (@yukibana/design/theme), shared with the cloud. Requires: the
 * boot script in root.tsx ran, which showed the choice before the page painted; this only reads it back.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, nothingYet);

  function choose(next: Theme) {
    chooseTheme(next);
    readers.forEach((read) => read());
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
