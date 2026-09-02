/**
 * The eight skies.
 *
 * Straight from the sky-palette spec. A past reading opens in a window painted
 * with the sky it was DRAWN under, not the one it is being read under, so the
 * app stops being green everywhere and a card pulled at dawn still opens in
 * dawn colours at midnight in December. The hour belongs to the card, which is
 * what makes a year of them a spread of skies rather than eight identical
 * windows that all happen to match the clock on the wall.
 *
 * Two constants hold across the whole set and are not per-sky: lime is the one
 * accent that reads on all eight, and forest is the ink that sits on lime.
 * Everything else moves with the hour.
 *
 * CONTRAST. The gradients here are NOT the sheet's exactly. The sheet's skies
 * sit behind a handful of large words; these sit behind a full reading, and a
 * gradient wide enough to run from #3F4A72 to #D98A7A cannot carry one ink at
 * both ends — the reading scrolls over the whole sky, so every ink has to pass
 * against every stop, not against an average. Five skies had stops pushed away
 * from their body ink until body copy, one muted tier and the hairlines all
 * clear WCAG AA. Each stop keeps its hue and chroma; only lightness moved.
 * Skies 02, 03 and 08 were already clear and are untouched.
 *
 * The cost is concentrated in 01 and 07, which lost the warm ends that made
 * them: the dusty mauve and the coral both went to a deep brick. That is the
 * honest price of light body text over a gradient that ends light. Reverting
 * either one is a two-line change here — and a failing one.
 */

export const LIME = '#C9F24E';
export const FOREST = '#12321F';

export interface Sky {
  /** Spec number, kept so a screen can be matched back to the sheet. */
  no: string;
  name: string;
  /** First hour of the day this sky covers, on the spec's reference clock. */
  from: number;
  /** The sky itself, top of the window to bottom. */
  stops: string[];
  /** Headline and accent marks. Cobalt through the day, lime once it darkens. */
  ink: string;
  /** Reading copy. */
  body: string;
  /** Titlebar and taskbar ground: light bezel by day, near-black at night. */
  chrome: string;
  /** Type on that chrome. */
  chromeInk: string;
  /** Window border and rules on the chrome. */
  edge: string;
}

/**
 * Ordered by `from`, and read as "this sky until the next one starts". Night
 * runs 20:40–04:20 in the spec, so it is the first and last entry — the lookup
 * below falls back to it for every hour before dawn.
 */
export const SKIES: Sky[] = [
  {
    no: '08', name: 'night', from: 0,
    stops: ['#101A2E', '#1B2A44', '#2A3C56'],
    ink: LIME, body: '#DFE9F5',
    chrome: '#101A2E', chromeInk: '#DFE9F5', edge: '#070C16',
  },
  {
    no: '01', name: 'before light', from: 4,
    stops: ['#2B3350', '#4A4F6B', '#574F5F', '#614E4C'],
    ink: LIME, body: '#E9E4F0',
    // Sky 01 is the note on the sheet that the pale bezel looked wrong here.
    chrome: '#2B3350', chromeInk: '#E9E4F0', edge: '#141A2C',
  },
  {
    no: '02', name: 'dawn', from: 5,
    stops: ['#F4D9B8', '#EFD6CD', '#DFD9E4', '#C9DCEA'],
    ink: '#2B35D6', body: '#2C3B2A',
    chrome: '#F4EFDD', chromeInk: FOREST, edge: FOREST,
  },
  {
    no: '03', name: 'morning', from: 7,
    stops: ['#CFE6F4', '#E4F0F8', '#D9EAF5'],
    ink: '#2B35D6', body: '#1D3A4A',
    chrome: '#F4EFDD', chromeInk: FOREST, edge: FOREST,
  },
  {
    no: '04', name: 'high noon', from: 11,
    stops: ['#8CC8F2', '#A8CFE8', '#CFE4F0'],
    // The one sky the cobalt title disappears into, so the title goes navy.
    ink: '#12324A', body: '#12324A',
    chrome: '#F4EFDD', chromeInk: FOREST, edge: FOREST,
  },
  {
    no: '05', name: 'long afternoon', from: 15,
    stops: ['#B0D2E7', '#D3DDE2', '#E8DFCD'],
    ink: '#2B35D6', body: '#243A3F',
    chrome: '#F4EFDD', chromeInk: FOREST, edge: FOREST,
  },
  {
    no: '06', name: 'golden hour', from: 18,
    stops: ['#93B9D5', '#DCC6A8', '#EAA86B', '#FBA047'],
    ink: '#2B35D6', body: '#33261A',
    chrome: '#F6E9D4', chromeInk: '#33261A', edge: '#33261A',
  },
  {
    no: '07', name: 'dusk', from: 19,
    stops: ['#3F4A72', '#5B5072', '#704A5A', '#764940'],
    ink: LIME, body: '#F4E8EA',
    chrome: '#3F4A72', chromeInk: '#F4E8EA', edge: '#1E2440',
  },
  {
    no: '08', name: 'night', from: 21,
    stops: ['#101A2E', '#1B2A44', '#2A3C56'],
    ink: LIME, body: '#DFE9F5',
    chrome: '#101A2E', chromeInk: '#DFE9F5', edge: '#070C16',
  },
];

/**
 * The baseline.
 *
 * Sky 03 is the sheet's own "baseline · current" — what the app looks like
 * today — and it is where a card with no recorded draw time lands.
 */
export const BASELINE = SKIES.find(s => s.no === '03')!;

/**
 * The sky a card was drawn under.
 *
 * `drawn-at-<date>` is stamped once, when that day's card is revealed, and
 * TarotCard deliberately refuses to back-fill it for an older card: there is no
 * honest draw time to invent, which is why the reading omits its "drawn" row
 * in the same situation. A sky is a softer claim than a printed time, but it is
 * still a claim about a moment, so the same rule applies — no stamp, no
 * invented hour, and the card opens on the baseline instead.
 *
 * Every card drawn from here on carries its own hour, so a history fills in
 * with real skies as it is lived rather than all at once.
 */
export function skyForDraw(date: string): Sky {
  if (typeof window === 'undefined') return BASELINE;
  try {
    const stamp = localStorage.getItem(`drawn-at-${date}`);
    if (!stamp) return BASELINE;
    const at = new Date(stamp);
    return Number.isNaN(at.getTime()) ? BASELINE : skyAt(at);
  } catch {
    return BASELINE;
  }
}

/**
 * Which sky it is.
 *
 * The spec wants solar boundaries — dawn at 05:10 in June and 07:40 in
 * December — and these are the fixed mid-latitude reference times it publishes
 * instead. They are the honest version of what can be known here: sunrise and
 * sunset need the reader's coordinates, which only exist server-side inside the
 * natal chart, and a window should not wait on a request to know what colour it
 * is. Boundaries snap rather than cross-fade, for the same reason.
 */
export function skyAt(at: Date = new Date()): Sky {
  const hour = at.getHours();
  let found = SKIES[0];
  for (const sky of SKIES) {
    if (hour >= sky.from) found = sky;
  }
  return found;
}

/** The CSS custom properties a sky publishes to whatever it is painting. */
export function skyVars(sky: Sky): Record<string, string> {
  return {
    '--sky-grad': `linear-gradient(180deg, ${sky.stops.join(', ')})`,
    '--sky-ink': sky.ink,
    '--sky-body': sky.body,
    '--sky-chrome': sky.chrome,
    '--sky-chrome-ink': sky.chromeInk,
    '--sky-edge': sky.edge,
  };
}
