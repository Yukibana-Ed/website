import { useEffect } from 'react';
import { createVariantStore, VariantSwitcher } from '@/components/variant-switcher';
import { barVariants } from './variants';

const store = createVariantStore({ param: 'bar', storageKey: 'yk-header-bar', variants: barVariants, fallback: '8' });

/**
 * Applies the chosen material to the lifted header bar on every page, as data-bar on <html> (bar-variants.css), and
 * shows the review switcher where it is enabled. 8, "Grain frost", is the default and is design/base.css's own
 * bar, so it sets nothing and the prerendered HTML has it before this runs. "Clears at the top" also marks
 * <html> with data-bar-scrolled once the page is scrolled.
 */
export function BarVariants() {
  const { id, switcher, choose } = store.useVariant();

  useEffect(() => {
    const root = document.documentElement;
    if (id === '8') delete root.dataset.bar;
    else root.dataset.bar = id;
    if (id !== '10') return;
    const onScroll = () => {
      if (window.scrollY > 8) root.dataset.barScrolled = '';
      else delete root.dataset.barScrolled;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      delete root.dataset.barScrolled;
    };
  }, [id]);

  return switcher ? <VariantSwitcher label="Bar" variants={barVariants} current={id} onChoose={choose} /> : null;
}
