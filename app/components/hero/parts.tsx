import { ArrowRight, Download } from 'lucide-react';
import { lightUrl, releasesUrl } from '@/lib/shared';

/*
 * Pieces the hero variants share (see variants.ts). Once one variant is chosen, fold what it uses into it and delete
 * the rest.
 */

/**
 * Pulls a hero up under the landing page's lifted header, so its background runs behind the header to the top of the
 * window, as in the designs. The header takes 47px at the top of the window below 760px (the full-width bar), and 12px
 * plus its 51px above that (the floating bar; see app.css).
 */
export const underHeader = '-mt-[47px] min-[760px]:-mt-[63px]';

/** The current hero's text column: heading, lead and the two buttons, left-aligned. */
export function CurrentCopy() {
  return (
    <>
      <h1 className="mb-4 text-[40px] leading-[1.05] md:text-(length:--yk-font-size-hero)">An IDE for education</h1>
      <p className="mb-8 max-w-xl text-lg text-(--yk-soft)">
        Give students exactly the tools each exercise calls for, and hand out and collect assignments without a single
        zip file.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href={releasesUrl} className="yk-btn yk-btn--primary px-4 py-2.5 text-[15px]">
          <Download className="size-4" strokeWidth={1.5} aria-hidden />
          Download
        </a>
        <a href={lightUrl} className="yk-btn yk-btn--secondary px-4 py-2.5 text-[15px]">
          Try Light in your browser
        </a>
      </div>
    </>
  );
}

/** The designed hero's text, centred: the 52px heading, the 18px lead at most 540px wide, and the two big buttons. */
export function DesignedCopy() {
  return (
    <>
      <h1 className="mt-[6px] mb-[12px] text-(length:--yk-font-size-hero) leading-[1.04]">An IDE for education</h1>
      <p className="mx-auto mb-[22px] max-w-[540px] text-(length:--yk-font-size-lg) leading-[1.55] text-(--yk-soft)">
        Give students exactly the tools each exercise calls for, and hand out and collect assignments without a single
        zip file.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[10px]">
        <a href={releasesUrl} className="yk-btn yk-btn--primary px-[17px] py-[9px] text-[14.5px]">
          <Download className="size-4" strokeWidth={1.75} aria-hidden />
          Download
        </a>
        <a href={lightUrl} className="yk-btn yk-btn--secondary px-[17px] py-[9px] text-[14.5px]">
          Try Light in your browser
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
        </a>
      </div>
    </>
  );
}

/**
 * The designed hero's lattice: it fills its (relatively positioned) parent and shows only toward the edges, never
 * behind the text. Above 760px it is the design's mask, an ellipse touching the parent's sides, clear to 58%. A phone's
 * hero is tall and narrow, so that ellipse would leave the lattice behind the text; there it is drawn to the corners,
 * clear to 64%, which leaves the lattice in the corners and out of the 16px-guttered column. `wide` replaces the mask
 * above 760px.
 */
export function EdgeLattice({ wide = 'min-[760px]:[mask:radial-gradient(closest-side,transparent_58%,#000)]' }) {
  return (
    <div
      aria-hidden
      className={`yk-lattice absolute inset-0 [mask:radial-gradient(farthest-corner,transparent_64%,#000)] ${wide}`}
    />
  );
}

/**
 * Round 13's two pastel glows, pink at the top left and blue at the top right, blurred, over the lattice. The design
 * draws both in oklch(85% 0.06 h / 0.5), faded to 40% in the dark theme. From the tokens: in the light theme the pastel
 * chip's background mixed with 15% of its label colour comes to that colour; in the dark theme the chip's label colour
 * is that colour, at the design's 20%.
 */
export function PastelGlow() {
  const glow = (hue: 'pink' | 'blue') =>
    `radial-gradient(closest-side, light-dark(color-mix(in oklch, color-mix(in oklch, var(--yk-chip-${hue}-bg) 85%, var(--yk-chip-${hue}-fg)) 50%, transparent), color-mix(in oklch, var(--yk-chip-${hue}-fg) 20%, transparent)), transparent)`;
  return (
    <div
      aria-hidden
      className="absolute -inset-10 blur-[18px]"
      style={{
        background: `${glow('pink')} 0% 0% / 55% 80% no-repeat, ${glow('blue')} 100% 0% / 55% 80% no-repeat`,
      }}
    />
  );
}
