/**
 * Shiki's theme for the docs, coloured by the design system's code tokens. The colours are custom properties, and each
 * already holds both schemes (light-dark()), so the one theme serves as the light and the dark one.
 */
export const ykShikiTheme = {
  name: 'yukibana',
  type: 'light' as const,
  colors: {
    'editor.background': 'var(--yk-code-bg)',
    'editor.foreground': 'var(--yk-code-ink)',
  },
  tokenColors: [
    { settings: { foreground: 'var(--yk-code-ink)' } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--yk-code-comment)' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'constant.language',
        'variable.language',
      ],
      settings: { foreground: 'var(--yk-code-keyword)' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name', 'entity.name.command'],
      settings: { foreground: 'var(--yk-code-function)' },
    },
    {
      scope: ['string', 'string.quoted', 'punctuation.definition.string', 'markup.inline.raw'],
      settings: { foreground: 'var(--yk-code-string)' },
    },
    {
      scope: ['constant.numeric', 'constant.character', 'constant.other', 'support.constant'],
      settings: { foreground: 'var(--yk-code-number)' },
    },
    {
      scope: ['support.type.property-name', 'entity.name.tag', 'entity.other.attribute-name', 'entity.name.type'],
      settings: { foreground: 'var(--yk-code-function)' },
    },
  ],
};
