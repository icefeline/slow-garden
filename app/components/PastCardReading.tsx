'use client';

import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import TarotCard from './TarotCard';
import { LABEL_TYPE } from './type';

interface PastCardReadingProps {
  date: string;
  card: TarotCardType;
  isReversed: boolean;
  /** Passed straight through to the reading — see TarotCard's `surface`. */
  surface?: 'page' | 'window';
}

/**
 * A past day's reading: the date it was drawn, the reading itself, and whatever
 * the reader wrote that day.
 *
 * This is the whole of what the mobile sheet used to hold inline. It moved out
 * so the desktop window could show the same thing rather than a second version
 * of it — the sheet and the window are two ways into one reading, and a copy
 * would have drifted the first time either was touched. Neither surface's
 * chrome lives here: no handle, no titlebar, no scroll container.
 */
export default function PastCardReading({ date, card, isReversed, surface }: PastCardReadingProps) {
  const reflection = typeof window === 'undefined'
    ? null
    : localStorage.getItem(`reflection-${date}`);

  return (
    <div className="pb-6 pt-4">
      {/* No bottom margin. The card page below already opens with 8px
          of its own padding and 4px above the name, which is the whole
          gap the date needs; the extra 16px here read as a gap between
          two unrelated things rather than a date belonging to a card. */}
      <div className="text-center px-4">
        <p
          /* The same date line as the main screen, rather than a
             drawer-sized one — it was three times the size there and
             took the room the card wanted. Lime on the sheet, the hour's ink
             in a window: the fallback is what leaves the sheet as it was. */
          style={{
            color: 'var(--sky-ink, #C9F24E)',
            fontSize: 'clamp(9px, 2.2vw, 11px)',
            letterSpacing: '0.18em',
            fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
          }}
        >
          {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          }).toLowerCase()}
        </p>
      </div>

      <div className="mb-4">
        <TarotCard
          card={card}
          isReversed={isReversed}
          isRevealed={true}
          cardDate={date}
          surface={surface}
        />
      </div>

      {reflection && reflection.trim() && (
        <div className="mt-4 px-5">
          <h3
            className="mb-2"
            style={{ ...LABEL_TYPE, color: 'var(--sky-ink, #C9F24E)', fontSize: 'clamp(9px, 2.2vw, 11px)' }}
          >
            reflection
          </h3>
          <div
            className="leading-relaxed"
            style={{ color: 'var(--sky-body, #F7F4E6)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: 'clamp(14px, 3.4vw, 16px)' }}
          >
            {reflection}
          </div>
        </div>
      )}
    </div>
  );
}
