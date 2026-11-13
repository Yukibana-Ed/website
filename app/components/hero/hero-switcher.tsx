import { createVariantStore, VariantSwitcher } from '@/components/variant-switcher';
import { heroVariants, type HeroId } from './variants';

/** G, "Designed in a card", is the landing hero; the others stay selectable with the switcher, for review. */
export const defaultHero: HeroId = 'g';

const store = createVariantStore({
  param: 'hero',
  storageKey: 'yk-landing-hero',
  variants: heroVariants,
  fallback: defaultHero,
});

/**
 * Which hero the landing page shows, and whether to show the switcher. Without the switcher (a production build with
 * no `?hero=`), it is always G.
 */
export const useHeroVariant = store.useVariant;

/** The review switcher at the bottom right, one letter per variant. */
export function HeroSwitcher({ current, onChoose }: { current: HeroId; onChoose: (id: HeroId) => void }) {
  return <VariantSwitcher label="Hero" variants={heroVariants} current={current} onChoose={onChoose} />;
}
