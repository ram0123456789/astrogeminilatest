import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Compass, Flame } from 'lucide-react';
import { RASHI_LIST, TODAY_PANCHANG } from '../constants';
import { IndianLanguageOption } from '../types';
import { getTranslation } from '../i18n';
import { generateDailyRashifalAI } from '../services/geminiService';

interface DailyHoroscopeProps {
  appLanguage: IndianLanguageOption;
}

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ appLanguage }) => {
  const t = getTranslation(appLanguage.code);
  const [selectedRashi, setSelectedRashi] = useState(RASHI_LIST[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [rashifal, setRashifal] = useState({
    overview:
      'आज पुष्य नक्षत्र और शुक्ल एकादशी के शुभ संयोग से रुके हुए कार्यों में गति आएगी। आत्मविश्वास और धर्म पर अडिग रहें।',
    career:
      'कार्यक्षेत्र में वरिष्ठ अधिकारियों का सहयोग मिलेगा। अभिजीत मुहूर्त (11:54 AM – 12:46 PM) में महत्वपूर्ण निर्णय लें।',
    love:
      'परिवार और जीवनसाथी के साथ मधुर संवाद से संबंध प्रगाढ़ होंगे।',
    vitality:
      'प्राण ऊर्जा उत्तम रहेगी; प्रातः सूर्य नमस्कार और ध्यान करें।',
    luckyColor: 'केसरिया और स्वर्ण (Saffron & Gold)',
    luckyNumber: '3, 9',
    mantraOfDay: 'ॐ घृणि सूर्याय नमः (Om Ghrini Suryaya Namah)',
  });

  const handleSelectRashi = async (rashi: (typeof RASHI_LIST)[0]) => {
    setSelectedRashi(rashi);
    setIsLoading(true);
    try {
      const fresh = await generateDailyRashifalAI(
        rashi.english,
        rashi.sanskrit,
        appLanguage.nativeName
      );
      setRashifal(fresh);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-translate active rashi prediction when user switches global app language
  useEffect(() => {
    handleSelectRashi(selectedRashi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLanguage.code]);

  return (
    <div className="space-y-6">
      {/* Daily Panchang Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-cosmic-800 via-[#22193D] to-cosmic-800 border border-gold-400/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              {TODAY_PANCHANG.samvat}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
              {t.panchangTitle}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 font-mono text-xs">
            Abhijit: {TODAY_PANCHANG.abhijitMuhurat}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-cosmic-950/70 border border-white/10">
            <span className="text-[#C4B5A6] flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-gold-400" /> {t.tithiLabel}
            </span>
            <span className="font-semibold text-white mt-1 block">{TODAY_PANCHANG.tithi}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-950/70 border border-white/10">
            <span className="text-[#C4B5A6] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" /> {t.nakshatraLabel}
            </span>
            <span className="font-semibold text-white mt-1 block">{TODAY_PANCHANG.nakshatra}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-950/70 border border-white/10">
            <span className="text-[#C4B5A6] flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-gold-400" /> {t.yogaLabel}
            </span>
            <span className="font-semibold text-white mt-1 block">{TODAY_PANCHANG.yoga}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-950/70 border border-white/10">
            <span className="text-[#C4B5A6] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-red-400" /> {t.rahuKaalLabel}
            </span>
            <span className="font-mono font-semibold text-red-300 mt-1 block">
              {TODAY_PANCHANG.rahuKaal}
            </span>
          </div>
        </div>
      </div>

      {/* 12 Rashi Selector Grid */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-3">
          {t.selectRashiTitle}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {RASHI_LIST.map((r) => {
            const active = r.id === selectedRashi.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRashi(r)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  active
                    ? 'bg-gradient-to-b from-saffron-500/25 to-gold-500/15 border-gold-400 shadow-lg scale-[1.02]'
                    : 'bg-cosmic-800/70 border-white/10 hover:border-white/25'
                }`}
              >
                <span className="text-2xl block">{r.symbol}</span>
                <span className="font-bold text-xs text-white mt-1 block">
                  {t.rashis[r.id] || r.english}
                </span>
                <span className="text-[10px] text-gold-300 block">{r.english}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rashi Detailed Prediction */}
      <div className="p-6 rounded-3xl bg-cosmic-800/90 border border-gold-400/30 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-cosmic-950/70 backdrop-blur-xs rounded-3xl flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gold-300 font-mono text-sm">
              <Sparkles className="w-5 h-5 animate-spin text-saffron-400" />
              <span>{t.calculatingBtn} ({appLanguage.nativeName})...</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500/30 to-gold-500/20 border border-gold-400 flex items-center justify-center text-3xl">
              {selectedRashi.symbol}
            </div>
            <div>
              <span className="text-xs font-mono text-gold-400">
                {selectedRashi.lord} • {selectedRashi.element}
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                {t.rashis[selectedRashi.id] || selectedRashi.english} ({selectedRashi.english})
              </h3>
            </div>
          </div>

          <div className="flex gap-2.5 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#C4B5A6] block text-[10px]">{t.luckyColorLabel}</span>
              <span className="text-gold-300 font-bold">{rashifal.luckyColor}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#C4B5A6] block text-[10px]">{t.luckyNumberLabel}</span>
              <span className="text-saffron-400 font-bold">{rashifal.luckyNumber}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="md:col-span-3 p-4 rounded-2xl bg-cosmic-900/90 border border-gold-400/20">
            <h4 className="font-display font-bold text-sm text-gold-300 mb-1">
              {t.yourDailyHoroscope}
            </h4>
            <p className="text-sm text-[#F4EFE6] leading-relaxed">{rashifal.overview}</p>
          </div>

          <div className="p-4 rounded-2xl bg-cosmic-900/70 border border-white/10">
            <h4 className="font-display font-bold text-sm text-saffron-400 mb-1">
              {t.career}
            </h4>
            <p className="text-xs text-[#C4B5A6] leading-relaxed">{rashifal.career}</p>
          </div>

          <div className="p-4 rounded-2xl bg-cosmic-900/70 border border-white/10">
            <h4 className="font-display font-bold text-sm text-pink-400 mb-1">
              {t.love}
            </h4>
            <p className="text-xs text-[#C4B5A6] leading-relaxed">{rashifal.love}</p>
          </div>

          <div className="p-4 rounded-2xl bg-cosmic-900/70 border border-white/10">
            <h4 className="font-display font-bold text-sm text-emerald-400 mb-1">
              {t.vitality}
            </h4>
            <p className="text-xs text-[#C4B5A6] leading-relaxed">{rashifal.vitality}</p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-[#FDFBF7] text-[#2A1810] border-2 border-[#C89B3C] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#9E2A2B]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E2A2B] font-bold block">
                {t.mantraOfDayLabel}
              </span>
              <span className="font-serif font-bold text-sm text-[#2A1810]">
                {rashifal.mantraOfDay}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
