'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { getActiveMeaning, getActiveKeywords } from '@/lib/utils/card-utils';
import {
  CardName, Distill, Keywords, Meaning, Module, Plate, Readout, StateLine,
  styles, type MarginRow,
} from './card-page';
import { clockTime, formatOrb, lifetimeDraws, noteShares } from '@/lib/utils/card-readout';
import { cardScents } from '@/lib/data/card-scents';
import { getHere } from '@/lib/utils/here';
import CardSlotReveal from './CardSlotReveal';
import { generateInsight, TransitData, GeneratedInsight } from '@/lib/utils/insight-generator-v2';
import type { ActiveTransit } from '@/lib/types/astrology';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
  animateReveal?: boolean;
  /**
   * Render the card face while the details stay sealed. Used by the tear-off
   * page: the art sits underneath, so tearing progressively uncovers the real
   * card rather than a card back that flips over afterwards.
   */
  artVisibleEarly?: boolean;
  userName?: string;
  cardDate?: string; // YYYY-MM-DD of when the card was drawn; defaults to today
  /**
   * SPEC §10, the input block. Rendered inside the reading page so it sits on
   * the page's own ground and at its measure, but owned by the caller — the
   * reflection text and its per-date storage key live in page.tsx.
   */
  footer?: ReactNode;
  /**
   * Which surface the reading is poured into. It decides nothing about the
   * look — only how much room the reading waits for before it lays itself out
   * wide: the whole screen waits for 880, a year-view window for 640, because
   * a window that wide is one the reader dragged there on purpose.
   */
  surface?: 'page' | 'window';
}

// Memory types
interface ReadingMemory {
  date: string;
  cardName: string;
  isReversed: boolean;
  transitingPlanet: string;
  natalPlanet: string;
  aspectType: string;
  house: number;
  keyPhrase: string;
}

interface SlowGardenMemory {
  readings: ReadingMemory[];
  memoryNotes: string[];
}

function todayKey(): string {
  // Use local date so cache aligns with the user's calendar day, not UTC
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadCachedInsight(cardId: string, date?: string): GeneratedInsight | null {
  try {
    const key = date ?? todayKey();
    const raw = localStorage.getItem(`insight-${cardId}-${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedInsight;
  } catch {
    return null;
  }
}

function saveCachedInsight(cardId: string, insight: GeneratedInsight, date?: string): void {
  try {
    const key = date ?? todayKey();
    localStorage.setItem(`insight-${cardId}-${key}`, JSON.stringify(insight));
  } catch {
    // ignore
  }
}

const MEMORY_KEY = 'slow-garden-memory';
/**
 * The same store under the app's former name. Read-only and never written
 * again: anyone who drew a card before the rename still has their notes here,
 * and dropping the fallback would silently empty their personalisation while
 * leaving the app looking healthy. Safe to delete once the old key is gone from
 * the field — there is no server copy to restore from, so err on the side of
 * leaving it.
 */
const LEGACY_MEMORY_KEY = 'slowHourMemory';

function loadMemory(): SlowGardenMemory {
  try {
    const raw =
      localStorage.getItem(MEMORY_KEY) ?? localStorage.getItem(LEGACY_MEMORY_KEY);
    if (!raw) return { readings: [], memoryNotes: [] };
    return JSON.parse(raw) as SlowGardenMemory;
  } catch {
    return { readings: [], memoryNotes: [] };
  }
}

function saveMemory(
  memory: SlowGardenMemory,
  newReading: ReadingMemory,
  memoryNote: string | undefined
): void {
  try {
    const updated: SlowGardenMemory = {
      readings: [newReading, ...memory.readings].slice(0, 30),
      memoryNotes: memoryNote
        ? [memoryNote, ...memory.memoryNotes].slice(0, 10)
        : memory.memoryNotes,
    };
    // Writes land on the new key only; loadMemory() has already carried any
    // legacy notes forward into `memory`, so the first save migrates them.
    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
    localStorage.removeItem(LEGACY_MEMORY_KEY);
  } catch {
    // localStorage write failed (private browsing, quota exceeded, etc.)
  }
}

// Helper function to convert ActiveTransit to TransitData
function convertToTransitData(transit: ActiveTransit): TransitData {
  // Map phase to generator's expected format
  const phaseMap: Record<string, 'approaching' | 'peak' | 'separating'> = {
    'beginning': 'approaching',
    'approaching': 'approaching',
    'peak': 'peak',
    'separating': 'separating',
    'integration': 'separating'
  };

  // Calculate days remaining until exact date
  const today = new Date();
  const exactDate = new Date(transit.exactDate);
  const daysRemaining = Math.ceil((exactDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    transitingPlanet: transit.transitingPlanet.charAt(0).toUpperCase() + transit.transitingPlanet.slice(1),
    natalPlanet: transit.natalPlanet.charAt(0).toUpperCase() + transit.natalPlanet.slice(1),
    aspectType: transit.aspect,
    phase: phaseMap[transit.phase] || 'approaching',
    house: transit.house,
    daysRemaining: daysRemaining > 0 ? daysRemaining : undefined
  };
}

export default function TarotCard({ card, isReversed, isRevealed, animateReveal, artVisibleEarly, userName, cardDate, footer, surface = 'page' }: TarotCardProps) {
  const activeMeaning = getActiveMeaning(card, isReversed);
  const activeKeywords = getActiveKeywords(card, isReversed);

  /** The date this reading is for — a past card keeps its own, not today's. */
  const readingDate = cardDate ?? todayKey();

  /**
   * How many notes this card's recipe holds. Recipes run five to eleven, so the
   * margin's percentage column is as long as the distill list beside it rather
   * than a fixed six.
   */
  const scent = cardScents[card.id];
  const noteCount = scent ? scent.top.length + scent.heart.length + scent.base.length : 0;

  /**
   * The margin's draw count.
   *
   * Read once on mount rather than during render: localStorage is not available
   * on the server, and counting it inline would make the first client render
   * disagree with the markup React shipped.
   */
  const [draws, setDraws] = useState(0);
  useEffect(() => setDraws(lifetimeDraws()), [readingDate]);

  /**
   * When the card was drawn. The draw is recorded against the date, not the
   * minute, so the time is the reader's first visit to this card — held in its
   * own key rather than inferred, since inferring it would print a different
   * "drawn" time every time the page was opened.
   */
  const [drawnAt, setDrawnAt] = useState<string | null>(null);
  useEffect(() => {
    if (!isRevealed) return;
    try {
      const key = `drawn-at-${readingDate}`;
      let stamp = localStorage.getItem(key);
      if (!stamp) {
        // Only today's card can be stamped now; an older card opened for the
        // first time has no honest draw time and simply omits the row.
        if (readingDate !== todayKey()) return;
        stamp = new Date().toISOString();
        localStorage.setItem(key, stamp);
      }
      setDrawnAt(stamp);
    } catch {
      // storage unavailable — the row is left out rather than guessed
    }
  }, [isRevealed, readingDate]);

  // State for generated insight — load from cache immediately on mount
  // Uses cardDate (the date the card was drawn) so past cards hit their original cached insight
  const [generatedInsight, setGeneratedInsight] = useState<GeneratedInsight | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadCachedInsight(card.id, cardDate);
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [insightError, setInsightError] = useState<'error' | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const isFirstMount = useRef(true);

  // Slot reveal animation — slotDone flips true when reel finishes
  const [slotDone, setSlotDone] = useState(false);
  const handleSlotComplete = useCallback(() => setSlotDone(true), []);
  const showSlot = !!animateReveal && isRevealed && !slotDone;


  // Reset insight + error when card or date changes, then try loading from cache for the new card/date
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const cached = loadCachedInsight(card.id, cardDate);
    setGeneratedInsight(cached);
    setInsightError(null);
    setIsRateLimited(false);
  }, [card.id, cardDate]);

  /*
   * The free quota: 7 personalised readings per person.
   *
   * Seven rather than three because this is a daily app, and a wall on day
   * three arrives before the habit that would make anyone want to pass it.
   * A week is long enough to find out whether the thing is for you.
   *
   * Counted as distinct DAYS that consumed a reading, not as fetches — a retry
   * after an error, or re-opening the same day, must not burn quota. A day is
   * recorded only once its reading actually arrives.
   *
   * This is per-user and therefore client-side. It is bypassable by clearing
   * storage; that is a deliberate trade, since the alternative (an IP limit)
   * punishes everyone behind a shared network. Cost abuse is bounded by the
   * abuse guards in middleware.ts instead.
   */
  /**
   * Set during onboarding ("read my chart"). When off, no request is made at
   * all — no Claude call, no quota spent — and the reader gets the card and its
   * traditional meaning. Defaults to on so anyone who onboarded before this
   * existed is unaffected.
   */
  const personalisationOn = (): boolean => {
    try {
      return localStorage.getItem('slow-garden-personalise') !== 'false';
    } catch {
      return true;
    }
  };

  const FREE_READING_DAYS = 7;
  const READING_DAYS_KEY = 'slow-garden-reading-days';

  const getReadingDays = (): string[] => {
    try {
      const raw = localStorage.getItem(READING_DAYS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const recordReadingDay = (day: string) => {
    try {
      const days = getReadingDays();
      if (days.includes(day)) return;
      localStorage.setItem(READING_DAYS_KEY, JSON.stringify([...days, day]));
    } catch {
      // storage unavailable — the reading still shows, we just cannot count it
    }
  };

  /**
   * Set once a supporter code has been checked by /api/unlock. Holding it
   * means the quota simply stops applying.
   *
   * The code was verified on the server — it cannot be invented — but this
   * flag is only localStorage, so someone could set it by hand. That is the
   * same door the quota already leaves open, and it stays open for the same
   * reason: closing it means accounts.
   */
  const UNLOCK_KEY = 'slow-garden-unlocked';

  const isUnlocked = (): boolean => {
    try {
      return Boolean(localStorage.getItem(UNLOCK_KEY));
    } catch {
      return false;
    }
  };

  /** Days already paid for stay readable; only a NEW day can exhaust the quota. */
  const hasQuotaFor = (day: string): boolean => {
    if (isUnlocked()) return true;
    const days = getReadingDays();
    return days.includes(day) || days.length < FREE_READING_DAYS;
  };

  const fetchInsight = async () => {
    // Opted out — the personalised layer is simply absent, not "loading".
    if (!personalisationOn()) return;

    const readingDay = cardDate ?? todayKey();

    if (!hasQuotaFor(readingDay)) {
      setIsRateLimited(true);
      return;
    }

    setIsGenerating(true);
    setIsRateLimited(false);
    try {
      const birthDateStr = localStorage.getItem('userBirthdate');
      const birthTime = localStorage.getItem('userBirthTime');
      const birthLocation = localStorage.getItem('userBirthLocation');

      if (!birthDateStr) throw new Error('No birth date found');

      const cardSeed = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) / 10000;

      // Where the reader is, for the margin's sunrise and sunset.
      //
      // Never asks here — onboarding's "use my location" toggle owns the
      // permission dialog, so the reveal is never interrupted by one. Without a
      // fix this resolves null immediately and those two rows are simply absent.
      const here = await getHere();

      const memory = loadMemory();
      const memoryNotes = memory.memoryNotes;
      const recentCards = memory.readings.slice(0, 7).map(r =>
        `${r.cardName}${r.isReversed ? ' (reversed)' : ''}`
      );

      const response = await fetch('/api/calculate-transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthDateStr,
          birthTime: birthTime || null,
          birthLocation: birthLocation || null,
          seed: cardSeed,
          cardId: card.id,
          isReversed,
          memoryNotes,
          recentCards,
          here
        })
      });

      if (response.status === 429) {
        setInsightError('error');
        return;
      }

        if (!response.ok) {
          setInsightError('error');
          return;
        }

        const data = await response.json();
        const dominantTransit: ActiveTransit = data.dominantTransit;

        if (!data.claudeInsight) {
          // API worked but Claude returned nothing — surface the error, don't fake a reading
          setInsightError('error');
          return;
        }

        // Build transit metadata (ticker + explanation accordion) from the real transit data
        const transitData = convertToTransitData(dominantTransit);
        const transitMeta = generateInsight(card.id, transitData, isReversed);

        const freshInsight: GeneratedInsight = {
          keyPhrase: data.claudeInsight.keyPhrase,
          insight: data.claudeInsight.insight,
          action: data.claudeInsight.action,
          transitInfo: transitMeta?.transitInfo || '',
          transitExplanation: transitMeta?.transitExplanation || {
            transitingPlanet: dominantTransit.transitingPlanet,
            transitingPlanetMeaning: '',
            natalPlanet: dominantTransit.natalPlanet,
            natalPlanetMeaning: '',
            aspectType: dominantTransit.aspect,
            aspectMeaning: '',
            phaseMeaning: '',
          },
          // Frozen with the reading: reopening this card next year should show
          // the sky it was drawn under, not the sky at the moment of reopening.
          readout: {
            orb: typeof dominantTransit.orb === 'number' ? dominantTransit.orb : null,
            exact: dominantTransit.phase === 'peak',
            sky: data.sky ?? null,
          },
        };

        setGeneratedInsight(freshInsight);
        saveCachedInsight(card.id, freshInsight, cardDate);
        // Only now — a failed or errored request must not cost the user a day.
        recordReadingDay(readingDay);

        saveMemory(
          memory,
          {
            date: new Date().toISOString().split('T')[0],
            cardName: card.name || card.id,
            isReversed,
            transitingPlanet: dominantTransit.transitingPlanet,
            natalPlanet: dominantTransit.natalPlanet,
            aspectType: dominantTransit.aspect,
            house: dominantTransit.house,
            keyPhrase: data.claudeInsight.keyPhrase,
          },
          data.claudeInsight.memoryNote
        );
      } catch (error) {
        console.error('Failed to calculate real transit:', error);
        setInsightError('error');
      } finally {
        setIsGenerating(false);
      }
  };

  // Generate insight when card is revealed
  useEffect(() => {
    if (!isRevealed || generatedInsight || insightError || isRateLimited) return;
    if (!personalisationOn()) return;
    const timer = setTimeout(fetchInsight, 800);
    return () => clearTimeout(timer);
  }, [isRevealed, card.id, isReversed, generatedInsight, insightError]);

  // Convert card ID to filename
  const getCardFilename = (cardId: string, cardName: string) => {
    // For major arcana, add the name part (e.g., "major-1" -> "major-1-magician")
    if (cardId.startsWith('major-')) {
      const namePart = cardName.toLowerCase().replace(/\s+/g, '-').replace(/^the-/, '');
      return `${cardId}-${namePart}`;
    }
    // For minor arcana, just use the ID (e.g., "cups-ace", "wands-2")
    return cardId;
  };

  /**
   * The left margin column (SPEC §03), and the mobile readout that repeats it.
   *
   * Built by pushing only the rows that have a real number behind them, so a
   * reader with no birth location gets a four-row column rather than two rows
   * of zeroes — SPEC §1.6. The sky and the orb ride along with the cached
   * insight, which is why a past card's margin is that day's, not today's.
   */
  const buildMarginRows = (): MarginRow[] => {
    const rows: MarginRow[] = [];
    const readout = generatedInsight?.readout;

    const drawn = clockTime(drawnAt);
    if (drawn) rows.push({ value: drawn, label: 'drawn' });

    // On the clock of the place the sun actually rose over, not the reader's.
    const zone = readout?.sky?.zone;
    const sunrise = clockTime(readout?.sky?.sunrise, zone);
    if (sunrise) rows.push({ value: sunrise, label: 'sunrise' });

    const sunset = clockTime(readout?.sky?.sunset, zone);
    if (sunset) rows.push({ value: sunset, label: 'sunset' });

    const { moonIllumination, moonDirection } = readout?.sky ?? {};
    if (moonIllumination !== null && moonIllumination !== undefined && moonDirection) {
      rows.push({ value: `${moonIllumination}%`, label: moonDirection });
    }

    const orb = formatOrb(readout?.orb);
    if (orb) rows.push({ value: orb, label: 'orb' });

    if (draws > 0) rows.push({ value: String(draws), label: draws === 1 ? 'draw' : 'draws' });

    return rows;
  };

  // Sealed card: the tear-off page owns this state, and none of the reading
  // below exists yet, so the plate stands alone without its margins.
  if (!isRevealed) {
    return (
      <div className="w-full mx-auto">
        <div data-card-image className="aspect-[2/3] w-72 md:w-96 mx-auto rounded-2xl overflow-visible relative">
          {artVisibleEarly ? (
            <div className={`relative w-full h-full rounded-2xl overflow-hidden transform-gpu ${
              isReversed ? 'rotate-180' : ''
            }`}>
              <img
                src={`/cards/${getCardFilename(card.id, card.name)}.png`}
                alt={card.name}
                className="w-full h-full object-cover shadow-xl"
                onError={(e) => { e.currentTarget.src = card.imagePath; }}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img src="/card-back.png" alt="Card back" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const marginRows = buildMarginRows();

  return (
    /* The reading measures itself against this, not against the browser, so it
       lays out the same whether it fills the screen or sits in a 420px window
       on the year view. See .shell in card-page.module.css. */
    <div className={`${styles.shell} ${surface === 'window' ? styles.shellWindow : ''}`}>
    <main className={styles.page}>
      <div className={styles.col}>
        <CardName name={card.name} />

        <Plate left={marginRows} shares={noteShares(card.id, noteCount)}>
          {/* The app's own card element, carried over untouched — the plate
              holds it, it doesn't re-implement it.

              Sized to match the sealed card above rather than to the spec's
              214/268px plate: the reveal is a tear, not a cut, and the card
              changing size at the moment it opens breaks that. */}
          <div data-card-image className="aspect-[2/3] w-72 md:w-96 mx-auto overflow-visible relative">
          <div className={`relative w-full h-full overflow-hidden transform-gpu ${
            isReversed ? 'rotate-180' : ''
          }`}>
            <img
              src={`/cards/${getCardFilename(card.id, card.name)}.png`}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = card.imagePath;
              }}
            />
          </div>

          {/* Slot reel overlay — renders on top while animating */}
          {showSlot && (
            <CardSlotReveal
              selectedCardSrc={`/cards/${getCardFilename(card.id, card.name)}.png`}
              isReversed={isReversed}
              onComplete={handleSlotComplete}
            />
          )}
          </div>
        </Plate>

        <StateLine suite={card.suite} isReversed={isReversed} />

        {/* The same figures as the left margin, 2-up. Mobile only. */}
        <Readout rows={marginRows} />

        {/* 06–08. One column on a phone; at 880px the spine splits it. */}
        <div className={styles.body}>
          <div className={styles.left}>
            <Keywords keywords={activeKeywords} />
            <Meaning lede={activeMeaning} sub={card.description} />
          </div>

          <div className={styles.spine} />

          <div className={styles.right}>
            <Distill cardId={card.id} isReversed={isReversed} />
          </div>
        </div>
      </div>

      {/* 09. Omitted entirely when the reader opted out, so the card and its
          traditional meaning stand on their own. */}
      {personalisationOn() && (
        <Module
          keyPhrase={generatedInsight?.keyPhrase || ''}
          insight={generatedInsight?.insight || ''}
          action={generatedInsight?.action}
          transitExplanation={generatedInsight?.transitExplanation}
          exact={generatedInsight?.readout?.exact}
          isLoading={isGenerating}
          isRateLimited={isRateLimited}
          hasError={!!insightError}
          onRetry={() => setInsightError(null)}
        />
      )}

      {footer}
    </main>
    </div>
  );

}
