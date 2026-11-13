import { HeroDesigned } from './hero-b-designed';
import { PastelGlow } from './parts';

/** C, "Designed + glow": B with round 13's two pastel glows over the lattice. */
export function HeroDesignedGlow() {
  return <HeroDesigned over={<PastelGlow />} />;
}
