'use client';

import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import BackgroundCanvas, { BG_STYLES, type BgStyle } from './BackgroundCanvas';

/**
 * Ported from the Claude Design canvas `Dream Interpreter v3.dc.html`.
 * The `{{ }}` bindings, `sc-if` / `sc-for` blocks and the `Component`
 * class's `renderVals()` map onto plain React state + JSX here; the AI
 * call moved from `window.claude.complete()` (canvas-only) to a real
 * `/api/dreams/interpret` route.
 */

type View = 'read' | 'index';

interface Symbol {
  name: string;
  note: string;
}

interface Action {
  do: string;
  why: string;
}

interface IndexEntry {
  name: string;
  note: string;
}

const INDEX: IndexEntry[] = [
  { name: 'falling', note: 'loss of footing in something waking life calls stable. often arrives during a change already underway.' },
  { name: 'flight', note: 'distance from a situation rather than escape from it. note how much effort it took.' },
  { name: 'teeth', note: 'usually cost, capability, or being seen. rarely about teeth.' },
  { name: 'water', note: 'depth and volume matter more than the water. still versus moving is the useful detail.' },
  { name: 'house', note: "the self as a structure. unfamiliar rooms are parts of it you don't use." },
  { name: 'doors', note: 'a choice you have already noticed. locked doors are timing, not refusal.' },
  { name: 'stairs', note: 'effort with a known direction. which way you were going is the whole question.' },
  { name: 'being chased', note: "something unattended. the pursuer's identity matters less than your refusal to turn around." },
  { name: 'nakedness', note: 'exposure without consequence. whether anyone looked is the detail to keep.' },
  { name: 'exams', note: 'rehearsal for judgement. common in people who have already passed the real test.' },
  { name: 'the dead', note: 'continuity, not visitation. usually says more about unfinished conversation than about grief.' },
  { name: 'strangers', note: "traits held at arm's length. they tend to behave the way you don't allow yourself to." },
  { name: 'vehicles', note: 'agency and pace. who is driving is the only part worth recording.' },
  { name: 'animals', note: 'instinct with a shape. domestic versus wild is the axis.' },
  { name: 'mirrors', note: 'self-assessment. a wrong reflection is a mismatch between how you read yourself and how you’re read.' },
  { name: 'phones', note: "a message that isn't getting through in either direction." },
  { name: 'fire', note: 'fast change. whether you set it decides whether it’s fear or appetite.' },
  { name: 'money', note: 'worth measured in something countable. often attached to a decision you framed as practical.' },
  { name: 'darkness', note: 'not knowing, held without panic or with it. the difference is the reading.' },
  { name: 'repetition', note: 'a loop that hasn’t resolved. recurrence is information about waking life, not about sleep.' },
  { name: 'arriving late', note: 'the clock is rarely the problem. something else was already running behind.' },
  { name: 'unprepared', note: 'rehearsal anxiety with the wrong location attached. it’s your skill you doubt, not the test.' },
  { name: 'failing', note: 'the repeat is the content. nobody fails the same thing this many times by accident.' },
  { name: 'sex', note: 'closeness, mostly. who it’s with says less than what the dream needed from them.' },
  { name: 'trapped', note: 'a situation you can name but can’t yet leave. the room is doing the naming for you.' },
  { name: 'losing control', note: 'direction without steering. where you were headed matters more than the crash.' },
  { name: 'finding money', note: 'value that showed up without being earned. worth noticing what’s been handed to you lately without asking.' },
  { name: 'counting', note: 'trying to make an uncertain thing add up. the number rarely resolves, on purpose.' },
  { name: 'corpses', note: 'something already over that you haven’t filed away yet.' },
  { name: 'blood', note: 'a cost, already paid or coming due. how much matters more than whose.' },
  { name: 'war', note: 'a conflict too big to take on directly, borrowed to carry a smaller one.' },
  { name: 'pregnancy', note: 'something underway that isn’t ready to be seen yet. common around any long commitment, not only children.' },
  { name: 'being someone else', note: 'a different vantage point on your own situation, borrowed so you don’t have to own the view.' },
  { name: 'alternate timeline', note: 'the same decision, replayed differently. says more about the choice you made than the one you didn’t.' },
  { name: 'sleep paralysis', note: 'the body waking up before the mind does. frightening because it’s physical, not because it means anything.' },
  { name: 'shadow figures', note: 'a presence with no face because you haven’t assigned it one yet. usually unnamed, not hidden.' },
  { name: 'zombies', note: 'someone who still moves but stopped being themselves. often about a person who changed, not about death.' },
  { name: 'alien abduction', note: 'taken somewhere and examined without a say in it. usually about a process you’re inside of, not a choice.' },
  { name: 'dragons', note: 'a threat old enough to have a plan. whether you fought it or just watched is worth keeping.' },
  { name: 'robots', note: 'behaviour with nobody behind it. often someone who stopped explaining themselves.' },
  { name: 'ghosts', note: 'something unfinished, still asking. the haunting is the unfinished part.' },
  { name: 'vampires', note: 'something taking from you slowly enough that you didn’t clock it happening. name what’s being taken.' },
  { name: 'clones', note: 'a version of someone with the singular part removed. what’s missing is the read.' },
  { name: 'haunted dolls', note: 'an old version of something, still watching from the shelf. usually childhood material nobody’s looked at in a while.' },
  { name: 'dying phone', note: 'reach running out faster than you can use it. rarely about the phone.' },
  { name: 'tattoos', note: 'a decision made permanent, which is usually the point of dreaming about one.' },
  { name: 'being watched', note: 'self-consciousness with no confirmed audience. ask who you think is judging, and why them specifically.' },
  { name: 'voiceless', note: 'effort that isn’t landing anywhere. common right after saying something in waking life that wasn’t heard.' },
  { name: 'songs stuck', note: 'a message on repeat because it hasn’t landed yet. the lyrics are usually more literal than the rest of the dream.' },
  { name: 'video games', note: 'consequences that reset. shows up when a decision feels reversible and isn’t.' },
  { name: 'celebrities', note: 'a familiar face standing in so the dream doesn’t have to introduce a stranger. the role is the point, not the person.' },
  { name: 'cheating partner', note: 'divided attention, not necessarily infidelity. ask where the focus actually went.' },
  { name: 'ex-partner', note: 'unfinished business from a specific period, not a current signal. rarely about wanting them back.' },
  { name: 'snakes', note: 'a threat that moves before you register it. whether it struck or just passed by is the detail to keep.' },
  { name: 'spiders', note: 'something small producing an outsized reaction. usually a detail you’ve been sidestepping, not a real threat.' },
  { name: 'size distortion', note: 'scale doing the work importance usually does. what got bigger or smaller tells you more than the distortion itself.' },
  { name: 'smell', note: 'a memory using the one sense dreams usually skip. worth taking seriously for exactly that reason.' },
  { name: 'apocalypse', note: 'an ending big enough to justify starting over. often just permission-seeking dressed as catastrophe.' },
  { name: 'gender shift', note: 'identity tried on outside its usual rules. rarely about wanting to change, more about testing the fit.' },
];

const YELLOW = '#F3F35C';
const BLUE = '#1438C4';

/** The canvas's fractal-noise grain, reused at two strengths. */
function noiseBg(baseFrequency: number, alpha: number): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='3' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${alpha} 0'/></filter>` +
    `<rect width='180' height='180' filter='url(%23n)'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g, '%23')}")`;
}

/** 12x10 bitmaps for the two bottom-right buttons, one per background style plus play/pause. */
const ICONS: Record<string, string[]> = {
  'marble drift': ['............', '.#.#.#......', '......#.#...', '..........#.', '...#.#.....#', '.#.....#...#', '#.......#.#.', '#...#...#...', '.#.#.#.#....', '............'],
  'sleep tide': ['............', '..##....##..', '.#..#..#..#.', '#....##....#', '............', '..##....##..', '.#..#..#..#.', '#....##....#', '............'],
  constellations: ['.....#......', '.....#......', '...#####....', '.....#......', '.....#...#..', '........###.', '..#......#..', '............', '......#.....', '.#..........'],
  'ink memory': ['.....##.....', '....####....', '....####....', '...######...', '..########..', '..###.####..', '..##.#####..', '..########..', '...######...', '....####....'],
  'sleep stages': ['...####.....', '.####.......', '.###........', '###.........', '###.........', '###.........', '###.........', '.###........', '.####....#..', '...######...'],
  play: ['...#........', '...##.......', '...###......', '...####.....', '...#####....', '...#####....', '...####.....', '...###......', '...##.......', '...#........'],
  'tilt sand': ['............', '...........#', '..........##', '.........###', '........####', '.......#####', '......######', '....########', '..##########', '############'],
  'scroll smear': ['#..#..#..#..', '#..#..#..#..', '#..#..#..#..', '#.....#.....', '#..#..#..#..', '...#.....#..', '#..#..#..#..', '#..#..#..#..', '#..#..#..#..'],
  'hold to remember': ['............', '..#......#..', '...#....#...', '............', '.....##.....', '#...####...#', '.....##.....', '............', '...#....#...', '..#......#..'],
  pause: ['..###..###..', '..###..###..', '..###..###..', '..###..###..', '..###..###..', '..###..###..', '..###..###..', '..###..###..', '..###..###..'],
};

const STYLE_FILL: Record<BgStyle, string> = {
  'marble drift': '#1438C4',
  'sleep tide': '#0A7E9C',
  constellations: '#0E0E0E',
  'ink memory': '#1438C4',
  'sleep stages': '#8A7A00',
  'tilt sand': '#8A7A00',
  'scroll smear': '#1438C4',
  'hold to remember': '#0E0E0E',
};

/** Turns a bitmap of "#"/"." rows into an SVG path of 1x1 unit squares, vertically centred in a 12-row grid. */
function iconPath(rows: string[]): string {
  const off = Math.floor((12 - rows.length) / 2);
  return rows
    .map((row, y) => [...row].map((c, x) => (c === '#' ? `M${x} ${y + off}h1v1h-1z` : '')).join(''))
    .join('');
}

/**
 * Stands in for the canvas's `<image-slot>` element. Renders the real photo
 * once one exists at `src`; until then, the same dashed placeholder the
 * design tool showed while empty.
 */
function ImageSlot({ src, alt, placeholder }: { src?: string; alt: string; placeholder: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 16,
        fontFamily: 'var(--font-geist)',
        fontSize: 13,
        lineHeight: 1.4,
        color: 'rgba(255,255,255,0.45)',
        border: '1px dashed rgba(255,255,255,0.3)',
      }}
    >
      {placeholder}
    </div>
  );
}

const navFont: CSSProperties = {
  fontFamily: 'var(--font-schoolbell)',
  fontSize: 15,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

export default function DreamInterpreter() {
  const [view, setView] = useState<View>('read');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [error, setError] = useState('');
  const [bgStyle, setBgStyle] = useState<BgStyle>('marble drift');
  const [motionOn, setMotionOn] = useState(true);

  const onRead = view === 'read';
  const q = query.trim().toLowerCase();
  const filtered = q ? INDEX.filter((e) => e.name.includes(q) || e.note.toLowerCase().includes(q)) : INDEX;
  const paragraphs = reading ? reading.split(/\n+/).filter(Boolean) : [];

  async function submit() {
    const text = draft.trim();
    if (loading) return;
    if (text.length < 12) {
      setError('not enough to go on. a few sentences.');
      return;
    }
    setLoading(true);
    setError('');
    setReading(null);
    setSymbols([]);
    setActions([]);
    try {
      const res = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, readingLength: 'medium', symbolCount: 4 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "reading didn't come back. try again.");
        return;
      }
      setReading(typeof data.reading === 'string' ? data.reading : '');
      setSymbols(Array.isArray(data.symbols) ? data.symbols : []);
      setActions(Array.isArray(data.actions) ? data.actions : []);
    } catch {
      setError("reading didn't come back. try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setReading(null);
    setSymbols([]);
    setActions([]);
    setError('');
    setDraft('');
    window.scrollTo(0, 0);
  }

  function toggleView() {
    setView(onRead ? 'index' : 'read');
    window.scrollTo(0, 0);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
  }

  function nextStyle() {
    const next = BG_STYLES[(BG_STYLES.indexOf(bgStyle) + 1) % BG_STYLES.length];
    setBgStyle(next);
    setMotionOn(true);

    // iOS only fires deviceorientation after an explicit grant, and that grant
    // only counts coming from a direct tap — not a tap relayed through state a
    // moment later. This button press is the one guaranteed real gesture we
    // have, so the ask has to happen right here, synchronously, not wherever
    // the reader next happens to touch the page.
    if (next === 'tilt sand') {
      const requestPermission = (
        window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      )?.requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission().catch(() => {});
      }
    }
  }

  function toggleMotion() {
    setMotionOn((on) => !on);
  }

  const motionIconPath = iconPath(motionOn ? ICONS.pause : ICONS.play);
  const motionPressedBg = motionOn ? '#D4D0C8' : 'repeating-conic-gradient(#FFFFFF 0 25%, #D4D0C8 0 50%)';
  const styleIconPath = iconPath(ICONS[bgStyle]);
  const styleFillColor = STYLE_FILL[bgStyle];
  const motionLabel = motionOn ? 'Pause background motion' : 'Play background motion';
  const styleLabel = `Background: ${bgStyle}, click for next`;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: BLUE,
        backgroundImage: noiseBg(0.85, 0.09),
        color: '#FFFFFF',
        fontFamily: 'var(--font-geist), Helvetica Neue, Helvetica, sans-serif',
        overflowX: 'hidden',
      }}
    >
      <BackgroundCanvas motion={motionOn} bgStyle={bgStyle} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1040,
          margin: '0 auto',
          padding: '36px 28px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 64,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', gap: 22, fontFamily: 'var(--font-geist)', fontSize: 13, letterSpacing: 0, textTransform: 'none' }}>
            <div
              onClick={() => setView('read')}
              style={{ cursor: 'pointer', borderBottom: `1px solid ${onRead ? '#FFFFFF' : 'transparent'}`, paddingBottom: 2 }}
            >
              interpret
            </div>
            <div
              onClick={() => setView('index')}
              style={{ cursor: 'pointer', borderBottom: `1px solid ${onRead ? 'transparent' : '#FFFFFF'}`, paddingBottom: 2 }}
            >
              index
            </div>
          </div>
        </div>

        {onRead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 9vw, 72px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
              <div
                style={{
                  position: 'relative',
                  marginLeft: '12%',
                  marginRight: -28,
                  height: 'clamp(180px, 26vw, 280px)',
                  background: '#2A2724',
                  filter: 'grayscale(1) contrast(1.05)',
                }}
              >
                <ImageSlot src="/dreams/hero-strip.webp" alt="" placeholder="drop a black and white photo, e.g. a crowd, a corridor, a bed" />
              </div>
              <div style={{ fontSize: 'clamp(48px, 7.4vw, 92px)', lineHeight: 0.88, letterSpacing: '-0.055em', maxWidth: '11ch' }}>
                <span style={{ fontWeight: 300 }}>what does my dream mean?</span>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                border: `12px solid ${YELLOW}`,
                borderRadius: 14,
                padding: '72px 22px 84px',
                background: 'rgba(8,28,120,0.35)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  background: YELLOW,
                  color: '#0E0E0E',
                  padding: '10px 22px 12px 18px',
                  borderRadius: '12px 0 12px 0',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                Last night
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                rows={7}
                placeholder="I'm in a house that is my house but the rooms are wrong..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#FFFFFF',
                  border: 0,
                  borderRadius: 0,
                  padding: 0,
                  fontFamily: 'var(--font-geist)',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <div style={{ position: 'absolute', left: 14, bottom: 14, ...navFont, fontSize: 14, color: YELLOW }}>
                {loading ? 'hold on' : 'cmd + enter'}
              </div>
              <div
                onClick={submit}
                className="di-submit"
                style={{
                  position: 'absolute',
                  right: -12,
                  bottom: -12,
                  cursor: 'pointer',
                  background: YELLOW,
                  color: '#0E0E0E',
                  padding: '14px 22px 12px 24px',
                  borderRadius: '12px 0 12px 0',
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  fontWeight: 600,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                {loading ? 'Reading…' : 'Interpret →'}
              </div>
            </div>

            {!!error && (
              <div style={{ fontFamily: 'var(--font-doto)', fontWeight: 900, fontSize: 22, color: YELLOW, textTransform: 'uppercase' }}>
                {error}
              </div>
            )}

            {!!reading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 88 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
                  <div style={navFont}>The reading</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: '26ch' }}>
                    {paragraphs.map((para, i) => (
                      <div key={i} style={{ fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.08, letterSpacing: '-0.035em' }}>
                        {para}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ ...navFont, paddingBottom: 12 }}>What showed up</div>
                  {symbols.map((sym, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '8px 32px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.35)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-doto)',
                          fontWeight: 900,
                          fontSize: 'clamp(34px, 4.6vw, 52px)',
                          lineHeight: 0.95,
                          color: YELLOW,
                          textTransform: 'uppercase',
                        }}
                      >
                        {sym.name}
                      </div>
                      <div style={{ fontSize: 16, lineHeight: 1.4 }}>{sym.note}</div>
                    </div>
                  ))}
                </div>

                {actions.length > 0 && (
                  <div style={{ position: 'relative', margin: '0 -28px', padding: '64px 28px', background: '#3A3A3A' }}>
                    <div style={{ position: 'absolute', inset: 0, filter: 'grayscale(0.2)' }}>
                      <ImageSlot src="/dreams/action-backdrop.webp" alt="" placeholder="drop a street or landscape photo" />
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        maxWidth: 620,
                        margin: '0 auto',
                        backgroundColor: '#4A72F0',
                        backgroundImage: noiseBg(0.7, 0.12),
                        padding: '44px 36px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 34,
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', ...navFont }}>
                        <div>What to do</div>
                        <div>This week</div>
                      </div>
                      {actions.map((act, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ fontFamily: 'var(--font-doto)', fontWeight: 900, fontSize: 20, color: YELLOW }}>
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div
                            style={{
                              fontSize: 'clamp(22px, 3vw, 30px)',
                              fontWeight: 600,
                              lineHeight: 1.02,
                              letterSpacing: '-0.01em',
                              textTransform: 'uppercase',
                              textAlign: 'justify',
                              textAlignLast: 'justify',
                              hyphens: 'none',
                            }}
                          >
                            {act.do}
                          </div>
                          <div style={{ fontSize: 15, lineHeight: 1.4 }}>{act.why}</div>
                        </div>
                      ))}
                      <div onClick={reset} style={{ pointerEvents: 'auto', cursor: 'pointer', alignSelf: 'flex-end', fontSize: 14 }}>
                        new dream →
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!onRead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            <div style={{ fontSize: 'clamp(44px, 6.6vw, 80px)', lineHeight: 0.9, letterSpacing: '-0.055em', maxWidth: '12ch' }}>
              <span style={{ fontWeight: 300 }}>things that keep showing up.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 15, lineHeight: 1.4, maxWidth: '40ch' }}>
                these are common patterns, not fixed answers. if what you know about your own life points somewhere
                else, trust that over anything written here.
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="FILTER"
                style={{
                  width: 240,
                  background: 'transparent',
                  color: YELLOW,
                  border: 0,
                  borderBottom: `2px solid ${YELLOW}`,
                  borderRadius: 0,
                  padding: '6px 0',
                  fontFamily: 'var(--font-doto)',
                  fontWeight: 900,
                  fontSize: 22,
                  textTransform: 'uppercase',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((entry, i) => (
                <div
                  key={entry.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '6px 32px',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.35)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-doto)',
                      fontWeight: 900,
                      fontSize: 'clamp(28px, 3.8vw, 42px)',
                      lineHeight: 0.95,
                      color: YELLOW,
                      textTransform: 'uppercase',
                    }}
                  >
                    {entry.name}
                  </div>
                  <div style={{ fontSize: 16, lineHeight: 1.4 }}>{entry.note}</div>
                </div>
              ))}
            </div>
            <div style={navFont}>
              {filtered.length} of {INDEX.length} entries
            </div>
          </div>
        )}

        {(!onRead || !!reading) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, paddingTop: 24 }}>
            <div onClick={toggleView} style={{ cursor: 'pointer', fontSize: 14, marginLeft: 'auto' }}>
              {onRead ? 'index →' : 'interpret →'}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 5, display: 'flex', flexDirection: 'column', background: '#0A0A0A', gap: 1, padding: '0 1px 1px 0' }}>
        <button
          type="button"
          onClick={nextStyle}
          title={styleLabel}
          aria-label={styleLabel}
          className="win98-btn"
          style={{ background: '#D4D0C8' }}
        >
          <svg width={24} height={24} viewBox="0 0 12 12" shapeRendering="crispEdges" style={{ display: 'block' }}>
            <path d={styleIconPath} fill={styleFillColor} />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleMotion}
          title={motionLabel}
          aria-label={motionLabel}
          aria-pressed={!motionOn}
          className="win98-btn"
          style={{ background: motionPressedBg }}
        >
          <svg width={24} height={24} viewBox="0 0 12 12" shapeRendering="crispEdges" style={{ display: 'block' }}>
            <path d={motionIconPath} fill="#0E0E0E" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        .di-submit:hover {
          background: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
