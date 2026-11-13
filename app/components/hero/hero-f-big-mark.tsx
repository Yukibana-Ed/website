import { DesignedCopy, underHeader } from './parts';

/**
 * F, "Big mark, designed text": the current hero's visual, the big logo on its fading lattice patch, centred above
 * the designed text block.
 */
export function HeroBigMark() {
  return (
    <section
      className={`grid place-items-center px-4 pt-20 pb-12 text-center min-[760px]:px-6 min-[760px]:pt-[84px] min-[760px]:pb-16 ${underHeader}`}
    >
      <div className="w-full max-w-[640px]">
        <div aria-hidden className="relative mx-auto grid aspect-[2/1] w-full max-w-[480px] place-items-center">
          <div className="yk-lattice absolute inset-0 [mask:radial-gradient(closest-side,#000_55%,transparent)]" />
          <img src="/logo.svg" alt="" width={200} height={200} className="relative size-32 md:size-44" />
        </div>
        <DesignedCopy />
      </div>
    </section>
  );
}
