'use client';

import { useEffect, useRef } from 'react';

/**
 * Ported from the canvas's later revision of `Dream Interpreter v3.dc.html`
 * (the `bgCanvas` prop + its `componentDidMount`). A dithered dot field —
 * three overlapping sine layers thresholded against a 4x4 Bayer matrix —
 * drifting behind the page, with the dots near the cursor pushed along by
 * its recent velocity.
 *
 * Runs its own rAF loop and canvas 2D drawing rather than CSS, since the
 * per-cell threshold test against a fixed dither matrix is what gives the
 * halftone look; a CSS/SVG animation can't reproduce that cheaply.
 */

interface BackgroundCanvasProps {
  /** Whether the field renders at all. */
  motion?: boolean;
  /** Multiplier on how fast the pattern drifts. */
  speed?: number;
  /** Multiplier on how much of the field is filled in (dot density). */
  amount?: number;
  /** How strongly dots near the cursor get carried along by its motion. */
  cursorPull?: number;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export default function BackgroundCanvas({ motion = true, speed = 1, amount = 0.5, cursorPull = 1 }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!motion) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let last = 0;
    let t = Math.random() * 100;
    const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, e: 0, vx: 0, vy: 0 };

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const p = 'touches' in ev ? ev.touches[0] : ev;
      if (m.sx < -999) {
        m.sx = p.clientX;
        m.sy = p.clientY;
      }
      m.e = Math.min(1, m.e + Math.hypot(p.clientX - m.x, p.clientY - m.y) / 120);
      m.x = p.clientX;
      m.y = p.clientY;
    };
    const onLeave = () => {
      m.x = m.sx = -9999;
      m.y = m.sy = -9999;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    let raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 40) return;
      const dt = Math.min(now - last, 100) / 1000;
      last = now;

      const c = canvasRef.current;
      if (!c) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }

      if (!reduce) t += dt * speed;

      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const cell = 6;
      const dot = 3;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const cx = w * 0.5;
      const cy = h * 0.42;
      const cut = 1 - amount * 0.75;
      ctx.fillStyle = 'rgba(170,195,255,0.55)';

      const nsx = m.sx + (m.x - m.sx) * 0.18;
      const nsy = m.sy + (m.y - m.sy) * 0.18;
      m.vx = m.vx * 0.85 + (nsx - m.sx) * 0.9;
      m.vy = m.vy * 0.85 + (nsy - m.sy) * 0.9;
      m.vx = Math.max(-60, Math.min(60, m.vx));
      m.vy = Math.max(-60, Math.min(60, m.vy));
      m.sx = nsx;
      m.sy = nsy;
      m.e *= 0.93;

      const R = 150;
      const R2 = R * R;
      const lim = R2 * 6;

      for (let j = 0; j < rows; j++) {
        const y = j * cell;
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          const wx = x + 40 * Math.sin(y * 0.006 + t * 0.35);
          const wy = y + 40 * Math.cos(x * 0.005 - t * 0.28);
          let v =
            Math.sin(wx * 0.009 + t * 0.2) +
            Math.sin((wx * 0.6 + wy) * 0.007 - t * 0.17) +
            Math.sin(Math.hypot(wx - cx, wy - cy) * 0.012 - t * 0.45);
          v = 0.5 + 0.5 * Math.sin(v * 1.9);
          const k = (v - cut) / (1 - cut);

          let ox = 0;
          let oy = 0;
          if (cursorPull > 0) {
            const dx = x - m.sx;
            const dy = y - m.sy;
            const d2 = dx * dx + dy * dy;
            if (d2 < lim) {
              const f = Math.exp(-d2 / R2) * cursorPull;
              ox = m.vx * f;
              oy = m.vy * f;
            }
          }

          if (k > BAYER[(j & 3) * 4 + (i & 3)]) ctx.fillRect(x + ox, y + oy, dot, dot);
        }
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [motion, speed, amount, cursorPull]);

  if (!motion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
