/**
 * What is actually live in a chart today, read the Jyotish way.
 *
 * The old answer to this question was a Western transit: an outer planet in
 * aspect to a natal planet. Because Uranus, Neptune and Pluto move a degree or
 * two a year, the same handful of aspects stayed in orb for months and the
 * readings said "saturn" or "neptune" almost every day. Nothing else in the
 * chart could ever get a word in.
 *
 * A Vedic reading is layered instead, and the layers move at different speeds:
 *
 *   dasha      the chapter — years, then months for the antardasha
 *   gochara    where the grahas are sitting relative to the janma rashi — weeks
 *   drishti    what is looking at what right now — days
 *   dignity    how well placed today's actor is — the flavour on top
 *
 * Every layer is computed. The one that leads on a given day is chosen from the
 * live candidates, weighted by strength and by the drawn card's affinity, with
 * the day's seed breaking ties — so an ordinary week moves through the chart
 * rather than circling one planet.
 */

import type { UserChart } from '../types/astrology';
import {
  GRAHAS, type Graha, dashaAt, gochara, sadeSatiPhase, hasDrishti,
  dignityOf, isCombust, houseFrom, signOf, navamsaSign, nodePositions,
  type DashaState,
} from './jyotish';

export type SignalKind = 'dasha' | 'gochara' | 'drishti' | 'sade-sati' | 'return';

export interface VedicSignal {
  kind: SignalKind;
  /** The graha doing the acting. */
  actor: Graha;
  /** What it is acting on — a natal graha, or a house from the Moon. */
  target?: Graha;
  /** House counted from the janma rashi, 1–12. */
  houseFromMoon: number;
  /** House counted from the lagna, when a birth time made one available. */
  houseFromLagna?: number;
  favourable: boolean;
  /** Plain-language line handed to the writer. No jargon survives past here. */
  description: string;
  strength: number;
}

export interface VedicContext {
  dasha: DashaState | null;
  signals: VedicSignal[];
  lead: VedicSignal | null;
  sadeSati: string | null;
  /** Dignity of the leading actor in the rashi and the navamsa. */
  leadDignity: { rashi: string; navamsa: string; combust: boolean; retrograde: boolean } | null;
}

/** What each graha is, in the app's register — no practitioner vocabulary. */
export const GRAHA_NATURE: Record<Graha, string> = {
  sun: 'the part of you that wants to be met on its own terms',
  moon: 'the part that feels first and explains itself later',
  mercury: 'the part that needs to name a thing before it can put it down',
  venus: 'the part that reaches for beauty, ease, and being wanted',
  mars: 'the part that pushes, and knows what it is willing to fight for',
  jupiter: 'the part that widens, believes, and looks for the meaning in it',
  saturn: 'the part that keeps time, holds the line, and asks what is actually real',
  rahu: 'the hunger that pulls forward into unfamiliar ground',
  ketu: 'the part already letting go, and quietly bored of what used to work',
};

/** The twelve houses from the Moon, as lived rather than as listed. */
const HOUSE_FROM_MOON_THEME: Record<number, string> = {
  1: 'how they are carrying themselves day to day',
  2: 'what they are holding onto, and what it costs to keep',
  3: 'their nerve, their voice, and the small brave things',
  4: 'home, rest, and whether the ground feels steady',
  5: 'play, making things, and what delights them',
  6: 'the daily grind and what it is wearing down',
  7: 'the people closest in, and what is being negotiated',
  8: 'what is being turned over underneath, out of sight',
  9: 'what they believe and how far they can see',
  10: 'the work, and being watched while doing it',
  11: 'the wider circle and what they are moving towards',
  12: 'the inner room, solitude, and what is being released',
};

const DASHA_ARC: Record<Graha, string> = {
  sun: 'a long stretch about standing in their own authority',
  moon: 'a long stretch about feeling, and what the feelings point to',
  mercury: 'a long stretch about the mind and the voice finding their range',
  venus: 'a long stretch about pleasure, closeness, and what they are worth',
  mars: 'a long stretch about will, effort, and picking the right fights',
  jupiter: 'a long stretch about meaning, growth, and what is believed',
  saturn: 'a long stretch about structure, patience, and doing the real work',
  rahu: 'a long stretch about wanting, ambition, and unfamiliar ground',
  ketu: 'a long stretch about letting go and turning inward',
};

const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Very small movement over a day means retrograde or stationary. */
function isRetrograde(today: number, tomorrow: number): boolean {
  const delta = norm360(tomorrow - today + 180) - 180;
  return delta < 0;
}

/** Reads as an adjective, so it can sit in front of either kind of period. */
function phaseWord(progress: number): string {
  if (progress < 0.15) return 'newly begun';
  if (progress < 0.45) return 'early';
  if (progress < 0.75) return 'midway';
  return 'ending';
}

/**
 * Everything live in the chart today, strongest first.
 *
 * `transitPositions` are today's sidereal graha longitudes; `seed` is the day's
 * card seed, so the same person on the same day always gets the same lead.
 */
export function buildVedicContext(
  chart: UserChart,
  transitPositions: Record<Graha, number>,
  tomorrowPositions: Record<Graha, number>,
  when: Date,
  seed: number,
  cardAffinityPlanets: string[] = [],
): VedicContext {
  const natal = chart.grahaPositions;
  const moon = natal.moon;
  const signals: VedicSignal[] = [];

  // ── the chapter ────────────────────────────────────────────────────────────
  const dasha = dashaAt(moon, chart.birthInstant, when);
  if (dasha) {
    const mahaHouse = houseFrom(moon, natal[dasha.maha.lord]);
    signals.push({
      kind: 'dasha',
      actor: dasha.antar.lord,
      target: dasha.maha.lord,
      houseFromMoon: mahaHouse,
      favourable: true,
      strength: 26,
      description:
        `${phaseWord(dasha.mahaProgress)}, ${DASHA_ARC[dasha.maha.lord]}, ` +
        `with ${GRAHA_NATURE[dasha.antar.lord]} running the current sub-chapter. ` +
        `the chapter's theme keeps surfacing through ${HOUSE_FROM_MOON_THEME[mahaHouse]}`,
    });
  }

  // ── where the grahas are sitting ───────────────────────────────────────────
  const positions = gochara(transitPositions, moon);
  for (const p of positions) {
    // The Moon changes sign every two and a bit days; too fast to lead a reading.
    if (p.graha === 'moon') continue;
    // Slow grahas sit in a sign for months, so they carry more weight — but only
    // slightly. Weighted heavily they crowd out every faster graha and the
    // reading goes back to naming the same two planets all year.
    const slow = p.graha === 'saturn' || p.graha === 'jupiter' || p.graha === 'rahu' || p.graha === 'ketu';
    signals.push({
      kind: 'gochara',
      actor: p.graha,
      houseFromMoon: p.houseFromMoon,
      houseFromLagna: chart.birthTime
        ? houseFrom(chart.ascendantLongitude, transitPositions[p.graha])
        : undefined,
      favourable: p.favourable,
      strength: (slow ? 13 : 11) + (p.favourable ? 0 : 3),
      description:
        `${GRAHA_NATURE[p.graha]} is sitting over ${HOUSE_FROM_MOON_THEME[p.houseFromMoon]}` +
        (p.favourable ? ', and it has room to work there' : ', where it tends to chafe'),
    });
  }

  // ── what is looking at what ────────────────────────────────────────────────
  for (const actor of GRAHAS) {
    for (const target of GRAHAS) {
      if (!hasDrishti(actor, transitPositions[actor], natal[target])) continue;
      // Everything aspects the 7th, so a bare 7th glance is background noise;
      // the special drishti are what a reading would actually remark on.
      const special = houseFrom(transitPositions[actor], natal[target]) !== 7;
      signals.push({
        kind: 'drishti',
        actor,
        target,
        houseFromMoon: houseFrom(moon, natal[target]),
        favourable: !['saturn', 'mars', 'rahu', 'ketu'].includes(actor),
        strength: special ? 12 : 7,
        description:
          `${GRAHA_NATURE[actor]} has its attention on ${GRAHA_NATURE[target]}`,
      });
    }
  }

  // ── the named one ──────────────────────────────────────────────────────────
  const sadeSati = sadeSatiPhase(transitPositions.saturn, moon);
  if (sadeSati) {
    signals.push({
      kind: 'sade-sati',
      actor: 'saturn',
      houseFromMoon: houseFrom(moon, transitPositions.saturn),
      favourable: false,
      strength: 24,
      description:
        sadeSati === 'rising'
          ? 'the long saturn passage over the emotional ground has begun — things are being quietly stripped back before anything is rebuilt'
          : sadeSati === 'peak'
          ? 'the long saturn passage is directly overhead — the heaviest and most clarifying stretch of it'
          : 'the long saturn passage is moving off — the weight is lifting, and what held is now visible',
    });
  }

  // ── returns ────────────────────────────────────────────────────────────────
  for (const graha of GRAHAS) {
    const separation = Math.abs(norm360(transitPositions[graha] - natal[graha] + 180) - 180);
    if (separation > 3) continue;
    signals.push({
      kind: 'return',
      actor: graha,
      target: graha,
      houseFromMoon: houseFrom(moon, natal[graha]),
      favourable: true,
      strength: 20,
      description: `${GRAHA_NATURE[graha]} has come back to exactly where it stood at their birth — a cycle closing and restarting`,
    });
  }

  // ── pick the lead ──────────────────────────────────────────────────────────
  // The dasha is deliberately excluded here. It is the chapter, reported on its
  // own every day, and it outscored everything else by construction — leading
  // with it would reproduce exactly the bug this module exists to fix, with the
  // dasha lord playing the part Saturn used to.
  const affinity = new Set(cardAffinityPlanets);
  const scored = signals
    .filter(s => s.kind !== 'dasha')
    .map((s, i) => {
      let score = s.strength;
      if (affinity.has(s.actor)) score += 10;
      // A graha that also rules the current chapter is more meaningful today.
      if (dasha && (s.actor === dasha.maha.lord || s.actor === dasha.antar.lord)) score += 5;
      // Deterministic jitter, wide enough that comparable signals genuinely
      // trade places across a week: same person, same day, same card always
      // lands the same way, but an ordinary week walks around the chart.
      score += Math.abs(Math.sin(seed * 997 + i * 31)) * 16;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score);

  const lead = scored[0]?.s ?? null;

  const leadDignity = lead
    ? {
        rashi: dignityOf(lead.actor, transitPositions[lead.actor]),
        navamsa: navamsaSign(transitPositions[lead.actor]),
        combust: isCombust(lead.actor, transitPositions[lead.actor], transitPositions.sun),
        retrograde: isRetrograde(transitPositions[lead.actor], tomorrowPositions[lead.actor]),
      }
    : null;

  return {
    dasha,
    // Ranked, minus the dasha — callers wanting the chapter read `dasha`.
    signals: scored.map(x => x.s),
    lead,
    sadeSati,
    leadDignity,
  };
}

/** The block of context handed to the writer. Plain language only. */
export function describeVedicContext(ctx: VedicContext, chart: UserChart): string {
  const lines: string[] = [];

  if (ctx.dasha) {
    lines.push(
      `Chapter (${phaseWord(ctx.dasha.mahaProgress)}): ${DASHA_ARC[ctx.dasha.maha.lord]}.`,
    );
    lines.push(
      `Sub-chapter (${phaseWord(ctx.dasha.antarProgress)}): ${GRAHA_NATURE[ctx.dasha.antar.lord]}.`,
    );
  }

  if (ctx.lead) {
    lines.push(`Today's strongest thread: ${ctx.lead.description}.`);
    if (ctx.leadDignity) {
      const d = ctx.leadDignity;
      if (d.rashi === 'exalted') lines.push('That part of them is unusually well placed right now — it has more room than usual.');
      if (d.rashi === 'debilitated') lines.push('That part of them is working uphill right now — it is not at its strongest.');
      if (d.rashi === 'own sign') lines.push('That part of them is on home ground right now — steady, sure of itself.');
      if (d.combust) lines.push('It is also hard to see clearly at the moment, sitting too close to the glare of the self.');
      if (d.retrograde) lines.push('It is moving backwards — revisiting rather than advancing.');
    }
  }

  const supporting = ctx.signals.slice(1, 4).map(s => `- ${s.description}`);
  if (supporting.length) {
    lines.push(`Also live, quieter:\n${supporting.join('\n')}`);
  }

  if (chart.birthTime && ctx.lead?.houseFromLagna) {
    lines.push(`From the lagna this is landing in house ${ctx.lead.houseFromLagna}.`);
  }

  return lines.join('\n');
}

export { nodePositions, signOf };
