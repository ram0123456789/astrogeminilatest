import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Grid,
  Calendar,
  Flame,
  CheckCircle2,
  Gem,
  Award,
} from 'lucide-react';
import { IndianLanguageOption, NumerologyAIInsights } from '../types';
import { getTranslation } from '../i18n';
import { generateNumerologyReportAI } from '../services/geminiService';

interface NumerologyCalculatorProps {
  initialName?: string;
  initialDob?: string;
  onConsultAstrologer?: () => void;
  appLanguage: IndianLanguageOption;
}

const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const PLANET_INFO: Record<
  number,
  { planet: string; sanskrit: string; element: string; direction: string; trait: string }
> = {
  1: { planet: 'Sun', sanskrit: 'सूर्य (Sun)', element: 'Water', direction: 'North', trait: 'Leadership & Career Authority' },
  2: { planet: 'Moon', sanskrit: 'चन्द्र (Moon)', element: 'Earth', direction: 'South-West', trait: 'Intuition, Marriage & Sensitivity' },
  3: { planet: 'Jupiter', sanskrit: 'गुरु (Jupiter)', element: 'Wood', direction: 'East', trait: 'Wisdom, Expansion & Family' },
  4: { planet: 'Rahu', sanskrit: 'राहु (Rahu)', element: 'Wood', direction: 'South-East', trait: 'Wealth, Discipline & Practicality' },
  5: { planet: 'Mercury', sanskrit: 'बुध (Mercury)', element: 'Earth', direction: 'Center', trait: 'Brahmasthan Balance & Business' },
  6: { planet: 'Venus', sanskrit: 'शुक्र (Venus)', element: 'Metal', direction: 'North-West', trait: 'Luxury, Foreign Travel & Allies' },
  7: { planet: 'Ketu', sanskrit: 'केतु (Ketu)', element: 'Metal', direction: 'West', trait: 'Spirituality, Research & Creativity' },
  8: { planet: 'Saturn', sanskrit: 'शनि (Saturn)', element: 'Earth', direction: 'North-East', trait: 'Karma, Justice & Financial Stability' },
  9: { planet: 'Mars', sanskrit: 'मंगल (Mars)', element: 'Fire', direction: 'South', trait: 'Fame, Courage & High Energy' },
};

const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const LO_SHU_PLANES = [
  { name: 'Mental Plane (मानसिक योग)', nums: [4, 9, 2], desc: 'Sharp memory, intellectual brilliance & vision' },
  { name: 'Emotional Plane (भावना योग)', nums: [3, 5, 7], desc: 'Heart-centered wisdom, intuition & spiritual faith' },
  { name: 'Practical Plane (कर्म योग)', nums: [8, 1, 6], desc: 'Grounded execution, material success & prosperity' },
  { name: 'Thought Plane (विचार योग)', nums: [4, 3, 8], desc: 'Strategic planning & analytical depth' },
  { name: 'Will Plane (संकल्प योग)', nums: [9, 5, 1], desc: 'Unstoppable determination & leadership spine' },
  { name: 'Action Plane (क्रिया योग)', nums: [2, 7, 6], desc: 'Quick action & manifestation speed' },
  { name: 'Golden Raj Yoga (स्वर्ण राजयोग)', nums: [4, 5, 6], desc: 'Rare fortune, immense wealth & luxury magnet' },
  { name: 'Silver Raj Yoga (रजत राजयोग)', nums: [2, 5, 8], desc: 'Real estate, land ownership & steady stability' },
];

function reduceToSingleDigit(num: number): number {
  let current = Math.abs(num);
  while (current > 9) {
    current = String(current)
      .split('')
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return current || 1;
}

const DEFAULT_AI_INSIGHTS: NumerologyAIInsights = {
  personalitySynthesis:
    'आपके मूलांक और भाग्यांक के मिलन से सूर्य-बुध-गुरु का शुभ संयोग बन रहा है। यह आपको स्वतंत्र नेतृत्व, व्यापारिक कुशलता और समाज में विशेष प्रतिष्ठा प्रदान करता है।',
  nameCorrectionAnalysis:
    'आपके वर्तमान नाम का कैल्डियन कंपन शुभ है, परंतु इसे बुध (5) या शुक्र (6) के संयुक्त अंक (जैसे 32 या 33) पर स्थापित करने से करियर और धन प्रवाह में तीव्र उन्नति होगी।',
  compatibilityScore: 86,
  suggestedSpellings: [
    {
      spelling: 'AARAV SHARMA',
      compoundNumber: 32,
      rootNumber: 5,
      rulingPlanet: 'Mercury (बुध)',
      benefit: 'अंक 32 बुध का चमत्कारी तारा है — व्यापार, संचार और तीव्र भाग्योदय के लिए सर्वश्रेष्ठ।',
    },
    {
      spelling: 'AARAAV SHARMA',
      compoundNumber: 33,
      rootNumber: 6,
      rulingPlanet: 'Venus (शुक्र)',
      benefit: 'अंक 33 कुबेर और लक्ष्मी की कृपा, सुख-सुविधा और वैवाहिक आनंद बढ़ाता है।',
    },
    {
      spelling: 'ARAV SHARMAA',
      compoundNumber: 28,
      rootNumber: 1,
      rulingPlanet: 'Sun (सूर्य)',
      benefit: 'उच्च पद, सरकारी सहयोग और नेतृत्व क्षमता के लिए अत्यंत शुभ।',
    },
  ],
  luckyDates: ['1, 10, 19, 28 (सूर्य तिथियां)', '5, 14, 23 (बुध तिथियां)', '6, 15, 24 (शुक्र तिथियां)'],
  avoidDates: ['8, 17, 26 (महत्वपूर्ण अनुबंध सायंकाल में टालें)'],
  luckyColors: ['केसरिया स्वर्ण (Saffron Gold)', 'पन्ना हरा (Emerald Green)', 'सफेद / क्रीम'],
  luckyGemstone: 'पन्ना (Emerald) या सुनेला (Citrine) सोने/चांदी में धारण करें',
  missingNumberRemedies: [
    {
      number: 5,
      planet: 'बुध (Mercury — ब्रह्मस्थान)',
      remedy: 'बुधवार को हरी इलायची या मूंग का दान करें और घर के मध्य भाग को स्वच्छ रखें।',
    },
    {
      number: 6,
      planet: 'शुक्र (Venus — उत्तर-पश्चिम)',
      remedy: 'कलाई पर सुनहरी या चांदी के पट्टे वाली घड़ी पहनें और शुक्रवार को सफेद मिठाई अर्पित करें।',
    },
    {
      number: 3,
      planet: 'गुरु (Jupiter — पूर्व)',
      remedy: 'प्रतिदिन माथे पर केसर या हल्दी का तिलक लगाएं।',
    },
  ],
  dailyAffirmationMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (108 बार जाप करें)',
};

export const NumerologyCalculator: React.FC<NumerologyCalculatorProps> = ({
  initialName = 'Aarav Sharma',
  initialDob = '1996-08-14',
  onConsultAstrologer,
  appLanguage,
}) => {
  const t = getTranslation(appLanguage.code);
  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState(initialDob);
  const [selectedCell, setSelectedCell] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<NumerologyAIInsights>(DEFAULT_AI_INSIGHTS);

  const calc = useMemo(() => {
    const parts = dob.split('-');
    const yearStr = parts[0] || '1996';
    const monthStr = parts[1] || '08';
    const dayStr = parts[2] || '14';

    const dayNum = parseInt(dayStr, 10) || 14;
    const mulank = reduceToSingleDigit(dayNum);

    const allDobDigits = `${yearStr}${monthStr}${dayStr}`
      .replace(/\D/g, '')
      .split('')
      .map(Number);

    const dobSum = allDobDigits.reduce((acc, d) => acc + d, 0);
    const bhagyank = reduceToSingleDigit(dobSum);

    const cleanLetters = name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('');

    const letterBreakdown = cleanLetters.map((char) => ({
      char,
      val: CHALDEAN_MAP[char] || 1,
    }));

    const nameCompound = letterBreakdown.reduce((acc, item) => acc + item.val, 0);
    const nameNumber = reduceToSingleDigit(nameCompound);

    const gridCounts: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
    };

    allDobDigits.forEach((d) => {
      if (d >= 1 && d <= 9) {
        gridCounts[d] = (gridCounts[d] || 0) + 1;
      }
    });

    if (dayNum > 9 && mulank >= 1 && mulank <= 9) {
      gridCounts[mulank] += 1;
    }
    if (bhagyank >= 1 && bhagyank <= 9) {
      gridCounts[bhagyank] += 1;
    }

    const missingNumbers = Object.keys(gridCounts)
      .map(Number)
      .filter((n) => gridCounts[n] === 0);

    const planes = LO_SHU_PLANES.map((plane) => {
      const completedCount = plane.nums.filter((n) => gridCounts[n] > 0).length;
      return {
        ...plane,
        completedCount,
        percentage: Math.round((completedCount / 3) * 100),
        isComplete: completedCount === 3,
      };
    });

    return {
      mulank,
      bhagyank,
      nameCompound,
      nameNumber,
      letterBreakdown,
      gridCounts,
      missingNumbers,
      planes,
    };
  }, [name, dob]);

  const handleGenerateAIReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    setIsGenerating(true);
    try {
      const report = await generateNumerologyReportAI(
        {
          name: name.trim(),
          dob,
          mulank: calc.mulank,
          bhagyank: calc.bhagyank,
          nameNumber: calc.nameNumber,
          nameCompound: calc.nameCompound,
          missingNumbers: calc.missingNumbers,
        },
        appLanguage.nativeName
      );
      setAiInsights(report);
    } catch (err) {
      console.error('Numerology AI Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeCellInfo = PLANET_INFO[selectedCell] || PLANET_INFO[5];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-cosmic-800/95 border border-gold-400/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
              {t.numerologySub}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
              {t.numerologyTitle}
            </h2>
          </div>
          {onConsultAstrologer && (
            <button
              type="button"
              onClick={onConsultAstrologer}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-gold-400/30 text-[11px] font-semibold text-gold-300 transition"
            >
              {t.discussChartBtn}
            </button>
          )}
        </div>

        <form onSubmit={handleGenerateAIReport} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="text-xs text-[#C4B5A6] block mb-1">{t.fullNameLabel}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs text-[#C4B5A6] flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-gold-400" /> {t.birthDateLabel}
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-1.5 transition disabled:opacity-50 h-[42px]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t.calculatingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.calculateNumerologyBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#251A42] to-[#17112B] border border-gold-400/35 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold-300 block">
            {t.mulankLabel}
          </span>
          <div className="my-2 w-14 h-14 rounded-2xl bg-cosmic-950/90 border-2 border-gold-400 flex items-center justify-center mx-auto">
            <span className="font-display text-2xl font-bold text-gold-300">{calc.mulank}</span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            {PLANET_INFO[calc.mulank]?.sanskrit}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#2D1938] to-[#17112B] border border-saffron-500/40 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-saffron-400 block">
            {t.bhagyankLabel}
          </span>
          <div className="my-2 w-14 h-14 rounded-2xl bg-cosmic-950/90 border-2 border-saffron-400 flex items-center justify-center mx-auto">
            <span className="font-display text-2xl font-bold text-saffron-400">
              {calc.bhagyank}
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            {PLANET_INFO[calc.bhagyank]?.sanskrit}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#1D283A] to-[#141A29] border border-emerald-400/35 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">
            {t.naamAnkLabel}
          </span>
          <div className="my-2 w-14 h-14 rounded-2xl bg-cosmic-950/90 border-2 border-emerald-400 flex items-center justify-center mx-auto">
            <span className="font-display text-2xl font-bold text-emerald-300">
              {calc.nameNumber}
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            #{calc.nameCompound} ({PLANET_INFO[calc.nameNumber]?.planet})
          </p>
        </div>
      </div>

      {/* Lo Shu Grid + Planes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#FDFBF7] text-[#2A1810] border-2 border-[#C89B3C] shadow-xl">
          <h3 className="font-display font-bold text-lg text-[#2A1810] mb-3">
            {t.loShuGridTitle}
          </h3>

          <div className="grid grid-cols-3 gap-2.5 aspect-square max-w-[340px] mx-auto my-2">
            {LO_SHU_LAYOUT.flat().map((cellNum) => {
              const count = calc.gridCounts[cellNum] || 0;
              const isPresent = count > 0;
              const isSelected = selectedCell === cellNum;
              const planetMeta = PLANET_INFO[cellNum];
              const repeatedDigits = isPresent ? String(cellNum).repeat(count) : '—';

              return (
                <button
                  key={cellNum}
                  type="button"
                  onClick={() => setSelectedCell(cellNum)}
                  className={`rounded-2xl p-2.5 flex flex-col justify-between border-2 transition-all text-left ${
                    isSelected ? 'ring-2 ring-[#9E2A2B] scale-[1.02]' : ''
                  } ${
                    isPresent
                      ? 'bg-gradient-to-br from-[#FFF9E6] to-[#F5E6C4] border-[#C89B3C] shadow-md'
                      : 'bg-[#2A1810]/5 border-dashed border-[#2A1810]/20 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-mono">
                    <span className="font-bold text-[#9E2A2B]">#{cellNum}</span>
                    <span className="text-[#2A1810]/60">{planetMeta.direction}</span>
                  </div>

                  <div className="my-auto text-center">
                    <span
                      className={`font-mono text-xl sm:text-2xl font-extrabold tracking-widest ${
                        isPresent ? 'text-[#9E2A2B]' : 'text-[#2A1810]/25'
                      }`}
                    >
                      {repeatedDigits}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-[#2A1810] truncate">
                      {planetMeta.planet}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-[#9E2A2B]/10 border border-[#9E2A2B]/30 text-xs">
            <div className="font-bold text-[#9E2A2B]">
              #{selectedCell}: {activeCellInfo.sanskrit}
            </div>
            <p className="text-[#2A1810]/85 mt-1">{activeCellInfo.trait}</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-base text-white">
                {t.nameBreakdownTitle}: {name.toUpperCase()}
              </h4>
              <span className="px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 font-mono text-xs font-bold">
                {calc.nameCompound} → {calc.nameNumber}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {calc.letterBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="w-9 h-12 rounded-xl bg-cosmic-950 border border-white/15 flex flex-col items-center justify-center"
                >
                  <span className="text-xs font-bold text-white">{item.char}</span>
                  <span className="text-[10px] font-mono text-gold-400 font-bold">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-white/10">
            <h4 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
              <Grid className="w-4 h-4 text-gold-400" />
              <span>{t.loShuPlanesTitle}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {calc.planes.map((plane) => (
                <div
                  key={plane.name}
                  className={`p-3 rounded-2xl border transition ${
                    plane.isComplete
                      ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/10 border-gold-400/50'
                      : 'bg-cosmic-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      {plane.isComplete && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {plane.name}
                    </span>
                    <span className="font-mono text-[11px] text-gold-300 font-bold">
                      {plane.nums.join('-')} ({plane.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full ${
                        plane.isComplete ? 'bg-emerald-400' : 'bg-gold-400'
                      }`}
                      style={{ width: `${plane.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Name Correction & Remedies */}
      <div className="space-y-5">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#231942] to-[#150F28] border border-gold-400/35 shadow-xl">
          <p className="text-xs sm:text-sm text-[#F4EFE6] leading-relaxed">
            {aiInsights.personalitySynthesis}
          </p>
          <p className="text-xs text-gold-300/90 leading-relaxed mt-2 bg-black/25 p-3 rounded-2xl border border-white/5">
            {aiInsights.nameCorrectionAnalysis}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-gold-400/30">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-gold-400" />
            <h4 className="font-display font-bold text-base text-white">
              {t.nameCorrectionTitle}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.suggestedSpellings.map((sug, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-cosmic-950/90 border border-gold-400/25 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-saffron-500/20 text-saffron-300 font-mono text-[10px] font-bold">
                      #{sug.compoundNumber} → {sug.rootNumber}
                    </span>
                    <span className="text-[10px] font-mono text-gold-400">
                      {sug.rulingPlanet}
                    </span>
                  </div>
                  <h5 className="font-mono font-bold text-base text-white tracking-wide mt-1">
                    {sug.spelling}
                  </h5>
                  <p className="text-xs text-[#C4B5A6] mt-2 leading-relaxed">{sug.benefit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setName(sug.spelling)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-white/5 hover:bg-gold-400/20 border border-white/10 text-[11px] font-semibold text-gold-300 transition"
                >
                  Apply Spelling ↑
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-white/10 space-y-3.5">
            <h4 className="font-display font-bold text-sm text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-saffron-400" />
              <span>{t.luckyDatesTitle}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                <p className="text-white font-medium">{aiInsights.luckyDates.join(' • ')}</p>
              </div>
              <div className="p-3 rounded-2xl bg-cosmic-950 border border-white/10">
                <span className="text-[10px] text-[#C4B5A6] flex items-center gap-1">
                  <Gem className="w-3 h-3 text-gold-400" /> {t.luckyGemstoneTitle}
                </span>
                <span className="text-white font-semibold text-xs mt-0.5 block">
                  {aiInsights.luckyGemstone}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FDFBF7] text-[#2A1810] border-2 border-[#C89B3C] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#9E2A2B] font-display font-bold text-sm mb-3">
                <Flame className="w-4 h-4" />
                <span>{t.missingRemediesTitle}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {aiInsights.missingNumberRemedies.map((rem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#9E2A2B]/5 border border-[#C89B3C]/40"
                  >
                    <div className="font-mono font-bold text-[#9E2A2B]">
                      #{rem.number} • {rem.planet}
                    </div>
                    <p className="text-[#2A1810]/90 mt-0.5">{rem.remedy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
