import { DesignedCopy, EdgeLattice } from './parts';

/**
 * G, "Designed in a card": the designed hero kept to the current hero's width, under the header rather than behind
 * it: a rounded panel exactly as wide as the lifted header, with the designed lattice, logo, heading, lead and buttons.
 */
export function HeroDesignedCard() {
  return (
    <section className="mx-auto w-full max-w-(--landing-width) px-4 pt-6 pb-4 min-[760px]:pt-8">
      <div className="relative grid place-items-center overflow-hidden rounded-(--yk-radius-xl) border border-(--yk-line) px-4 pt-14 pb-12 text-center min-[760px]:px-6 min-[760px]:pt-16 min-[760px]:pb-14">
        <EdgeLattice />
        <div className="relative max-w-[640px]">
          <img src="/logo.svg" alt="" width={88} height={88} className="mx-auto size-[88px]" />
          <DesignedCopy />
        </div>
      </div>
    </section>
  );
}
