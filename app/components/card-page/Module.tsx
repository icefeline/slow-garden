'use client';

import { useEffect, useState } from 'react';
import styles from './card-page.module.css';

/**
 * How the module fills in.
 *
 * The log prints a line at a time rather than the whole block landing at once,
 * so the wait reads as the machine working through it: the command, then the
 * thinking, then what it found in the chart, then the read. A terminal echoing
 * its own progress, not decoration — which is what keeps it on the right side
 * of the spec's "nothing animates".
 *
 * The two waiting lines are held by the fetch, not by a stopwatch: `thinking`
 * only decides when the first swaps to the second, and whichever is showing
 * stays until the answer is actually back. An earlier version expired them on a
 * fixed timer and left the block empty for as long as the request took.
 *
 * `body` is the one deliberate pause — the read is held a beat after the
 * transit line so the two don't arrive together and lose the sense of one
 * following from the other.
 */
const STAGE_MS = { thinking: 700, body: 900 } as const;

/** The glyphs an ephemeris uses, so the log line reads as a real transit line. */
const ASPECT_GLYPH: Record<string, string> = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

interface TransitExplanation {
  transitingPlanet: string;
  transitingPlanetMeaning: string;
  natalPlanet: string;
  natalPlanetMeaning: string;
  aspectType: string;
  aspectMeaning: string;
  phaseMeaning: string;
}

interface ModuleProps {
  keyPhrase: string;
  insight: string;
  action?: string;
  transitExplanation?: TransitExplanation;
  /** Whether the aspect is at peak — the log line's EXACT: YES/NO. */
  exact?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

/**
 * SPEC §09. The lime module: the machine's log, then the personalised read.
 *
 * Everything in here is VT323 including the headline — SPEC §1.1 assigns the
 * whole module to that one voice, which is what makes it read as a single
 * utterance rather than as a card with a title on it. The log lines sit inside
 * the module rather than above it (SPEC §1.4).
 *
 * This replaced the old ActiveInsight panel, which has since been deleted. It
 * keeps that component's three states — waiting, rate-limited, and the read
 * itself — and drops its scrolling transit ticker, the last animated thing
 * below the card. The explanation the ticker used to open is still here, as a
 * static toggle.
 */
export function Module({
  keyPhrase,
  insight,
  action,
  transitExplanation,
  exact,
  isLoading,
  hasError,
  onRetry,
}: ModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  /** Which of the two waiting lines is showing. Only ever advances 0 → 1. */
  const [waiting, setWaiting] = useState(0);
  useEffect(() => {
    if (!isLoading) return;
    setWaiting(0);
    const timer = setTimeout(() => setWaiting(1), STAGE_MS.thinking);
    return () => clearTimeout(timer);
  }, [isLoading]);

  /**
   * Whether the read itself has been let through, a beat behind the transit
   * line above it.
   *
   * A reading that was already cached never waited, so it starts open and the
   * pause is skipped — the delay belongs to the arrival of an answer, not to
   * every viewing of one.
   */
  const [bodyShown, setBodyShown] = useState(!isLoading);
  useEffect(() => {
    if (isLoading) {
      setBodyShown(false);
      return;
    }
    const timer = setTimeout(() => setBodyShown(true), STAGE_MS.body);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const transitLine = (() => {
    if (!transitExplanation?.transitingPlanet || !transitExplanation.natalPlanet) return null;
    const glyph = ASPECT_GLYPH[transitExplanation.aspectType?.toLowerCase()] ?? '·';
    const exactness = exact === undefined ? '' : ` EXACT: ${exact ? 'YES' : 'NO'}`;
    return `> TRANSIT: ${transitExplanation.transitingPlanet.toUpperCase()} ${glyph} ${transitExplanation.natalPlanet.toUpperCase()}${exactness}`;
  })();

  return (
    <section className={styles.module}>
      <div className={styles.log}>&gt; READ CARD --VERBOSE</div>

      {/* The waiting line occupies the transit line's place until the chart has
          actually been read, so the block grows downward instead of shuffling.
          No spinner: the cursor is the only thing on this page allowed to move
          (SPEC §5). */}
      {isLoading && (
        <div className={styles.log}>
          {waiting < 1 ? <>&gt; THINKING...</> : <>&gt; READING CHART...</>}
          <span className={styles.cursor}>_</span>
        </div>
      )}

      {!isLoading && transitLine && <div className={styles.log}>{transitLine}</div>}

      {isLoading || !bodyShown ? null : hasError ? (
        <div style={{ marginTop: 12 }}>
          <p className={styles.moduleQuiet}>&gt; NO CONNECTION TO THE READING.</p>
          {onRetry && (
            <button type="button" className={styles.moduleRetry} onClick={onRetry}>
              retry
            </button>
          )}
        </div>
      ) : (
        <>
          <h2>{keyPhrase || 'what this could mean for you'}</h2>
          <p>{insight}</p>

          {action && (
            <div className={styles.try}>
              <div className={styles.tryLabel}>try this</div>
              <p>{action}</p>
            </div>
          )}

          {transitExplanation?.transitingPlanetMeaning && (
            <div className={styles.explain}>
              <button
                type="button"
                className={styles.moduleRetry}
                style={{ marginTop: 0 }}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'close' : 'what is this transit'}
              </button>
              {isExpanded && (
                <p style={{ marginTop: 10 }}>
                  {transitExplanation.transitingPlanet} ({transitExplanation.transitingPlanetMeaning})
                  is making a {transitExplanation.aspectType} ({transitExplanation.aspectMeaning}) to
                  your natal {transitExplanation.natalPlanet} (
                  {transitExplanation.natalPlanetMeaning}). {transitExplanation.phaseMeaning}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Module;
