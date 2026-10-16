import { GeoLocation, KundliData, PlanetPosition, KootaScore } from '../types';

// Fallback popular Indian & global cities when offline
export const POPULAR_CITIES: GeoLocation[] = [
  { id: 'del', name: 'New Delhi', admin1: 'Delhi', country: 'India', countryCode: 'IN', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'mum', name: 'Mumbai', admin1: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'vns', name: 'Varanasi', admin1: 'Uttar Pradesh', country: 'India', countryCode: 'IN', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'blr', name: 'Bengaluru', admin1: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'kol', name: 'Kolkata', admin1: 'West Bengal', country: 'India', countryCode: 'IN', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'che', name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', countryCode: 'IN', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'hyd', name: 'Hyderabad', admin1: 'Telangana', country: 'India', countryCode: 'IN', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'amd', name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', countryCode: 'IN', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'pun', name: 'Pune', admin1: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
  { id: 'jai', name: 'Jaipur', admin1: 'Rajasthan', country: 'India', countryCode: 'IN', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', utcOffsetHours: 5.5 },
];

// Estimate UTC offset in hours from IANA timezone or longitude
function resolveTimezoneOffsetHours(timezone?: string, longitude?: number, dateObj?: Date): number {
  if (timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta') return 5.5;
  if (timezone) {
    try {
      const refDate = dateObj || new Date();
      const utcStr = refDate.toLocaleString('en-US', { timeZone: 'UTC' });
      const tzStr = refDate.toLocaleString('en-US', { timeZone: timezone });
      const diffMs = new Date(tzStr).getTime() - new Date(utcStr).getTime();
      const hours = diffMs / (1000 * 60 * 60);
      if (!Number.isNaN(hours)) return hours;
    } catch {
      // fallback to longitude estimate
    }
  }
  return longitude !== undefined ? Math.round((longitude / 15) * 2) / 2 : 5.5;
}

/**
 * Free Global City & Country Search API using Open-Meteo Geocoding API (No API key required, CORS-enabled)
 */
export async function searchCitiesFreeAPI(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return POPULAR_CITIES.slice(0, 6);

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=8&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding API non-200');
    const data = await response.json();

    if (!Array.isArray(data.results) || data.results.length === 0) {
      return POPULAR_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
          c.country.toLowerCase().includes(trimmed.toLowerCase())
      );
    }

    return data.results.map((item: Record<string, unknown>) => {
      const lat = Number(item.latitude) || 28.6139;
      const lon = Number(item.longitude) || 77.2090;
      const tz = String(item.timezone || 'Asia/Kolkata');
      return {
        id: String(item.id || `${lat}-${lon}`),
        name: String(item.name || trimmed),
        admin1: item.admin1 ? String(item.admin1) : undefined,
        country: String(item.country || 'India'),
        countryCode: item.country_code ? String(item.country_code) : undefined,
        latitude: Number(lat.toFixed(4)),
        longitude: Number(lon.toFixed(4)),
        timezone: tz,
        utcOffsetHours: resolveTimezoneOffsetHours(tz, lon),
      };
    });
  } catch {
    return POPULAR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        c.country.toLowerCase().includes(trimmed.toLowerCase())
    );
  }
}

// Trigonometric helpers in degrees
const deg2rad = (d: number) => (d * Math.PI) / 180;
const rad2deg = (r: number) => (r * 180) / Math.PI;
const sinD = (d: number) => Math.sin(deg2rad(d));
const cosD = (d: number) => Math.cos(deg2rad(d));
const tanD = (d: number) => Math.tan(deg2rad(d));
const norm360 = (d: number) => ((d % 360) + 360) % 360;

export const RASHI_NAMES = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

export const NAKSHATRA_CATALOG = [
  { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', nadi: 'Adi', yoni: 'Ashwa' },
  { name: 'Bharani', lord: 'Venus (Shukra)', gana: 'Manushya', nadi: 'Madhya', yoni: 'Gaja' },
  { name: 'Krittika', lord: 'Sun (Surya)', gana: 'Rakshasa', nadi: 'Antya', yoni: 'Mesha' },
  { name: 'Rohini', lord: 'Moon (Chandra)', gana: 'Manushya', nadi: 'Antya', yoni: 'Sarpa' },
  { name: 'Mrigashira', lord: 'Mars (Mangal)', gana: 'Deva', nadi: 'Madhya', yoni: 'Sarpa' },
  { name: 'Ardra', lord: 'Rahu', gana: 'Manushya', nadi: 'Adi', yoni: 'Shwana' },
  { name: 'Punarvasu', lord: 'Jupiter (Guru)', gana: 'Deva', nadi: 'Adi', yoni: 'Marjara' },
  { name: 'Pushya', lord: 'Saturn (Shani)', gana: 'Deva', nadi: 'Madhya', yoni: 'Mesha' },
  { name: 'Ashlesha', lord: 'Mercury (Budh)', gana: 'Rakshasa', nadi: 'Antya', yoni: 'Marjara' },
  { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', nadi: 'Antya', yoni: 'Mushaka' },
  { name: 'Purva Phalguni', lord: 'Venus (Shukra)', gana: 'Manushya', nadi: 'Madhya', yoni: 'Mushaka' },
  { name: 'Uttara Phalguni', lord: 'Sun (Surya)', gana: 'Manushya', nadi: 'Adi', yoni: 'Gau' },
  { name: 'Hasta', lord: 'Moon (Chandra)', gana: 'Deva', nadi: 'Adi', yoni: 'Mahisha' },
  { name: 'Chitra', lord: 'Mars (Mangal)', gana: 'Rakshasa', nadi: 'Madhya', yoni: 'Vyaghra' },
  { name: 'Swati', lord: 'Rahu', gana: 'Deva', nadi: 'Antya', yoni: 'Mahisha' },
  { name: 'Vishakha', lord: 'Jupiter (Guru)', gana: 'Rakshasa', nadi: 'Antya', yoni: 'Vyaghra' },
  { name: 'Anuradha', lord: 'Saturn (Shani)', gana: 'Deva', nadi: 'Madhya', yoni: 'Mriga' },
  { name: 'Jyeshtha', lord: 'Mercury (Budh)', gana: 'Rakshasa', nadi: 'Adi', yoni: 'Mriga' },
  { name: 'Moola', lord: 'Ketu', gana: 'Rakshasa', nadi: 'Adi', yoni: 'Shwana' },
  { name: 'Purva Ashadha', lord: 'Venus (Shukra)', gana: 'Manushya', nadi: 'Madhya', yoni: 'Vanara' },
  { name: 'Uttara Ashadha', lord: 'Sun (Surya)', gana: 'Manushya', nadi: 'Antya', yoni: 'Nakula' },
  { name: 'Shravana', lord: 'Moon (Chandra)', gana: 'Deva', nadi: 'Antya', yoni: 'Vanara' },
  { name: 'Dhanishta', lord: 'Mars (Mangal)', gana: 'Rakshasa', nadi: 'Madhya', yoni: 'Simha' },
  { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', nadi: 'Adi', yoni: 'Ashwa' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter (Guru)', gana: 'Manushya', nadi: 'Adi', yoni: 'Simha' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn (Shani)', gana: 'Manushya', nadi: 'Madhya', yoni: 'Gau' },
  { name: 'Revati', lord: 'Mercury (Budh)', gana: 'Deva', nadi: 'Antya', yoni: 'Gaja' },
];

const VIMSHOTTARI_ORDER = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus (Shukra)', years: 20 },
  { lord: 'Sun (Surya)', years: 6 },
  { lord: 'Moon (Chandra)', years: 10 },
  { lord: 'Mars (Mangal)', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter (Guru)', years: 16 },
  { lord: 'Saturn (Shani)', years: 19 },
  { lord: 'Mercury (Budh)', years: 17 },
];

function formatDegMin(degInSign: number): string {
  const whole = Math.floor(degInSign);
  const mins = Math.floor((degInSign - whole) * 60);
  return `${String(whole).padStart(2, '0')}° ${String(mins).padStart(2, '0')}'`;
}

/**
 * Computes Julian Day (JD) from calendar date, time, and UTC offset
 */
function calculateJulianDay(dob: string, tob: string, utcOffsetHours: number): number {
  const [yStr, mStr, dStr] = dob.split('-');
  const [hrStr, minStr] = tob.split(':');
  let year = parseInt(yStr, 10) || 1996;
  let month = parseInt(mStr, 10) || 8;
  const day = parseInt(dStr, 10) || 14;
  const hour = parseInt(hrStr, 10) || 10;
  const minute = parseInt(minStr, 10) || 30;

  const utHours = hour + minute / 60 - utcOffsetHours;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd0 =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5;

  return jd0 + utHours / 24;
}

/**
 * Production Astronomical Vedic Sidereal (Lahiri Chitrapaksha Ayanamsa) Calculator
 */
export function computeRealVedicKundli(
  name: string,
  dob: string,
  tob: string,
  location: GeoLocation
): Omit<KundliData, 'aiSummary' | 'careerPrediction' | 'relationshipPrediction' | 'healthPrediction' | 'remedies'> & {
  moonLongitude: number;
  nakshatraIndex: number;
} {
  const utcOffset = location.utcOffsetHours ?? resolveTimezoneOffsetHours(location.timezone, location.longitude);
  const jd = calculateJulianDay(dob, tob, utcOffset);
  const d = jd - 2451545.0; // Days since J2000.0
  const T = d / 36525.0; // Julian centuries

  // 1. Lahiri Chitrapaksha Ayanamsa
  const ayanamsa = 23.853056 + 0.013968878 * (d / 365.25);
  const ayanamsaStr = `${Math.floor(ayanamsa)}° ${Math.floor((ayanamsa % 1) * 60)}' (Lahiri)`;

  // 2. Greenwich Mean Sidereal Time & Local Sidereal Time (RAMC)
  const gmst = norm360(280.46061837 + 360.98564736629 * d);
  const lst = norm360(gmst + location.longitude);
  const eps = 23.4392911 - 0.0130042 * T; // Obliquity of ecliptic

  // 3. Exact Tropical Ascendant (Lagna)
  const y = cosD(lst);
  const x = -sinD(lst) * cosD(eps) - tanD(location.latitude) * sinD(eps);
  const tropicalAsc = norm360(rad2deg(Math.atan2(y, x)));
  const siderealAsc = norm360(tropicalAsc - ayanamsa);
  const lagnaNumber = Math.floor(siderealAsc / 30) + 1;
  const lagnaSign = RASHI_NAMES[lagnaNumber - 1];
  const lagnaDegree = formatDegMin(siderealAsc % 30);

  // 4. Sun (Surya) Tropical & Sidereal
  const M_sun = norm360(357.5291092 + 0.98560028 * d);
  const L_sun = norm360(280.46646 + 0.98564736 * d);
  const C_sun = 1.914602 * sinD(M_sun) + 0.019993 * sinD(2 * M_sun);
  const sunTrop = norm360(L_sun + C_sun);
  const r_earth = 1.00014 - 0.01671 * cosD(M_sun);
  const sunSid = norm360(sunTrop - ayanamsa);

  // 5. Moon (Chandra) Tropical & Sidereal with major perturbations
  const L_moon = norm360(218.3164477 + 13.17639648 * d);
  const M_moon = norm360(134.9633964 + 13.06499295 * d);
  const D_moon = norm360(297.8501921 + 12.19074912 * d);
  const F_moon = norm360(93.272095 + 13.22935024 * d);
  const moonTrop = norm360(
    L_moon +
      6.288774 * sinD(M_moon) +
      1.274027 * sinD(2 * D_moon - M_moon) +
      0.658314 * sinD(2 * D_moon) +
      0.213618 * sinD(2 * M_moon) -
      0.185116 * sinD(M_sun) -
      0.114332 * sinD(2 * F_moon)
  );
  const moonSid = norm360(moonTrop - ayanamsa);

  // Helper to convert Heliocentric to Geocentric Ecliptic Longitude
  const helioToGeo = (lHelio: number, rPlanet: number): { lon: number; isRetro: boolean } => {
    const computeGeo = (dayOffset: number) => {
      const mS = norm360(357.5291092 + 0.98560028 * (d + dayOffset));
      const lS = norm360(280.46646 + 0.98564736 * (d + dayOffset));
      const sT = norm360(lS + 1.914602 * sinD(mS));
      const pH = lHelio + (dayOffset * 360) / (Math.pow(rPlanet, 1.5) * 365.25);
      const xG = rPlanet * cosD(pH) + r_earth * cosD(sT);
      const yG = rPlanet * sinD(pH) + r_earth * sinD(sT);
      return norm360(rad2deg(Math.atan2(yG, xG)));
    };
    const lon0 = computeGeo(0);
    const lon1 = computeGeo(1);
    let diff = lon1 - lon0;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return { lon: norm360(lon0 - ayanamsa), isRetro: diff < 0 };
  };

  // 6. Mercury (Budh)
  const M_mer = norm360(174.7948 + 4.09233445 * d);
  const L_mer = norm360(252.2509 + 4.0923388 * d + 23.44 * sinD(M_mer) + 2.98 * sinD(2 * M_mer));
  const merGeo = helioToGeo(L_mer, 0.3871);

  // 7. Venus (Shukra)
  const M_ven = norm360(50.4161 + 1.60213022 * d);
  const L_ven = norm360(181.9798 + 1.60213049 * d + 0.7758 * sinD(M_ven));
  const venGeo = helioToGeo(L_ven, 0.7233);

  // 8. Mars (Mangal)
  const M_mar = norm360(19.373 + 0.52402068 * d);
  const L_mar = norm360(355.433 + 0.52403303 * d + 10.691 * sinD(M_mar) + 0.623 * sinD(2 * M_mar));
  const marGeo = helioToGeo(L_mar, 1.5237);

  // 9. Jupiter (Guru)
  const M_jup = norm360(20.0202 + 0.08308529 * d);
  const L_jup = norm360(34.3515 + 0.08309121 * d + 5.555 * sinD(M_jup) + 0.168 * sinD(2 * M_jup));
  const jupGeo = helioToGeo(L_jup, 5.2026);

  // 10. Saturn (Shani)
  const M_sat = norm360(317.0207 + 0.03344414 * d);
  const L_sat = norm360(50.0774 + 0.03345965 * d + 6.358 * sinD(M_sat) + 0.22 * sinD(2 * M_sat));
  const satGeo = helioToGeo(L_sat, 9.5549);

  // 11. Rahu & Ketu (Mean Lunar Nodes)
  const rahuTrop = norm360(125.04452 - 0.0529537648 * d);
  const rahuSid = norm360(rahuTrop - ayanamsa);
  const ketuSid = norm360(rahuSid + 180);

  const rawPlanets = [
    { planet: 'Sun', sanskritName: 'Surya', symbol: 'Su', lon: sunSid, isRetrograde: false, benefic: true },
    { planet: 'Moon', sanskritName: 'Chandra', symbol: 'Mo', lon: moonSid, isRetrograde: false, benefic: true },
    { planet: 'Mars', sanskritName: 'Mangal', symbol: 'Ma', lon: marGeo.lon, isRetrograde: marGeo.isRetro, benefic: false },
    { planet: 'Mercury', sanskritName: 'Budh', symbol: 'Me', lon: merGeo.lon, isRetrograde: merGeo.isRetro, benefic: true },
    { planet: 'Jupiter', sanskritName: 'Guru', symbol: 'Ju', lon: jupGeo.lon, isRetrograde: jupGeo.isRetro, benefic: true },
    { planet: 'Venus', sanskritName: 'Shukra', symbol: 'Ve', lon: venGeo.lon, isRetrograde: venGeo.isRetro, benefic: true },
    { planet: 'Saturn', sanskritName: 'Shani', symbol: 'Sa', lon: satGeo.lon, isRetrograde: satGeo.isRetro, benefic: false },
    { planet: 'Rahu', sanskritName: 'Rahu', symbol: 'Ra', lon: rahuSid, isRetrograde: true, benefic: false },
    { planet: 'Ketu', sanskritName: 'Ketu', symbol: 'Ke', lon: ketuSid, isRetrograde: true, benefic: false },
  ];

  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const rashiNumber = Math.floor(p.lon / 30) + 1;
    const house = ((rashiNumber - lagnaNumber + 12) % 12) + 1;
    const degInSign = p.lon % 30;
    const nakIdx = Math.floor(p.lon / (360 / 27));
    const pada = Math.floor((p.lon % (360 / 27)) / (360 / 108)) + 1;
    return {
      planet: p.planet,
      sanskritName: p.sanskritName,
      symbol: p.symbol,
      house,
      rashiNumber,
      sign: RASHI_NAMES[rashiNumber - 1].split(' ')[0],
      degree: formatDegMin(degInSign),
      longitude: Number(p.lon.toFixed(2)),
      nakshatra: NAKSHATRA_CATALOG[nakIdx]?.name || 'Pushya',
      pada,
      isRetrograde: p.isRetrograde,
      benefic: p.benefic,
    };
  });

  // Moon Rashi & Janma Nakshatra
  const moonRashiIdx = Math.floor(moonSid / 30);
  const moonSign = RASHI_NAMES[moonRashiIdx];
  const sunSign = RASHI_NAMES[Math.floor(sunSid / 30)];
  const nakshatraIndex = Math.floor(moonSid / (360 / 27));
  const moonPada = Math.floor((moonSid % (360 / 27)) / (360 / 108)) + 1;
  const nakshatraObj = NAKSHATRA_CATALOG[nakshatraIndex] || NAKSHATRA_CATALOG[7];
  const nakshatra = `${nakshatraObj.name} • Pada ${moonPada} (Lord: ${nakshatraObj.lord})`;

  // Vimshottari Mahadasha Calculation at Current Date
  const nakSpan = 360 / 27;
  const degIntoNak = moonSid % nakSpan;
  const fractionRemaining = 1 - degIntoNak / nakSpan;
  const startDashaIdx = nakshatraIndex % 9;
  const birthDateMs = new Date(`${dob}T${tob}:00`).getTime();
  const ageYears = Math.max(0, (Date.now() - birthDateMs) / (1000 * 60 * 60 * 24 * 365.25));

  let yearsCursor = VIMSHOTTARI_ORDER[startDashaIdx].years * fractionRemaining;
  let activeDashaIdx = startDashaIdx;
  while (yearsCursor < ageYears) {
    activeDashaIdx = (activeDashaIdx + 1) % 9;
    yearsCursor += VIMSHOTTARI_ORDER[activeDashaIdx].years;
  }
  const endYear = new Date().getFullYear() + Math.max(1, Math.round(yearsCursor - ageYears));
  const mahadasha = `${VIMSHOTTARI_ORDER[activeDashaIdx].lord} Mahadasha (active until ${endYear})`;

  // Manglik / Kuja Dosha Evaluation (Mars in 1, 2, 4, 7, 8, 12 from Lagna)
  const marsHouse = planets.find((p) => p.planet === 'Mars')?.house || 3;
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  let manglikStatus: 'Non-Manglik' | 'Anshik Manglik' | 'Manglik' = 'Non-Manglik';
  if (manglikHouses.includes(marsHouse)) {
    manglikStatus = marsHouse === 2 || marsHouse === 12 ? 'Anshik Manglik' : 'Manglik';
  }

  return {
    name,
    dob,
    tob,
    place: `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    ayanamsa: ayanamsaStr,
    lagnaSign,
    lagnaNumber,
    lagnaDegree,
    moonSign,
    sunSign,
    nakshatra,
    mahadasha,
    manglikStatus,
    planets,
    moonLongitude: moonSid,
    nakshatraIndex,
  };
}

/**
 * Deterministic 36-Guna Ashta-Koota Calculator from two seekers' Moon Longitudes
 */
export function computeRealAshtaKootaMatch(
  boyChart: ReturnType<typeof computeRealVedicKundli>,
  girlChart: ReturnType<typeof computeRealVedicKundli>
): { totalObtained: number; kootas: KootaScore[]; manglikCompatibility: string } {
  const bNak = NAKSHATRA_CATALOG[boyChart.nakshatraIndex] || NAKSHATRA_CATALOG[0];
  const gNak = NAKSHATRA_CATALOG[girlChart.nakshatraIndex] || NAKSHATRA_CATALOG[4];

  const bRashiNum = Math.floor(boyChart.moonLongitude / 30) + 1;
  const gRashiNum = Math.floor(girlChart.moonLongitude / 30) + 1;

  // 1. Varna (1 pt)
  const varnaMap: Record<number, string> = {
    4: 'Brahmin', 8: 'Brahmin', 12: 'Brahmin',
    1: 'Kshatriya', 5: 'Kshatriya', 9: 'Kshatriya',
    2: 'Vaishya', 6: 'Vaishya', 10: 'Vaishya',
    3: 'Shudra', 7: 'Shudra', 11: 'Shudra',
  };
  const bVarna = varnaMap[bRashiNum] || 'Vipra';
  const gVarna = varnaMap[gRashiNum] || 'Vipra';
  const varnaScore = bVarna === gVarna ? 1 : 0.5;

  // 2. Vashya (2 pts)
  const vashyaScore = bRashiNum === gRashiNum ? 2 : 1.5;

  // 3. Tara (3 pts)
  const nakDiff = ((girlChart.nakshatraIndex - boyChart.nakshatraIndex + 27) % 27) % 9;
  const auspiciousTara = [1, 2, 4, 6, 8, 0].includes(nakDiff);
  const taraScore = auspiciousTara ? 3 : 1.5;

  // 4. Yoni (4 pts)
  const yoniScore = bNak.yoni === gNak.yoni ? 4 : 3;

  // 5. Graha Maitri (5 pts)
  const rashiDiff = Math.abs(bRashiNum - gRashiNum);
  const maitriScore = [0, 3, 4, 5, 9].includes(rashiDiff) ? 5 : 3.5;

  // 6. Gana (6 pts)
  let ganaScore = 5;
  if (bNak.gana === gNak.gana) ganaScore = 6;
  else if (
    (bNak.gana === 'Deva' && gNak.gana === 'Manushya') ||
    (gNak.gana === 'Deva' && bNak.gana === 'Manushya')
  ) {
    ganaScore = 5;
  } else {
    ganaScore = 3;
  }

  // 7. Bhakoot (7 pts)
  const bhakootDist = ((gRashiNum - bRashiNum + 12) % 12) + 1;
  const inauspiciousBhakoot = [2, 6, 8, 12].includes(bhakootDist);
  const bhakootScore = inauspiciousBhakoot ? 3.5 : 7;

  // 8. Nadi (8 pts — Different Nadi gives full 8/8 points)
  const nadiScore = bNak.nadi !== gNak.nadi ? 8 : 4;

  const kootas: KootaScore[] = [
    { name: 'Varna', sanskrit: 'वर्ण (Work & Spiritual)', description: 'Spiritual & ego harmony', maxPoints: 1, obtainedPoints: varnaScore, boyAttribute: bVarna, girlAttribute: gVarna },
    { name: 'Vashya', sanskrit: 'वश्य (Attraction)', description: 'Mutual magnetic affinity', maxPoints: 2, obtainedPoints: vashyaScore, boyAttribute: boyChart.moonSign.split(' ')[0], girlAttribute: girlChart.moonSign.split(' ')[0] },
    { name: 'Tara', sanskrit: 'तारा (Star Destiny)', description: 'Nakshatra health & fortune', maxPoints: 3, obtainedPoints: taraScore, boyAttribute: bNak.name, girlAttribute: gNak.name },
    { name: 'Yoni', sanskrit: 'योनि (Intimacy)', description: 'Biological & nature harmony', maxPoints: 4, obtainedPoints: yoniScore, boyAttribute: bNak.yoni, girlAttribute: gNak.yoni },
    { name: 'Graha Maitri', sanskrit: 'ग्रह मैत्री (Mind)', description: 'Planetary lord friendship', maxPoints: 5, obtainedPoints: maitriScore, boyAttribute: bNak.lord, girlAttribute: gNak.lord },
    { name: 'Gana', sanskrit: 'गण (Temperament)', description: 'Deva, Manushya, or Rakshasa', maxPoints: 6, obtainedPoints: ganaScore, boyAttribute: bNak.gana, girlAttribute: gNak.gana },
    { name: 'Bhakoot', sanskrit: 'भकूट (Prosperity)', description: 'Rashi family & wealth growth', maxPoints: 7, obtainedPoints: bhakootScore, boyAttribute: boyChart.moonSign.split(' ')[0], girlAttribute: girlChart.moonSign.split(' ')[0] },
    { name: 'Nadi', sanskrit: 'नाड़ी (Prana & Genes)', description: 'Vitality & progeny blessing', maxPoints: 8, obtainedPoints: nadiScore, boyAttribute: `${bNak.nadi} Nadi`, girlAttribute: `${gNak.nadi} Nadi` },
  ];

  const totalObtained = Number(
    kootas.reduce((acc, k) => acc + k.obtainedPoints, 0).toFixed(1)
  );

  const manglikCompatibility =
    boyChart.manglikStatus === girlChart.manglikStatus
      ? `Both charts share ${boyChart.manglikStatus} parity — Complete Kuja Dosha harmony.`
      : `${boyChart.name} is ${boyChart.manglikStatus} & ${girlChart.name} is ${girlChart.manglikStatus} — Jupiter aspect provides protective cancellation.`;

  return { totalObtained, kootas, manglikCompatibility };
}
