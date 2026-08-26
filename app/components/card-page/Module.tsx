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

/**
 * Where a supporter turns their code into an unlocked app.
 *
 * It lives under the coffee link rather than in settings because this is the
 * only moment anyone needs it: they have just been told the free readings ran
 * out, and the code is the answer to that sentence.
 *
 * The code is checked by the server — it cannot be invented — and on a yes the
 * page reloads so the reading it was blocking simply appears. No confirmation
 * screen: the unlocked reading is the confirmation.
 */
function UnlockEntry() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'bad'>('idle');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim() || state === 'checking') return;

    setState('checking');
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const { valid } = await res.json();

      if (!valid) {
        setState('bad');
        return;
      }

      localStorage.setItem('slow-garden-unlocked', code.trim());
      // Reload rather than lift state up through the card page: the quota is
      // read at fetch time in TarotCard, and a reload is the honest way to
      // re-ask every question that depended on it.
      window.location.reload();
    } catch {
      // Offline or the endpoint is down. Not the reader's fault and not a
      // wrong code, so it must not say the code was wrong.
      setState('idle');
    }
  };

  return (
    <div className={styles.unlock}>
      <form className={styles.unlockRow} onSubmit={submit}>
        <span>&gt;</span>
        <input
          className={styles.unlockInput}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (state === 'bad') setState('idle');
          }}
          placeholder="paste your transaction code e.g. a1fd54w5"
          aria-label="supporter code"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {code.trim() && (
          <button type="submit" className={styles.moduleRetry}>
            {state === 'checking' ? 'checking' : 'unlock'}
          </button>
        )}
      </form>
      {/* The example lives in the placeholder rather than on a line of its own:
          the field is already under the coffee link, so where the code comes
          from is answered by what it sits beneath. */}
      {state === 'bad' && (
        <p className={styles.unlockNote}>
          that code didn&apos;t match. check it came from the email with your receipt.
        </p>
      )}
    </div>
  );
}



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
  isRateLimited?: boolean;
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
  isRateLimited,
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
      ) : isRateLimited && !insight ? (
        <>
          <h2>thank you for using slow garden</h2>
          <p>
            if this has meant something to you, a small contribution goes directly toward
            keeping it running :-)
          </p>
          {/* `explain`, not `try`: same spacing, no rule. The link is the
              sentence above it carried to its conclusion, not a new section,
              and a divider between them read as though it were. */}
          <div className={styles.explain}>
            <a
              href="https://buymeacoffee.com/shxntxnx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              <p>buy me a coffee →</p>
            </a>
          </div>
          <UnlockEntry />
        </>
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
