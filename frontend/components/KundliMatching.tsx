import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { GeoLocation, IndianLanguageOption, KundliMatchResult } from '../types';
import { getTranslation } from '../i18n';
import { generateKundliMatchingAI } from '../services/geminiService';
import { POPULAR_CITIES } from '../services/vedicAstrologyEngine';
import { CityAutocomplete } from './CityAutocomplete';

interface KundliMatchingProps {
  appLanguage: IndianLanguageOption;
}

const INITIAL_MATCH: KundliMatchResult = {
  boyName: 'Rohan Verma',
  girlName: 'Ananya Nair',
  boyLagna: 'Vrishabha (Taurus)',
  girlLagna: 'Simha (Leo)',
  boyRashi: 'Mithuna (Gemini)',
  girlRashi: 'Tula (Libra)',
  boyNakshatra: 'Mrigashira',
  girlNakshatra: 'Swati',
  totalObtained: 28.5,
  totalMax: 36,
  manglikCompatibility: 'Both charts share Non-Manglik parity — Complete Kuja Dosha harmony.',
  verdictTitle: 'उत्तम विवाह मिलान — अत्यंत शुभ संयोग',
  aiDetailedReport:
    '36 में से 28.5 गुण मिलने के साथ, इस विवाह में ग्रह मैत्री (5/5) और नाड़ी कूट (8/8) पूर्णतः शुभ हैं। दांपत्य जीवन में सुख, समृद्धि और आपसी सामंजस्य बना रहेगा।',
  kootas: [
    { name: 'Varna', sanskrit: 'वर्ण', description: 'Spiritual harmony', maxPoints: 1, obtainedPoints: 1, boyAttribute: 'Shudra', girlAttribute: 'Shudra' },
    { name: 'Vashya', sanskrit: 'वश्य', description: 'Mutual affinity', maxPoints: 2, obtainedPoints: 1.5, boyAttribute: 'Mithuna', girlAttribute: 'Tula' },
    { name: 'Tara', sanskrit: 'तारा', description: 'Nakshatra fortune', maxPoints: 3, obtainedPoints: 3, boyAttribute: 'Mrigashira', girlAttribute: 'Swati' },
    { name: 'Yoni', sanskrit: 'योनि', description: 'Nature harmony', maxPoints: 4, obtainedPoints: 3, boyAttribute: 'Sarpa', girlAttribute: 'Mahisha' },
    { name: 'Graha Maitri', sanskrit: 'ग्रह मैत्री', description: 'Planetary friendship', maxPoints: 5, obtainedPoints: 5, boyAttribute: 'Mars', girlAttribute: 'Rahu' },
    { name: 'Gana', sanskrit: 'गण', description: 'Temperament', maxPoints: 6, obtainedPoints: 6, boyAttribute: 'Deva', girlAttribute: 'Deva' },
    { name: 'Bhakoot', sanskrit: 'भकूट', description: 'Family prosperity', maxPoints: 7, obtainedPoints: 1, boyAttribute: 'Mithuna', girlAttribute: 'Tula' },
    { name: 'Nadi', sanskrit: 'नाड़ी', description: 'Vitality & genes', maxPoints: 8, obtainedPoints: 8, boyAttribute: 'Madhya Nadi', girlAttribute: 'Antya Nadi' },
  ],
  remedies: [
    'विवाह से पूर्व सोमवार को संयुक्त गौरी-शंकर पूजन करें।',
    'शुक्रवार को भगवान विष्णु और माता लक्ष्मी के समक्ष घी का दीपक जलाएं।',
  ],
};

export const KundliMatching: React.FC<KundliMatchingProps> = ({ appLanguage }) => {
  const t = getTranslation(appLanguage.code);

  const [boy, setBoy] = useState({
    name: 'Rohan Verma',
    dob: '1995-11-12',
    tob: '09:15',
    location: POPULAR_CITIES[1],
  });
  const [girl, setGirl] = useState({
    name: 'Ananya Nair',
    dob: '1997-04-22',
    tob: '16:40',
    location: POPULAR_CITIES[3],
  });
  const [matchResult, setMatchResult] = useState<KundliMatchResult>(INITIAL_MATCH);
  const [isLoading, setIsLoading] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await generateKundliMatchingAI(boy, girl, appLanguage.nativeName);
      setMatchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const scorePercentage = Math.round((matchResult.totalObtained / 36) * 100);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-3xl bg-cosmic-800/90 border border-gold-400/30">
        <h2 className="font-display text-xl font-bold text-white">{t.matchTitle}</h2>
      </div>

      {/* Dual Partner Input Form */}
      <form onSubmit={handleMatch} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-gold-400/25 space-y-3">
          <h3 className="font-display text-base font-bold text-gold-300">
            {t.boyDetailsTitle}
          </h3>
          <div>
            <label className="text-xs text-[#C4B5A6] block mb-1">{t.fullNameLabel}</label>
            <input
              type="text"
              required
              value={boy.name}
              onChange={(e) => setBoy({ ...boy, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs text-[#C4B5A6] block mb-1">{t.birthDateLabel}</label>
              <input
                type="date"
                required
                value={boy.dob}
                onChange={(e) => setBoy({ ...boy, dob: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-xs sm:text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#C4B5A6] block mb-1">{t.birthTimeLabel}</label>
              <input
                type="time"
                required
                value={boy.tob}
                onChange={(e) => setBoy({ ...boy, tob: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-xs sm:text-sm text-white font-mono"
              />
            </div>
          </div>
          <CityAutocomplete
            label={t.birthCityLabel}
            selectedLocation={boy.location}
            onSelectLocation={(loc: GeoLocation) => setBoy({ ...boy, location: loc })}
          />
        </div>

        <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-saffron-500/30 space-y-3">
          <h3 className="font-display text-base font-bold text-saffron-400">
            {t.girlDetailsTitle}
          </h3>
          <div>
            <label className="text-xs text-[#C4B5A6] block mb-1">{t.fullNameLabel}</label>
            <input
              type="text"
              required
              value={girl.name}
              onChange={(e) => setGirl({ ...girl, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs text-[#C4B5A6] block mb-1">{t.birthDateLabel}</label>
              <input
                type="date"
                required
                value={girl.dob}
                onChange={(e) => setGirl({ ...girl, dob: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-xs sm:text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#C4B5A6] block mb-1">{t.birthTimeLabel}</label>
              <input
                type="time"
                required
                value={girl.tob}
                onChange={(e) => setGirl({ ...girl, tob: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-xs sm:text-sm text-white font-mono"
              />
            </div>
          </div>
          <CityAutocomplete
            label={t.birthCityLabel}
            selectedLocation={girl.location}
            onSelectLocation={(loc: GeoLocation) => setGirl({ ...girl, location: loc })}
          />
        </div>

        <div className="lg:col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 text-white font-bold text-sm shadow-xl shadow-saffron-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{t.calculatingBtn}</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                <span>{t.calculateMatchBtn} ({appLanguage.name})</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Score Banner & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-cosmic-800 to-cosmic-900 border border-gold-400/40 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              {t.matchResultTitle}
            </span>
            <h3 className="font-display text-xl font-bold text-white mt-1">
              {matchResult.boyName} &amp; {matchResult.girlName}
            </h3>

            <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-cosmic-950/80 border border-white/10">
                <span className="text-gold-400 block">{matchResult.boyName}</span>
                <span className="text-white block">{matchResult.boyRashi}</span>
                <span className="text-[#C4B5A6]">{matchResult.boyNakshatra}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cosmic-950/80 border border-white/10">
                <span className="text-saffron-400 block">{matchResult.girlName}</span>
                <span className="text-white block">{matchResult.girlRashi}</span>
                <span className="text-[#C4B5A6]">{matchResult.girlNakshatra}</span>
              </div>
            </div>

            <div className="my-5 flex items-center gap-5">
              <div className="w-24 h-24 rounded-full border-4 border-gold-400 bg-cosmic-950 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(229,184,75,0.25)] shrink-0">
                <span className="font-mono text-2xl font-bold text-gold-300">
                  {matchResult.totalObtained}
                </span>
                <span className="font-mono text-[11px] text-[#C4B5A6]">{t.outOf36}</span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    matchResult.totalObtained >= 18
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {matchResult.totalObtained >= 18 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  )}
                  {scorePercentage}%
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white mt-2">
                  {matchResult.verdictTitle}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#F4EFE6] leading-relaxed">
              {matchResult.aiDetailedReport}
            </p>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="font-mono text-gold-400 uppercase text-[10px] block">
              {t.manglikParityTitle}
            </span>
            <span className="text-white font-medium">{matchResult.manglikCompatibility}</span>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-3xl bg-cosmic-800/90 border border-white/10 space-y-5">
          <h4 className="font-display font-bold text-base text-white">
            {t.kootaDistributionTitle}
          </h4>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchResult.kootas}>
                <XAxis dataKey="name" stroke="#C4B5A6" fontSize={11} />
                <YAxis stroke="#C4B5A6" fontSize={11} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18132A',
                    borderColor: '#E5B84B',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="obtainedPoints" name="Guna" radius={[6, 6, 0, 0]}>
                  {matchResult.kootas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.obtainedPoints / entry.maxPoints >= 0.6
                          ? '#E5B84B'
                          : '#FF6B00'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#C4B5A6] font-mono">
                  <th className="py-2 px-2">Koota</th>
                  <th className="py-2 px-2">Vara</th>
                  <th className="py-2 px-2">Vadhu</th>
                  <th className="py-2 px-2 text-right">Guna</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matchResult.kootas.map((k) => (
                  <tr key={k.name} className="hover:bg-white/5">
                    <td className="py-2 px-2">
                      <span className="font-semibold text-white">{k.name}</span>{' '}
                      <span className="text-[#C4B5A6] text-[11px]">({k.sanskrit})</span>
                    </td>
                    <td className="py-2 px-2 text-[#C4B5A6]">{k.boyAttribute}</td>
                    <td className="py-2 px-2 text-[#C4B5A6]">{k.girlAttribute}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-gold-300">
                      {k.obtainedPoints} / {k.maxPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
