import { useEffect, useState, useSyncExternalStore } from 'react';
import built from 'virtual:ide-release';
import { ideReleaseOf, installerFor, releasesApiUrl, type IdeRelease, type InstallerKind } from './ide-release';

let current: Promise<IdeRelease | undefined> | undefined;

/**
 * The newest IDE release: the one of the build at first, so that the prerendered page and its first render agree, then
 * the newest GitHub has, so that a release made after the site was deployed is offered without a deploy. GitHub is
 * asked once per page load, whichever components ask. When it cannot answer (offline, its limit of 60 requests an hour
 * spent), the build's release stays, which is a release that was the newest a deploy ago, and the console says so.
 */
export function useIdeRelease(): IdeRelease {
  const [release, setRelease] = useState(built);
  useEffect(() => {
    current ??= fetch(releasesApiUrl, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub answered ${r.status}`))))
      .then(ideReleaseOf)
      .catch((error: unknown) => {
        console.warn('Offering the IDE release of the build, since the newest could not be read:', error);
        return undefined;
      });
    let live = true;
    void current.then((newest) => {
      if (live && newest && newest.version !== built.version) setRelease(newest);
    });
    return () => {
      live = false;
    };
  }, []);
  return release;
}

interface UserAgentData {
  getHighEntropyValues(hints: readonly string[]): Promise<{ architecture?: string }>;
}

/** This computer's installer, once read: the architecture comes later, and only from Chromium. */
let detected: InstallerKind | undefined | null = null;
const listeners = new Set<() => void>();

function detect(): InstallerKind | undefined {
  const browser = { userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints };
  const data = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
  data?.getHighEntropyValues(['architecture']).then(
    ({ architecture }) => {
      detected = installerFor({ ...browser, architecture });
      for (const listener of listeners) listener();
    },
    () => {},
  );
  return installerFor(browser);
}

/**
 * The installer that suits this computer ({@link installerFor}): `null` while the page is prerendered and hydrated,
 * since the prerendered page cannot know, and `undefined` once it is known that none does (a phone, a tablet).
 */
export function useDetectedInstaller(): InstallerKind | undefined | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => {
      if (detected === null) detected = detect();
      return detected;
    },
    () => null,
  );
}
