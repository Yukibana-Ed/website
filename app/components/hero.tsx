import { Link } from 'react-router';
import release from 'virtual:ide-release';
import { ArrowRight, Download } from 'lucide-react';
import { DownloadLink, installPage, useInstallDialog } from './downloads';
import { installers } from '@/lib/ide-release';
import { lightUrl } from '@/lib/shared';
import { useDetectedInstaller } from '@/lib/detect-installer';

/**
 * The landing hero, "Designed in a card": a rounded panel under the header, exactly as wide as the lifted header, with
 * the lattice toward its edges, the logo, the heading, the lead and the two buttons. The download button is the
 * installer for the visitor's system, and a line under it names that installer and links to the others.
 */
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-(--landing-width) px-4 pt-6 pb-4 min-[760px]:pt-8">
      <div className="relative grid place-items-center overflow-hidden rounded-(--yk-radius-xl) border border-(--yk-line) px-4 pt-14 pb-12 text-center min-[760px]:px-6 min-[760px]:pt-16 min-[760px]:pb-14">
        <EdgeLattice />
        <div className="relative max-w-[640px]">
          <img src="/logo.svg" alt="" width={88} height={88} className="mx-auto size-[88px]" />
          <h1 className="mt-[6px] mb-[12px] text-(length:--yk-font-size-hero) leading-[1.04]">An IDE for education</h1>
          <p className="mx-auto mb-[22px] max-w-[540px] text-(length:--yk-font-size-lg) leading-[1.55] text-(--yk-soft)">
            Give students exactly the tools each exercise calls for, and hand out and collect assignments without a
            single zip file.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[10px]">
            <HeroDownload />
            <a href={lightUrl} className="yk-btn yk-btn--secondary px-[17px] py-[9px] text-[14.5px]">
              Try Light in your browser
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
          <HeroDownloadNote />
        </div>
      </div>
    </section>
  );
}

const heroButton = 'yk-btn yk-btn--primary px-[17px] py-[9px] text-[14.5px]';

/**
 * The installer for this computer, as a direct download that opens the install steps. Before the page knows the
 * computer (the prerendered page, or no JavaScript) and where Yukibana does not run (a phone), the install page.
 */
function HeroDownload() {
  const kind = useDetectedInstaller();
  const { open, dialog } = useInstallDialog();
  const icon = <Download className="size-4" strokeWidth={1.75} aria-hidden />;
  if (!kind) {
    return (
      <Link to={installPage} className={heroButton}>
        {icon}
        Download
      </Link>
    );
  }
  return (
    <>
      <DownloadLink installer={release.installers[kind]} onDownload={open} className={heroButton}>
        {icon}
        Download for {installers[kind].osLabel}
      </DownloadLink>
      {dialog}
    </>
  );
}

/** Which installer the download button gives, and the way to the others. */
function HeroDownloadNote() {
  const kind = useDetectedInstaller();
  return (
    <p className="mt-3 text-sm text-(--yk-soft)">
      Version {release.version}
      {kind ? ` · ${installers[kind].variant}` : ''} ·{' '}
      <Link to={installPage} className="text-(--yk-soft) underline">
        {kind ? 'Other systems' : 'Windows, macOS and Linux'}
      </Link>
    </p>
  );
}

/**
 * The lattice: it fills the panel and shows only toward the edges, never behind the text. Above 760px the mask is an
 * ellipse touching the panel's sides, clear to 66%. A phone's panel is tall and narrow, so that ellipse would leave the
 * lattice behind the text; there it is drawn to the corners, clear to 64%, which leaves the lattice in the corners and
 * out of the 16px-guttered column.
 */
function EdgeLattice() {
  return (
    <div
      aria-hidden
      className="yk-lattice absolute inset-0 [mask:radial-gradient(farthest-corner,transparent_64%,#000)] min-[760px]:[mask:radial-gradient(closest-side,transparent_66%,#000)]"
    />
  );
}
