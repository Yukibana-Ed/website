import { useSyncExternalStore } from 'react';
import { installerFor, type InstallerKind } from './ide-release';

declare global {
  interface Navigator {
    /** Chromium-based browsers only. */
    readonly userAgentData?: { getHighEntropyValues(hints: readonly string[]): Promise<{ architecture?: string }> };
  }
}

/** This computer's installer once read, and whether it has been: the architecture comes later, and only from Chromium. */
let detected: InstallerKind | undefined;
let read = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot(): InstallerKind | undefined {
  if (read) return detected;
  read = true;
  const browser = { userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints };
  detected = installerFor({ ...browser, architecture: undefined });
  // Without an answer the guess stands (Apple silicon on a Mac), which is what Safari and Firefox get anyway.
  navigator.userAgentData?.getHighEntropyValues(['architecture']).then(
    ({ architecture }) => {
      detected = installerFor({ ...browser, architecture });
      for (const listener of listeners) listener();
    },
    (error: unknown) => console.warn('The browser did not say its architecture:', error),
  );
  return detected;
}

/**
 * The installer that suits this computer ({@link installerFor}), or undefined where none does (a phone, a tablet) and
 * while the page is prerendered and hydrated, since the prerendered page cannot know.
 */
export function useDetectedInstaller(): InstallerKind | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}
