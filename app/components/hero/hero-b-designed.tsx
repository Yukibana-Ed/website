import type { ReactNode } from 'react';
import { DesignedCopy, EdgeLattice, underHeader } from './parts';

/**
 * B, "Designed": the designed hero (in-context.html, Landing). Full width and running up behind the lifted header,
 * the lattice toward the edges, and centred on it the 88px logo, the heading, the lead and the two buttons; a hairline
 * below. `over` is drawn over the lattice and under the text (C's glows).
 */
export function HeroDesigned({ over }: { over?: ReactNode }) {
  return (
    <section
      className={`relative grid place-items-center overflow-hidden border-b border-(--yk-line) px-4 pt-[96px] pb-[48px] text-center min-[760px]:px-[24px] min-[760px]:pt-[112px] min-[760px]:pb-[64px] ${underHeader}`}
    >
      <EdgeLattice />
      {over}
      <div className="relative max-w-[640px]">
        <img src="/logo.svg" alt="" width={88} height={88} className="mx-auto size-[88px]" />
        <DesignedCopy />
      </div>
    </section>
  );
}
