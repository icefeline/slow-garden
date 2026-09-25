'use client';

import { useCallback, useRef, useState } from 'react';
import type { DetectedPattern } from '@/lib/utils/pattern-detector';
import styles from './card-page.module.css';

interface PatternStampsProps {
  patterns: DetectedPattern[];
}

/**
 * The stamp row that sits between the reading and "try this" when the recent
 * draws — or the live sky — show something worth naming. One photo per
 * pattern TYPE (not per instance): the same suit photo shows every time a
 * suit dominance fires, whichever suit it actually is.
 *
 * More than one pattern can be true on the same day, so this is a rail, not
 * a single card — same peek-the-next-card rail as the share screen's
 * template picker. The header names whichever card is currently centred and
 * updates as the rail scrolls, the same way the log line above it names
 * whichever transit the reading is about.
 */
export function PatternStamps({ patterns }: PatternStampsProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const railBox = el.getBoundingClientRect();
    const middle = railBox.left + railBox.width / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const box = (child as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  const current = patterns[active] ?? patterns[0];

  return (
    <div className={styles.patternStamp}>
      <div className={styles.log}>
        &gt; {patterns.length > 1 ? `${patterns.length} PATTERNS FOUND` : 'PATTERN FOUND'}
      </div>
      <div className={styles.log}>&gt; {current.label}</div>
      <div className={styles.patternRow} ref={railRef} onScroll={onScroll}>
        {patterns.map(pattern => (
          <div key={pattern.id} className={styles.patternItem}>
            <div className={styles.patternCard}>
              <div className={styles.patternGrid}>
                <div className={styles.patternImage} style={{ background: pattern.bg }}>
                  <img
                    src={pattern.image}
                    alt=""
                    style={{
                      mixBlendMode: pattern.blend ? 'multiply' : undefined,
                      transform: pattern.rotate ? 'rotate(180deg)' : undefined,
                    }}
                  />
                </div>
                <div className={styles.patternText}>
                  <div className={styles.patternTop}>
                    <span className={styles.patternHeadline}>{pattern.headline}</span>
                    <span className={styles.patternBody}>{pattern.body}</span>
                  </div>
                  <span className={styles.patternStat}>{pattern.stat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
