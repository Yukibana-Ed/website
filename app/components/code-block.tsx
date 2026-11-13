import { useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react';

/**
 * A code block as an Expressive Code frame, like hylo-lang.org's: a block with a title (a file) gets Light's dock tab
 * bar with the file as its one tab and Copy at the end; a block without one (a terminal, a snippet) has no header, and
 * Copy appears on hover. Replaces Fumadocs' `pre`, so it receives what its Shiki step passes: the title and the
 * highlighted `<pre>`.
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
  const pre = (
    <pre ref={ref} {...props} className={className} style={style}>
      {children}
    </pre>
  );
  const copy = <CopyButton from={ref} />;
  if (!title) {
    return (
      <figure className="yk-code yk-code--terminal shiki not-prose my-4" dir="ltr">
        {copy}
        {pre}
      </figure>
    );
  }
  return (
    <figure className="yk-code shiki not-prose my-4" dir="ltr">
      <div className="yk-dock">
        <figcaption className="yk-dock-tab">{title}</figcaption>
        <span className="yk-dock-actions">{copy}</span>
      </div>
      {pre}
    </figure>
  );
}

/** Copies the block's text; its icon turns into a check for two seconds, so the button itself says it worked. */
function CopyButton({ from }: { from: RefObject<HTMLPreElement | null> }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    const text = from.current?.textContent;
    if (text == null) return;
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button type="button" className="yk-icon-btn" onClick={onClick} aria-label={done ? 'Copied' : 'Copy'}>
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
