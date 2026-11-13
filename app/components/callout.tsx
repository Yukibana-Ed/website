import type { ReactNode } from 'react';

type CalloutType = 'info' | 'note' | 'tip' | 'warn' | 'warning' | 'error' | 'success' | 'idea';

/**
 * A note or a warning: a tinted box with the icon in a column of its own. Notes are blue and warnings amber, never
 * green, since green is for actions. Takes Fumadocs' `<Callout>` props, so the pages need no change.
 */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType;
  title?: ReactNode;
  children?: ReactNode;
}) {
  const warn = type === 'warn' || type === 'warning' || type === 'error';
  return (
    <div className={warn ? 'yk-callout yk-callout--warn my-4' : 'yk-callout my-4'} role="note">
      {warn ? (
        <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3 2 20h20zM12 10v4M12 17v.5" />
        </svg>
      ) : (
        <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6M12 7.5v.5" />
        </svg>
      )}
      <div className="prose-no-margin min-w-0 text-sm">
        {title && <b className="mb-1 block">{title}</b>}
        {children}
      </div>
    </div>
  );
}
