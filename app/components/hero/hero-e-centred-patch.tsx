import { DesignedCopy, underHeader } from './parts';

/**
 * E, "Centred on a patch": the designed layout and type (centred, 88px logo, 52px heading, big buttons) on the current
 * background, the plain page with a small fading patch of lattice behind the logo only.
 */
export function HeroCentredPatch() {
  return (
    <section
      className={`grid place-items-center px-4 pt-24 pb-12 text-center min-[760px]:px-6 min-[760px]:pt-[104px] min-[760px]:pb-16 ${underHeader}`}
    >
      <div className="max-w-[640px]">
        <div aria-hidden className="relative mx-auto mb-3 grid h-[136px] w-[260px] place-items-center">
          <div className="yk-lattice absolute inset-0 [mask:radial-gradient(closest-side,#000_45%,transparent)]" />
          <img src="/logo.svg" alt="" width={88} height={88} className="relative size-[88px]" />
        </div>
        <DesignedCopy />
      </div>
    </section>
  );
}
