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
import { cardScents } from '@/lib/data/card-scents';
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
  const read = (variable: string, fallback: string) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
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
    ctx.fillRect(0, 0, CARD_W, CARD_H);
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
  ctx.letterSpacing = '4px';
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
  const pad = 26;
  const artW = stampW - pad * 2;
  const artH = Math.round(artW * 1.5); // the 2:3 the design gives the art
  const stampH = pad + 180 + artH + 60;

  ctx.fillStyle = PAPER;
  ctx.fillRect(stampX, stampY, stampW, stampH);

  // The card name, one word per line, as the design sets it.
  ctx.fillStyle = INK;
  ctx.font = `700 60px ${sans}`;
  ctx.textBaseline = 'top';
  const words = card.name.replace(/^The /i, '').toUpperCase().split(' ');
  let ny = stampY + pad;
  for (const word of words) {
    ctx.fillText(word, stampX + pad, ny);
    ny += 56;
  }

  // The numeral, where the card has one — the pips carry it too, which is
  // where the design's IX on the Nine of Cups comes from. Court cards have no
  // number and correctly get nothing.
  if (typeof card.number === 'number' && card.number > 0) {
    ctx.fillStyle = COBALT;
    ctx.font = `700 52px ${sans}`;
    ctx.textAlign = 'right';
    ctx.fillText(toRoman(card.number), stampX + stampW - pad, stampY + pad);
    ctx.textAlign = 'left';
  }

  const artY = stampY + pad + 180;
  try {
    const art = await loadImage(cardImageSrc(card));
    ctx.save();
    ctx.beginPath();
    ctx.rect(stampX + pad, artY, artW, artH);
    ctx.clip();
    // grayscale + contrast, then multiplied over the gradient beneath, which is
    // what the design's filter chain amounts to.
    const grad = ctx.createLinearGradient(stampX, artY, stampX + artW, artY + artH);
    grad.addColorStop(0, LIME);
    grad.addColorStop(0.46, '#3f9f6a');
    grad.addColorStop(1, COBALT);
    ctx.fillStyle = grad;
    ctx.fillRect(stampX + pad, artY, artW, artH);

    ctx.globalCompositeOperation = 'multiply';
    ctx.filter = 'grayscale(1) contrast(1.55) brightness(1.08)';
    drawCover(ctx, art, stampX + pad, artY, artW, artH);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  } catch {
    // Art missing — the stamp still reads, and a share is better than an error.
    ctx.fillStyle = COBALT;
    ctx.fillRect(stampX + pad, artY, artW, artH);
  }

  ctx.fillStyle = '#5d6b52';
  ctx.font = `18px ${mono}`;
  ctx.letterSpacing = '3px';
  ctx.fillText(
    `${isReversed ? 'REVERSED' : 'UPRIGHT'} · ${SUIT_ELEMENT[card.suite] ?? ''}`,
    stampX + pad,
    artY + artH + 18
  );
  ctx.textAlign = 'right';
  ctx.fillText('SLOW GARDEN', stampX + stampW - pad, artY + artH + 18);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';

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
  ctx.letterSpacing = '4px';
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
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
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
