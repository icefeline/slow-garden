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
import { cardTraceSubjects } from '@/lib/data/card-trace-subjects';

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

/**
 * The filter chains, done in pixels.
 *
 * `ctx.filter` is not supported by WebKit on iOS — it is accepted and then
 * ignored, with no error — so every treatment in these designs silently did
 * nothing on an iPhone. The art drew in full colour with only the blend mode
 * applied, which is why the bleed came out lilac instead of cobalt. It worked
 * in a desktop Chromium, which is exactly how it survived being checked.
 *
 * Doing the arithmetic by hand costs one pass over the pixels and behaves the
 * same in every browser. The operations follow CSS's own definitions and are
 * applied in the order given, as a filter list is.
 */
export interface Treatment {
  grayscale?: boolean;
  invert?: boolean;
  /** 1 leaves it alone; above 1 pushes darks and lights apart. */
  contrast?: number;
  brightness?: number;
}

function treated(
  img: HTMLImageElement,
  w: number,
  h: number,
  t: Treatment,
  posX = 0.5,
  posY = 0.5,
  pixelated = false
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(w));
  out.height = Math.max(1, Math.round(h));
  const c = out.getContext('2d', { willReadFrequently: true });
  if (!c) return out;

  c.imageSmoothingEnabled = !pixelated;
  drawCover(c, img, 0, 0, out.width, out.height, posX, posY);

  const frame = c.getImageData(0, 0, out.width, out.height);
  const px = frame.data;
  const contrast = t.contrast ?? 1;
  const brightness = t.brightness ?? 1;

  for (let i = 0; i < px.length; i += 4) {
    let r = px[i];
    let g = px[i + 1];
    let b = px[i + 2];

    if (t.grayscale) {
      // Rec. 601 luma, the same weighting CSS uses.
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = l;
    }
    if (t.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    if (contrast !== 1) {
      r = (r - 128) * contrast + 128;
      g = (g - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;
    }
    if (brightness !== 1) {
      r *= brightness;
      g *= brightness;
      b *= brightness;
    }

    px[i] = r < 0 ? 0 : r > 255 ? 255 : r;
    px[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    px[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }

  c.putImageData(frame, 0, 0);
  return out;
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
  /*
   * The full name, article included — THE / FOOL, not FOOL. Dropping it made
   * the majors read as labels rather than as the cards they are, and it is the
   * only place in the app that renamed them.
   */
  const words = card.name.toUpperCase().split(' ');
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
   *
   * The Fool is 0 and shows it. Guarding on `number > 0` dropped it silently,
   * which is why one major arcana card had no numeral while the other
   * twenty-one did — it looked arbitrary because it was.
   */
  if (typeof card.number === 'number' && !isCourt(card.id)) {
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
    sctx.drawImage(
      treated(art, artW, artH, { grayscale: true, contrast: 1.75, brightness: 0.9 }),
      padX,
      artYLocal
    );

    // The bone dot screen over the window — the spec's 9px cell at .6.
    const screen = ditherPattern(sctx, 9, PAPER, 0.42);
    if (screen) {
      /*
       * The dot screen at .6 was lifting the whole window — a screen blend at
       * that strength is most of a wash, and the gradient underneath had
       * nothing left to show. Halved, it still reads as a printed screen and
       * the colour keeps its depth.
       */
      sctx.globalCompositeOperation = 'screen';
      sctx.globalAlpha = 0.3;
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
  const prompt = firstQuestions(meaningOf(card, isReversed), 2);
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
  /*
   * Rounded, because a nearest-neighbour upscale landing on a fractional
   * offset samples the edge row inconsistently — the top of the bleed came out
   * ragged, like paper cut crooked. Whole pixels in, whole pixels out.
   */
  ctx.drawImage(img, Math.round(x + (w - dw) * posX), Math.round(y + (h - dh) * posY), Math.round(dw), Math.round(dh));
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

/**
 * The deck holds two readings of every card, and until now the share cards
 * only ever showed one.
 *
 * Meaning and keywords both have a reversed form, and they are not variations
 * on the upright — the Devil upright asks what binds you, reversed it asks
 * what you are ready to release. A reversed draw showing the upright text is
 * not a formatting slip; it is the wrong reading on the card.
 *
 * Description and the memory passage have no reversed form in the deck, so
 * both orientations share them. That is the data's shape, not an oversight
 * here.
 */
function meaningOf(card: TarotCard, isReversed: boolean): string {
  return isReversed ? card.reversedMeaning : card.uprightMeaning;
}

function keywordsOf(card: TarotCard, isReversed: boolean): string[] {
  return isReversed ? card.reversedKeywords : card.uprightKeywords;
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
    /*
     * Deeper than the spec's literal numbers, deliberately.
     *
     * Screen only ever lightens, so brightness above 1 lifts the darks as well
     * as the lights and the cobalt stops reading through them — on artwork
     * with a pale ground the whole card washes out. The reference is a deep
     * blue field with a light figure standing in it, which needs the darks
     * held down and the separation carried by contrast instead.
     */
    ctx.globalAlpha = 0.82;
    // object-position: 50% 42% — the frame sits a little above centre.
    ctx.drawImage(
      treated(
        art,
        CARD_W,
        CARD_H,
        { grayscale: true, contrast: 1.9, brightness: 0.86 },
        0.5,
        0.42,
        true
      ),
      0,
      0
    );
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
  artTreatment: Treatment;
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
  /** The heaviest weight this face actually loads — never more. */
  leadWeight: number;
  bodySize: number;
  leadIn: string;
  chips: boolean;
  body: (card: TarotCard) => string;
}

const PLATE_DARK: PlatePalette = {
  panelBg: '#1b3d5c',
  artTreatment: { grayscale: true, invert: true, contrast: 6, brightness: 1.35 },
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
  leadWeight: 500,
  leadIn: '#f2f0eb',
  chips: true,
  body: (card) => card.description.replace(/^.*? represents /i, ''),
};

const PLATE_LIGHT: PlatePalette = {
  panelBg: '#c9e0a8',
  artTreatment: { grayscale: true, contrast: 9, brightness: 0.75 },
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
  leadWeight: 400,
  leadIn: '#1C3D5C',
  chips: false,
  body: (card) => cardMemories[card.id] ?? card.description,
};

const SPLIT_Y = 1180;

async function drawPlate(
  canvas: HTMLCanvasElement,
  { card, isReversed, date, drawnAt }: ShareContext,
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
      lc.drawImage(treated(art, CARD_W, SPLIT_Y, p.artTreatment), 0, 0);

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
    /*
     * The rows were stepping at the type size plus the gap, which is right for
     * CSS line boxes and too tight for canvas: VT323's glyphs sit small inside
     * their em, so the same arithmetic reads as squeezed. The pitch and the
     * padding both open up.
     */
    const ROW_PITCH = 58;
    const padTopNotes = 26;
    const padBottomNotes = 32;
    const cardW = widest + 30 + 60 + 60;
    const cardH = padTopNotes + 30 + rows.length * ROW_PITCH + padBottomNotes;
    const cardX = CARD_W - cardW;

    ctx.fillStyle = p.notesBg;
    ctx.fillRect(cardX, 120, cardW, cardH);

    ctx.fillStyle = p.notesLabel;
    ctx.font = `16px ${mono}`;
    ctx.letterSpacing = tracking(0.18, 16);
    ctx.textBaseline = 'top';
    ctx.fillText('NOTES', cardX + 30, 120 + padTopNotes);
    ctx.letterSpacing = '0px';

    ctx.font = `42px ${term}`;
    rows.forEach((row, i) => {
      const y = 120 + padTopNotes + 30 + 14 + i * ROW_PITCH;
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
  // Just the date. The footer says which way up the card came out.
  ctx.fillText(time ? `DRAWN ${stamp} · ${time}` : `DRAWN ${stamp}`, left, y);
  ctx.letterSpacing = '0px';
  y += 22 + 42;

  /*
   * The lead-in asks for the heaviest weight the face actually has.
   *
   * It used to ask for 900. VT323 ships one weight and DM Mono stops at 500,
   * so the browser synthesised the rest by smearing the glyphs sideways —
   * which on a pixel face turns the counters to mush. It is why the W in
   * KNIGHT OF SWORDS was unreadable. A synthesised weight never looks bold,
   * only damaged.
   */
  ctx.font = `${p.leadWeight} ${p.bodySize}px ${bodyFamily}`;
  ctx.fillStyle = p.leadIn;
  const lead = p.bodyFace === 'term' ? `> ${card.name.toUpperCase()}_` : card.name.toUpperCase();
  ctx.fillText(lead, left, y);
  const leading = p.bodySize * 1.22;
  y += leading;

  /*
   * How many lines fit, rather than a fixed cap.
   *
   * The passages run to very different lengths — a one-line description on one
   * plate, a whole remembered afternoon on the other — so a fixed count either
   * crowds the short ones or runs the long ones into the chips. This measures
   * what is actually left above the footer and takes that many.
   */
  const footerBaseline = CARD_H - 56;
  const reserved = (p.chips ? 44 + 38 : 0) + 40;
  const room = footerBaseline - y - reserved;
  const maxLines = Math.max(1, Math.floor(room / leading));

  ctx.font = `${p.bodySize}px ${bodyFamily}`;
  ctx.fillStyle = p.textInk;
  const bodyLines = wrap(ctx, p.body(card).toUpperCase(), measure, maxLines);
  y = drawLines(ctx, bodyLines, left, y, leading);

  if (p.chips) {
    // Close under the copy they belong to. At 44 they read as a separate band
    // sitting in the middle of the panel rather than as the card's keywords.
    y += 24;
    ctx.font = `19px ${mono}`;
    ctx.letterSpacing = tracking(0.1, 19);
    let chipX = left;
    for (const word of keywordsOf(card, isReversed)) {
      const label = word.toUpperCase();
      const w = ctx.measureText(label).width + 28;
      if (chipX + w > CARD_W - left) break;
      ctx.strokeStyle = p.textInk;
      ctx.lineWidth = 1;
      ctx.strokeRect(chipX, y, w, 38);
      ctx.fillStyle = p.textInk;
      /*
       * Centred by baseline rather than by a guessed offset. Drawing from the
       * top and nudging down by an eyeballed 11px left the words sitting high
       * in their boxes — the nudge has to change with the type size, and a
       * middle baseline works it out from the metrics instead.
       */
      ctx.textBaseline = 'middle';
      ctx.fillText(label, chipX + 14, y + 19);
      ctx.textBaseline = 'top';
      chipX += w + 10;
    }
    ctx.letterSpacing = '0px';
  }

  /*
   * Footer row, pinned to the bottom of the panel.
   *
   * The question wraps rather than running under the wordmark. It was drawn as
   * one unbounded line, and across the deck that is not an edge case: the
   * questions run to a median of 49 characters and a maximum of 129, and 44 of
   * the 78 cards overflowed the space beside the wordmark.
   *
   * Truncating would therefore have cut most of the deck rather than a few
   * outliers, and shortening means rewriting authored questions to fit a
   * layout — the wrong way round. Two lines hold everything up to about 110
   * characters; the one card longer than that ends in an ellipsis.
   *
   * The wordmark is measured rather than assumed, so the question's measure
   * stays correct if either ever changes.
   */
  const footY = CARD_H - 56;
  ctx.textBaseline = 'alphabetic';

  ctx.font = `40px ${term}`;
  const markW = ctx.measureText('SLOWWW.GARDEN').width;

  /*
   * The orientation, not the question.
   *
   * The question belonged here in the reference, but the deck's questions run
   * to a median of forty-nine characters and a maximum of a hundred and one —
   * they cannot share a line with the wordmark, and wrapping them turned a
   * footer into a paragraph. The orientation is one word, always fits, and is
   * the thing a reader most needs to know that the card itself does not say.
   */
  ctx.fillStyle = p.meta;
  ctx.font = `21px ${mono}`;
  ctx.letterSpacing = tracking(0.14, 21);
  ctx.fillText(isReversed ? 'REVERSED' : 'UPRIGHT', left, footY);
  ctx.letterSpacing = '0px';

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

/**
 * Template 5 — the ascii trace.
 *
 * The trace picks out one element of the card — the sprig on the Queen, the
 * horns on the Devil — and it does that without being told which, because of
 * how the deck is drawn: the subject is dark linework on a lighter ground. So
 * sampling the art on a grid and only setting a glyph where the cell is dark
 * enough leaves the drawn form standing in characters and the ground empty.
 * Different card, different element, no per-card authoring.
 *
 * The ramp runs dense to sparse, so the darkest parts of the drawing come out
 * as the heaviest glyphs and the trace keeps the subject's own weight.
 */
export async function drawAsciiTrace(
  canvas: HTMLCanvasElement,
  { card, isReversed }: ShareContext,
): Promise<void> {
  await fontsReady();
  const { term, sans, mono } = faces();

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  ctx.fillStyle = '#3a3fd6';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  let art: HTMLImageElement | null = null;
  try {
    art = await loadImage(cardImageSrc(card));
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(
      treated(art, CARD_W, CARD_H, { grayscale: true, contrast: 0.95, brightness: 1.06 }, 0.5, 0.38),
      0,
      0
    );
    ctx.restore();
  } catch {
    // no art — the trace has nothing to read, and the type still stands
  }

  /*
   * The trace layer is authored art, not generated.
   *
   * Three attempts at deriving it from the card said why: tracing the whole
   * frame gives a halftone screen, taking the largest dark mass finds the
   * wrong form — the caption read HORNS while the trace sat on the goat's
   * chest — and even aimed at the right region it reproduces linework rather
   * than becoming a shape of its own. The reference traces are drawn things,
   * and they read that way.
   *
   * So each card brings its own lime character layer as a PNG at full card
   * size, laid over the art at the offset the reference uses. A card without
   * one simply has no trace; nothing here fails or waits.
   */
  try {
    const trace = await loadImage(`/trace/${card.id}.png`);
    ctx.drawImage(trace, -8, 6, CARD_W, CARD_H);
  } catch {
    // no trace drawn for this card yet
  }

  // ── header ────────────────────────────────────────────────────────────
  const numeral =
    typeof card.number === 'number' && card.number > 0 && !isCourt(card.id)
      ? `${toRoman(card.number)} · `
      : '';
  ctx.fillStyle = LIME;
  ctx.font = `17px ${mono}`;
  ctx.letterSpacing = tracking(0.24, 17);
  ctx.textBaseline = 'top';
  const subject = cardTraceSubjects[card.id];
  ctx.fillText(
    `${numeral}${isReversed ? 'REVERSED' : 'UPRIGHT'}${subject ? ` · ${subject.toUpperCase()}` : ''}`,
    56,
    52
  );
  ctx.letterSpacing = '0px';

  ctx.fillStyle = '#f4f1e4';
  ctx.font = `700 76px ${sans}`;
  ctx.letterSpacing = tracking(-0.03, 76);
  let hy = 52 + 17 + 24;
  for (const line of wrap(ctx, card.name.toUpperCase(), CARD_W - 112, 3)) {
    ctx.fillText(line, 56, hy);
    hy += 76 * 0.9;
  }
  ctx.letterSpacing = '0px';

  // ── footer ────────────────────────────────────────────────────────────
  const rows = scentRows(card.id);
  const noteLead = 30 * 1.06;
  ctx.font = `30px ${term}`;
  ctx.fillStyle = LIME;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  rows.forEach((row, i) => {
    ctx.fillText(
      row.note.toLowerCase(),
      CARD_W - 56,
      CARD_H - 64 - (rows.length - 1 - i) * noteLead
    );
  });
  ctx.textAlign = 'left';

  ctx.fillStyle = '#f4f1e4';
  ctx.font = `500 31px ${sans}`;
  const message = card.description.replace(/^.*? represents /i, '').toLowerCase();
  const lines = wrap(ctx, message, 520, 3);
  lines.forEach((line, i) => {
    ctx.fillText(line, 56, CARD_H - 64 - (lines.length - 1 - i) * 31 * 1.18);
  });
}
