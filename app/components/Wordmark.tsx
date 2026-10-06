import type { CSSProperties } from 'react';

/**
 * The slow garden wordmark, typed out: a block cursor blinks, "sl", the snail and "w" go in, the
 * cursor drops a line, "garden" follows, then it blinks until the loop restarts (12s, timings
 * from the 5a design).
 *
 * Browsers can't pause a GIF or WebP, so a reader who has asked for reduced motion gets the
 * finished wordmark as a still instead.
 *
 * The caller positions it: pass a width (and any position/transform) in `style`.
 */
export function Wordmark({
  animated,
  still,
  alt,
  style,
}: {
  animated: string;
  still: string;
  alt: string;
  style?: CSSProperties;
}) {
  return (
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcSet={still} />
      <img
        src={animated}
        alt={alt}
        draggable={false}
        style={{ display: 'block', height: 'auto', userSelect: 'none', ...style }}
      />
    </picture>
  );
}

export default Wordmark;
