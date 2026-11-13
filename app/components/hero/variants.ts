import type { ComponentType } from 'react';
import { HeroCurrent } from './hero-a-current';
import { HeroDesigned } from './hero-b-designed';
import { HeroDesignedGlow } from './hero-c-designed-glow';
import { HeroSplitLattice } from './hero-d-split-lattice';
import { HeroCentredPatch } from './hero-e-centred-patch';
import { HeroBigMark } from './hero-f-big-mark';
import { HeroDesignedCard } from './hero-g-designed-card';

/**
 * The landing hero's variants, for review: the switcher (hero-switcher.tsx) shows them in this order. Visitors see the
 * first, the hero as it was, until one is chosen; then keep that one's file and parts.tsx, and delete the rest.
 */
export const heroVariants = [
  { id: 'a', name: 'Current', Hero: HeroCurrent },
  { id: 'b', name: 'Designed', Hero: HeroDesigned },
  { id: 'c', name: 'Designed + glow', Hero: HeroDesignedGlow },
  { id: 'd', name: 'Split on lattice', Hero: HeroSplitLattice },
  { id: 'e', name: 'Centred on a patch', Hero: HeroCentredPatch },
  { id: 'f', name: 'Big mark, designed text', Hero: HeroBigMark },
  { id: 'g', name: 'Designed in a card', Hero: HeroDesignedCard },
] as const satisfies readonly { id: string; name: string; Hero: ComponentType }[];

export type HeroId = (typeof heroVariants)[number]['id'];

export function isHeroId(value: unknown): value is HeroId {
  return heroVariants.some((v) => v.id === value);
}
