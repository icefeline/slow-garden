'use client';

import { useEffect, useRef, useState } from 'react';

interface TearOffPageProps {
  /** Fired once, after the tear animation commits. */
  onTear: () => void;
  /** Disables the drag (e.g. while another animation owns the screen). */
  disabled?: boolean;
}

/**
 * Drag distance that commits the tear, measured in whatever direction the page
 * was pulled rather than straight down.
 *
 * Readers reported the tear as hard to trigger, and it was: only downward travel
 * counted, so a pull that drifted sideways — which is most of them, since a thumb
 * arcs — spent its distance on an axis the commit test ignored.
 *
 * 120 rather than the old 150. The threshold was set against pure vertical travel
 * on a 288px page; now that a diagonal pull counts for its full length, the same
 * gesture reaches further, and the old number asked for a longer drag than the
 * animation needs to read.
 */
const COMMIT_PX = 120;

/**
 * How far the page has been pulled off the pad, in any direction but up.
 *
 * Upward travel is dropped rather than counted: pushing the page back onto its
 * binding is the one direction that should not tear it.
 */
function pullDistance(dx: number, dy: number): number {
  return Math.hypot(dx, Math.max(0, dy));
}

/**
 * The ragged top edge, as percentages of the page width so it survives the
 * mobile/desktop size change. Ported from the prototype's 304px polygon.
 */
const TORN_EDGE = [
  '0 9px', '4.28% 2px', '8.22% 10px', '12.5% 3px', '16.45% 11px', '20.72% 1px',
  '25% 9px', '29.28% 3px', '33.55% 10px', '38.16% 2px', '42.43% 9px', '47.04% 4px',
  '51.32% 11px', '55.92% 2px', '60.2% 8px', '64.8% 3px', '69.08% 10px', '73.68% 2px',
  '77.96% 9px', '82.57% 4px', '86.84% 10px', '91.45% 2px', '95.72% 9px', '100% 3px',
  '100% 100%', '0 100%',
].join(',');

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

/** Days of the current month that already have a card drawn. */
function drawnDaysThisMonth(now: Date): Set<number> {
  const drawn = new Set<number>();
  if (typeof window === 'undefined') return drawn;
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (localStorage.getItem(`card-${iso}`)) drawn.add(d);
  }
  return drawn;
}

/**
 * A tear-off calendar page covering today's card. Dragging it down past the
 * commit distance tears it away and reveals what is underneath.
 *
 * Replaces the old "reveal card" button — the gesture is the reveal, so it
 * carries the day's finality (one page, no redraws) in the interaction itself
 * rather than in a label.
 */
export default function TearOffPage({ onTear, disabled = false }: TearOffPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const tornRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
  const [drawn, setDrawn] = useState<Set<number>>(new Set());
  const [now] = useState(() => new Date());

  useEffect(() => {
    setDrawn(drawnDaysThisMonth(now));
  }, [now]);

  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase();

  useEffect(() => {
    const page = pageRef.current;
    if (!page || disabled) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const onPointerDown = (e: PointerEvent) => {
      if (tornRef.current) return;
      dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 };
      page.classList.remove('tear-settle');
      // Throws NotFoundError if the pointer is already gone. Capture is a
      // nice-to-have (it keeps the drag alive past the element bounds), so a
      // failure here must not take the rest of the handler down with it.
      try {
        page.setPointerCapture?.(e.pointerId);
      } catch {
        /* drag still works, just without capture */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.active || tornRef.current) return;
      drag.dx = e.clientX - drag.startX;
      drag.dy = e.clientY - drag.startY;
      const down = Math.max(0, drag.dy);
      const pull = Math.min(1, pullDistance(drag.dx, drag.dy) / 320);
      // The page follows sideways at 0.7 rather than the old 0.35. At a third of
      // the finger a horizontal pull barely moved it, so a gesture that was in
      // fact tearing the page looked like it was being ignored.
      // written straight to style rather than through state — a re-render per
      // pointermove would make the drag feel laggy
      page.style.transform =
        `translate(${drag.dx * 0.7}px, ${down}px) rotate(${pull * 7 + drag.dx * 0.02}deg)`;
    };

    const end = () => {
      const drag = dragRef.current;
      if (!drag.active || tornRef.current) return;
      drag.active = false;
      page.classList.add('tear-settle');

      if (pullDistance(drag.dx, drag.dy) > COMMIT_PX) {
        tornRef.current = true;
        // Leaves in the direction it was pulled, so a sideways tear does not
        // suddenly swing back the other way on release.
        const away = drag.dx >= 0 ? 1 : -1;
        page.style.transform =
          `translate(${drag.dx * 0.9 + away * 60}px, 900px) rotate(${away * 18 + drag.dx * 0.02}deg)`;
        if (reduceMotion) {
          onTear();
        } else {
          page.addEventListener('transitionend', () => onTear(), { once: true });
        }
      } else {
        page.style.transform = 'none';
      }
    };

    page.addEventListener('pointerdown', onPointerDown);
    page.addEventListener('pointermove', onPointerMove);
    page.addEventListener('pointerup', end);
    page.addEventListener('pointercancel', end);
    page.addEventListener('lostpointercapture', end);
    return () => {
      page.removeEventListener('pointerdown', onPointerDown);
      page.removeEventListener('pointermove', onPointerMove);
      page.removeEventListener('pointerup', end);
      page.removeEventListener('pointercancel', end);
      page.removeEventListener('lostpointercapture', end);
    };
  }, [onTear, disabled]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex justify-center">
      <div className="pointer-events-auto relative w-72 md:w-96" style={{ touchAction: 'none' }}>
        {/* the pad the page is bound to */}
        <div
          className="absolute left-1 right-1 z-10"
          style={{ top: '2px', height: '9px', background: '#efeada', boxShadow: '0 4px 0 #e3dcc8, 0 8px 0 #d8d1bc' }}
        />
        <div
          className="absolute left-0 right-0 z-20"
          style={{ top: '-6px', height: '26px', background: '#b28f5c', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.18)' }}
        />
        {['left', 'right'].map((side) => (
          <div
            key={side}
            className="absolute z-30"
            style={{
              top: '3px', [side]: '15%', width: '9px', height: '9px', borderRadius: '50%',
              background: '#e8e4d6', boxShadow: 'inset 0 1px 1px rgba(0,0,0,.4)',
            }}
          />
        ))}

        {/* the page itself */}
        <div
          ref={pageRef}
          className="tear-page relative cursor-grab select-none active:cursor-grabbing"
          style={{
            containerType: 'inline-size',
            marginTop: '10px',
            aspectRatio: '2 / 3',
            background: '#C9F24E',
            color: '#172211',
            boxShadow: '0 18px 40px rgba(0,0,0,.55)',
            clipPath: `polygon(${TORN_EDGE})`,
            willChange: 'transform',
            fontFamily: 'var(--font-vt323), monospace',
          }}
        >
          {/* paper tooth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#172211 1px, transparent 1.2px)',
              backgroundSize: '5px 5px',
              opacity: 0.07,
            }}
          />

          <div
            className="absolute flex justify-between"
            style={{ left: '6.6cqw', right: '6.6cqw', top: '9cqw', fontSize: '3.6cqw', letterSpacing: '0.18em' }}
          >
            <span>{now.getFullYear()}</span>
            <span>{MONTHS[now.getMonth()].toUpperCase()}</span>
            <span style={{ color: '#4f6b28' }}>{today} / {daysInMonth}</span>
          </div>

          {/* one tick per day — filled for days already drawn, blue for today */}
          <div
            className="absolute grid"
            style={{
              left: '6.6cqw', right: '6.6cqw', top: '18cqw',
              gridTemplateColumns: 'repeat(11, 1fr)', gap: '1.65cqw',
            }}
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <i
                key={d}
                style={{
                  height: '3cqw',
                  border: `1px solid ${d === today ? '#2f5cc4' : 'rgba(23,34,17,.3)'}`,
                  background: d === today ? '#2f5cc4' : drawn.has(d) ? '#172211' : 'transparent',
                }}
              />
            ))}
          </div>

          <div
            className="absolute text-center"
            style={{ left: 0, right: 0, top: '32cqw', fontSize: '67cqw', lineHeight: 0.78 }}
          >
            {today}
          </div>

          <div
            className="absolute"
            style={{ left: '6.6cqw', right: '6.6cqw', top: '92cqw', fontSize: '8.5cqw', lineHeight: 1.25 }}
          >
            &gt; {weekday.toUpperCase()}<br />
            &gt; CARD SEALED<br />
            &gt; PULL TO TEAR
          </div>

          <div
            className="absolute flex justify-between"
            style={{
              left: '6.6cqw', right: '6.6cqw', bottom: '5cqw',
              borderTop: '1px dashed rgba(23,34,17,.3)', paddingTop: '4cqw',
              fontSize: '3.6cqw', letterSpacing: '0.08em', color: '#3f5a1f',
            }}
          >
            <span>NO REDRAWS</span>
            <span>EXPIRES MIDNIGHT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
