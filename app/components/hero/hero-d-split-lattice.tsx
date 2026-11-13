import { CurrentCopy, EdgeLattice, underHeader } from './parts';

/**
 * D, "Split on lattice": the current layout and type (text left, big logo right) on the designed background, the
 * full-width lattice running up behind the header. The lattice clears in an ellipse around the text column instead of
 * the centre, so the logo stands on it and the text never does. On a phone, where the logo is above the text, it is
 * the designed hero's phone mask.
 */
export function HeroSplitLattice() {
  return (
    <section className={`relative overflow-hidden border-b border-(--yk-line) ${underHeader}`}>
      <EdgeLattice wide="md:[mask:radial-gradient(ellipse_280px_72%_at_26%_56%,transparent_70%,#000)] lg:[mask:radial-gradient(ellipse_420px_72%_at_max(26%,calc(50%-240px))_56%,transparent_70%,#000)]" />
      <div className="relative mx-auto grid w-full max-w-(--landing-width) items-center gap-10 px-4 pt-24 pb-14 md:grid-cols-[1.1fr_1fr] md:pt-[124px] md:pb-20">
        <div className="max-md:order-2">
          <CurrentCopy />
        </div>
        <div aria-hidden className="grid place-items-center max-md:order-1">
          <img src="/logo.svg" alt="" width={200} height={200} className="size-32 md:size-52" />
        </div>
      </div>
    </section>
  );
}
