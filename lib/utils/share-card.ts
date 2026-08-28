/**
 * Share cards, drawn on a canvas at story size.
 *
 * Why canvas and not an HTML-to-image library, or Next's ImageResponse: the
 * designs are built from `mix-blend-mode`, `mask-image` dithering,
 * `conic-gradient` and CSS `filter`, and none of those survive Satori or
 * html2canvas — they come out as flat rectangles, silently. Canvas has real
 * equivalents for all of them (`globalCompositeOperation` is blend modes,
 * `createPattern` is the dot grids, and pixel work covers the rest), so the
 * card can be drawn as designed rather than approximated.
 *
 * Everything on a share card is fixed card data — the name, its keywords, the
 * description, the scent recipe, the memory passage. No personalised reading
 * and no reflection ever appears here, which is what lets this run entirely on
 * the device and lets the privacy page keep saying what it says.
 */

import type { TarotCard } from '@/lib/types/tarot';
import { cardScents, cardMemories } from '@/lib/data/card-scents';
import { noteShares } from '@/lib/utils/card-readout';

export const CARD_W = 1080;
export const CARD_H = 1920;

/** The palette the designs are drawn in, which is not the app's own. */
const INK = '#161a3d';
const COBALT = '#2b35d6';
const LIME = '#c9f24e';
const PAPER = '#f2efe1';

/**
 * The faces, resolved at run time.
 *
 * next/font rewrites family names to hashed ones, so they cannot be hardcoded
 * into a canvas font string. Reading the computed value off the document gets
 * whatever the build actually produced.
 */
function faces(): { term: string; sans: string; mono: string } {
  /*
   * Read from body, not documentElement.
   *
   * next/font puts its variables on the class it gives <body>, so they are
   * empty on <html> — and reading them there returned nothing, silently, so
   * every card was drawn in the fallback monospace and sans instead of the
   * faces the spec names. Canvas gives no warning for a font it cannot find;
   * it just draws something else.
   */
  const read = (variable: string, fallback: string) => {
    const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
    return value || fallback;
  };
  return {
    term: read('--font-vt323', 'monospace'),
    sans: read('--font-dm-sans', 'sans-serif'),
    mono: read('--font-dm-mono', 'monospace'),
  };
}

/**
 * Canvas silently falls back to a default face if the font is not yet loaded,
 * and the card is drawn once — there is no reflow to correct it afterwards.
 */
async function fontsReady(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    // no Font Loading API — the draw goes ahead with whatever is available
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Same-origin, so the canvas stays untainted and can be exported.
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

/** The deck's art is PNG under a different name than the card id alone. */
export function cardImageSrc(card: TarotCard): string {
  if (card.id.startsWith('major-')) {
    const namePart = card.name.toLowerCase().replace(/\s+/g, '-').replace(/^the-/, '');
    return `/cards/${card.id}-${namePart}.png`;
  }
  return `/cards/${card.id}.png`;
}

/**
 * The quarter-wedge dot grid, as a repeating pattern.
 *
 * `conic-gradient(lime 0 25%, transparent 0 50%)` at an 8px tile is a quarter
 * turn of colour per tile. Drawn once into a tile canvas and repeated, rather
 * than approximated with squares, so the texture keeps the same weight.
 */
function dotPattern(ctx: CanvasRenderingContext2D, size: number, colour: string): CanvasPattern | null {
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const t = tile.getContext('2d');
  if (!t) return null;
  t.fillStyle = colour;
  t.beginPath();
  t.moveTo(size / 2, size / 2);
  // The wedge runs from twelve o'clock to three o'clock — the first quarter.
  t.arc(size / 2, size / 2, size, -Math.PI / 2, 0);
  t.closePath();
  t.fill();
  return ctx.createPattern(tile, 'repeat');
}

/** The spec gives tracking in em; canvas only takes px. */
function tracking(em: number, size: number): string {
  return `${(em * size).toFixed(2)}px`;
}

/**
 * The stamp tooth.
 *
 * The design punches it with six layered radial masks; canvas gets there by
 * drawing the stamp first and then removing half-circles around the perimeter
 * with `destination-out`. 13px radius on a 26px repeat, which is the spec's
 * cut-out and pitch.
 */
function perforate(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const r = 13;
  const pitch = 26;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000';
  const punch = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  for (let x = r; x <= w; x += pitch) {
    punch(x, 0);
    punch(x, h);
  }
  for (let y = r; y <= h; y += pitch) {
    punch(0, y);
    punch(w, y);
  }
  ctx.restore();
}

/**
 * The radial dot dither — the spec's second screen, distinct from the conic
 * checker: `radial-gradient(color 34-42%, transparent 40-46%)` on a 7-9px cell.
 */
function ditherPattern(
  ctx: CanvasRenderingContext2D,
  size: number,
  colour: string,
  radiusRatio: number
): CanvasPattern | null {
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const t = tile.getContext('2d');
  if (!t) return null;
  t.fillStyle = colour;
  t.beginPath();
  t.arc(size / 2, size / 2, size * radiusRatio, 0, Math.PI * 2);
  t.fill();
  return ctx.createPattern(tile, 'repeat');
}

/** Wrap to a measure, in canvas rather than CSS, and cap the number of lines. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = Infinity
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);

  // A reading that overran is cut at a word and marked, never mid-word.
  if (lines.length === maxLines && words.length) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth - 40) {
      lines[maxLines - 1] = last.replace(/\s+\S+$/, '') + '…';
    }
  }
  return lines;
}

/** Draw a run of text, returning the y the next block should start at. */
function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
): number {
  let cursor = y;
  for (const line of lines) {
    ctx.fillText(line, x, cursor);
    cursor += lineHeight;
  }
  return cursor;
}

/** The repeating marquee bars, top and bottom. */
function marquee(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  height: number,
  font: string
) {
  ctx.save();
  ctx.fillStyle = LIME;
  ctx.fillRect(0, y, CARD_W, height);
  ctx.fillStyle = INK;
  ctx.font = font;
  ctx.letterSpacing = tracking(0.06, 42);
  ctx.textBaseline = 'middle';
  const unit = ctx.measureText(text).width;
  for (let x = 16; x < CARD_W; x += unit) {
    ctx.fillText(text, x, y + height / 2);
  }
  ctx.restore();
}

export interface ShareContext {
  card: TarotCard;
  isReversed: boolean;
  /** ISO date of the draw, and the time it was drawn if it was recorded. */
  date: Date;
  drawnAt?: string;
}

const SUIT_ELEMENT: Record<string, string> = {
  cups: 'WATER',
  wands: 'FIRE',
  swords: 'AIR',
  pentacles: 'EARTH',
  major: 'ARCANA',
};

function formatTime(drawnAt?: string): string {
  if (!drawnAt) return '';
  const d = new Date(drawnAt);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Template 3 — the stamp.
 *
 * Chosen to go first because its imagery is flat colour and one plainly
 * filtered image, so it needs no baked assets: everything on it can be drawn
 * live. The dither plates need their blended layers prepared ahead of time,
 * and this proves the pipeline before that work starts.
 */
export async function drawStamp(
  canvas: HTMLCanvasElement,
  { card, isReversed, date, drawnAt }: ShareContext
): Promise<void> {
  await fontsReady();
  const { term, sans, mono } = faces();

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  ctx.fillStyle = COBALT;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const dots = dotPattern(ctx, 8, LIME);
  if (dots) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = dots;
    // The spec offsets the screen 9px from the top so it does not line up with
    // the marquee's edge.
    ctx.translate(0, 9);
    ctx.fillRect(0, -9, CARD_W, CARD_H);
    ctx.restore();
  }

  const time = formatTime(drawnAt);
  const dateLine = date
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();

  marquee(ctx, '★ CARD OF THE DAY ', 0, 78, `42px ${term}`);

  // The header rule and its two labels.
  ctx.fillStyle = PAPER;
  ctx.font = `22px ${mono}`;
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = tracking(0.22, 22);
  ctx.fillText('SLOW GARDEN', 64, 138);
  ctx.fillStyle = LIME;
  ctx.textAlign = 'right';
  ctx.fillText(time ? `${dateLine} · ${time}` : dateLine, CARD_W - 64, 138);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
  ctx.fillStyle = LIME;
  ctx.fillRect(0, 196, CARD_W, 3);

  // ── the stamp itself ──────────────────────────────────────────────────
  const stampW = 600;
  const stampX = (CARD_W - stampW) / 2;
  const stampY = 250;
  // The spec's asymmetric padding: 24 top, 26 sides, 28 bottom.
  const padX = 26;
  const padTop = 24;
  const padBottom = 28;
  const artW = stampW - padX * 2;
  const artH = Math.round(artW * 1.5); // the 2:3 the design gives the art
  const stampH = padTop + 180 + artH + 44 + padBottom;

  /*
   * The stamp is drawn on its own surface so the tooth can be cut out of it.
   * Punching `destination-out` arcs straight onto the card would take the
   * cobalt field with them and leave holes through to nothing.
   */
  const stamp = document.createElement('canvas');
  stamp.width = stampW;
  stamp.height = stampH;
  const sctx = stamp.getContext('2d');
  if (!sctx) throw new Error('no stamp context');

  sctx.fillStyle = PAPER;
  sctx.fillRect(0, 0, stampW, stampH);

  // The card name, one word per line, as the design sets it.
  sctx.fillStyle = INK;
  sctx.font = `700 60px ${sans}`;
  sctx.letterSpacing = tracking(-0.02, 60);
  sctx.textBaseline = 'top';
  const words = card.name.replace(/^The /i, '').toUpperCase().split(' ');
  let ny = padTop;
  for (const word of words) {
    sctx.fillText(word, padX, ny);
    ny += 56; // 60px at the spec's .94 leading
  }
  sctx.letterSpacing = '0px';

  /*
   * The numeral, where the card has one.
   *
   * The pips carry it as well as the majors, which is where the design's IX on
   * the Nine of Cups comes from. The court does not — and the court cards DO
   * hold a number in the deck data, 11 through 14, so a truthy check is not
   * enough: it printed XIII on the Queen of Pentacles, which is the same
   * mistake the mock made and for the same reason.
   */
  if (typeof card.number === 'number' && card.number > 0 && !isCourt(card.id)) {
    sctx.fillStyle = COBALT;
    sctx.font = `700 52px ${sans}`;
    sctx.textAlign = 'right';
    sctx.fillText(toRoman(card.number), stampW - padX, padTop);
    sctx.textAlign = 'left';
  }

  const artYLocal = padTop + 180;
  try {
    const art = await loadImage(cardImageSrc(card));
    sctx.save();
    sctx.beginPath();
    sctx.rect(padX, artYLocal, artW, artH);
    sctx.clip();

    // The gradient the art is multiplied onto, at the spec's 165deg.
    const grad = sctx.createLinearGradient(padX, artYLocal, padX + artW, artYLocal + artH);
    grad.addColorStop(0, LIME);
    grad.addColorStop(0.46, '#3f9f6a');
    grad.addColorStop(1, COBALT);
    sctx.fillStyle = grad;
    sctx.fillRect(padX, artYLocal, artW, artH);

    sctx.globalCompositeOperation = 'multiply';
    sctx.filter = 'grayscale(1) contrast(1.55) brightness(1.08)';
    drawCover(sctx, art, padX, artYLocal, artW, artH);
    sctx.filter = 'none';

    // The bone dot screen over the window — the spec's 9px cell at .6.
    const screen = ditherPattern(sctx, 9, PAPER, 0.42);
    if (screen) {
      sctx.globalCompositeOperation = 'screen';
      sctx.globalAlpha = 0.6;
      sctx.fillStyle = screen;
      sctx.fillRect(padX, artYLocal, artW, artH);
      sctx.globalAlpha = 1;
    }
    sctx.globalCompositeOperation = 'source-over';
    sctx.restore();
  } catch {
    // Art missing — the stamp still reads, and a share beats an error.
    sctx.fillStyle = COBALT;
    sctx.fillRect(padX, artYLocal, artW, artH);
  }

  sctx.fillStyle = '#5d6b52';
  sctx.font = `18px ${mono}`;
  sctx.letterSpacing = tracking(0.16, 18);
  sctx.fillText(
    `${isReversed ? 'REVERSED' : 'UPRIGHT'} · ${SUIT_ELEMENT[card.suite] ?? ''}`,
    padX,
    artYLocal + artH + 18
  );
  sctx.textAlign = 'right';
  sctx.fillText('SLOW GARDEN', stampW - padX, artYLocal + artH + 18);
  sctx.textAlign = 'left';
  sctx.letterSpacing = '0px';

  // The tooth, then the finished stamp onto the card.
  perforate(sctx, stampW, stampH);
  ctx.drawImage(stamp, stampX, stampY);

  // ── the prompt ────────────────────────────────────────────────────────
  ctx.fillStyle = LIME;
  ctx.font = `40px ${term}`;
  ctx.fillText(time ? `> PULLED ${time}_` : '> PULLED_', 64, 1440);

  ctx.fillStyle = PAPER;
  ctx.font = `44px ${term}`;
  const prompt = firstQuestions(card.uprightMeaning, 2);
  drawLines(ctx, wrap(ctx, prompt, CARD_W - 128, 6), 64, 1500, 54);

  // ── the closing rules ─────────────────────────────────────────────────
  ctx.fillStyle = LIME;
  ctx.fillRect(0, CARD_H - 190, CARD_W, 3);
  ctx.fillStyle = PAPER;
  ctx.font = `22px ${mono}`;
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = tracking(0.2, 22);
  ctx.fillText('ONE CARD A DAY', 64, CARD_H - 134);
  ctx.fillStyle = LIME;
  ctx.textAlign = 'right';
  ctx.fillText('NO REDRAWS', CARD_W - 64, CARD_H - 134);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';

  marquee(ctx, 'SLOWWW.GARDEN ★ ', CARD_H - 78, 78, `42px ${term}`);
}

/** `object-fit: cover`, which canvas has no equivalent for. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  /** `object-position`, as fractions. Defaults to dead centre. */
  posX = 0.5,
  posY = 0.5
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) * posX, y + (h - dh) * posY, dw, dh);
}

/** The meanings are written as runs of questions; the card wants the first few. */
function firstQuestions(meaning: string, count: number): string {
  /*
   * Sentences that end in a question mark, and only those. Matching on "up to
   * the next ?" instead swept in whatever declarative clause preceded the
   * first question — the Nine of Cups card opened "wishes fulfilled, deep
   * satisfaction earned and deserved." before asking anything, which read as
   * the card describing itself rather than asking the reader something.
   */
  const questions = meaning.match(/[^.?!]+\?/g);
  if (!questions) return meaning;
  return questions.slice(0, count).map((q) => q.trim().toLowerCase()).join(' ');
}

/** Page, knight, queen, king — numbered in the data, unnumbered on the card. */
function isCourt(cardId: string): boolean {
  return /-(page|knight|queen|king)$/.test(cardId);
}

function toRoman(n: number): string {
  const table: Array<[number, string]> = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let rest = n;
  let out = '';
  for (const [value, glyph] of table) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out || '0';
}

/** Kept for the templates that list the recipe; unused by the stamp. */
export function scentRows(cardId: string): Array<{ note: string; share: number }> {
  const scent = cardScents[cardId];
  if (!scent) return [];
  const notes = [...scent.top, ...scent.heart, ...scent.base];
  const shares = noteShares(cardId, notes.length);
  return notes.map((note, i) => ({ note: note.toUpperCase(), share: shares[i] }));
}

/**
 * Template 1 — pixel bleed.
 *
 * One image filling the frame, screened over cobalt, with the name sitting in
 * the scrim at the bottom. The pixelation is real rather than a filter: the art
 * is drawn small with smoothing off and scaled back up, which is what
 * `image-rendering: pixelated` does and what no CSS filter can imitate.
 */
export async function drawPixelBleed(
  canvas: HTMLCanvasElement,
  { card, date, drawnAt }: ShareContext
): Promise<void> {
  await fontsReady();
  const { term, mono } = faces();

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  ctx.fillStyle = COBALT;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  try {
    const art = await loadImage(cardImageSrc(card));
    /*
     * `image-rendering: pixelated`, which is not what I first took it for.
     *
     * It does not reduce the image. It turns off smoothing while the browser
     * ENLARGES one — and this art is 896x1344 being scaled about 1.43x to
     * cover a 9:16 frame, so what the spec asks for is a crisp
     * nearest-neighbour upscale: hard edges, every source pixel intact.
     *
     * Downsampling first, as this did, threw away three quarters of the
     * picture before enlarging what was left. No choice of divisor recovers
     * that; the result is soft because the detail is gone, not because the
     * blocks are too small.
     */
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.9;
    ctx.imageSmoothingEnabled = false;
    ctx.filter = 'grayscale(1) contrast(1.5) brightness(1.1)';
    // object-position: 50% 42% — the frame sits a little above centre.
    drawCover(ctx, art, 0, 0, CARD_W, CARD_H, 0.5, 0.42);
    ctx.filter = 'none';
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
  } catch {
    // no art — the field and the type still carry the card
  }

  const checker = dotPattern(ctx, 11, LIME);
  if (checker) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = checker;
    ctx.fillRect(0, 0, CARD_W, 520);
    ctx.restore();
  }

  const scrim = ctx.createLinearGradient(0, CARD_H - 640, 0, CARD_H);
  scrim.addColorStop(0, 'rgba(22,26,61,0)');
  scrim.addColorStop(1, 'rgba(22,26,61,.86)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, CARD_H - 640, CARD_W, 640);

  // Name block, centred, bottom 300.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = LIME;
  ctx.font = `96px ${term}`;
  ctx.fillText(card.name.toUpperCase(), CARD_W / 2, CARD_H - 300 - 78);

  ctx.fillStyle = '#fff';
  ctx.font = `52px ${mono}`;
  const time = formatTime(drawnAt);
  ctx.fillText(
    time ? `MY CARD TODAY, ${time}` : 'MY CARD TODAY',
    CARD_W / 2,
    CARD_H - 300 - 4
  );
  ctx.textAlign = 'left';

  // Footer bar.
  ctx.fillStyle = LIME;
  ctx.fillRect(0, CARD_H - 96, CARD_W, 96);
  ctx.fillStyle = INK;
  ctx.font = `46px ${term}`;
  ctx.letterSpacing = tracking(0.08, 46);
  ctx.textBaseline = 'middle';
  ctx.fillText('> SLOWWW.GARDEN', 60, CARD_H - 48);
  ctx.textAlign = 'right';
  ctx.fillText('ONE CARD A DAY', CARD_W - 60, CARD_H - 48);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
  void date;
}

/**
 * Templates 2 and 4 — the dither plates.
 *
 * The same split geometry inverted tonally, so they are one drawing with a
 * palette rather than two that would drift apart. The dark plate carries the
 * card's description and its keyword chips; the light one carries the memory
 * passage and drops the chips, which is what the spec has.
 *
 * The dithering is a real mask, not a texture laid over the top: the art is
 * drawn to its own surface, then everything outside the dot grid is removed
 * with `destination-in`, so the plate shows through the holes exactly as the
 * CSS mask does.
 */
interface PlatePalette {
  panelBg: string;
  artFilter: string;
  artBlend: GlobalCompositeOperation;
  ditherCell: number;
  ditherRatio: number;
  overlay: string;
  overlayBlend: GlobalCompositeOperation;
  notesBg: string;
  notesInk: string;
  notesValue: string;
  notesLabel: string;
  textBg: string;
  textInk: string;
  meta: string;
  bodyFace: 'mono' | 'term';
  bodySize: number;
  leadIn: string;
  chips: boolean;
  body: (card: TarotCard) => string;
}

const PLATE_DARK: PlatePalette = {
  panelBg: '#1b3d5c',
  artFilter: 'grayscale(1) invert(1) contrast(6) brightness(1.35)',
  artBlend: 'screen',
  ditherCell: 8,
  ditherRatio: 0.36,
  overlay: '#c9e0a8',
  overlayBlend: 'darken',
  notesBg: '#12180f',
  notesInk: '#c9e0a8',
  notesValue: '#8fa8c4',
  notesLabel: '#c9e0a8',
  textBg: '#12180f',
  textInk: '#f2f0eb',
  meta: '#a9b3a0',
  bodyFace: 'mono',
  bodySize: 64,
  leadIn: '#f2f0eb',
  chips: true,
  body: (card) => card.description.replace(/^.*? represents /i, ''),
};

const PLATE_LIGHT: PlatePalette = {
  panelBg: '#c9e0a8',
  artFilter: 'grayscale(1) contrast(9) brightness(.75)',
  artBlend: 'multiply',
  ditherCell: 7,
  ditherRatio: 0.34,
  overlay: '#1b3d5c',
  overlayBlend: 'lighten',
  notesBg: '#f2f0eb',
  notesInk: '#1b3d5c',
  notesValue: '#7d8a72',
  notesLabel: '#5f6b52',
  textBg: '#f2f0eb',
  textInk: '#111',
  meta: '#555',
  bodyFace: 'term',
  bodySize: 48,
  leadIn: '#1C3D5C',
  chips: false,
  body: (card) => cardMemories[card.id] ?? card.description,
};

const SPLIT_Y = 1180;

async function drawPlate(
  canvas: HTMLCanvasElement,
  { card, date, drawnAt }: ShareContext,
  p: PlatePalette
): Promise<void> {
  await fontsReady();
  const { term, mono } = faces();
  const bodyFamily = p.bodyFace === 'term' ? term : mono;

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  // ── image panel ───────────────────────────────────────────────────────
  ctx.fillStyle = p.panelBg;
  ctx.fillRect(0, 0, CARD_W, SPLIT_Y);

  try {
    const art = await loadImage(cardImageSrc(card));
    const layer = document.createElement('canvas');
    layer.width = CARD_W;
    layer.height = SPLIT_Y;
    const lc = layer.getContext('2d');
    if (lc) {
      lc.filter = p.artFilter;
      drawCover(lc, art, 0, 0, CARD_W, SPLIT_Y);
      lc.filter = 'none';

      // Punch the dot grid: keep only what falls inside a dot.
      const dots = ditherPattern(lc, p.ditherCell, '#000', p.ditherRatio);
      if (dots) {
        lc.globalCompositeOperation = 'destination-in';
        lc.fillStyle = dots;
        lc.fillRect(0, 0, CARD_W, SPLIT_Y);
        lc.globalCompositeOperation = 'source-over';
      }

      ctx.save();
      ctx.globalCompositeOperation = p.artBlend;
      ctx.drawImage(layer, 0, 0);
      ctx.restore();
    }
  } catch {
    // no art — the panel keeps its ground
  }

  ctx.save();
  ctx.globalCompositeOperation = p.overlayBlend;
  ctx.fillStyle = p.overlay;
  ctx.fillRect(0, 0, CARD_W, SPLIT_Y);
  ctx.restore();

  // ── the notes card, flush right ───────────────────────────────────────
  const rows = scentRows(card.id);
  if (rows.length) {
    ctx.font = `42px ${term}`;
    const widest = Math.max(...rows.map((r) => ctx.measureText(r.note).width));
    const cardW = widest + 28 + 60 + 60;
    const cardH = 22 + 22 + rows.length * 52 + 26;
    const cardX = CARD_W - cardW;

    ctx.fillStyle = p.notesBg;
    ctx.fillRect(cardX, 120, cardW, cardH);

    ctx.fillStyle = p.notesLabel;
    ctx.font = `16px ${mono}`;
    ctx.letterSpacing = tracking(0.18, 16);
    ctx.textBaseline = 'top';
    ctx.fillText('NOTES', cardX + 30, 142);
    ctx.letterSpacing = '0px';

    ctx.font = `42px ${term}`;
    rows.forEach((row, i) => {
      const y = 186 + i * 52;
      ctx.fillStyle = p.notesInk;
      ctx.fillText(row.note, cardX + 30, y);
      ctx.fillStyle = p.notesValue;
      ctx.textAlign = 'right';
      ctx.fillText(String(row.share), cardX + cardW - 30, y);
      ctx.textAlign = 'left';
    });
  }

  // ── text panel ────────────────────────────────────────────────────────
  ctx.fillStyle = p.textBg;
  ctx.fillRect(0, SPLIT_Y, CARD_W, CARD_H - SPLIT_Y);

  const left = 56;
  const measure = CARD_W - left * 2;
  let y = SPLIT_Y + 44;

  ctx.fillStyle = p.meta;
  ctx.font = `22px ${mono}`;
  ctx.letterSpacing = tracking(0.14, 22);
  ctx.textBaseline = 'top';
  const stamp = date
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
  const time = formatTime(drawnAt);
  ctx.fillText(time ? `DRAWN ${stamp} · ${time}` : `DRAWN ${stamp}`, left, y);
  ctx.letterSpacing = '0px';
  y += 26 + 26;

  // The name leads the body, in the same face at the same size.
  ctx.font = `900 ${p.bodySize}px ${bodyFamily}`;
  ctx.fillStyle = p.leadIn;
  const lead = p.bodyFace === 'term' ? `> ${card.name.toUpperCase()}_` : card.name.toUpperCase();
  ctx.fillText(lead, left, y);
  y += p.bodySize * 1.14;

  ctx.font = `${p.bodySize}px ${bodyFamily}`;
  ctx.fillStyle = p.textInk;
  const bodyLines = wrap(ctx, p.body(card).toUpperCase(), measure, 8);
  y = drawLines(ctx, bodyLines, left, y, p.bodySize * 1.14);

  if (p.chips) {
    y += 34;
    ctx.font = `19px ${mono}`;
    ctx.letterSpacing = tracking(0.1, 19);
    let chipX = left;
    for (const word of card.uprightKeywords) {
      const label = word.toUpperCase();
      const w = ctx.measureText(label).width + 28;
      if (chipX + w > CARD_W - left) break;
      ctx.strokeStyle = p.textInk;
      ctx.lineWidth = 1;
      ctx.strokeRect(chipX, y, w, 33);
      ctx.fillStyle = p.textInk;
      ctx.fillText(label, chipX + 14, y + 8);
      chipX += w + 10;
    }
    ctx.letterSpacing = '0px';
  }

  // Footer row, pinned to the bottom of the panel.
  const footY = CARD_H - 44;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = p.meta;
  ctx.font = `21px ${mono}`;
  ctx.fillText(firstQuestions(card.uprightMeaning, 1).toUpperCase(), left, footY);
  ctx.fillStyle = p.textInk;
  ctx.font = `40px ${term}`;
  ctx.textAlign = 'right';
  ctx.fillText('SLOWWW.GARDEN', CARD_W - left, footY);
  ctx.textAlign = 'left';
}

export const drawPlateDark = (c: HTMLCanvasElement, ctx: ShareContext) =>
  drawPlate(c, ctx, PLATE_DARK);
export const drawPlateLight = (c: HTMLCanvasElement, ctx: ShareContext) =>
  drawPlate(c, ctx, PLATE_LIGHT);
