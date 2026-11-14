import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Download, X } from 'lucide-react';
import { CodeBlock } from './code-block';
import {
  formatSize,
  installerKinds,
  installers,
  type IdeRelease,
  type Installer,
  type InstallerKind,
} from '@/lib/ide-release';
import { useDetectedInstaller, useIdeRelease } from '@/lib/use-ide-release';

/** The docs page with every installer and how to install each. */
export const installPage = '/docs/getting-started/install';

/**
 * A dialog with the steps to install one installer, which {@link DownloadLink} opens as its download starts, so that
 * the visitor reads them while the file arrives. The page behind it is dimmed; Escape, Close and a click outside it
 * close it.
 */
export function useInstallDialog(release: IdeRelease): { open: (kind: InstallerKind) => void; dialog: ReactNode } {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<InstallerKind>();
  const open = (k: InstallerKind) => {
    setKind(k);
    if (!ref.current?.open) ref.current?.showModal();
  };
  const installer = kind && release.installers[kind];
  const info = kind && installers[kind];
  const dialog = (
    <dialog
      ref={ref}
      className="yk-install-dialog"
      aria-labelledby="install-dialog-title"
      // A click on the backdrop lands on the dialog itself, never on its content.
      onClick={(event) => event.target === ref.current && ref.current.close()}
    >
      {installer && info && (
        <div className="p-6">
          <div className="mb-1 flex items-start justify-between gap-4">
            <h2 id="install-dialog-title" className="text-(length:--yk-font-size-xl)">
              Install Yukibana on {info.osLabel}
            </h2>
            <form method="dialog">
              <button className="yk-btn yk-btn--ghost -me-2 p-1.5" aria-label="Close">
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </form>
          </div>
          <p className="mb-4 text-sm text-(--yk-soft)">
            Your download of <code>{installer.name}</code> ({formatSize(installer.size)}) has started. If it has not,{' '}
            <a href={installer.url}>download it again</a>.
          </p>
          <InstallSteps kind={installer.kind} />
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            <Link to="/docs/getting-started/students" className="yk-btn yk-btn--secondary">
              Next: open your first exercise
            </Link>
            <form method="dialog">
              <button className="yk-btn yk-btn--primary">Close</button>
            </form>
          </div>
        </div>
      )}
    </dialog>
  );
  return { open, dialog };
}

/**
 * A direct download of `installer`: without JavaScript a plain link to the file, with it also the install dialog
 * (`onDownload`). The link is not prevented: GitHub answers it with the file as an attachment, so the page stays.
 */
export function DownloadLink({
  installer,
  onDownload,
  className,
  children,
}: {
  installer: Installer;
  onDownload: (kind: InstallerKind) => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <a href={installer.url} download className={className} onClick={() => onDownload(installer.kind)}>
      {children}
    </a>
  );
}

/**
 * Every installer of the newest release, each with its size, the one for this computer highlighted. For the
 * install page (`<Downloads />` in MDX).
 */
export function Downloads() {
  const release = useIdeRelease();
  const detected = useDetectedInstaller();
  const { open, dialog } = useInstallDialog(release);
  return (
    <div className="not-prose my-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {installerKinds.map((kind) => {
          const installer = release.installers[kind];
          const { osLabel, variant } = installers[kind];
          const mine = kind === detected;
          return (
            <div
              key={kind}
              className={`flex items-center justify-between gap-3 rounded-(--yk-radius-lg) border bg-(--yk-surface) p-4 ${mine ? 'border-(--yk-accent)' : 'border-(--yk-line)'}`}
            >
              <div className="min-w-0">
                <div className="font-semibold">
                  {osLabel} <span className="font-normal text-(--yk-soft)">· {variant}</span>
                </div>
                <div className="truncate text-sm text-(--yk-soft)">
                  {mine ? 'For this computer · ' : ''}
                  {formatSize(installer.size)}
                </div>
              </div>
              <DownloadLink
                installer={installer}
                onDownload={open}
                className={`yk-btn ${mine ? 'yk-btn--primary' : 'yk-btn--secondary'}`}
              >
                <Download className="size-4" strokeWidth={1.75} aria-hidden />
                Download
              </DownloadLink>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-(--yk-soft)">
        Yukibana {release.version}. Release notes and every file are on{' '}
        <a href={release.url} className="underline">
          GitHub
        </a>
        .
      </p>
      {dialog}
    </div>
  );
}

function Command({ children }: { children: string }) {
  return (
    // Shiki's lines carry the padding of a highlighted block; this text is not highlighted.
    <CodeBlock className="overflow-x-auto px-4 py-3">
      <code>{children}</code>
    </CodeBlock>
  );
}

/**
 * How to install one installer of the newest release, in numbered steps. Both the install dialog and the install page
 * (`<InstallSteps kind="…" />` in MDX) show it, so the two never disagree.
 */
export function InstallSteps({ kind }: { kind: InstallerKind }) {
  const { name } = useIdeRelease().installers[kind];
  const file = <code>{name}</code>;
  const steps: ReactNode[] = {
    windows: [
      <>Run {file}. It installs Yukibana for your account only, with no administrator prompt, and opens it.</>,
      <>
        If Windows says <q>Windows protected your PC</q>, click <b>More info</b>, then <b>Run anyway</b>. The installer
        is not signed yet, so Windows does not know it.
      </>,
      <>
        Yukibana is now in the Start menu, and opens the <code>yukibana://</code> links the cloud uses to open
        exercises.
      </>,
    ],
    'mac-arm64': macSteps(file),
    'mac-x64': macSteps(file),
    'linux-appimage': [
      <>
        Make the AppImage executable and run it:
        <Command>{`chmod +x ${name}\n./${name}`}</Command>
      </>,
      <>
        If it does not start and mentions FUSE, install FUSE 2: <code>sudo apt install libfuse2t64</code> on Ubuntu
        24.04 and later, <code>libfuse2</code> on older releases.
      </>,
      <>
        Yukibana offers to create a desktop entry and a <code>yukibana</code> command for itself, so that{' '}
        <code>yukibana://</code> links from the browser open in the IDE.
      </>,
    ],
    'linux-deb': [
      <>
        Install the package on Debian, Ubuntu or a distribution based on them:
        <Command>{`sudo apt install ./${name}`}</Command>
      </>,
      <>
        Start Yukibana from your applications menu, or with <code>yukibana</code> in a terminal.
      </>,
    ],
  }[kind];
  return (
    <ol className="list-decimal space-y-3 ps-5 text-sm leading-relaxed">
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}

function macSteps(file: ReactNode): ReactNode[] {
  return [
    <>
      Open {file} and drag Yukibana into <b>Applications</b>.
    </>,
    <>
      Open Yukibana from Applications. It is not notarized by Apple yet, so the first time macOS refuses to open it:
      click <b>Done</b>, go to <b>System Settings</b> › <b>Privacy &amp; Security</b>, and click <b>Open Anyway</b> next
      to the message about Yukibana, then confirm. macOS asks only once.
    </>,
    <>
      If macOS says Yukibana <q>is damaged and can’t be opened</q>, remove the download’s quarantine in Terminal:
      <Command>xattr -dr com.apple.quarantine /Applications/Yukibana.app</Command>
    </>,
  ];
}
