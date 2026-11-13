import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react';

/**
 * A code block as an Expressive Code frame, like hylo-lang.org's: a block with a title (a file) gets Light's dock tab
 * bar with the file as its one tab and Copy at the end; a block without one (a terminal, a snippet) has no header, and
 * Copy appears on hover. Replaces Fumadocs' `pre`, so it receives what its Shiki step passes: the title and the
 * highlighted `<pre>`. The title is the dock's tab, inside the bar rather than directly in the `<figure>`, so it is a
 * `<span>` that names the figure, not a `<figcaption>`.
 */
export function CodeBlock({
  title,
  icon: _icon,
  children,
  className,
  style,
  ...props
}: ComponentProps<'pre'> & { title?: ReactNode; icon?: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const titleId = useId();
  const pre = (
    <pre ref={ref} {...props} className={className} style={style}>
      {children}
    </pre>
  );
  const copy = <CopyButton from={ref} />;
  if (!title) {
    return (
      <figure className="yk-code yk-code--terminal shiki not-prose my-4" dir="ltr">
        {pre}
        {/* After the code, so it paints above it: Fumadocs makes each .line `position: relative`, and a line drawn
            later than the button covered its middle, so hovering the icon itself lost the hover. */}
        {copy}
      </figure>
    );
  }
  return (
    <figure className="yk-code shiki not-prose my-4" dir="ltr" aria-labelledby={titleId}>
      <div className="yk-dock">
        <span id={titleId} className="yk-dock-tab">
          {title}
        </span>
        <span className="yk-dock-actions">{copy}</span>
      </div>
      {pre}
    </figure>
  );
}

/**
 * Copies the block's text; its icon turns into a check for two seconds, so the button itself says it worked, and a
 * screen reader hears "Copied". Where the browser refuses the clipboard (no permission, not a secure page), the button
 * says "Copy failed" instead of failing silently. A second click restarts the two seconds; leaving the page cancels them.
 */
function CopyButton({ from }: { from: RefObject<HTMLPreElement | null> }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onClick = async () => {
    const text = from.current?.textContent;
    if (text == null) return;
    let next: 'done' | 'failed';
    try {
      await navigator.clipboard.writeText(text);
      next = 'done';
    } catch {
      next = 'failed';
    }
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  };
  const done = state === 'done';
  const label = done ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy';
  return (
    <button type="button" className="yk-icon-btn" onClick={onClick} aria-label={label} title={label}>
      <span className="sr-only" aria-live="polite">
        {state === 'idle' ? '' : label}
      </span>
      {done ? (
        <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
          <path d="m5 12 5 5 9-10" />
        </svg>
      ) : (
        <svg className="yk-icon" viewBox="0 0 24 24" aria-hidden>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
        </svg>
      )}
    </button>
  );
}
