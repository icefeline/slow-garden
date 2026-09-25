/**
 * Pattern cards — the stamp that sits between the reading and "try this"
 * when the recent draws (or the live sky) show something worth naming.
 *
 * Draw-based patterns (tiers 1 and 4) read from the same `card-{date}` /
 * `reversed-{date}` localStorage entries that already power the year view.
 * Sky-based patterns (tiers 2 and 3) take a small, pre-computed context —
 * retrograde planets and any natal-planet convergences — since that math
 * already happens server-side in calculate-transit's active-transit pass.
 *
 * At most one pattern is returned per reading. The list below is priority
 * order, rarest/most specific first, and detectPattern returns the first
 * match rather than every match — the stamp is a single quiet aside, not
 * a dashboard.
 */

export interface DrawRecord {
  date: string; // YYYY-MM-DD
  cardId: string;
  isReversed: boolean;
}

export interface SkyContext {
  /** Lowercase planet names currently retrograde, from the six planets calculate-transit checks. */
  retrogradePlanets: string[];
  /** Natal planets currently being aspected by three or more distinct transiting planets at once. */
  convergentNatalPlanets: { natalPlanet: string; count: number }[];
}

export interface DetectedPattern {
  id: string;
  label: string;
  headline: string;
  body: string;
  stat: string;
  image: string;
  bg: string;
  blend?: boolean;
  rotate?: boolean;
}

const COURT_RANKS = new Set(['page', 'knight', 'queen', 'king']);
const SUITS = ['cups', 'swords', 'wands', 'pentacles'] as const;

function parseCard(cardId: string): { suit: string; rank: string } {
  const dash = cardId.indexOf('-');
  return { suit: cardId.slice(0, dash), rank: cardId.slice(dash + 1) };
}

function isMajor(cardId: string): boolean {
  return cardId.startsWith('major-');
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86400000);
}

/** Most recent first. Callers pass in history that already includes today's draw. */
function sorted(history: DrawRecord[]): DrawRecord[] {
  return [...history].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function suitLabel(suit: string): string {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}

// ---- tier 1: draw patterns ------------------------------------------------

function detectRepeat(draws: DrawRecord[]): DetectedPattern | null {
  const today = draws[0];
  if (!today) return null;
  const window = draws.slice(0, 9);
  const priorMatch = window.slice(1).find(d => d.cardId === today.cardId);
  if (!priorMatch) return null;
  const span = Math.max(1, daysBetween(today.date, priorMatch.date));
  return {
    id: 'repeat',
    label: 'REPEAT',
    headline: 'Same card again.',
    body: `same card twice in ${span} days. either you didn't finish the conversation with it the first time, or it's not done with you.`,
    stat: `2ND TIME / ${span} DAYS`,
    image: '/patterns/repeat.jpg',
    bg: '#14180f',
  };
}

function detectNumber(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 7).filter(d => !isMajor(d.cardId));
  const byRank = new Map<string, Set<string>>();
  for (const d of window) {
    const { suit, rank } = parseCard(d.cardId);
    if (COURT_RANKS.has(rank)) continue;
    if (!byRank.has(rank)) byRank.set(rank, new Set());
    byRank.get(rank)!.add(suit);
  }
  for (const [rank, suits] of byRank) {
    const count = window.filter(d => parseCard(d.cardId).rank === rank).length;
    if (count >= 3 && suits.size >= 2) {
      return {
        id: 'number',
        label: 'NUMBER',
        headline: `Three ${rank}s this week.`,
        body: `${rank}s across ${suits.size} different suits. every number carries its own meaning whichever suit it lands in. something in that number's theme is close, whichever part of life it's in.`,
        stat: `${count} / ${suits.size} SUITS / 7 DAYS`,
        image: '/patterns/number.jpg',
        bg: '#ff2b8f',
        blend: true,
      };
    }
  }
  return null;
}

function detectCourt(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 9);
  const counts = new Map<string, number>();
  for (const d of window) {
    const { rank } = parseCard(d.cardId);
    if (COURT_RANKS.has(rank)) counts.set(rank, (counts.get(rank) ?? 0) + 1);
  }
  for (const [rank, count] of counts) {
    if (count >= 3) {
      const plural = rank === 'knight' ? 'knights' : `${rank}s`;
      return {
        id: 'court',
        label: 'COURT CARDS',
        headline: `Three ${plural}, nine days.`,
        body: `when the court cards stack up, it's usually not the situation, it's a person. someone's playing a bigger part in this than the events are.`,
        stat: `${count} ${plural.toUpperCase()} / 9 DAYS`,
        image: '/patterns/court.jpg',
        bg: '#14180f',
      };
    }
  }
  return null;
}

function detectMajor(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 7);
  if (window.length < 5) return null;
  const majors = window.filter(d => isMajor(d.cardId)).length;
  if (majors / window.length >= 0.55) {
    return {
      id: 'major',
      label: 'MAJOR ARCANA',
      headline: 'All big cards lately.',
      body: `the small stuff hasn't been showing up. lately it's all the big cards. whatever this is, it isn't a logistics problem.`,
      stat: `${majors} OF ${window.length} DRAWS / EXPECTED ~28%`,
      image: '/patterns/major.jpg',
      bg: '#14180f',
    };
  }
  return null;
}

function detectSuit(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 21).filter(d => !isMajor(d.cardId));
  if (window.length < 12) return null;
  for (const suit of SUITS) {
    const count = window.filter(d => parseCard(d.cardId).suit === suit).length;
    const ratio = count / window.length;
    if (ratio >= 0.38) {
      const ranks = window.filter(d => parseCard(d.cardId).suit === suit).map(d => parseCard(d.cardId).rank);
      const mostDrawn = mostCommon(ranks);
      return {
        id: 'suit',
        label: 'SUIT',
        headline: `${suitLabel(suit)}, ${count} of ${window.length}.`,
        body: `${count} of your last ${window.length} draws were ${suit}. that's not the odds. body, money, the ground under you keeps asking to be looked at.`,
        stat: `${count} OF ${window.length} / EXPECTED 25%${mostDrawn ? ` · MOST DRAWN: ${mostDrawn.toUpperCase()}` : ''}`,
        image: '/patterns/suit.jpg',
        bg: '#5f6d18',
      };
    }
  }
  return null;
}

function detectReversed(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 8);
  if (window.length < 6) return null;
  const reversed = window.filter(d => d.isReversed).length;
  if (reversed / window.length >= 0.6) {
    return {
      id: 'reversed',
      label: 'REVERSED',
      headline: 'Mostly sideways.',
      body: `most of what's come up lately has come up sideways. reversed isn't opposite, it's turned inward. you're the one holding this back right now.`,
      stat: `${reversed} OF ${window.length} DRAWS / EXPECTED 30%`,
      image: '/patterns/reversed.jpg',
      bg: '#14180f',
      rotate: true,
    };
  }
  return null;
}

// ---- tier 4: self-relative -------------------------------------------------

function detectBaseline(draws: DrawRecord[]): DetectedPattern | null {
  const today = draws[0];
  if (!today) return null;
  const month = today.date.slice(0, 7); // YYYY-MM
  const thisMonth = draws.filter(d => d.date.slice(0, 7) === month);
  const prior = draws.filter(d => d.date.slice(0, 7) !== month);
  if (thisMonth.length < 8 || prior.length < 15) return null;
  const thisRatio = thisMonth.filter(d => isMajor(d.cardId)).length / thisMonth.length;
  const priorRatio = prior.filter(d => isMajor(d.cardId)).length / prior.length;
  if (thisRatio - priorRatio >= 0.1) {
    return {
      id: 'baseline',
      label: 'YOUR BASELINE',
      headline: 'Bigger than your normal.',
      body: `compared to your own history, not just the deck, you're pulling far more majors than usual. whatever this is, it's bigger than your normal.`,
      stat: `${Math.round(thisRatio * 100)}% MAJORS THIS MONTH / YOUR AVG ${Math.round(priorRatio * 100)}%`,
      image: '/patterns/baseline.jpg',
      bg: '#b4d63a',
      blend: true,
    };
  }
  return null;
}

function detectEcho(draws: DrawRecord[]): DetectedPattern | null {
  const today = draws[0];
  if (!today) return null;
  const todayDate = new Date(today.date);
  const lastYear = new Date(todayDate);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const match = draws.find(d => {
    if (d === today || d.cardId !== today.cardId) return false;
    return Math.abs(daysBetween(d.date, lastYear.toISOString().slice(0, 10))) <= 3;
  });
  if (!match) return null;
  return {
    id: 'echo',
    label: 'ECHO',
    headline: 'Same week, a year on.',
    body: `same card, same week, one year apart. worth asking what was true then that might be true again.`,
    stat: `SAME CARD / SAME WEEK LAST YEAR`,
    image: '/patterns/echo.jpg',
    bg: '#5f6d18',
  };
}

// ---- tiers 2 and 3: sky events and synthesis ------------------------------

function detectReversedRetrograde(draws: DrawRecord[], sky: SkyContext): DetectedPattern | null {
  const window = draws.slice(0, 8);
  if (window.length < 6) return null;
  const reversed = window.filter(d => d.isReversed).length;
  // Saturn, Uranus, Neptune and Pluto are each retrograde 35-45% of any given
  // year, so 3 of the 6 checked planets overlapping is an ordinary Tuesday,
  // not a season. Requiring all but one of them is what actually makes this
  // rare enough to call out.
  if (reversed / window.length >= 0.5 && sky.retrogradePlanets.length >= 5) {
    return {
      id: 'reversed-retrograde',
      label: 'REVERSED × RETROGRADE',
      headline: 'A review stretch.',
      body: `the cards keep turning up sideways while most of the sky's moving backwards too. this isn't a bad stretch, it's a review stretch. nothing forward-facing finishes until the retrogrades clear.`,
      stat: `${reversed} REVERSED / ${sky.retrogradePlanets.length} PLANETS RETROGRADE`,
      image: '/patterns/reversed-retrograde.jpg',
      bg: '#6b3ff5',
      blend: true,
      rotate: true,
    };
  }
  return null;
}

function detectMarsRetrograde(sky: SkyContext): DetectedPattern | null {
  if (!sky.retrogradePlanets.includes('mars')) return null;
  return {
    id: 'retrograde',
    label: 'RETROGRADE',
    headline: 'Mars retrograde.',
    body: `mars stopped moving forward. the planet that usually pushes you to act is asking you to redo instead of advance.`,
    stat: 'MARS RETROGRADE / RIGHT NOW',
    image: '/patterns/retrograde.jpg',
    bg: '#6b3ff5',
  };
}

function detectConvergence(sky: SkyContext): DetectedPattern | null {
  // With 6 transiting planets checked against 6 natal points and a generous
  // orb, some natal planet clearing 3 distinct hits is the normal state of
  // the sky, not a convergence — on a random day, two or three different
  // natal planets can each qualify at once. 4 is the bar where it's actually
  // an unusual pile-up rather than routine background noise.
  const hit = sky.convergentNatalPlanets.find(c => c.count >= 4);
  if (!hit) return null;
  const planet = hit.natalPlanet.charAt(0).toUpperCase() + hit.natalPlanet.slice(1);
  return {
    id: 'convergence',
    label: 'CONVERGENCE',
    headline: `${hit.count} transits on your ${planet}.`,
    body: `your ${hit.natalPlanet} is getting hit from ${hit.count} directions at once right now. expect whatever it governs to feel unusually loud.`,
    stat: `${hit.count} TRANSITS / THIS WEEK`,
    image: '/patterns/convergence.jpg',
    bg: '#b4d63a',
    blend: true,
  };
}

function mostCommon(values: string[]): string | null {
  if (values.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: string | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return bestCount >= 2 ? best : null;
}

/**
 * Every pattern that fires today, rarest and most specific first. `history`
 * must include today's just-drawn card as its most recent entry — callers
 * build it from the same `card-{date}` / `reversed-{date}` keys the year
 * view reads. More than one can be true at once (a suit run and a live
 * retrograde don't exclude each other), so the stamp row shows all of them
 * rather than picking a single winner.
 */
export function detectPatterns(history: DrawRecord[], sky: SkyContext): DetectedPattern[] {
  const draws = sorted(history);
  const reversedRetrograde = detectReversedRetrograde(draws, sky);

  return [
    detectEcho(draws),
    reversedRetrograde,
    detectRepeat(draws),
    detectNumber(draws),
    detectCourt(draws),
    detectConvergence(sky),
    detectMarsRetrograde(sky),
    detectMajor(draws),
    detectSuit(draws),
    detectBaseline(draws),
    // The plain reversed-spike card would just repeat reversed+retrograde's
    // point without the sky context, so it only shows when that one didn't fire.
    reversedRetrograde ? null : detectReversed(draws),
  ].filter((p): p is DetectedPattern => p !== null);
}

/**
 * Groups the day's active transits by natal planet and counts distinct
 * transiting planets currently aspecting each one within a workable orb —
 * the raw material for the convergence pattern.
 */
export function convergencesFromTransits(
  transits: { natalPlanet: string; transitingPlanet: string; orb: number }[]
): { natalPlanet: string; count: number }[] {
  const byNatal = new Map<string, Set<string>>();
  for (const t of transits) {
    if (t.orb > 8) continue;
    if (!byNatal.has(t.natalPlanet)) byNatal.set(t.natalPlanet, new Set());
    byNatal.get(t.natalPlanet)!.add(t.transitingPlanet);
  }
  return [...byNatal.entries()].map(([natalPlanet, planets]) => ({
    natalPlanet,
    count: planets.size,
  }));
}

/** Reads the same localStorage keys `loadJournalEntries` in page.tsx builds from. */
export function loadDrawHistory(): DrawRecord[] {
  if (typeof window === 'undefined') return [];
  const records: DrawRecord[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('card-')) continue;
      const date = key.replace('card-', '');
      const cardId = localStorage.getItem(key);
      if (!cardId) continue;
      records.push({
        date,
        cardId,
        isReversed: localStorage.getItem(`reversed-${date}`) === 'true',
      });
    }
  } catch {
    // localStorage unavailable — no history, no pattern
  }
  return records;
}
