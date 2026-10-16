import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import {
  Astrologer,
  ChatMessage,
  GeoLocation,
  KundliData,
  KundliMatchResult,
  PalmReadingResult,
  NumerologyAIInsights,
  FaceReadingResult,
  DreamAnalysisResult,
  TarotCardReading,
  VastuAnalysisResult,
} from '../types';
import {
  computeRealVedicKundli,
  computeRealAshtaKootaMatch,
} from './vedicAstrologyEngine';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export async function sendAstrologerMessage(
  astrologer: Astrologer,
  history: ChatMessage[],
  userMessage: string,
  userKundliContext?: KundliData | null,
  languageName: string = 'हिन्दी (Hindi)',
  attachedImage?: { base64: string; mimeType: string }
): Promise<{ reply: string; remedyCard?: { title: string; mantra?: string; instruction: string } }> {
  const ai = getAI();

  const kundliContextStr = userKundliContext
    ? `\nActive Consulted Person's Real Astronomical Janam Kundli Context (${userKundliContext.relationLabel || 'Self'}):
- Name: ${userKundliContext.name}
- DOB: ${userKundliContext.dob} at ${userKundliContext.tob}
- Place: ${userKundliContext.place} (${userKundliContext.latitude}°N, ${userKundliContext.longitude}°E)
- Lagna (Ascendant): ${userKundliContext.lagnaSign} (${userKundliContext.lagnaDegree || ''})
- Moon Sign (Chandra Rashi): ${userKundliContext.moonSign}
- Janma Nakshatra: ${userKundliContext.nakshatra}
- Active Mahadasha: ${userKundliContext.mahadasha}
- Planetary Positions: ${userKundliContext.planets.map((p) => `${p.planet} in ${p.sign} (House ${p.house}, ${p.degree})`).join(', ')}`
    : '';

  const recentTranscript = history
    .slice(-8)
    .map((m) => `${m.sender === 'user' ? 'Seeker' : astrologer.name}: ${m.text}`)
    .join('\n');

  const prompt = `${astrologer.systemPrompt}${kundliContextStr}

IMPORTANT DOMAIN & LANGUAGE INSTRUCTION:
1. Stay strictly true to your specialty (${astrologer.title} - ${astrologer.specialties.join(', ')}). Ask relevant follow-up questions from your field (e.g. if you are a Palmist and no palm image was sent yet, remind them they can tap the camera/palm upload button in chat or ask about their palm lines; if Numerologist, ask for exact name spelling or mobile digits; if Vedic/Horary, reference their houses/dasha or ask if they are asking for themselves or a family member).
2. If an image is attached with this message, carefully examine the palm lines (Jeevan Rekha, Hridaya Rekha, Mastishka Rekha, Bhagya Rekha, Graha Parvat) or face features and give a detailed reading!
3. Write your entire response ("reply", "remedyTitle", and "remedyInstruction") in **${languageName}** using its authentic script (or natural Roman Hinglish if Hinglish is selected).

Recent Conversation:
${recentTranscript}

Seeker's New Message: "${userMessage}"

Respond in JSON format with:
1. "reply": Your warm, insightful, authentic response in ${languageName} (2-3 crisp paragraphs).
2. "includeRemedy": boolean (true if a specific mantra or Vedic upay is helpful).
3. "remedyTitle": short title of the remedy in ${languageName}.
4. "remedyMantra": Authentic Sanskrit mantra in Devanagari + transliteration.
5. "remedyInstruction": 1-2 sentences in ${languageName} on how to perform the remedy.`;

  try {
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
    if (attachedImage) {
      parts.push({
        inlineData: {
          mimeType: attachedImage.mimeType || 'image/jpeg',
          data: attachedImage.base64,
        },
      });
    }
    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            includeRemedy: { type: Type.BOOLEAN },
            remedyTitle: { type: Type.STRING },
            remedyMantra: { type: Type.STRING },
            remedyInstruction: { type: Type.STRING },
          },
          required: ['reply', 'includeRemedy'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      reply:
        parsed.reply ||
        '🙏 Namaste. Your planetary transits indicate a period of positive dharmic progress ahead.',
      remedyCard:
        parsed.includeRemedy && parsed.remedyTitle
          ? {
              title: parsed.remedyTitle,
              mantra: parsed.remedyMantra,
              instruction:
                parsed.remedyInstruction || 'Chant 108 times with devotion every morning.',
            }
          : undefined,
    };
  } catch (err) {
    console.error('Gemini Chat Error:', err);
    return {
      reply: `🙏 Namaste! Through the grace of ${astrologer.signatureMantra}, I see strong Jupiter blessings protecting your chart. Please share your specific concern so I can guide you.`,
    };
  }
}

export async function generateJanamKundliAI(
  name: string,
  dob: string,
  tob: string,
  location: GeoLocation,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<KundliData> {
  const astroChart = computeRealVedicKundli(name, dob, tob, location);

  const ai = getAI();
  const planetSummary = astroChart.planets
    .map((p) => `${p.planet} (${p.sanskritName}): ${p.sign} ${p.degree} in House ${p.house} (${p.nakshatra} Pada ${p.pada})`)
    .join('\n');

  const prompt = `You are a master Vedic Astrologer (Parashari Jyotish).
Analyze this exact sidereal (Lahiri Ayanamsa) Janam Kundli calculated from ephemeris coordinates:
- Seeker: ${name}
- Birth: ${dob} at ${tob} in ${astroChart.place} (${location.latitude}°N, ${location.longitude}°E)
- Lagna (Ascendant): ${astroChart.lagnaSign} at ${astroChart.lagnaDegree}
- Chandra Rashi (Moon Sign): ${astroChart.moonSign}
- Janma Nakshatra: ${astroChart.nakshatra}
- Active Mahadasha: ${astroChart.mahadasha}
- Manglik Status: ${astroChart.manglikStatus}
- Exact Navagraha Positions:
${planetSummary}

IMPORTANT LANGUAGE INSTRUCTION:
Write all JSON fields ("aiSummary", "careerPrediction", "relationshipPrediction", "healthPrediction", and "remedies") in **${languageName}**!`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiSummary: { type: Type.STRING },
            careerPrediction: { type: Type.STRING },
            relationshipPrediction: { type: Type.STRING },
            healthPrediction: { type: Type.STRING },
            remedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'aiSummary',
            'careerPrediction',
            'relationshipPrediction',
            'healthPrediction',
            'remedies',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...astroChart,
      aiSummary: parsed.aiSummary || `Born under ${astroChart.lagnaSign} Lagna with Moon in ${astroChart.moonSign} (${astroChart.nakshatra}).`,
      careerPrediction: parsed.careerPrediction || '',
      relationshipPrediction: parsed.relationshipPrediction || '',
      healthPrediction: parsed.healthPrediction || '',
      remedies: Array.isArray(parsed.remedies) ? parsed.remedies : [],
    };
  } catch {
    return {
      ...astroChart,
      aiSummary: `Born under ${astroChart.lagnaSign} Ascendant (${astroChart.lagnaDegree}) with Moon in ${astroChart.moonSign} and ${astroChart.nakshatra}. Currently running ${astroChart.mahadasha}.`,
      careerPrediction: `Your 10th house and ${astroChart.mahadasha} support steady professional elevation and leadership recognition.`,
      relationshipPrediction: `Harmonious emotional alignment indicated by ${astroChart.moonSign} Chandra Rashi.`,
      healthPrediction: `Maintain balanced pranic routine and morning sun salutation.`,
      remedies: [
        'Chant Gayatri Mantra 21 times every morning at sunrise.',
        'Offer water (Arghya) to Surya Dev in a copper vessel.',
      ],
    };
  }
}

export async function generateKundliMatchingAI(
  boy: { name: string; dob: string; tob: string; location: GeoLocation },
  girl: { name: string; dob: string; tob: string; location: GeoLocation },
  languageName: string = 'हिन्दी (Hindi)'
): Promise<KundliMatchResult> {
  const boyChart = computeRealVedicKundli(boy.name, boy.dob, boy.tob, boy.location);
  const girlChart = computeRealVedicKundli(girl.name, girl.dob, girl.tob, girl.location);
  const matchCalc = computeRealAshtaKootaMatch(boyChart, girlChart);

  const ai = getAI();
  const prompt = `Analyze this real Vedic Ashta-Koota (36-Guna) Kundli Match calculated from sidereal coordinates:
- Boy (Vara): ${boy.name} (${boyChart.place}) • Lagna: ${boyChart.lagnaSign}, Moon Sign: ${boyChart.moonSign}, Nakshatra: ${boyChart.nakshatra}, Manglik: ${boyChart.manglikStatus}
- Girl (Vadhu): ${girl.name} (${girlChart.place}) • Lagna: ${girlChart.lagnaSign}, Moon Sign: ${girlChart.moonSign}, Nakshatra: ${girlChart.nakshatra}, Manglik: ${girlChart.manglikStatus}
- Total Ashta-Koota Score: ${matchCalc.totalObtained} / 36

IMPORTANT LANGUAGE INSTRUCTION:
Write "verdictTitle", "aiDetailedReport", and "remedies" in **${languageName}**!`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdictTitle: { type: Type.STRING },
            aiDetailedReport: { type: Type.STRING },
            remedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['verdictTitle', 'aiDetailedReport', 'remedies'],
        },
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    return {
      boyName: boy.name,
      girlName: girl.name,
      boyLagna: boyChart.lagnaSign,
      girlLagna: girlChart.lagnaSign,
      boyRashi: boyChart.moonSign,
      girlRashi: girlChart.moonSign,
      boyNakshatra: boyChart.nakshatra.split('•')[0].trim(),
      girlNakshatra: girlChart.nakshatra.split('•')[0].trim(),
      totalObtained: matchCalc.totalObtained,
      totalMax: 36,
      manglikCompatibility: matchCalc.manglikCompatibility,
      verdictTitle: parsed.verdictTitle || 'Uttam Vivah Yoga — Auspicious Compatibility',
      aiDetailedReport: parsed.aiDetailedReport || '',
      kootas: matchCalc.kootas,
      remedies: Array.isArray(parsed.remedies) ? parsed.remedies : [],
    };
  } catch {
    return {
      boyName: boy.name,
      girlName: girl.name,
      boyLagna: boyChart.lagnaSign,
      girlLagna: girlChart.lagnaSign,
      boyRashi: boyChart.moonSign,
      girlRashi: girlChart.moonSign,
      boyNakshatra: boyChart.nakshatra.split('•')[0].trim(),
      girlNakshatra: girlChart.nakshatra.split('•')[0].trim(),
      totalObtained: matchCalc.totalObtained,
      totalMax: 36,
      manglikCompatibility: matchCalc.manglikCompatibility,
      verdictTitle: 'Shubh Milan — Harmonious Planetary Alignment',
      aiDetailedReport: `With ${matchCalc.totalObtained}/36 Gunas matched between ${boyChart.moonSign} and ${girlChart.moonSign}, this union is blessed with mutual respect and shared dharmic growth.`,
      kootas: matchCalc.kootas,
      remedies: ['Perform joint Lakshmi-Narayan puja on an auspicious Friday.'],
    };
  }
}

export async function analyzePalmImageAI(
  base64Image: string,
  mimeType: string,
  handType: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<PalmReadingResult> {
  const ai = getAI();

  const prompt = `You are a master of Vedic Samudrika Shastra (Hastrekha / Palmistry).
Examine this palm image (${handType}) carefully. Analyze the visible creases, palm shape, fingers, and mounts to provide a structured Vedic Hastrekha reading covering:
- Jeevan Rekha (Life Line)
- Hridaya Rekha (Heart Line)
- Mastishka Rekha (Head Line)
- Bhagya Rekha (Fate/Saturn Line)
- Graha Parvat (Planetary Mounts)
- Recommended Ratna (Gemstone) and Sacred Upay (Remedy).

IMPORTANT LANGUAGE INSTRUCTION:
Write all text descriptions, titles, observations, predictions, mountsSummary, luckyGemstone, and sacredRemedy in **${languageName}**!`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          elementalHandType: { type: Type.STRING },
          lifeLine: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              score: { type: Type.INTEGER },
              observation: { type: Type.STRING },
              prediction: { type: Type.STRING },
            },
            required: ['title', 'score', 'observation', 'prediction'],
          },
          heartLine: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              score: { type: Type.INTEGER },
              observation: { type: Type.STRING },
              prediction: { type: Type.STRING },
            },
            required: ['title', 'score', 'observation', 'prediction'],
          },
          headLine: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              score: { type: Type.INTEGER },
              observation: { type: Type.STRING },
              prediction: { type: Type.STRING },
            },
            required: ['title', 'score', 'observation', 'prediction'],
          },
          fateLine: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              score: { type: Type.INTEGER },
              observation: { type: Type.STRING },
              prediction: { type: Type.STRING },
            },
            required: ['title', 'score', 'observation', 'prediction'],
          },
          mountsSummary: { type: Type.STRING },
          luckyGemstone: { type: Type.STRING },
          sacredRemedy: { type: Type.STRING },
        },
        required: [
          'elementalHandType',
          'lifeLine',
          'heartLine',
          'headLine',
          'fateLine',
          'mountsSummary',
          'luckyGemstone',
          'sacredRemedy',
        ],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  return {
    handDominance: handType,
    elementalHandType: parsed.elementalHandType || 'Agni-Vayu Tattva (Intuitive & Dynamic)',
    lifeLine: parsed.lifeLine,
    heartLine: parsed.heartLine,
    headLine: parsed.headLine,
    fateLine: parsed.fateLine,
    mountsSummary: parsed.mountsSummary || '',
    luckyGemstone: parsed.luckyGemstone || 'Yellow Sapphire (Pukhraj) in Gold on Thursday',
    sacredRemedy: parsed.sacredRemedy || 'Offer Arghya (water) to the rising Sun in a copper vessel every morning.',
  };
}

export async function analyzeFaceImageAI(
  base64Image: string,
  mimeType: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<FaceReadingResult> {
  const ai = getAI();

  const prompt = `You are a master of Vedic Mukha Samudrika Shastra (Indian Face Reading & Physiognomy).
Analyze this face photo to read the seeker's Lalat (Forehead), Netra (Eyes), Nasika (Nose), Adhara (Lips/Chin), Tejas (Aura), and Career/Wealth Yoga.
IMPORTANT: Write all fields in **${languageName}**!`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [
        { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Image } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          faceShapeElement: { type: Type.STRING },
          foreheadLalat: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              insight: { type: Type.STRING },
            },
            required: ['score', 'insight'],
          },
          eyesNetra: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              insight: { type: Type.STRING },
            },
            required: ['score', 'insight'],
          },
          noseNasika: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              insight: { type: Type.STRING },
            },
            required: ['score', 'insight'],
          },
          lipsAdhara: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              insight: { type: Type.STRING },
            },
            required: ['score', 'insight'],
          },
          auraAndPersonality: { type: Type.STRING },
          careerAndWealthYoga: { type: Type.STRING },
          sacredRemedy: { type: Type.STRING },
        },
        required: [
          'faceShapeElement',
          'foreheadLalat',
          'eyesNetra',
          'noseNasika',
          'lipsAdhara',
          'auraAndPersonality',
          'careerAndWealthYoga',
          'sacredRemedy',
        ],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeDreamSwapnaAI(
  dreamDescription: string,
  timeOfDream: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<DreamAnalysisResult> {
  const ai = getAI();

  const prompt = `You are a master of Vedic Swapna Shastra (ancient Indian Dream Interpretation from Agni Purana & Brihat Samhita).
Analyze this seeker's dream:
- Dream Description: "${dreamDescription}"
- Time Seen: "${timeOfDream}"

Provide an authentic Swapna Phala reading in **${languageName}**!`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { role: 'user', parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dreamSymbolism: { type: Type.STRING },
          swapnaShastraCategory: { type: Type.STRING },
          spiritualMeaning: { type: Type.STRING },
          nearFutureIndication: { type: Type.STRING },
          auspiciousIndex: { type: Type.INTEGER },
          morningUpay: { type: Type.STRING },
        },
        required: [
          'dreamSymbolism',
          'swapnaShastraCategory',
          'spiritualMeaning',
          'nearFutureIndication',
          'auspiciousIndex',
          'morningUpay',
        ],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function generateTarotSpreadAI(
  question: string,
  selectedCardNames: string[],
  languageName: string = 'हिन्दी (Hindi)'
): Promise<TarotCardReading> {
  const ai = getAI();

  const prompt = `You are Devi Ananya, an intuitive Tarot & Vedic Nakshatra reader.
The seeker asks: "${question || 'What does the universe want me to know about my love, career, and destiny?'}"
They drew 3 cards for Past, Present, and Future:
1. Past: ${selectedCardNames[0]}
2. Present: ${selectedCardNames[1]}
3. Future: ${selectedCardNames[2]}

Provide a deeply insightful 3-card reading in **${languageName}**!`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { role: 'user', parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pastCard: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sanskritArchetype: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ['name', 'sanskritArchetype', 'meaning'],
          },
          presentCard: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sanskritArchetype: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ['name', 'sanskritArchetype', 'meaning'],
          },
          futureCard: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sanskritArchetype: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ['name', 'sanskritArchetype', 'meaning'],
          },
          overallGuidance: { type: Type.STRING },
          luckyAffirmation: { type: Type.STRING },
        },
        required: ['pastCard', 'presentCard', 'futureCard', 'overallGuidance', 'luckyAffirmation'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeVastuShastraAI(
  roomOrEntrance: string,
  facingDirection: string,
  issueDescription: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<VastuAnalysisResult> {
  const ai = getAI();

  const prompt = `You are Pandit Rajeshwar, an authority on Vedic Vastu Shastra (Mayamata & Vishwakarma Prakash).
Analyze this space:
- Area / Room: ${roomOrEntrance}
- Facing Direction: ${facingDirection}
- Seeker's Concern: "${issueDescription || 'Want peace, wealth flow, and positive energy'}"

Provide non-demolition Vedic Vastu remedies in **${languageName}**!`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { role: 'user', parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vastuScore: { type: Type.INTEGER },
          directionalEnergy: { type: Type.STRING },
          doshaDetected: { type: Type.STRING },
          simpleCorrections: { type: Type.ARRAY, items: { type: Type.STRING } },
          auspiciousPlacement: { type: Type.STRING },
        },
        required: [
          'vastuScore',
          'directionalEnergy',
          'doshaDetected',
          'simpleCorrections',
          'auspiciousPlacement',
        ],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function generateSacredAshirwadAI(
  astrologer: Astrologer,
  amount: number,
  tierName: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<{ blessingShloka: string; blessingMeaning: string; personalAshirwad: string }> {
  const ai = getAI();

  const prompt = `As ${astrologer.name} (${astrologer.title}), generate a sacred Vedic Ashirwad (Blessing Scroll) for a seeker who just completed a consultation${
    amount > 0 ? ` and offered a Dakshina of ₹${amount} (${tierName})` : ' and requested your blessings'
  }.
Return JSON with:
- "blessingShloka": An authentic auspicious Sanskrit shloka in Devanagari script.
- "blessingMeaning": Translation of the shloka in **${languageName}**.
- "personalAshirwad": A deeply heartfelt 2-3 sentence blessing from ${astrologer.name} written in **${languageName}**.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blessingShloka: { type: Type.STRING },
            blessingMeaning: { type: Type.STRING },
            personalAshirwad: { type: Type.STRING },
          },
          required: ['blessingShloka', 'blessingMeaning', 'personalAshirwad'],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return {
      blessingShloka: 'स्वस्ति प्रजाभ्यः परिपालयन्तां न्यायेन मार्गेण महीं महीशाः। ओम् शान्तिः शान्तिः शान्तिः॥',
      blessingMeaning: 'May all beings be blessed with auspiciousness, prosperity, and righteous peace.',
      personalAshirwad: `May the Navagrahas illuminate your path with wisdom and remove every obstacle. Your sincerity brings immense punya—walk forward with unwavering faith.`,
    };
  }
}

export async function generateDailyRashifalAI(
  rashiName: string,
  sanskritName: string,
  languageName: string = 'हिन्दी (Hindi)'
): Promise<{
  overview: string;
  career: string;
  love: string;
  vitality: string;
  luckyColor: string;
  luckyNumber: string;
  mantraOfDay: string;
}> {
  const ai = getAI();
  const prompt = `Generate today's detailed Vedic Daily Rashifal (Horoscope) for ${rashiName} (${sanskritName}) considering today's Pushya Nakshatra and Shukla Ekadashi transit.
IMPORTANT LANGUAGE INSTRUCTION: Write all fields ("overview", "career", "love", "vitality", "luckyColor") in **${languageName}**!`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { role: 'user', parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          career: { type: Type.STRING },
          love: { type: Type.STRING },
          vitality: { type: Type.STRING },
          luckyColor: { type: Type.STRING },
          luckyNumber: { type: Type.STRING },
          mantraOfDay: { type: Type.STRING },
        },
        required: ['overview', 'career', 'love', 'vitality', 'luckyColor', 'luckyNumber', 'mantraOfDay'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function generateNumerologyReportAI(
  params: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    nameNumber: number;
    nameCompound: number;
    missingNumbers: number[];
  },
  languageName: string = 'हिन्दी (Hindi)'
): Promise<NumerologyAIInsights> {
  const ai = getAI();

  const prompt = `You are Pandit Rajeshwar, a master of Vedic Anka Jyotish (Numerology), Chaldean Name Numerology, and Lo Shu Grid analysis.
Analyze this seeker's numerological blueprint:
- Full Name: "${params.name}"
- Date of Birth: ${params.dob}
- Mulank (Psychic / Driver Number): ${params.mulank}
- Bhagyank (Destiny / Conductor Number): ${params.bhagyank}
- Current Chaldean Name Compound Number: ${params.nameCompound} (Root Name Number: ${params.nameNumber})
- Missing Numbers in Lo Shu Grid: ${params.missingNumbers.join(', ') || 'None'}

IMPORTANT LANGUAGE INSTRUCTION:
Write all explanations, benefits, dates, colors, gemstone advice, and remedies in **${languageName}**!`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { role: 'user', parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalitySynthesis: { type: Type.STRING },
          nameCorrectionAnalysis: { type: Type.STRING },
          compatibilityScore: { type: Type.INTEGER },
          suggestedSpellings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                spelling: { type: Type.STRING },
                compoundNumber: { type: Type.INTEGER },
                rootNumber: { type: Type.INTEGER },
                rulingPlanet: { type: Type.STRING },
                benefit: { type: Type.STRING },
              },
              required: ['spelling', 'compoundNumber', 'rootNumber', 'rulingPlanet', 'benefit'],
            },
          },
          luckyDates: { type: Type.ARRAY, items: { type: Type.STRING } },
          avoidDates: { type: Type.ARRAY, items: { type: Type.STRING } },
          luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
          luckyGemstone: { type: Type.STRING },
          missingNumberRemedies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                planet: { type: Type.STRING },
                remedy: { type: Type.STRING },
              },
              required: ['number', 'planet', 'remedy'],
            },
          },
          dailyAffirmationMantra: { type: Type.STRING },
        },
        required: [
          'personalitySynthesis',
          'nameCorrectionAnalysis',
          'compatibilityScore',
          'suggestedSpellings',
          'luckyDates',
          'avoidDates',
          'luckyColors',
          'luckyGemstone',
          'missingNumberRemedies',
          'dailyAffirmationMantra',
        ],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}
