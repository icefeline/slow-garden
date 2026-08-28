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
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

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
        const rail = railRef.current;
        if (rail) rail.scrollLeft = 0;
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
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft = 0;
    setActive(0);
  }, []);

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
    const rail = railRef.current;
    if (!rail) return;
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
    const railBox = rail.getBoundingClientRect();
    const middle = railBox.left + railBox.width / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(rail.children).forEach((child, i) => {
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
        const name = `slow-garden-${card.id}-${TEMPLATES[active].id}.png`;
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
        background: 'rgba(10, 14, 8, .9)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // Card and controls centre together as one group, so the buttons sit
        // just under the card instead of at the far bottom of the screen with
        // a gap between.
        justifyContent: 'center',
        gap: 14,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
      }}
    >
      {/*
        The rail.

        Cards take 92% of the width, so the next one shows at the edge. That
        sliver is the whole reason this is a rail rather than one card with
        buttons beneath it — nothing else says "there are more" as immediately,
        and it costs no interface to say it. Wide enough to fill the screen,
        narrow enough that the neighbour still shows.

        The snapping is the browser's. `scroll-snap-type` with a centred
        alignment gives the flick, the settle and the momentum that a
        hand-built carousel spends hundreds of lines failing to imitate.
      */}
      <div
        ref={railRef}
        onScroll={onScroll}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          flex: '0 1 auto',
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          // This padding is what lets the first and last cards reach the centre.
          padding: '0 4%',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TEMPLATES.map((template, i) => (
          <div
            key={template.id}
            style={{
              flex: '0 0 92%',
              scrollSnapAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

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
                maxWidth: '100%',
                // Leaves room for the dots and the two buttons beneath.
                maxHeight: '74vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
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

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
          color: '#F7F4E6',
        }}
      >
        {/* Where you are along the rail, and how many there are. */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {TEMPLATES.map((t, i) => (
            <span
              key={t.id}
              style={{
                width: i === active ? 18 : 6,
                height: 6,
                background: i === active ? '#C9F24E' : 'rgba(247,244,230,.3)',
                transition: 'width .25s ease, background .25s ease',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={share}
          disabled={!ready}
          style={{
            background: '#C9F24E',
            color: '#172211',
            border: 'none',
            padding: '14px 34px',
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: ready ? 'pointer' : 'default',
            opacity: ready ? 1 : 0.4,
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
            color: 'rgba(247, 244, 230, .55)',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}
