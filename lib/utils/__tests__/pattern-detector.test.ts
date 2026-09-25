import { detectPatterns, convergencesFromTransits, type DrawRecord } from '../pattern-detector';

const noSky = { retrogradePlanets: [], convergentNatalPlanets: [] };

/** Builds N days of history ending today, oldest first is irrelevant — detectPatterns sorts. */
function draws(cardIds: string[], startDaysAgo: number = 0): DrawRecord[] {
  return cardIds.map((cardId, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (startDaysAgo + i));
    return { date: d.toISOString().slice(0, 10), cardId, isReversed: false };
  });
}

function ids(history: DrawRecord[], sky = noSky) {
  return detectPatterns(history, sky).map(p => p.id);
}

describe('detectPatterns', () => {
  it('finds a suit dominance', () => {
    const history = draws([
      'pentacles-1', 'pentacles-2', 'pentacles-3', 'pentacles-4', 'pentacles-5',
      'pentacles-6', 'pentacles-7', 'pentacles-8', 'cups-1', 'cups-2',
      'swords-1', 'swords-2', 'wands-1',
    ]);
    expect(ids(history)).toContain('suit');
  });

  it('finds an exact-card repeat', () => {
    const history = draws(['major-16', 'cups-2', 'cups-3', 'major-16', 'wands-1', 'swords-2', 'pentacles-3']);
    expect(ids(history)).toContain('repeat');
  });

  it('does not call a duplicate entry for the same date a repeat — only one card can be drawn a day', () => {
    const today = new Date().toISOString().slice(0, 10);
    const history = [
      { date: today, cardId: 'major-16', isReversed: false },
      { date: today, cardId: 'major-16', isReversed: false }, // stale duplicate for today's date
      ...draws(['wands-1', 'swords-2', 'pentacles-3', 'cups-4', 'swords-5', 'wands-6'], 1),
    ];
    expect(ids(history)).not.toContain('repeat');
  });

  it('finds a number cluster across suits', () => {
    const history = draws(['cups-9', 'swords-9', 'wands-3', 'pentacles-9', 'major-1', 'wands-5', 'cups-2']);
    expect(ids(history)).toContain('number');
  });

  it('finds a court-card cluster', () => {
    const history = draws(['cups-queen', 'swords-2', 'wands-queen', 'pentacles-queen', 'major-1', 'wands-5', 'cups-3']);
    expect(ids(history)).toContain('court');
  });

  it('finds major arcana dominance', () => {
    const history = draws(['major-0', 'major-1', 'major-2', 'major-3', 'cups-1', 'cups-2', 'wands-3']);
    expect(ids(history)).toContain('major');
  });

  it('finds a reversed spike', () => {
    const history = [
      { date: '2026-01-08', cardId: 'cups-1', isReversed: true },
      { date: '2026-01-07', cardId: 'cups-2', isReversed: true },
      { date: '2026-01-06', cardId: 'cups-3', isReversed: true },
      { date: '2026-01-05', cardId: 'cups-4', isReversed: true },
      { date: '2026-01-04', cardId: 'cups-5', isReversed: false },
      { date: '2026-01-03', cardId: 'cups-6', isReversed: false },
      { date: '2026-01-02', cardId: 'cups-7', isReversed: true },
    ];
    expect(ids(history)).toContain('reversed');
  });

  it('finds mars retrograde', () => {
    const history = draws(['cups-1', 'wands-2', 'swords-3', 'pentacles-4', 'cups-5', 'wands-6', 'swords-7']);
    expect(ids(history, { retrogradePlanets: ['mars'], convergentNatalPlanets: [] })).toContain('retrograde');
  });

  it('finds a natal-planet convergence at 4+ distinct transiting planets', () => {
    const history = draws(['cups-1', 'wands-2', 'swords-3', 'pentacles-4', 'cups-5', 'wands-6', 'swords-7']);
    const result = ids(history, {
      retrogradePlanets: [],
      convergentNatalPlanets: [{ natalPlanet: 'venus', count: 4 }],
    });
    expect(result).toContain('convergence');
  });

  it('does not call 3 distinct transiting planets a convergence — that is the normal state of the sky', () => {
    const history = draws(['cups-1', 'wands-2', 'swords-3', 'pentacles-4', 'cups-5', 'wands-6', 'swords-7']);
    const result = ids(history, {
      retrogradePlanets: [],
      convergentNatalPlanets: [{ natalPlanet: 'venus', count: 3 }],
    });
    expect(result).not.toContain('convergence');
  });

  it('does not fire any pattern before a week of draws exist, even a sky-only one', () => {
    // Only 3 days of history — below MIN_DRAWS_FOR_PATTERNS — so a convergence
    // that would otherwise clearly fire must not show up on day one.
    const history = draws(['cups-1', 'wands-2', 'swords-3']);
    const result = ids(history, {
      retrogradePlanets: ['mars'],
      convergentNatalPlanets: [{ natalPlanet: 'venus', count: 4 }],
    });
    expect(result).toEqual([]);
  });

  it('shows reversed+retrograde synthesis instead of a plain reversed spike, not both', () => {
    const history = [
      { date: '2026-01-08', cardId: 'cups-1', isReversed: true },
      { date: '2026-01-07', cardId: 'cups-2', isReversed: true },
      { date: '2026-01-06', cardId: 'cups-3', isReversed: true },
      { date: '2026-01-05', cardId: 'cups-4', isReversed: true },
      { date: '2026-01-04', cardId: 'cups-5', isReversed: false },
      { date: '2026-01-03', cardId: 'cups-6', isReversed: false },
      { date: '2026-01-02', cardId: 'cups-7', isReversed: true },
    ];
    const result = ids(history, {
      retrogradePlanets: ['mars', 'saturn', 'jupiter', 'uranus', 'neptune'],
      convergentNatalPlanets: [],
    });
    expect(result).toContain('reversed-retrograde');
    expect(result).not.toContain('reversed');
  });

  it('does not call 3 retrograde planets a retrograde season — the four outer ones overlap routinely', () => {
    const history = [
      { date: '2026-01-08', cardId: 'cups-1', isReversed: true },
      { date: '2026-01-07', cardId: 'cups-2', isReversed: true },
      { date: '2026-01-06', cardId: 'cups-3', isReversed: true },
      { date: '2026-01-05', cardId: 'cups-4', isReversed: true },
      { date: '2026-01-04', cardId: 'cups-5', isReversed: false },
      { date: '2026-01-03', cardId: 'cups-6', isReversed: false },
      { date: '2026-01-02', cardId: 'cups-7', isReversed: true },
    ];
    const result = ids(history, {
      retrogradePlanets: ['saturn', 'uranus', 'neptune'],
      convergentNatalPlanets: [],
    });
    expect(result).not.toContain('reversed-retrograde');
    expect(result).toContain('reversed');
  });

  it('finds an echo one year back', () => {
    const history = [
      { date: '2026-09-25', cardId: 'major-9', isReversed: false },
      { date: '2026-09-24', cardId: 'wands-1', isReversed: false },
      { date: '2026-09-23', cardId: 'cups-2', isReversed: false },
      { date: '2026-09-22', cardId: 'swords-3', isReversed: false },
      { date: '2026-09-21', cardId: 'pentacles-4', isReversed: false },
      { date: '2026-09-20', cardId: 'wands-5', isReversed: false },
      { date: '2025-09-24', cardId: 'major-9', isReversed: false },
    ];
    expect(ids(history)).toContain('echo');
  });

  it('returns an empty array when nothing matches', () => {
    const history = draws(['cups-1', 'wands-4', 'major-2', 'swords-6', 'pentacles-8', 'cups-3', 'wands-7']);
    expect(detectPatterns(history, noSky)).toEqual([]);
  });

  it('returns more than one pattern when more than one is true, rarest first', () => {
    const history = draws(['major-0', 'major-1', 'major-2', 'major-3', 'cups-1', 'wands-2', 'swords-3']);
    const result = ids(history, { retrogradePlanets: ['mars'], convergentNatalPlanets: [] });
    expect(result).toEqual(['retrograde', 'major']);
  });
});

describe('convergencesFromTransits', () => {
  it('counts distinct transiting planets per natal planet within orb', () => {
    const result = convergencesFromTransits([
      { natalPlanet: 'venus', transitingPlanet: 'mars', orb: 2 },
      { natalPlanet: 'venus', transitingPlanet: 'saturn', orb: 4 },
      { natalPlanet: 'venus', transitingPlanet: 'jupiter', orb: 9 }, // out of orb
      { natalPlanet: 'moon', transitingPlanet: 'pluto', orb: 1 },
    ]);
    expect(result).toEqual(expect.arrayContaining([
      { natalPlanet: 'venus', count: 2 },
      { natalPlanet: 'moon', count: 1 },
    ]));
  });
});
