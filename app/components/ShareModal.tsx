'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TarotCard } from '@/lib/types/tarot';
import {
  drawStamp,
  drawPixelBleed,
  drawPlateDark,
  drawPlateLight,
  CARD_W,
  CARD_H,
  type ShareContext,
} from '@/lib/utils/share-card';

/**
 * The templates on offer.
 *
 * They differ in what they carry as much as in how they look — the stamp asks
 * a question, one plate gives the card's description, the other its memory
 * passage — so the choice is editorial rather than a skin.
 *
 * The trace card is deliberately absent. It is built and it draws, but its
 * character layer is authored per card and none exist yet, so it would ship as
 * a plainer version of itself. Add it back alongside the first traces.
 */
const TEMPLATES = [
  { id: 'bleed', label: 'bleed', draw: drawPixelBleed },
  { id: 'plate-dark', label: 'plate', draw: drawPlateDark },
  { id: 'stamp', label: 'stamp', draw: drawStamp },
  { id: 'plate-light', label: 'plate ii', draw: drawPlateLight },
] as const;

/**
 * The menu's field and its type — a VCR set-up screen, which is where the
 * design comes from. Deliberately not the app's own ground: this is a machine
 * talking, and it should look like a different machine.
 *
 * A deep navy rather than the brand cobalt. The cobalt is a foreground colour
 * — it is what the cards are drawn IN — and at full strength behind them it
 * competes with the very thing it is holding. This sits back far enough to
 * read as a screen the cards are displayed on.
 */
const MENU_BLUE = '#010179';
const MENU_INK = '#f2efe1';

interface ShareModalProps {
  card: TarotCard;
  isReversed: boolean;
  date: Date;
  drawnAt?: string;
  onClose: () => void;
}

/**
 * Sharing, rather than downloading, wherever the browser has it.
 *
 * `navigator.share` with a file opens the native sheet, which is one tap from
 * Instagram Stories. A download is the fallback, and on iOS a poor one — the
 * file lands in Files rather than the camera roll, and the reader then has to
 * go looking for it. The card is also shown at size, where a long press saves
 * it, which is what people do with images on a phone anyway.
 */
function canShareFiles(file: File): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  );
}

export default function ShareModal({ card, isReversed, date, drawnAt, onClose }: ShareModalProps) {
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  /*
   * The tallest a card may be, measured rather than expressed in CSS.
   *
   * Three attempts to say it in stylesheet terms all failed the same way: a
   * canvas carries an intrinsic 1080x1920, and as a flex item that intrinsic
   * size kept winning over max-height and percentage heights, so the card
   * overflowed the rail and was cropped top and bottom. Measuring the rail and
   * giving the card a pixel ceiling is unambiguous — there is nothing left for
   * the layout to interpret.
   */
  /*
   * The rail's own size, kept current, with the card derived from it at render
   * time rather than stored alongside it.
   *
   * Storing the computed card size let the two fall out of step: the rail was
   * measured once at one width, the viewport then changed, and the card kept
   * the size it had been given — which is how it ended up 92% wide when it had
   * been asked for 80%, and why the end margins no longer matched the card
   * they were spacing.
   */
  const [rail, setRail] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    /*
     * Measured on the wrapper rather than on the rail.
     *
     * The rail is about to be sized to the card, and sizing a thing from its
     * own measurement is a loop: shrink the rail, re-measure, shrink again.
     * The wrapper just holds whatever room the title and controls leave, so it
     * is a stable thing to measure against.
     */
    const el = spaceRef.current;
    if (!el) return;
    const measure = () => {
      if (el.clientWidth && el.clientHeight) {
        setRail({ w: el.clientWidth, h: el.clientHeight });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /*
   * The card takes the smaller of the two bounds — the rail's height, or 80%
   * of its width — and the ends get exactly half of whatever is left beside
   * it, so the first and last can reach the middle.
   */
  const box = rail
    ? (() => {
        /*
         * The width cap is deliberately close to the full width, so the card
         * is bounded by HEIGHT rather than width in almost every case.
         *
         * A tighter cap left the card shorter than the space it sat in, and
         * that leftover pushed the title and the arrows away from it — the
         * gaps above and below were slack, not spacing. Letting the card take
         * the height available closes them, and the peek that remains is what
         * the aspect ratio leaves over.
         */
        const widest = rail.w * 0.95;
        const h = Math.min(rail.h, widest * (CARD_H / CARD_W));
        const w = h * (CARD_W / CARD_H);
        return { w, h, edge: Math.max(0, (rail.w - w) / 2) };
      })()
    : null;

  /**
   * Bring one card to the middle of the rail.
   *
   * Setting scrollLeft to zero is not a snap position for a centre-aligned
   * item — it puts the rail at its start, which leaves the first card sitting
   * slightly off-centre until a gesture makes the browser re-snap. Measuring
   * the gap between the card's middle and the rail's and closing it lands the
   * card exactly, from any starting point.
   *
   * Rects throughout, so everything is in the viewport's frame and there is no
   * offsetParent to reconcile.
   */
  const centre = useCallback((index: number, smooth = false) => {
    const el = railRef.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    const railBox = el.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    const delta = itemBox.left + itemBox.width / 2 - (railBox.left + railBox.width / 2);
    el.scrollTo({ left: el.scrollLeft + delta, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  /*
   * Every template is drawn once, when the sheet opens, rather than on demand.
   *
   * They all read the same card art, so every draw after the first costs only
   * the drawing — the image is already cached. Drawing lazily as each scrolled
   * into view would put a blank card under the reader's thumb at exactly the
   * moment they swiped to it.
   */
  useEffect(() => {
    let cancelled = false;
    const context: ShareContext = { card, isReversed, date, drawnAt };

    Promise.all(
      TEMPLATES.map((template, i) => {
        const canvas = canvasRefs.current[i];
        if (!canvas) return Promise.resolve();
        // One template failing must not take the others with it.
        return template.draw(canvas, context).catch(() => undefined);
      })
    ).then(() => {
      if (cancelled) return;
      setReady(true);
      /*
       * Pin the rail after the drawing, not only on mount.
       *
       * Each canvas has no laid-out height until it has been drawn, so the
       * rail's contents grow underneath it and the browser adjusts scroll to
       * keep what it thinks you were looking at — which landed the sheet on
       * the last template. Resetting once the sizes are final is what actually
       * holds.
       */
      /*
       * A frame later, so the pin lands after the browser has laid out the
       * canvases it has just been given. Setting it in the same tick is still
       * racing the reflow that the drawing causes.
       */
      requestAnimationFrame(() => {
        centre(0);
        setActive(0);
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id, isReversed]);

  /*
   * Open on the first card.
   *
   * The rail is a scroll container inside a dialog that appears mid-page, and
   * browsers do not reliably start it at zero — it opened on the third
   * template, which makes the first two look like something the reader had
   * already passed rather than the beginning of the set.
   */
  useEffect(() => {
    centre(0);
    setActive(0);
  }, [centre]);

  // Escape closes, and the page behind does not scroll while this is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  /**
   * Which card is centred, read from the rail's own scroll position.
   *
   * Scroll-snap does the moving; this only reports where it settled, so the
   * share button acts on what the reader is actually looking at. Measured from
   * the centre rather than the left edge, because the rail is padded so the
   * first and last cards can reach the middle too.
   */
  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    /*
     * Measured with bounding rects, not offsetLeft.
     *
     * offsetLeft is relative to the nearest POSITIONED ancestor, and the rail
     * is not positioned — so the offsets came back in the dialog's frame while
     * scrollLeft was in the rail's, and the two disagreed by the rail's own
     * inset. The dot lit one card ahead of the one actually centred.
     *
     * Rects are all in the viewport's frame, so there is nothing to reconcile.
     */
    const railBox = el.getBoundingClientRect();
    const middle = railBox.left + railBox.width / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const box = (child as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  const toFile = (): Promise<File | null> =>
    new Promise((resolve) => {
      const canvas = canvasRefs.current[active];
      if (!canvas) return resolve(null);
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        /*
         * Named for a person, not for the codebase. It was saving as
         * "slow-garden-pentacles-queen-plate-dark.png", which is the card's
         * internal id and the template's — meaningful here and meaningless in
         * a camera roll. The card's own name and the day it was drawn is what
         * someone would look for.
         */
        const day = date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const name = `slow garden — ${card.name} — ${day}.png`;
        resolve(new File([blob], name, { type: 'image/png' }));
      }, 'image/png');
    });

  const share = async () => {
    const file = await toFile();
    if (!file) return;

    if (canShareFiles(file)) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        // Dismissed, or the share failed — fall through to saving.
      }
    }

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="share this card"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        /*
         * The old VCR and BIOS menu: one flat blue field, pixel type, and a
         * row of transport arrows. It suits the app's machine voice better
         * than a dimmed blur did — and a blur behind a picker is a modern
         * idiom the rest of this page does not speak.
         */
        background: MENU_BLUE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // Card and controls centre together as one group, so the buttons sit
        // just under the card instead of at the far bottom of the screen with
        // a gap between.
        justifyContent: 'center',
        gap: 10,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
      }}
    >
      {/* The menu's title rule, set the way those screens set theirs. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: 'var(--font-vt323), monospace',
          fontSize: 'clamp(20px, 5.4vw, 26px)',
          letterSpacing: '0.12em',
          color: MENU_INK,
          flexShrink: 0,
          paddingBottom: 4,
        }}
      >
        ————— TELL YOUR FRIENDS —————
      </div>

      {/*
        The rail.

        Cards take 80% of the width, so the next one shows at the edge. That
        sliver is the whole reason this is a rail rather than one card with
        buttons beneath it — nothing else says "there are more" as immediately,
        and it costs no interface to say it. Wide enough to fill the screen,
        narrow enough that the neighbour still shows. The end margins are
        exactly half of what is left over — (100 - 80) / 2 — which is what
        lets the first and last cards reach the middle rather than stopping
        short at the ends of the scroll.

        The gap is small on purpose: the neighbours sit close, so more of the
        next card is in view as you move between them.

        The snapping is the browser's. `scroll-snap-type` with a centred
        alignment gives the flick, the settle and the momentum that a
        hand-built carousel spends hundreds of lines failing to imitate.
      */}
      <div
        ref={spaceRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
      <div
        ref={railRef}
        onScroll={onScroll}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          width: '100%',
          /*
           * The rail takes the room the title and controls leave, and the
           * cards size themselves to it. Capping the card at a fraction of the
           * viewport instead meant the total could exceed the screen — the
           * rail then shrank under a card taller than itself and clipped its
           * top and bottom, which is what cut the edges off.
           */
          // Exactly the card's height, so the arrows sit right beneath it
          // rather than beneath the leftover space around it.
          height: box ? box.h : '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TEMPLATES.map((template, i) => (
          <div
            key={template.id}
            style={{
              // Sized from the measured card, so the item and the card it holds
              // are the same width — percentages let those two disagree, and
              // the end spacing was then sized against the wrong one.
              flex: box ? `0 0 ${box.w}px` : '0 0 80%',
              scrollSnapAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              /*
               * The end spacing lives on the first and last cards rather than
               * on the rail, because a flex container with overflow drops its
               * trailing padding — the last card could never reach the middle.
               * Exactly half of what is left beside a card, so both ends
               * centre.
               */
              marginLeft: box && i === 0 ? box.edge : undefined,
              marginRight: box && i === TEMPLATES.length - 1 ? box.edge : undefined,
            }}
          >
            <canvas
              ref={(el) => {
                canvasRefs.current[i] = el;
              }}
              width={CARD_W}
              height={CARD_H}
              aria-label={template.label}
              style={{
                // Whichever of the two binds first: wide screens run out of
                // height, narrow ones run out of width.
                width: box ? box.w : '100%',
                height: box ? box.h : 'auto',
                maxWidth: '100%',
                display: 'block',
                // The neighbours sit back, so the centred one is clearly the
                // one being offered rather than one of four competing.
                opacity: ready ? (i === active ? 1 : 0.45) : 0.2,
                transition: 'opacity .25s ease',
              }}
            />
          </div>
        ))}
      </div>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          fontFamily: 'var(--font-vt323), monospace',
          color: MENU_INK,
        }}
      >
        {/*
          Transport arrows, not dots. Same job — where you are, how many there
          are — in the vocabulary of the machine the rest of this is borrowed
          from. The one you are on is solid; the rest are the dimmed blue those
          menus used for what you had not selected.
        */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          {TEMPLATES.map((t, i) => (
            <span
              key={t.id}
              style={{
                color: i === active ? MENU_INK : 'rgba(242, 239, 225, .38)',
                transition: 'color .25s ease',
              }}
            >
              ▶
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={share}
          disabled={!ready}
          /*
           * The highlighted row from those menus: a filled light block with
           * the field's own blue knocked out of it, rather than a button with
           * a colour of its own.
           */
          style={{
            background: MENU_INK,
            color: MENU_BLUE,
            border: 'none',
            borderRadius: 0,
            padding: '12px 56px',
            fontFamily: 'var(--font-vt323), monospace',
            fontSize: 24,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: ready ? 'pointer' : 'default',
            opacity: ready ? 1 : 0.45,
          }}
        >
          {saved ? 'saved' : 'share'}
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: MENU_INK,
            fontFamily: 'var(--font-vt323), monospace',
            fontSize: 22,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}
