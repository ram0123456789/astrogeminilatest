export enum ActiveTab {
  HOME = 'HOME',
  CHAT = 'CHAT',
  KUNDLI = 'KUNDLI',
  MATCHING = 'MATCHING',
  PALMISTRY = 'PALMISTRY',
  HOROSCOPE = 'HOROSCOPE',
  NUMEROLOGY = 'NUMEROLOGY',
  FACE_READING = 'FACE_READING',
  DREAM_ANALYSIS = 'DREAM_ANALYSIS',
  TAROT_READING = 'TAROT_READING',
  VASTU_SHASTRA = 'VASTU_SHASTRA',
  MORE_SERVICES = 'MORE_SERVICES',
  PROFILE = 'PROFILE',
}

export type AppTheme = 'divya-dark' | 'divya-light' | 'cosmic' | 'saffron';

export interface IndianLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  greeting: string;
  samplePrompts: string[];
}

export interface GeoLocation {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffsetHours: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar: string;
  authMethod: 'google' | 'phone';
  joinedAt: string;
  rashi?: string;
}

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  category: 'Vedic' | 'Numerology' | 'Tarot' | 'Palmistry' | 'Horary';
  specialties: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  pricePerMin: number;
  originalPrice: number;
  consultationsCount: string;
  avatar: string;
  status: 'online' | 'busy';
  systemPrompt: string;
  voiceSystemPrompt: string;
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  signatureMantra: string;
  bio: string;
  requiresPalmImage?: boolean;
  specialtyOpeningHi: string;
  specialtyOpeningEn: string;
  specialtyPrompts: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astrologer' | 'system';
  text: string;
  timestamp: string;
  imageUrl?: string;
  remedyCard?: {
    title: string;
    mantra?: string;
    instruction: string;
  };
}

export interface ChatSessionRecord {
  id: string;
  astrologerId: string;
  astrologerName: string;
  astrologerAvatar: string;
  astrologerTitle: string;
  lastMessage: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface PlanetPosition {
  planet: string;
  sanskritName: string;
  symbol: string;
  house: number; // 1 to 12
  sign: string;
  rashiNumber?: number; // 1 to 12
  degree: string;
  longitude?: number; // 0 to 360 sidereal
  nakshatra?: string;
  pada?: number;
  isRetrograde: boolean;
  benefic: boolean;
}

export interface KundliData {
  id?: string;
  isPrimaryUser?: boolean;
  relationLabel?: string; // e.g. 'Self', 'Partner', 'Family', 'Friend'
  name: string;
  gender?: 'male' | 'female' | 'other';
  dob: string;
  tob: string;
  place: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  ayanamsa?: string;
  lagnaSign: string;
  lagnaNumber: number; // 1 (Aries) to 12 (Pisces)
  lagnaDegree?: string;
  moonSign: string;
  sunSign?: string;
  nakshatra: string;
  mahadasha: string;
  manglikStatus: 'Non-Manglik' | 'Anshik Manglik' | 'Manglik';
  planets: PlanetPosition[];
  aiSummary: string;
  careerPrediction: string;
  relationshipPrediction: string;
  healthPrediction: string;
  remedies: string[];
}

export interface KootaScore {
  name: string;
  sanskrit: string;
  description: string;
  maxPoints: number;
  obtainedPoints: number;
  boyAttribute: string;
  girlAttribute: string;
}

export interface KundliMatchResult {
  boyName: string;
  girlName: string;
  boyLagna?: string;
  girlLagna?: string;
  boyRashi?: string;
  girlRashi?: string;
  boyNakshatra?: string;
  girlNakshatra?: string;
  totalObtained: number;
  totalMax: number;
  manglikCompatibility: string;
  verdictTitle: string;
  aiDetailedReport: string;
  kootas: KootaScore[];
  remedies: string[];
}

export interface PalmReadingResult {
  handDominance: string;
  elementalHandType: string;
  lifeLine: {
    title: string;
    score: number;
    observation: string;
    prediction: string;
  };
  heartLine: {
    title: string;
    score: number;
    observation: string;
    prediction: string;
  };
  headLine: {
    title: string;
    score: number;
    observation: string;
    prediction: string;
  };
  fateLine: {
    title: string;
    score: number;
    observation: string;
    prediction: string;
  };
  mountsSummary: string;
  luckyGemstone: string;
  sacredRemedy: string;
}

export interface FaceReadingResult {
  faceShapeElement: string;
  foreheadLalat: { score: number; insight: string };
  eyesNetra: { score: number; insight: string };
  noseNasika: { score: number; insight: string };
  lipsAdhara: { score: number; insight: string };
  auraAndPersonality: string;
  careerAndWealthYoga: string;
  sacredRemedy: string;
}

export interface DreamAnalysisResult {
  dreamSymbolism: string;
  swapnaShastraCategory: string;
  spiritualMeaning: string;
  nearFutureIndication: string;
  auspiciousIndex: number;
  morningUpay: string;
}

export interface TarotCardReading {
  pastCard: { name: string; sanskritArchetype: string; meaning: string };
  presentCard: { name: string; sanskritArchetype: string; meaning: string };
  futureCard: { name: string; sanskritArchetype: string; meaning: string };
  overallGuidance: string;
  luckyAffirmation: string;
}

export interface VastuAnalysisResult {
  vastuScore: number;
  directionalEnergy: string;
  doshaDetected: string;
  simpleCorrections: string[];
  auspiciousPlacement: string;
}

export interface NumerologyAIInsights {
  personalitySynthesis: string;
  nameCorrectionAnalysis: string;
  compatibilityScore: number;
  suggestedSpellings: Array<{
    spelling: string;
    compoundNumber: number;
    rootNumber: number;
    rulingPlanet: string;
    benefit: string;
  }>;
  luckyDates: string[];
  avoidDates: string[];
  luckyColors: string[];
  luckyGemstone: string;
  missingNumberRemedies: Array<{
    number: number;
    planet: string;
    remedy: string;
  }>;
  dailyAffirmationMantra: string;
}

export interface DakshinaReceipt {
  id: string;
  astrologerName: string;
  amount: number;
  tierName: string;
  rating: number;
  blessingShloka: string;
  blessingMeaning: string;
  personalAshirwad: string;
  timestamp: string;
}
