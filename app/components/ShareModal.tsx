'use client';

import { useEffect, useRef, useState } from 'react';
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
 * The share sheet.
 *
 * Four templates, and the reader picks. They differ in what they carry as much
 * as in how they look — the stamp asks a question, the plates give the
 * description or the memory passage — so the choice is editorial, not a skin.
 */
const TEMPLATES = [
  { id: 'stamp', label: 'stamp', draw: drawStamp },
  { id: 'bleed', label: 'bleed', draw: drawPixelBleed },
  { id: 'plate-dark', label: 'plate', draw: drawPlateDark },
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
 * Instagram Stories. A download is the fallback, and on iOS it is a poor one —
 * the file lands in Files rather than the camera roll, and the reader then has
 * to go looking for it. So where sharing is unavailable the image is simply
 * shown at size and labelled for a long press, which is what people do with
 * images on a phone anyway.
 */
function canShareFiles(file: File): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  );
}

export default function ShareModal({ card, isReversed, date, drawnAt, onClose }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]['id']>('stamp');
  const [state, setState] = useState<'drawing' | 'ready' | 'failed'>('drawing');
  const [saved, setSaved] = useState(false);

  const context: ShareContext = { card, isReversed, date, drawnAt };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const chosen = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];
    let cancelled = false;
    setState('drawing');
    chosen
      .draw(canvas, context)
      .then(() => {
        if (!cancelled) setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('failed');
      });
    return () => {
      cancelled = true;
    };
    // The card cannot change while the sheet is open; only the template can.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, card.id, isReversed]);

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

  const toFile = (): Promise<File | null> =>
    new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        resolve(new File([blob], `slow-garden-${card.id}.png`, { type: 'image/png' }));
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
        // Dismissed the sheet, or the share failed — fall through to saving.
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
        background: 'rgba(10, 14, 8, .88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: '24px 20px',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      }}
    >
      {/* The card. Stops the click so tapping the image does not close. */}
      <canvas
        ref={canvasRef}
        width={CARD_W}
        height={CARD_H}
        onClick={(e) => e.stopPropagation()}
        style={{
          // Whichever of height or width binds first, so the whole card is
          // always visible rather than cropped to the viewport's shape.
          maxHeight: '68vh',
          maxWidth: '100%',
          aspectRatio: `${CARD_W} / ${CARD_H}`,
          objectFit: 'contain',
          display: 'block',
          opacity: state === 'ready' ? 1 : 0.35,
          transition: 'opacity .3s ease',
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
          color: '#F7F4E6',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              style={{
                background: template === t.id ? '#C9F24E' : 'transparent',
                color: template === t.id ? '#172211' : 'rgba(247,244,230,.7)',
                border: `1px solid ${template === t.id ? '#C9F24E' : 'rgba(247,244,230,.28)'}`,
                padding: '7px 14px',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {state === 'failed' ? (
          <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>
            couldn&apos;t draw this one. try again in a moment.
          </p>
        ) : (
          <button
            type="button"
            onClick={share}
            disabled={state !== 'ready'}
            style={{
              background: '#C9F24E',
              color: '#172211',
              border: 'none',
              padding: '14px 30px',
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: state === 'ready' ? 'pointer' : 'default',
              opacity: state === 'ready' ? 1 : 0.4,
            }}
          >
            {saved ? 'saved' : 'share'}
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(247, 244, 230, .6)',
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
