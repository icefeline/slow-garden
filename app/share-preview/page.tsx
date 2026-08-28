'use client';

/**
 * A bench for the share card templates.
 *
 * Development only — it renders a template at full size so the drawing can be
 * looked at directly, without going through onboarding, drawing a card and
 * opening a modal every time a number changes. Not linked from anywhere.
 */

import { useEffect, useRef, useState } from 'react';
import { tarotDeck } from '@/lib/data/tarot-deck';
import { drawStamp, drawPixelBleed, drawPlateDark, drawPlateLight, CARD_W, CARD_H } from '@/lib/utils/share-card';

const DRAWERS = { stamp: drawStamp, bleed: drawPixelBleed, plate: drawPlateDark, plate2: drawPlateLight } as const;

export default function SharePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardId, setCardId] = useState('cups-9');
  const [tpl, setTpl] = useState<keyof typeof DRAWERS>('stamp');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const card = tarotDeck.find((c) => c.id === cardId) ?? tarotDeck[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    DRAWERS[tpl](canvas, {
      card,
      isReversed: false,
      date: new Date('2026-08-27T06:41:00'),
      drawnAt: new Date('2026-08-27T06:41:00').toISOString(),
    })
      .then(() => setError(null))
      .catch((e) => setError(String(e)));
  }, [cardId, tpl]);

  return (
    <main style={{ background: '#0d1310', minHeight: '100vh', padding: 32, color: '#c9f24e' }}>
      <select
        value={cardId}
        onChange={(e) => setCardId(e.target.value)}
        style={{ marginBottom: 24, padding: 8, fontSize: 16 }}
      >
        {tarotDeck.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {(Object.keys(DRAWERS) as Array<keyof typeof DRAWERS>).map((k) => (
        <button key={k} onClick={() => setTpl(k)} style={{ marginRight: 8, padding: '6px 12px', background: tpl === k ? '#c9f24e' : 'transparent', color: tpl === k ? '#111' : '#c9f24e', border: '1px solid #c9f24e', cursor: 'pointer' }}>{k}</button>
      ))}
      {error && <p style={{ color: '#ff8080' }}>{error}</p>}
      <canvas
        ref={canvasRef}
        width={CARD_W}
        height={CARD_H}
        style={{ width: 405, height: 720, display: 'block', border: '1px solid #333' }}
      />
    </main>
  );
}
