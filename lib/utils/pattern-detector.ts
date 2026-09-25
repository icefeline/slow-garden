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

/**
 * Most recent first, one entry per date. Callers pass in history that
 * already includes today's draw; a second entry for the same date can only
 * be a data artifact (only one card can be drawn a day), so the first one
 * seen for a date wins — the caller always puts today's own draw first,
 * ahead of whatever loadDrawHistory() returns for other dates.
 */
function sorted(history: DrawRecord[]): DrawRecord[] {
  const byDate = new Map<string, DrawRecord>();
  for (const d of history) {
    if (!byDate.has(d.date)) byDate.set(d.date, d);
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
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
    body: `the same card twice in ${span} days means whatever it named the first time is still open. it didn't resolve, so it came back.`,
    stat: `2ND TIME · ${span} DAYS`,
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
        body: `${rank}s across ${suits.size} different suits in a week makes the number the constant. whichever suit it landed in was incidental, so whatever ${rank} means is what's actually running through the different parts of your life it touched.`,
        stat: `${count}/${suits.size} SUITS · 7D`,
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
        body: `court cards read as people more than events. three of them clustered in nine days means a person is driving what's happening more than the situation is, worth asking who instead of what.`,
        stat: `${count} ${plural.toUpperCase()} · 9D`,
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
      body: `the minor cards are the daily mechanics of life, errands and logistics. lately it's been almost all majors instead, which makes this a life theme, not a logistics problem.`,
      stat: `${majors}/${window.length} DRAWS · EXP ~28%`,
      image: '/patterns/major.jpg',
      bg: '#14180f',
    };
  }
  return null;
}

// What's actually recurring when a suit dominates — the pattern the reader
// can check against their own life, not just the suit's name.
const SUIT_DOMAIN: Record<string, string> = {
  wands: 'everything to do with your drive and what you\'re building',
  cups: 'everything to do with how you feel and who you feel it with',
  swords: 'everything to do with your mind and the decisions you keep circling',
  pentacles: 'everything to do with your body, your money, the ground under you',
};

function detectSuit(draws: DrawRecord[]): DetectedPattern | null {
  const window = draws.slice(0, 21).filter(d => !isMajor(d.cardId));
  if (window.length < 12) return null;
  for (const suit of SUITS) {
    const count = window.filter(d => parseCard(d.cardId).suit === suit).length;
    const ratio = count / window.length;
    if (ratio >= 0.38) {
      return {
        id: 'suit',
        label: 'SUIT',
        headline: `${suitLabel(suit)}, ${count} of ${window.length}.`,
        body: `${count} of your last ${window.length} draws were ${suit}, well past what chance explains. ${SUIT_DOMAIN[suit]} is doing all the work right now, whether or not you're looking at it directly.`,
        stat: `${count}/${window.length} · EXP 25%`,
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
      body: `reversed means the same theme turned inward: held back, working under the surface instead of out in the open. most of what's come up lately has stayed there, and you're the one holding it back.`,
      stat: `${reversed}/${window.length} DRAWS · EXP 30%`,
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
      body: `compared to your own history, you're pulling far more majors than usual this month. majors are life themes rather than daily mechanics, so whatever's active runs bigger than your normal range, past what a busy stretch alone would explain.`,
      stat: `${Math.round(thisRatio * 100)}% MAJORS · AVG ${Math.round(priorRatio * 100)}%`,
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
    body: `same card, same week, one year apart. cards repeating on a yearly rhythm like this usually point to a cycle, worth asking what was true then that might still be true now.`,
    stat: `SAME CARD · LAST YEAR`,
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
      body: `most of what's come up has come up sideways, and most of the sky is moving backwards too. retrograde is when a planet stops pushing forward and starts reworking what's already there, which makes this a review stretch rather than a bad one. nothing forward-facing finishes until it clears.`,
      stat: `${reversed} REVERSED · ${sky.retrogradePlanets.length} RETRO`,
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
    body: `mars is the planet that pushes you to act, and right now it's stopped moving forward. the drive redirects instead of switching off: redo instead of advance, revisit instead of launch.`,
    stat: 'MARS RETROGRADE · NOW',
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
    body: `${hit.count} different planets are aspecting your ${hit.natalPlanet} at once, each pulling a different way. that's a pile-up, so whatever it governs is going to feel loud and contradictory this week.`,
    stat: `${hit.count} TRANSITS · THIS WEEK`,
    image: '/patterns/convergence.jpg',
    bg: '#b4d63a',
    blend: true,
  };
}

/** Below this, nothing fires — see the note on MIN_DRAWS_FOR_PATTERNS. */
const MIN_DRAWS_FOR_PATTERNS = 7;

/**
 * Every pattern that fires today, rarest and most specific first. `history`
 * must include today's just-drawn card as its most recent entry — callers
 * build it from the same `card-{date}` / `reversed-{date}` keys the year
 * view reads. More than one can be true at once (a suit run and a live
 * retrograde don't exclude each other), so the stamp row shows all of them
 * rather than picking a single winner.
 *
 * Nothing fires before a week of draws exist, full stop — including the
 * sky-only patterns (convergence, Mars retrograde), which would otherwise
 * happily fire on someone's very first day since they don't touch draw
 * history at all. A pattern is supposed to read as something building over
 * time; on day one it would just read as the app being dramatic.
 */
export function detectPatterns(history: DrawRecord[], sky: SkyContext): DetectedPattern[] {
  const draws = sorted(history);
  if (draws.length < MIN_DRAWS_FOR_PATTERNS) return [];
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
