import { CurrentCopy } from './parts';

/** A, "Current": the hero as the site has it, text on the left and the big logo on a fading lattice patch. */
export function HeroCurrent() {
  return (
    <section className="mx-auto grid w-full max-w-(--landing-width) items-center gap-10 px-4 pt-14 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-24">
      <div className="max-md:order-2">
        <CurrentCopy />
      </div>
      {/* The lattice patch, fading at its edges, and the big logo on it. Nothing to read sits on the lattice. */}
      <div aria-hidden className="relative grid aspect-[4/3] place-items-center max-md:order-1 max-md:aspect-[2/1]">
        <div className="yk-lattice absolute inset-0 [mask:radial-gradient(closest-side,#000_55%,transparent)]" />
        <img src="/logo.svg" alt="" width={200} height={200} className="relative size-32 md:size-52" />
      </div>
    </section>
  );
}
