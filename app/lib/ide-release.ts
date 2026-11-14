/**
 * The IDE's installers: which files the newest IDE release on GitHub offers, and which of them suits the visitor.
 *
 * Pure functions of the GitHub API's answer, which the build reads once (`vite.config.ts`), and of the browser's
 * description of itself (`detect-installer.ts`).
 */

/** The repository whose GitHub releases carry the IDE, as the IDE's own updater names it. */
export const releasesRepository = 'Yukibana-Ed/Yukibana';

/** An IDE release's tag is this prefix and its version, `ide-v1.2.3`; the repository's other tags are not the IDE. */
export const ideTagPrefix = 'ide-v';

/** Each installer a release carries, one per kind of machine and package. */
export type InstallerKind = 'windows' | 'mac-arm64' | 'mac-x64' | 'linux-appimage' | 'linux-deb';

/** What the site says about an installer kind, and how its file is recognised among a release's assets. */
export interface InstallerInfo {
  /** The operating system as a visitor knows it, for "Download for …". */
  readonly osLabel: string;
  /** The machine or package within that system, such as "Apple silicon" or ".deb". */
  readonly variant: string;
  /**
   * The asset's name, after the version is taken out. The names come from `ide/electron/electron-builder.yml` in the
   * Yukibana repository; a rename there must be followed here, or the build fails (see {@link ideReleaseOf}).
   */
  readonly file: (version: string) => string;
}

/** Every installer kind, in the order the site lists them. */
export const installers: Readonly<Record<InstallerKind, InstallerInfo>> = {
  windows: { osLabel: 'Windows', variant: 'x64', file: (v) => `Yukibana-Setup-${v}.exe` },
  'mac-arm64': { osLabel: 'macOS', variant: 'Apple silicon', file: (v) => `Yukibana-${v}-arm64.dmg` },
  'mac-x64': { osLabel: 'macOS', variant: 'Intel', file: (v) => `Yukibana-${v}-x64.dmg` },
  'linux-appimage': {
    osLabel: 'Linux',
    variant: 'AppImage, x64',
    file: (v) => `Yukibana-${v}-x86_64.AppImage`,
  },
  'linux-deb': { osLabel: 'Linux', variant: '.deb, x64', file: (v) => `Yukibana-${v}-amd64.deb` },
};

/** The kinds in the order the site lists them. */
export const installerKinds = Object.keys(installers) as readonly InstallerKind[];

/** One installer file of a release. */
export interface Installer {
  readonly kind: InstallerKind;
  /** The file's name, which carries the version: `Yukibana-Setup-0.3.0.exe`. */
  readonly name: string;
  /** A direct download: GitHub answers it with the file itself, as an attachment, so the page stays where it is. */
  readonly url: string;
  /** In bytes. */
  readonly size: number;
}

/** The newest IDE release, with every installer {@link installers} lists. */
export interface IdeRelease {
  /** `X.Y.Z`, without the tag's prefix. */
  readonly version: string;
  /** The release's page on GitHub, with its notes and every file. */
  readonly url: string;
  readonly installers: Readonly<Record<InstallerKind, Installer>>;
}

const version = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * The newest IDE release in `releases`, the body of GitHub's `GET /repos/{owner}/{repo}/releases` (newest first).
 * Drafts and pre-releases are skipped, and so is every tag that is not `ide-vX.Y.Z`.
 *
 * Throws, naming what is missing, when there is no such release or it lacks one of the {@link installers}: the release
 * workflow publishes a release only once every installer is attached, so either means this site no longer knows the
 * files' names.
 */
export function ideReleaseOf(releases: unknown): IdeRelease {
  if (!Array.isArray(releases)) {
    throw new Error(`GitHub's list of releases of ${releasesRepository} is not a list.`);
  }
  for (const release of releases) {
    if (!isRecord(release) || release['draft'] === true || release['prerelease'] === true) continue;
    const tag = release['tag_name'];
    if (typeof tag !== 'string' || !tag.startsWith(ideTagPrefix)) continue;
    const v = tag.slice(ideTagPrefix.length);
    if (!version.test(v)) continue;

    const assets = Array.isArray(release['assets']) ? release['assets'].filter(isRecord) : [];
    const found: Partial<Record<InstallerKind, Installer>> = {};
    const missing: string[] = [];
    for (const kind of installerKinds) {
      const name = installers[kind].file(v);
      const asset = assets.find((a) => a['name'] === name);
      const url = asset?.['browser_download_url'];
      const size = asset?.['size'];
      if (typeof url === 'string' && typeof size === 'number') found[kind] = { kind, name, url, size };
      else missing.push(name);
    }
    if (missing.length > 0) {
      throw new Error(`The IDE release ${tag} of ${releasesRepository} has no ${missing.join(', ')}.`);
    }
    return {
      version: v,
      url: `https://github.com/${releasesRepository}/releases/tag/${tag}`,
      installers: found as Record<InstallerKind, Installer>,
    };
  }
  throw new Error(`${releasesRepository} has no published IDE release (a tag ${ideTagPrefix}X.Y.Z).`);
}

/** GitHub's API URL of the repository's newest releases, enough to find the newest IDE release among them. */
export const releasesApiUrl = `https://api.github.com/repos/${releasesRepository}/releases?per_page=20`;

/** What {@link installerFor} reads from `navigator`. */
export interface BrowserDescription {
  readonly userAgent: string;
  /** `navigator.maxTouchPoints`: an iPad describes itself as a Mac, and is told apart by its touch screen. */
  readonly maxTouchPoints: number;
  /**
   * The CPU's architecture from `navigator.userAgentData`, `arm` or `x86`; undefined where the browser does not say,
   * which is every browser but Chromium-based ones.
   */
  readonly architecture: string | undefined;
}

/**
 * The installer to offer first to the browser `browser` describes, or undefined on a phone, a tablet or a system
 * Yukibana is not built for (Linux on ARM). A Mac is offered the Apple silicon build unless its browser says it is an
 * Intel Mac: only Chromium tells, Safari and Firefox report every Mac as Intel, and most Macs in use are Apple silicon.
 * Linux is offered the AppImage, which runs on any distribution.
 */
export function installerFor(browser: BrowserDescription): InstallerKind | undefined {
  const ua = browser.userAgent;
  if (/Android|iPhone|iPad|iPod|CrOS/i.test(ua)) return undefined;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(ua)) {
    if (browser.maxTouchPoints > 1) return undefined;
    return browser.architecture === 'x86' ? 'mac-x64' : 'mac-arm64';
  }
  if (/aarch64|arm/i.test(ua)) return undefined;
  if (/Linux|X11/i.test(ua)) return 'linux-appimage';
  return undefined;
}

/** `bytes` as a person reads a download's size: "334 MB". */
export function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1_000_000)} MB`;
}
