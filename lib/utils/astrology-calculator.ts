/**
 * Real Astrology Calculator using Astronomy Engine
 *
 * Calculates natal chart positions and current transits for users based on their
 * birth data (date, time, location).
 */

import * as Astronomy from 'astronomy-engine';
import type { ActiveTransit, UserChart, House, Planet, AspectType, TransitPhase } from '../types/astrology';
import { cardPlanetAffinity } from '../data/insight-structure-templates';
import { birthInstant, zoneForCoordinates } from './birth-instant';
import { nodePositions, type Graha } from './jyotish';

// Planet bodies in Astronomy Engine
const PLANET_BODIES = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

// Aspect orbs (degrees) - made more lenient to ensure we find transits
const ASPECT_ORBS = {
  conjunction: 10,
  opposition: 10,
  square: 8,
  trine: 8,
  sextile: 6,
};

/**
 * Compute the Lahiri (Chitrapaksha) ayanamsa for a given date.
 * This is the standard ayanamsa used in Indian Vedic astrology (also adopted by the
 * Indian government's Rashtriya Panchang).
 *
 * Formula: 23.85129° at J2000.0, increasing at ~0.013972°/year (50.3"/year precession).
 */
function getLahiriAyanamsa(date: Date): number {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const yearsDiff = (date.getTime() - J2000.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return 23.85129 + yearsDiff * 0.013972;
}

/** The 27 nakshatras, in order from 0° sidereal Aries. */
export const NAKSHATRA_NAMES = [
  'ashwini', 'bharani', 'krittika', 'rohini', 'mrigashira', 'ardra',
  'punarvasu', 'pushya', 'ashlesha', 'magha', 'purva phalguni', 'uttara phalguni',
  'hasta', 'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha',
  'mula', 'purva ashadha', 'uttara ashadha', 'shravana', 'dhanishtha', 'shatabhisha',
  'purva bhadrapada', 'uttara bhadrapada', 'revati',
] as const;

/** Vimshottari dasha lords, cycling every 9 nakshatras from Ashwini. */
const NAKSHATRA_LORDS = [
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury',
] as const;

/** Each nakshatra spans 13°20', each of its four padas 3°20'. */
const NAKSHATRA_SPAN = 360 / 27;

export interface Nakshatra {
  index: number;
  name: string;
  /** Vimshottari dasha lord — the planet whose period runs first. */
  lord: string;
  /** Quarter of the nakshatra, 1–4. */
  pada: number;
}

/**
 * The nakshatra containing a given sidereal longitude.
 *
 * For a natal Moon this is the janma nakshatra — fixed at birth, and the anchor
 * for Vimshottari dasha and most of classical Jyotish. It never changes, so it
 * is computed once from birth data rather than tracked over time.
 */
export function getNakshatra(siderealLongitude: number): Nakshatra {
  const lon = ((siderealLongitude % 360) + 360) % 360;
  const index = Math.floor(lon / NAKSHATRA_SPAN);
  const pada = Math.floor((lon % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  return {
    index,
    name: NAKSHATRA_NAMES[index],
    lord: NAKSHATRA_LORDS[index % 9],
    pada,
  };
}

/**
 * Convert a tropical ecliptic longitude to sidereal by subtracting the ayanamsa.
 */
function toSidereal(tropicalLon: number, ayanamsa: number): number {
  let sid = tropicalLon - ayanamsa;
  while (sid < 0) sid += 360;
  while (sid >= 360) sid -= 360;
  return sid;
}

/**
 * Apply ayanamsa to every planet position in a map, returning sidereal longitudes.
 */
function applyAyanamsaToPositions(
  positions: Record<Planet, number>,
  ayanamsa: number
): Record<Planet, number> {
  const sidereal: Partial<Record<Planet, number>> = {};
  for (const [planet, lon] of Object.entries(positions)) {
    sidereal[planet as Planet] = toSidereal(lon, ayanamsa);
  }
  return sidereal as Record<Planet, number>;
}

/**
 * Calculate planetary positions for a given date
 */
function calculatePlanetaryPositions(date: Date, observer?: Astronomy.Observer): Record<Planet, number> {
  const positions: Partial<Record<Planet, number>> = {};

  // Convert Date to AstroTime
  const astroTime = new Astronomy.AstroTime(date);

  // Use default observer (geocentric) if not provided
  const obs = observer || new Astronomy.Observer(0, 0, 0);

  for (const [planetName, planetBody] of Object.entries(PLANET_BODIES)) {
    try {
      // Get equatorial coordinates for the planet
      const equatorial = Astronomy.Equator(planetBody as Astronomy.Body, astroTime, obs, true, true);

      // Convert to ecliptic coordinates
      const ecliptic = Astronomy.Ecliptic(equatorial.vec);

      // Normalize longitude to 0-360 degrees
      let lon = ecliptic.elon;
      while (lon < 0) lon += 360;
      while (lon >= 360) lon -= 360;

      positions[planetName as Planet] = lon;
    } catch (error) {
      console.error(`Failed to calculate position for ${planetName}:`, error);
    }
  }

  return positions as Record<Planet, number>;
}

/**
 * Calculate the sidereal ascendant for a given date/location.
 * Uses Local Sidereal Time to estimate the tropical ascendant, then
 * subtracts the Lahiri ayanamsa to convert to sidereal.
 */
function calculateSiderealAscendant(
  date: Date,
  latitude: number,
  longitude: number,
  ayanamsa: number
): number {
  try {
    const astroTime = new Astronomy.AstroTime(date);
    // Greenwich Mean Sidereal Time (hours) → degrees, then add observer longitude
    const gmst = Astronomy.SiderealTime(astroTime) * 15;
    const tropicalAscendant = ((gmst + longitude) % 360 + 360) % 360;
    return toSidereal(tropicalAscendant, ayanamsa);
  } catch (error) {
    console.error('Failed to calculate ascendant:', error);
    return 0;
  }
}

/**
 * Whole Sign house system (standard Vedic / Jyotish).
 * The entire sign containing the sidereal ascendant is House 1.
 * Each subsequent sign is the next house — 12 even 30° houses.
 * This gives clean, unambiguous house placements regardless of latitude.
 */
function calculateWholeSignHouses(siderealAscendant: number): { houses: number[]; ascendant: number } {
  // 0° of the ascendant's sign is the House 1 cusp
  const h1Start = Math.floor(siderealAscendant / 30) * 30;
  const houses: number[] = [];
  for (let i = 0; i < 12; i++) {
    houses.push((h1Start + i * 30) % 360);
  }
  return { houses, ascendant: siderealAscendant };
}

/**
 * Calculate the angle between two planetary positions
 */
function calculateAngle(pos1: number, pos2: number): number {
  let angle = Math.abs(pos1 - pos2);

  // Normalize to 0-180 degrees
  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * Determine aspect type based on angle
 */
function getAspectType(angle: number): AspectType | null {
  const aspects: Array<{ type: AspectType; degrees: number; orb: number }> = [
    { type: 'conjunction', degrees: 0, orb: ASPECT_ORBS.conjunction },
    { type: 'sextile', degrees: 60, orb: ASPECT_ORBS.sextile },
    { type: 'square', degrees: 90, orb: ASPECT_ORBS.square },
    { type: 'trine', degrees: 120, orb: ASPECT_ORBS.trine },
    { type: 'opposition', degrees: 180, orb: ASPECT_ORBS.opposition },
  ];

  for (const aspect of aspects) {
    const diff = Math.abs(angle - aspect.degrees);
    if (diff <= aspect.orb) {
      return aspect.type;
    }
  }

  return null;
}

/**
 * Determine which house a planet is in
 */
function getHouseForPlanet(planetPosition: number, houseCusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];

    // Handle wrap-around at 360/0 degrees
    if (nextCusp < currentCusp) {
      if (planetPosition >= currentCusp || planetPosition < nextCusp) {
        return i + 1;
      }
    } else {
      if (planetPosition >= currentCusp && planetPosition < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // Default to 1st house if calculation fails
}

/**
 * Determine transit phase based on orb
 */
function getTransitPhase(orb: number): TransitPhase {
  if (orb < 1) return 'peak';
  if (orb < 3) return 'approaching';
  return 'beginning';
}

/**
 * Determine zodiac sign from ecliptic longitude
 */
function getZodiacSign(degrees: number): any {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  return signs[Math.floor(degrees / 30)];
}

/**
 * Geocode location to latitude/longitude using Nominatim (OpenStreetMap)
 * Free, no API key required. Used server-side only.
 */
async function geocodeLocation(location: string): Promise<{ latitude: number; longitude: number; timezone: string }> {
  try {
    const encoded = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SlowHourTarotApp/1.0 (daily tarot readings)',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      // The zone comes from the coordinates, not from the browser — the chart
      // is cast for where they were born, not where they are reading this.
      return {
        latitude,
        longitude,
        timezone: zoneForCoordinates(latitude, longitude) ?? 'UTC',
      };
    }

    console.warn(`Could not geocode "${location}" via Nominatim. Using equatorial default.`);
    return { latitude: 0, longitude: 0, timezone: 'UTC' };
  } catch (error) {
    console.error('Geocoding failed:', error);
    return { latitude: 0, longitude: 0, timezone: 'UTC' };
  }
}

/**
 * Calculate natal chart from birth data
 */
export async function calculateNatalChart(
  birthDate: Date,
  birthTime?: string,
  birthLocation?: string
): Promise<UserChart | null> {
  try {
    // Geocode location if provided
    const location = birthLocation
      ? await geocodeLocation(birthLocation)
      : { latitude: 0, longitude: 0, timezone: 'UTC' };

    // The birth clock time is read in the birth place's zone. Doing this with
    // setHours read it in the server's zone — UTC in production — which put a
    // Singapore birth eight hours late and threw the lagna out by four signs.
    const { instant: birthDateTime } = birthInstant(
      birthDate,
      birthTime,
      location.timezone === 'UTC' ? null : location.timezone,
    );

    // Create observer for location
    const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);

    // Lahiri ayanamsa for the birth date
    const ayanamsa = getLahiriAyanamsa(birthDateTime);

    // Planetary positions → sidereal (subtract ayanamsa)
    const tropicalPositions = calculatePlanetaryPositions(birthDateTime, observer);
    const positions = applyAyanamsaToPositions(tropicalPositions, ayanamsa);

    // Sidereal ascendant → Whole Sign house cusps
    const siderealAscendant = calculateSiderealAscendant(
      birthDateTime, location.latitude, location.longitude, ayanamsa
    );
    const { houses: houseCusps, ascendant } = calculateWholeSignHouses(siderealAscendant);

    // Build houses array with themes
    const houseThemes = [
      'self & identity', 'values & resources', 'communication & learning',
      'home & foundation', 'creativity & pleasure', 'health & service',
      'relationships & partnerships', 'transformation & shared resources',
      'philosophy & travel', 'career & public life', 'community & hopes',
      'subconscious & spirituality'
    ];

    const houses: House[] = houseCusps.map((cusp, i) => ({
      number: i + 1,
      sign: getZodiacSign(cusp),
      theme: houseThemes[i]
    }));

    // Janma nakshatra — the nakshatra the Moon occupied at birth. Fixed for life
    // and the primary reference in Jyotish, so it is derived from the real
    // sidereal Moon rather than estimated from the date.
    const nakshatra = getNakshatra(positions.moon!);

    // The Moon covers ~13° a day, so it can change nakshatra (13°20') within a
    // single date. With no birth time we assumed noon, which may be the wrong
    // side of a boundary — check whether the whole day sits in one nakshatra so
    // callers can tell a certain reading from a probable one.
    let nakshatraCertain = true;
    if (!birthTime) {
      const dayStart = new Date(birthDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(birthDate);
      dayEnd.setHours(23, 59, 0, 0);

      const startMoon = applyAyanamsaToPositions(
        calculatePlanetaryPositions(dayStart, observer),
        getLahiriAyanamsa(dayStart),
      ).moon!;
      const endMoon = applyAyanamsaToPositions(
        calculatePlanetaryPositions(dayEnd, observer),
        getLahiriAyanamsa(dayEnd),
      ).moon!;

      nakshatraCertain =
        getNakshatra(startMoon).index === getNakshatra(endMoon).index;
    }

    const nodes = nodePositions(birthDateTime, ayanamsa);

    return {
      sunSign: getZodiacSign(positions.sun),   // sidereal sun sign
      moonSign: getZodiacSign(positions.moon), // sidereal moon sign — janma rashi
      risingSign: getZodiacSign(ascendant),    // sidereal rising sign — lagna
      nakshatra,
      /** False when no birth time was given and the Moon crossed a boundary that day. */
      nakshatraCertain,
      birthDate,
      birthTime: birthTime || '12:00',
      birthLocation: location,
      houses,
      // Kept so the dasha timeline and gochara work from the same instant the
      // chart was cast for, rather than re-deriving it and drifting.
      birthInstant: birthDateTime,
      grahaPositions: {
        sun: positions.sun, moon: positions.moon, mercury: positions.mercury,
        venus: positions.venus, mars: positions.mars, jupiter: positions.jupiter,
        saturn: positions.saturn, rahu: nodes.rahu, ketu: nodes.ketu,
      },
      ascendantLongitude: ascendant,
    };
  } catch (error) {
    console.error('Failed to calculate natal chart:', error);
    return null;
  }
}

/**
 * Sidereal longitudes of the nine grahas at an instant, Rahu and Ketu included.
 *
 * The observer barely matters for the grahas at this resolution — it is passed
 * through for consistency with the natal call rather than for parallax.
 */
export function grahaPositionsAt(date: Date, observer?: Astronomy.Observer): Record<Graha, number> {
  const ayanamsa = getLahiriAyanamsa(date);
  const sidereal = applyAyanamsaToPositions(calculatePlanetaryPositions(date, observer), ayanamsa);
  const nodes = nodePositions(date, ayanamsa);
  return {
    sun: sidereal.sun, moon: sidereal.moon, mercury: sidereal.mercury,
    venus: sidereal.venus, mars: sidereal.mars, jupiter: sidereal.jupiter,
    saturn: sidereal.saturn, rahu: nodes.rahu, ketu: nodes.ketu,
  };
}

/**
 * Calculate current active transits for a user
 */
export async function calculateActiveTransits(
  natalChart: UserChart,
  currentDate: Date = new Date()
): Promise<ActiveTransit[]> {
  try {
    // Create observer for location
    const observer = new Astronomy.Observer(
      natalChart.birthLocation.latitude,
      natalChart.birthLocation.longitude,
      0
    );

    // The instant the chart was cast for, carried over rather than rebuilt —
    // re-deriving it here is what let the two paths disagree about the hour.
    const natalDateTime = natalChart.birthInstant;

    // Ayanamsa for birth date and current date (ayanamsa drifts ~0.014°/yr, so they differ slightly)
    const birthAyanamsa = getLahiriAyanamsa(natalDateTime);
    const currentAyanamsa = getLahiriAyanamsa(currentDate);

    // Sidereal natal positions
    const natalTropical = calculatePlanetaryPositions(natalDateTime, observer);
    const natalPositions = applyAyanamsaToPositions(natalTropical, birthAyanamsa);

    // Sidereal current (transit) positions
    const currentTropical = calculatePlanetaryPositions(currentDate, observer);
    const currentPositions = applyAyanamsaToPositions(currentTropical, currentAyanamsa);

    // Natal Whole Sign house cusps — aspects activate natal houses, not current-sky houses
    const siderealNatalAsc = calculateSiderealAscendant(
      natalDateTime,
      natalChart.birthLocation.latitude,
      natalChart.birthLocation.longitude,
      birthAyanamsa
    );
    const { houses: houseCusps } = calculateWholeSignHouses(siderealNatalAsc);

    const transits: ActiveTransit[] = [];

    // Check each transiting planet against each natal planet
    // Include more transiting planets to ensure we find at least one transit
    const transitingPlanets: Planet[] = ['saturn', 'jupiter', 'uranus', 'neptune', 'pluto', 'mars'];
    const natalPlanets: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter'];

    for (const transitingPlanet of transitingPlanets) {
      const transitPos = currentPositions[transitingPlanet];

      for (const natalPlanet of natalPlanets) {
        const natalPos = natalPositions[natalPlanet];

        // Calculate angle between planets
        const angle = calculateAngle(transitPos, natalPos);
        const aspectType = getAspectType(angle);

        if (aspectType) {
          // Calculate orb (difference from exact aspect)
          const exactAspectDegrees = aspectType === 'conjunction' ? 0
            : aspectType === 'sextile' ? 60
            : aspectType === 'square' ? 90
            : aspectType === 'trine' ? 120
            : 180;

          const orb = Math.abs(angle - exactAspectDegrees);

          // Determine which house is being activated
          const house = getHouseForPlanet(natalPos, houseCusps);

          // Determine transit phase
          const phase = getTransitPhase(orb);

          // Determine intensity (outer planets = high, inner = medium/low)
          const intensity = ['pluto', 'saturn', 'uranus'].includes(transitingPlanet) ? 'high' : 'medium';

          // Create transit ID
          const id = `transit-${transitingPlanet}-${aspectType}-${natalPlanet}-${currentDate.toISOString().split('T')[0]}`;

          transits.push({
            id,
            name: `${transitingPlanet} ${aspectType} ${natalPlanet}`,
            transitingPlanet,
            natalPlanet,
            aspect: aspectType,
            house,
            startDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // Approximate
            exactDate: currentDate,
            endDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Approximate
            phase,
            orb,
            intensity
          });
        }
      }
    }

    // Sort by orb only (closest aspects first) - removed intensity sorting
    // This ensures all planets are available for selection, not just outer planets
    transits.sort((a, b) => a.orb - b.orb);

    return transits;
  } catch (error) {
    console.error('Failed to calculate active transits:', error);
    return [];
  }
}

/**
 * Which of the six transiting planets calculateActiveTransits checks are
 * currently retrograde — apparent backward motion, tiny movement over a day
 * in the wrong direction. Geocentric and ayanamsa-independent, so this needs
 * no observer location and no sidereal correction.
 */
export function getRetrogradePlanets(currentDate: Date = new Date()): Planet[] {
  const transitingPlanets: Planet[] = ['saturn', 'jupiter', 'uranus', 'neptune', 'pluto', 'mars'];
  const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  try {
    const today = calculatePlanetaryPositions(currentDate);
    const next = calculatePlanetaryPositions(tomorrow);

    return transitingPlanets.filter(planet => {
      const delta = ((next[planet] - today[planet] + 180) % 360 + 360) % 360 - 180;
      return delta < 0;
    });
  } catch (error) {
    console.error('Failed to calculate retrograde planets:', error);
    return [];
  }
}

/**
 * Get the most relevant transit for the drawn card.
 * Uses card-planet affinity to weight toward thematically resonant transits.
 * Falls back to tightest orb if no affinity match is active.
 */
export function getDominantTransit(
  transits: ActiveTransit[],
  seed: number = Math.random(),
  cardId?: string
): ActiveTransit | null {
  if (transits.length === 0) return null;

  const affinity = cardId ? cardPlanetAffinity[cardId] : null;

  const weights = transits.map((t, i) => {
    // Base weight: tighter orb = stronger signal
    let weight = Math.max(1, 10 - t.orb);

    if (affinity) {
      // Planet affinity: first in list gets highest boost
      const planetRank = affinity.planets.indexOf(t.transitingPlanet);
      if (planetRank !== -1) {
        weight += (affinity.planets.length - planetRank) * 6;
      }

      // Aspect affinity: matching aspect types get a bump
      if (affinity.aspects.includes(t.aspect)) {
        weight += 3;
      }
    }

    // Small deterministic noise so the same card doesn't always pick
    // the exact same transit when multiple affinity matches exist
    const noise = Math.sin(seed * 1000 + i) * 1.5;
    return Math.max(0.5, weight + noise);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = (seed * totalWeight) % totalWeight;

  for (let i = 0; i < transits.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return transits[i];
    }
  }

  return transits[0];
}
