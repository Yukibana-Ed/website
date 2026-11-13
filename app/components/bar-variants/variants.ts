/**
 * The lifted header bar's material, for review: the switcher (bar-switcher.tsx) shows these in this order, as `?bar=`.
 * Each changes only what the bar is made of: its fill, the backdrop's blur and saturation, its border or inner
 * highlight, and its shadow; never its layout or size. Visitors see 8, "Grain frost", the one chosen, which is now
 * design/base.css's own bar; 1 is the plain frost it replaced. The other recipes are in bar-variants.css, one section
 * each; once the choice is final, delete this folder.
 */
export const barVariants = [
  { id: '1', name: 'Plain frost' },
  { id: '2', name: 'Nearly opaque' },
  { id: '3', name: 'Heavy frost' },
  { id: '4', name: 'Clear glass' },
  { id: '5', name: 'Vibrancy' },
  { id: '6', name: 'Liquid glass' },
  { id: '7', name: 'Accent tint' },
  { id: '8', name: 'Grain frost (package)' },
  { id: '9', name: 'Smoked' },
  { id: '10', name: 'Clears at the top' },
] as const;

export type BarId = (typeof barVariants)[number]['id'];
