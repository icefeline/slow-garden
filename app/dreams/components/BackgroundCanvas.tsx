'use client';

import { useEffect, useRef } from 'react';

/**
 * Ported from the canvas's later revision of `Dream Interpreter v3.dc.html`
 * (the `bgCanvas` prop + its `componentDidMount`/`renderVals`). Eight dot-field
 * styles sharing one dithered-halftone renderer (a 4x4 Bayer matrix thresholds
 * a per-cell value into on/off), plus a play/pause toggle and a style switcher.
 *
 * Everything that drives a style (stars, ink trails, click ripples, tilt,
 * hold-and-release, scroll velocity) is set up once on mount and kept alive
 * for the component's lifetime — switching styles or pausing never resets it,
 * it just changes which branch the per-frame draw takes. That is why the live
 * prop values are read through a ref inside the animation loop instead of
 * being effect dependencies: making them dependencies would tear the whole
 * simulation down and rebuild it every time the reader flips a switch.
 */

export type BgStyle =
  | 'marble drift'
  | 'sleep tide'
  | 'constellations'
  | 'ink memory'
  | 'sleep stages'
  | 'tilt sand'
  | 'scroll smear'
  | 'hold to remember';

export const BG_STYLES: BgStyle[] = [
  'marble drift',
  'sleep tide',
  'constellations',
  'ink memory',
  'sleep stages',
  'tilt sand',
  'scroll smear',
  'hold to remember',
];

interface BackgroundCanvasProps {
  /** Whether the field renders at all. */
  motion?: boolean;
  /** Multiplier on how fast the pattern drifts. */
  speed?: number;
  /** Multiplier on how much of the field is filled in (dot density). */
  amount?: number;
  /** How strongly dots near the cursor/touch get carried along by its motion. */
  cursorPull?: number;
  /** Which of the eight styles is active. */
  bgStyle?: BgStyle;
  /** Recent touch/click/scroll points render in the accent yellow instead of the ambient blue. */
  yellowTouch?: boolean;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** The four colour pairs "sleep stages" cross-fades between on each click. */
const STAGES: [string, string, string][] = [
  ['#4A2FE0', '#0A1C8A', '#6F8BFF'],
  ['#081676', '#1B0E63', '#3C4FD8'],
  ['#8B2FD8', '#1438C4', '#B98BFF'],
  ['#0C7FA6', '#2B31E3', '#5FC8F0'],
];

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (x: string, y: string, f: number) => {
  const a = hex(x);
  const b = hex(y);
  return a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(',');
};

interface Point {
  x: number;
  y: number;
}
interface Click extends Point {
  t0: number;
  a: number;
}
interface HeatPoint extends Point {
  t0: number;
}
interface TrailPoint extends Point {
  t0: number;
}
interface Star extends Point {
  p: number;
  s: number;
  b: number;
  z: number;
}

export default function BackgroundCanvas({
  motion = true,
  speed = 1,
  amount = 0.5,
  cursorPull = 1,
  bgStyle = 'marble drift',
  yellowTouch = false,
}: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Live values the draw loop reads each frame, without restarting the loop when they change. */
  const live = useRef({ motion, speed, amount, cursorPull, bgStyle, yellowTouch });
  useEffect(() => {
    live.current = { motion, speed, amount, cursorPull, bgStyle, yellowTouch };
  }, [motion, speed, amount, cursorPull, bgStyle, yellowTouch]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let last = 0;
    let t = Math.random() * 100;
    let rt = 0;
    let drift = 0;
    let stars: Star[] | null = null;
    let sw = 0;
    let sh = 0;
    let pal = 0;
    let palFrom = 0;
    let palT = -99;

    const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, e: 0, vx: 0, vy: 0 };
    const clicks: Click[] = [];
    const trail: TrailPoint[] = [];
    const heat: HeatPoint[] = [];
    const tilt = { x: 0, y: 0, dx: 0, dy: 0, dev: false, asked: false };
    const hold = { on: false, x: 0, y: 0, amt: 0 };
    const sc = { y: window.scrollY, v: 0, off: 0 };

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.dev = true;
      tilt.dx = Math.max(-1, Math.min(1, e.gamma / 40));
      tilt.dy = Math.max(-1, Math.min(1, (e.beta - 35) / 40));
    };
    const onUp = () => {
      hold.on = false;
    };
    const onHoldMove = (ev: PointerEvent) => {
      if (hold.on) {
        hold.x = ev.clientX;
        hold.y = ev.clientY;
      }
    };
    const onWheelV = (ev: WheelEvent) => {
      sc.v += Math.max(-80, Math.min(80, ev.deltaY)) * 0.25;
    };
    const addHeat = (x: number, y: number) => {
      const lh = heat[heat.length - 1];
      if (!lh || Math.hypot(x - lh.x, y - lh.y) > 14 || rt - lh.t0 > 0.15) heat.push({ x, y, t0: rt });
      if (heat.length > 60) heat.shift();
    };
    const onTouch = (ev: TouchEvent) => {
      for (let i = 0; i < ev.touches.length; i++) addHeat(ev.touches[i].clientX, ev.touches[i].clientY);
    };
    const onDrag = (ev: PointerEvent) => {
      if (ev.buttons & 1) addHeat(ev.clientX, ev.clientY);
    };
    const onScroll = () => {
      if (m.x > -999) addHeat(m.x, m.y);
      else addHeat(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * (0.3 + Math.random() * 0.4));
    };
    const onWheel = () => {
      if (m.x > -999) addHeat(m.x + (Math.random() - 0.5) * 30, m.y + (Math.random() - 0.5) * 30);
    };
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
    const onDown = (ev: PointerEvent) => {
      const target = ev.target as HTMLElement | null;
      if (target?.closest && target.closest('a,button,input,textarea,select,label')) return;
      clicks.push({ x: ev.clientX, y: ev.clientY, t0: rt, a: Math.random() * 6.283 });
      if (clicks.length > 8) clicks.shift();
      hold.on = true;
      hold.x = ev.clientX;
      hold.y = ev.clientY;
      const requestPermission = (
        window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      )?.requestPermission;
      if (!tilt.asked && typeof requestPermission === 'function' && live.current.bgStyle === 'tilt sand') {
        tilt.asked = true;
        requestPermission().catch(() => {});
      }
      if (live.current.bgStyle === 'sleep stages') {
        palFrom = pal;
        pal = (pal + 1) % STAGES.length;
        palT = rt;
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onHoldMove);
    window.addEventListener('wheel', onWheelV, { passive: true });
    window.addEventListener('deviceorientation', onOrient);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onDrag);
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

      const { speed: curSpeed, amount: curAmount, cursorPull: pull, bgStyle: mode, motion: motionOn, yellowTouch: wantsGlow } = live.current;

      if (!motionOn) return;
      if (!reduce) t += dt * curSpeed;
      rt += dt;

      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const cell = 6;
      const dot = 3;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const cx = w * 0.5;
      const cy = h * 0.42;
      const cut = 1 - curAmount * 0.75;

      const nsx = m.sx + (m.x - m.sx) * 0.18;
      const nsy = m.sy + (m.y - m.sy) * 0.18;
      m.vx = m.vx * 0.85 + (nsx - m.sx) * 0.9;
      m.vy = m.vy * 0.85 + (nsy - m.sy) * 0.9;
      m.vx = Math.max(-60, Math.min(60, m.vx));
      m.vy = Math.max(-60, Math.min(60, m.vy));
      m.sx = nsx;
      m.sy = nsy;
      m.e *= 0.93;
      const has = m.x > -999;

      while (clicks.length && rt - clicks[0].t0 > 7) clicks.shift();
      if (has) {
        const lt = trail[trail.length - 1];
        if (!lt || Math.hypot(m.x - lt.x, m.y - lt.y) > 10) trail.push({ x: m.x, y: m.y, t0: rt });
      }
      const glow = wantsGlow && !reduce;
      while (heat.length && rt - heat[0].t0 > 1.8) heat.shift();
      const hot = glow && heat.length > 0;
      const heatAt = (x: number, y: number) => {
        let v = 0;
        for (const p of heat) {
          const dx = x - p.x;
          const dy = y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 72000) {
            const f = 1 - (rt - p.t0) / 1.8;
            v += Math.exp(-d2 / 14400) * f * f;
          }
        }
        return v;
      };
      while (trail.length && (rt - trail[0].t0 > 1.6 || trail.length > 30)) trail.shift();

      const marble = (x: number, y: number) => {
        const wx = x + 40 * Math.sin(y * 0.006 + t * 0.35);
        const wy = y + 40 * Math.cos(x * 0.005 - t * 0.28);
        let v =
          Math.sin(wx * 0.009 + t * 0.2) +
          Math.sin((wx * 0.6 + wy) * 0.007 - t * 0.17) +
          Math.sin(Math.hypot(wx - cx, wy - cy) * 0.012 - t * 0.45);
        v = 0.5 + 0.5 * Math.sin(v * 1.9);
        return (v - cut) / (1 - cut);
      };

      const field = (kfn: (x: number, y: number) => number, drag?: boolean) => {
        const ys: number[] = [];
        const R2 = 22500;
        const lim = R2 * 6;
        for (let j = 0; j < rows; j++) {
          const y = j * cell;
          for (let i = 0; i < cols; i++) {
            const x = i * cell;
            let k = kfn(x, y);
            let hv = 0;
            if (hot) {
              hv = Math.min(1, heatAt(x, y));
              k += hv * 1.1;
            }
            let ox = 0;
            let oy = 0;
            if (drag && pull > 0) {
              const dx = x - m.sx;
              const dy = y - m.sy;
              const d2 = dx * dx + dy * dy;
              if (d2 < lim) {
                const f = Math.exp(-d2 / R2) * pull;
                ox = m.vx * f;
                oy = m.vy * f;
              }
            }
            if (k > BAYER[(j & 3) * 4 + (i & 3)]) {
              if (hv > 0.12) ys.push(x + ox, y + oy);
              else ctx.fillRect(x + ox, y + oy, dot, dot);
            }
          }
        }
        if (ys.length) {
          const pf = ctx.fillStyle;
          ctx.fillStyle = 'rgba(243,243,92,0.92)';
          for (let q = 0; q < ys.length; q += 2) ctx.fillRect(ys[q], ys[q + 1], dot, dot);
          ctx.fillStyle = pf;
        }
      };

      ctx.fillStyle = 'rgba(170,195,255,0.55)';

      if (mode === 'sleep tide') {
        field((x, y) => {
          let ph = y * 0.011 + Math.sin(x * 0.004 + t * 0.25) * 1.6 + Math.sin(x * 0.011 - t * 0.4) * 0.5 - t * 0.5;
          let boost = 0;
          for (const cl of clicks) {
            const age = rt - cl.t0;
            const q = (Math.hypot(x - cl.x, y - cl.y) - age * 200) / 45;
            if (q > -3 && q < 3) {
              const g = Math.exp(-q * q) * Math.max(0, 1 - age / 5);
              ph += g * 2.2;
              boost += g * 0.25;
            }
          }
          let v = 0.5 + 0.5 * Math.sin(ph);
          v *= v;
          let k = (v - cut) / (1 - cut) + boost;
          if (pull > 0 && has) {
            const dx = x - m.sx;
            const dy = y - m.sy;
            k += Math.exp(-(dx * dx + dy * dy) / 28900) * pull * v * 0.9;
          }
          return k;
        });
      } else if (mode === 'ink memory') {
        field((x, y) => {
          let k = marble(x, y) * 0.45;
          for (const p of trail) {
            const age = rt - p.t0;
            const dx = x - p.x;
            const dy = y - (p.y - age * 24);
            const r = 22 + age * 34;
            const d2 = dx * dx + dy * dy;
            if (d2 < r * r * 4) k += Math.exp(-d2 / (r * r)) * (1 - age / 1.6) * 0.8 * pull;
          }
          for (const cl of clicks) {
            const age = rt - cl.t0;
            const dx = x - cl.x;
            const dy = y - cl.y;
            const d = Math.hypot(dx, dy);
            const R = 260 * (1 - Math.exp(-age * 1.1));
            if (d < R * 1.4) {
              const an = Math.atan2(dy, dx);
              const rr = R * (1 + 0.22 * Math.sin(an * 5 + cl.a + age * 0.6) + 0.1 * Math.sin(an * 11 - cl.a - age));
              k += Math.max(0, 1 - age / 6.5) * Math.min(1, Math.max(0, (rr - d) / 60)) * (0.7 + 0.3 * Math.sin(d * 0.045 - age * 2));
            }
          }
          return k;
        });
      } else if (mode === 'constellations') {
        if (!stars || sw !== w || sh !== h) {
          sw = w;
          sh = h;
          stars = [];
          const n = Math.floor((w * h) / 6500);
          for (let i = 0; i < n; i++) {
            stars.push({
              x: Math.random() * w,
              y: Math.random() * h,
              p: Math.random() * 6.28,
              s: 0.6 + Math.random() * 1.6,
              b: 0.25 + Math.random() * 0.75,
              z: 0.3 + Math.random() * 0.7,
            });
          }
        }
        const px0 = has ? m.sx - w / 2 : 0;
        const py0 = has ? m.sy - h / 2 : 0;
        const reach = 200 * pull;
        const pts: { x: number; y: number; d: number }[] = [];
        for (const st of stars) {
          if (!reduce) {
            st.x += st.z * 6 * dt * curSpeed;
            if (st.x > w + 10) st.x -= w + 20;
          }
          const x = Math.round(st.x - px0 * st.z * 0.03);
          const y = Math.round(st.y - py0 * st.z * 0.03);
          const al = Math.min(1, st.b * (0.5 + 0.5 * Math.sin(rt * st.s + st.p)) * (0.4 + curAmount * 1.2));
          ctx.fillStyle = hot && heatAt(x, y) > 0.12 ? 'rgba(243,243,92,0.95)' : 'rgba(190,210,255,' + al.toFixed(3) + ')';
          const sz = st.b > 0.8 ? 3 : 2;
          ctx.fillRect(x, y, sz, sz);
          if (st.b > 0.92 && al > 0.6) {
            ctx.fillRect(x - 3, y, sz, sz);
            ctx.fillRect(x + 3, y, sz, sz);
            ctx.fillRect(x, y - 3, sz, sz);
            ctx.fillRect(x, y + 3, sz, sz);
          }
          if (has && reach > 0) {
            const d = Math.hypot(x - m.sx, y - m.sy);
            if (d < reach) pts.push({ x, y, d });
          }
        }
        pts.sort((p, q) => p.d - q.d);
        pts.length = Math.min(pts.length, 8);
        for (let i = 1; i < pts.length; i++) {
          let jb = 0;
          let bd = 1e9;
          for (let j = 0; j < i; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < bd) {
              bd = d;
              jb = j;
            }
          }
          const A = pts[i];
          const B = pts[jb];
          const L = Math.hypot(B.x - A.x, B.y - A.y);
          const n = Math.floor(L / 7);
          ctx.fillStyle = 'rgba(243,243,92,' + ((1 - A.d / reach) * 0.8).toFixed(3) + ')';
          for (let q = 1; q < n; q++) ctx.fillRect(A.x + ((B.x - A.x) * q) / n, A.y + ((B.y - A.y) * q) / n, 2, 2);
        }
        for (const cl of clicks) {
          const age = rt - cl.t0;
          if (age > 1.4) continue;
          const ang = 0.3 + (cl.a / 6.283) * 0.5;
          const dx = Math.cos(ang) * (cl.x > w / 2 ? -1 : 1);
          const dy = Math.sin(ang);
          const hx = cl.x + dx * age * 650;
          const hy = cl.y + dy * age * 650;
          for (let q = 0; q < 22; q++) {
            ctx.fillStyle = 'rgba(235,240,255,' + ((1 - q / 22) * (1 - age / 1.4)).toFixed(3) + ')';
            ctx.fillRect(hx - dx * q * 8, hy - dy * q * 8, 3, 3);
          }
        }
      } else if (mode === 'sleep stages') {
        const f = Math.min(1, (rt - palT) / 2.5);
        const e = f * f * (3 - 2 * f);
        const col = (i: number) => mix(STAGES[palFrom][i], STAGES[pal][i], e);
        const blob = (x: number, y: number, r: number, rgb: string, al: string) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(' + rgb + ',' + al + ')');
          g.addColorStop(1, 'rgba(' + rgb + ',0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        };
        const b1x = w * (0.5 + 0.35 * Math.sin(t * 0.13));
        const b1y = h * (0.4 + 0.3 * Math.cos(t * 0.11));
        const b2x = w * (0.5 + 0.4 * Math.cos(t * 0.09 + 2));
        const b2y = h * (0.6 + 0.3 * Math.sin(t * 0.12 + 1));
        const R = Math.max(w, h) * 0.55;
        const al = (0.3 + curAmount * 0.4).toFixed(2);
        blob(b1x, b1y, R, col(0), al);
        blob(b2x, b2y, R, col(1), al);
        if (has && pull > 0) blob(m.sx, m.sy, 380 * Math.max(0.4, pull), col(2), '0.28');
        ctx.fillStyle = 'rgba(200,215,255,0.4)';
        const r2 = R * 0.6 * (R * 0.6);
        field((x, y) => {
          const d1 = (x - b1x) ** 2 + (y - b1y) ** 2;
          const d2 = (x - b2x) ** 2 + (y - b2y) ** 2;
          return 0.3 * Math.exp(-d1 / r2) + 0.3 * Math.exp(-d2 / r2) - 0.08;
        });
      } else if (mode === 'tilt sand') {
        if (!tilt.dev) {
          tilt.dx = has ? Math.max(-1, Math.min(1, (m.sx - cx) / (w * 0.4))) : 0;
          tilt.dy = has ? Math.max(-1, Math.min(1, (m.sy - h / 2) / (h * 0.4))) : 0;
        }
        tilt.x += (tilt.dx - tilt.x) * 0.06;
        tilt.y += (tilt.dy - tilt.y) * 0.06;
        const mag = Math.hypot(tilt.x, tilt.y);
        if (!reduce) drift += (0.3 + mag * 3) * dt * curSpeed;
        // "Down" defaults to straight toward the bottom of the screen — a
        // level phone, or an idle cursor, settles the pile exactly where
        // real sand would come to rest, not spread across the whole field.
        const gx = mag > 0.01 ? tilt.x / mag : 0;
        const gy = mag > 0.01 ? tilt.y / mag : 1;

        // A fixed quantity of sand, not a field covering the whole screen:
        // find how far the downhill corner is from the uphill one along the
        // gravity axis, then only fill the bottom slice of that range.
        let minDepth = Infinity;
        let maxDepth = -Infinity;
        for (const [cx0, cy0] of [
          [0, 0],
          [w, 0],
          [0, h],
          [w, h],
        ] as [number, number][]) {
          const d = cx0 * gx + cy0 * gy;
          if (d < minDepth) minDepth = d;
          if (d > maxDepth) maxDepth = d;
        }
        const range = maxDepth - minDepth || 1;
        const fillFraction = 0.16 + curAmount * 0.34;
        const surface = maxDepth - fillFraction * range;
        const edgeBand = range * 0.1;

        field((x, y) => {
          const depth = x * gx + y * gy;
          // A slow ripple along the surface so the pile settles with a bit
          // of texture, not a razor-flat line.
          const along = (x * -gy + y * gx) * 0.02;
          const wobble = Math.sin(along + drift * 0.6) * edgeBand * 0.6;
          return (depth + wobble - surface) / edgeBand;
        });
      } else if (mode === 'scroll smear') {
        const ny = window.scrollY;
        sc.v += (ny - sc.y) * 0.6;
        sc.y = ny;
        sc.v *= 0.82;
        sc.off += sc.v * 0.5;
        const len = Math.min(70, Math.abs(sc.v) * 1.6 * Math.max(0.3, pull));
        for (let j = 0; j < rows; j++) {
          const y = j * cell;
          for (let i = 0; i < cols; i++) {
            const x = i * cell;
            if (marble(x, y + sc.off) > BAYER[(j & 3) * 4 + (i & 3)]) ctx.fillRect(x, y - len * 0.5, dot, dot + len);
          }
        }
      } else if (mode === 'hold to remember') {
        hold.amt = hold.on ? Math.min(1, hold.amt + dt * 0.45) : Math.max(0, hold.amt - dt * 1.4);
        const ys: number[] = [];
        if (hold.amt <= 0.001) field(marble);
        else {
          const R = 90 + hold.amt * 260;
          const R2 = R * R;
          for (let j = 0; j < rows; j++) {
            const y = j * cell;
            for (let i = 0; i < cols; i++) {
              const x = i * cell;
              const dx = x - hold.x;
              const dy = y - hold.y;
              const d2 = dx * dx + dy * dy;
              const p = d2 < R2 * 5 ? hold.amt * Math.exp(-d2 / R2) : 0;
              const k = marble(x, y) + p * 0.9;
              if (k > BAYER[(j & 3) * 4 + (i & 3)]) {
                const px1 = x - dx * p * 0.75;
                const py1 = y - dy * p * 0.75;
                if (p > 0.28) ys.push(px1, py1);
                else ctx.fillRect(px1, py1, dot, dot);
              }
            }
          }
          ctx.fillStyle = 'rgba(243,243,92,0.92)';
          for (let q = 0; q < ys.length; q += 2) ctx.fillRect(ys[q], ys[q + 1], dot, dot);
        }
      } else {
        field(marble, true);
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onHoldMove);
      window.removeEventListener('wheel', onWheelV);
      window.removeEventListener('deviceorientation', onOrient);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onDrag);
      document.removeEventListener('mouseleave', onLeave);
    };
    // Runs once: the simulation is long-lived and reads live prop values via
    // the `live` ref above, rather than being torn down and rebuilt on change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, display: motion ? 'block' : 'none' }}
    />
  );
}
