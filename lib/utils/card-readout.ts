/**
 * The numbers and the dot leaders on the reading page.
 *
 * SPEC §1.6: "numbers must be real". Nothing here invents a value — the sky
 * figures come from the transit route, which is the only place the reader's
 * coordinates exist, and anything that cannot be computed is returned as null
 * so the row can be left out rather than filled with a plausible-looking zero.
 *
 * The one derived quantity is the note percentages, which are not measurements
 * of anything: they are a stable, arbitrary-but-fixed weighting per card. See
 * noteShares.
 */

import { seededRandom } from './card-utils';
import type { CardScent } from '../data/card-scents';

/**
 * The verb column in the distill list.
 *
 * A recipe has as many notes as it has — five to eleven across the deck — so
 * the verbs cannot be a fixed list of six. Each tier draws from its own pool in
 * order, which keeps the word honest: a top note can open or lift or cool, and
 * a base note grounds or binds, because that is what those tiers do. Assigning
 * verbs by position alone would end up calling a base note BRIGHTENS.
 *
 * Two are pinned. The first note always OPENS and the last always CLOSES,
 * whatever the counts, so every card's list reads as one arc from first meeting
 * to last trace rather than as three lists stacked.
 *
 * The pools are longer than any tier currently needs. A tier that somehow ran
 * past its pool repeats the last verb rather than falling off the end, which is
 * the least wrong thing to print.
 */
const TIER_VERBS = {
  top: ['OPENS', 'LIFTS', 'BRIGHTENS', 'COOLS', 'SHARPENS'],
  heart: ['STEADIES', 'WARMS', 'ROUNDS', 'SOFTENS', 'SWEETENS', 'DRIES'],
  base: ['DEEPENS', 'SMOKES', 'GROUNDS', 'BINDS', 'CLOSES'],
} as const;

export interface DistillRow {
  note: string;
  verb: string;
  tier: keyof CardScent;
}

/** Every note a card carries, in tier order, each with what it does. */
export function distillRows(scent: CardScent): DistillRow[] {
  const rows: DistillRow[] = [];
  (['top', 'heart', 'base'] as const).forEach(tier => {
    const pool = TIER_VERBS[tier];
    scent[tier].forEach((note, i) => {
      rows.push({ note, verb: pool[Math.min(i, pool.length - 1)], tier });
    });
  });

  if (rows.length > 0) {
    rows[0] = { ...rows[0], verb: 'OPENS' };
    rows[rows.length - 1] = { ...rows[rows.length - 1], verb: 'CLOSES' };
  }
  return rows;
}

/**
 * A percentage per note, indexed against the distill list.
 *
 * These are a proportion of the accord, not a measurement — no perfumer weighed
 * anything. What matters is that a card's numbers never change between readings
 * and never appear to have been rounded by hand, so they are derived from the
 * card id through the same seededRandom the deck itself is drawn with.
 *
 * Each share is pulled from a floor of 8% so no note reads as a trace, then the
 * remainder is distributed by weight. Integer rounding leaves a drift of a point
 * or two either way; it goes onto the largest share, where it is least visible,
 * which is what guarantees the column sums to exactly 100.
 */
export function noteShares(cardId: string, count: number): number[] {
  const FLOOR = 8;
  const weights = Array.from({ length: count }, (_, i) => seededRandom(`${cardId}-note-${i}`));
  const total = weights.reduce((sum, w) => sum + w, 0);

  const spare = 100 - FLOOR * count;
  const shares = weights.map(w => FLOOR + Math.round((w / total) * spare));

  const drift = 100 - shares.reduce((sum, s) => sum + s, 0);
  if (drift !== 0) {
    const largest = shares.indexOf(Math.max(...shares));
    shares[largest] += drift;
  }
  return shares;
}

/** `01`, `02` … — the index the readout and the distill list share. */
export function slotIndex(i: number): string {
  return String(i + 1).padStart(2, '0');
}

/**
 * The literal dot leaders between a note name and its verb.
 *
 * SPEC §4 says to compute the pad when the names come from data. The width is
 * the longest name in *this card's* accord rather than the deck's longest, so
 * every block is flush at its own measure instead of carrying a ragged gap
 * inherited from a card the reader isn't looking at.
 *
 * Two spaces of breathing room either side are folded in, which is why the
 * shortest run is still two dots rather than none.
 */
export function dotLeader(name: string, widest: number): string {
  return '.'.repeat(Math.max(2, widest - name.length + 2));
}

export function widestNote(names: string[]): number {
  return names.reduce((max, name) => Math.max(max, name.length), 0);
}

/**
 * The sky at the moment of the draw, as the transit route reports it.
 *
 * Every field is nullable and every one is omitted rather than guessed: sunrise
 * and sunset need coordinates, which only exist once a birth location has been
 * geocoded, and the whole object is absent for a reader who turned
 * personalisation off, since that reader makes no request at all.
 */
export interface SkyReadout {
  /** ISO instant. */
  sunrise: string | null;
  /** ISO instant. */
  sunset: string | null;
  /** 0–100, the illuminated fraction. */
  moonIllumination: number | null;
  /** Which side of full the moon is on — the word printed after the percentage. */
  moonDirection: 'waxing' | 'waning' | null;
  /**
   * IANA zone of the place the sun rose and set at.
   *
   * Sunrise is an event somewhere, so it is printed in that somewhere's clock:
   * rendering a London sunrise against a Bangkok clock produces 12:45, which is
   * a true instant and a useless number. The draw time above it stays in the
   * reader's own zone, because that one really did happen where they are.
   */
  zone: string | null;
}

/** `07:14`. Formatted in `zone` when given, otherwise the reader's own clock. */
export function clockTime(
  value: string | Date | null | undefined,
  zone?: string | null,
): string | null {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  try {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...(zone ? { timeZone: zone } : {}),
    });
  } catch {
    // An unrecognised zone should cost the row, not the whole column.
    return null;
  }
}

/**
 * `0°14'` — an orb in degrees and arcminutes.
 *
 * The transit carries it as a decimal degree; the margin prints it the way an
 * ephemeris would, since that is the register the rest of the column is in.
 */
export function formatOrb(orb: number | null | undefined): string | null {
  if (orb === null || orb === undefined || Number.isNaN(orb)) return null;
  const degrees = Math.floor(Math.abs(orb));
  const minutes = Math.round((Math.abs(orb) - degrees) * 60);
  // 59.7' rounds to 60, which would print as 0°60'.
  return minutes === 60 ? `${degrees + 1}°00'` : `${degrees}°${String(minutes).padStart(2, '0')}'`;
}

/**
 * How many cards this reader has ever drawn.
 *
 * Counts the reflection/journal history: a draw is a draw whether or not its
 * personalised reading was ever fetched.
 */
export function lifetimeDraws(journalKeyPrefix = 'card-'): number {
  if (typeof window === 'undefined') return 0;
  try {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(journalKeyPrefix)) count++;
    }
    return count;
  } catch {
    return 0;
  }
}
