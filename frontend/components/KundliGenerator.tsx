import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Flame,
  ArrowLeft,
  Zap,
  UserPlus,
  Users,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { AppTheme, GeoLocation, IndianLanguageOption, KundliData } from '../types';
import { getTranslation } from '../i18n';
import { generateJanamKundliAI } from '../services/geminiService';
import { computeRealVedicKundli, POPULAR_CITIES } from '../services/vedicAstrologyEngine';
import { NorthIndianChart } from './NorthIndianChart';
import { CityAutocomplete } from './CityAutocomplete';

interface KundliGeneratorProps {
  savedKundli: KundliData | null;
  allSavedKundlis: KundliData[];
  onSaveKundli: (data: KundliData, isNewOther?: boolean) => void;
  onSelectActiveKundli: (data: KundliData) => void;
  onDeleteKundli?: (id: string) => void;
  onConsultAstrologer: () => void;
  appLanguage: IndianLanguageOption;
  appTheme?: AppTheme;
  onBack?: () => void;
}

const DEFAULT_DELHI: GeoLocation = POPULAR_CITIES[0];

const INITIAL_REAL_KUNDLI: KundliData = (() => {
  const base = computeRealVedicKundli('Anjul Chouksey', '1996-08-14', '10:30', DEFAULT_DELHI);
  return {
    ...base,
    id: 'default-self',
    isPrimaryUser: true,
    relationLabel: 'Self (मेरी कुंडली)',
    aiSummary:
      'Strong Rajyoga formed by Sun and Moon in the 10th Karma Bhava. Natural leadership, diplomatic wisdom, and steady career rise.',
    careerPrediction:
      '10th House luminaries and Mercury in the 11th House of gains bring executive recognition and financial prosperity.',
    relationshipPrediction:
      'Venus and Mars in the 9th Bhagyasthana bless you with a devoted, fortunate partner.',
    healthPrediction: 'High vitality; balance water intake and morning pranayama.',
    remedies: [
      'Offer Arghya (water in a copper vessel) to the rising Sun every morning.',
      'Chant "Om Brihaspataye Namah" 108 times on Thursdays.',
    ],
  };
})();

const KEY_HOUSES_DESCRIPTIONS = [
  {
    house: '1st House',
    title: '1st House',
    desc: 'Ascendant - Self, personality, and life path. Indicates your outward appearance and how you are perceived by the world.',
  },
  {
    house: '5th House',
    title: '5th House',
    desc: 'Creativity, romance, and children. Rules artistic expression, entertainment, and romantic relationships.',
  },
  {
    house: '7th House',
    title: '7th House',
    desc: 'Partnership and marriage. Signifies relationships, partnerships, and your ideal partner qualities.',
  },
  {
    house: '10th House',
    title: '10th House',
    desc: 'Career and reputation. Represents professional success, status, and public image in society.',
  },
];

export const KundliGenerator: React.FC<KundliGeneratorProps> = ({
  savedKundli,
  allSavedKundlis,
  onSaveKundli,
  onSelectActiveKundli,
  onDeleteKundli,
  onConsultAstrologer,
  appLanguage,
  appTheme = 'divya-dark',
  onBack,
}) => {
  const isLight = appTheme === 'divya-light' || appTheme === 'saffron';
  const t = getTranslation(appLanguage.code);
  const activeKundli = savedKundli || allSavedKundlis[0] || INITIAL_REAL_KUNDLI;

  // Mode: 'view' (Viewing active Kundli), 'create-other' (Making Kundli for someone else), 'edit-current' (Editing current Kundli)
  const [formMode, setFormMode] = useState<'view' | 'create-other' | 'edit-current'>('view');

  const [name, setName] = useState('');
  const [relationLabel, setRelationLabel] = useState('Family / Partner');
  const [dob, setDob] = useState('1998-05-20');
  const [tob, setTob] = useState('14:15');
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(POPULAR_CITIES[1]);
  const [isLoading, setIsLoading] = useState(false);

  const openCreateForOther = () => {
    setName('');
    setRelationLabel('Family / Partner');
    setDob('1998-05-20');
    setTob('14:15');
    setSelectedLocation(POPULAR_CITIES[1]);
    setFormMode('create-other');
  };

  const openEditCurrent = () => {
    setName(activeKundli.name);
    setRelationLabel(activeKundli.relationLabel || 'Self');
    setDob(activeKundli.dob);
    setTob(activeKundli.tob);
    setSelectedLocation({
      id: 'curr-loc',
      name: activeKundli.place.split(',')[0] || 'New Delhi',
      country: activeKundli.place.split(',').pop()?.trim() || 'India',
      latitude: activeKundli.latitude ?? 28.6139,
      longitude: activeKundli.longitude ?? 77.2090,
      timezone: activeKundli.timezone ?? 'Asia/Kolkata',
      utcOffsetHours: 5.5,
    });
    setFormMode('edit-current');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob || !tob) return;
    setIsLoading(true);
    try {
      const result = await generateJanamKundliAI(
        name.trim(),
        dob,
        tob,
        selectedLocation,
        appLanguage.nativeName
      );
      const isCreatingOther = formMode === 'create-other';
      const enriched: KundliData = {
        ...result,
        id: isCreatingOther ? `kundli-${Date.now()}` : activeKundli.id || `kundli-self`,
        isPrimaryUser: isCreatingOther ? false : activeKundli.isPrimaryUser,
        relationLabel: isCreatingOther ? relationLabel : activeKundli.relationLabel || 'Self',
      };
      onSaveKundli(enriched, isCreatingOther);
      setFormMode('view');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-full p-4 space-y-4 transition-colors ${
        isLight ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-white'
      }`}
    >
      {/* Top Sub-Header: ← ✨ Your Kundli + "+ Make for Others" Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`p-1.5 rounded-full ${
                isLight ? 'hover:bg-gray-200 text-gray-800' : 'hover:bg-white/10 text-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Sparkles className="w-5 h-5 text-[#A855F7]" />
          <div>
            <h2 className="font-bold text-base sm:text-lg leading-tight">
              {activeKundli.name}'s Kundli
            </h2>
            <span className="text-[10px] font-mono text-[#A855F7] block">
              {activeKundli.relationLabel || 'Primary Seeker'} • {activeKundli.place.split(',')[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openEditCurrent}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold ${
              isLight
                ? 'bg-white border-gray-300 text-gray-700'
                : 'bg-[#17141F] border-white/15 text-gray-300'
            }`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={openCreateForOther}
            className="px-3 py-1.5 rounded-xl bg-[#F5C33B] text-[#14111C] text-xs font-extrabold flex items-center gap-1 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ For Others</span>
          </button>
        </div>
      </div>

      {/* Saved Kundli Profiles Switcher Bar (Self + Family / Partner / Friends) */}
      <div
        className={`p-3 rounded-2xl border ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold flex items-center gap-1.5 text-[#A855F7]">
            <Users className="w-3.5 h-3.5" />
            Saved Kundli Profiles ({allSavedKundlis.length})
          </span>
          <span className="text-[10px] text-gray-400">Tap to switch chart</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {allSavedKundlis.map((k) => {
            const isSelected = k.id === activeKundli.id || k.name === activeKundli.name;
            return (
              <div
                key={k.id || k.name}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition ${
                  isSelected
                    ? 'bg-[#A855F7] border-[#A855F7] text-white font-bold shadow-xs'
                    : isLight
                    ? 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300'
                    : 'bg-[#211D2D] border-white/10 text-gray-300 hover:border-white/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectActiveKundli(k);
                    setFormMode('view');
                  }}
                  className="flex items-center gap-1.5 text-left"
                >
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <div>
                    <span className="block leading-none">{k.name}</span>
                    <span className="text-[9px] opacity-80 block mt-0.5">
                      {k.relationLabel || (k.isPrimaryUser ? 'Self' : 'Other')} • {k.lagnaSign.split(' ')[0]}
                    </span>
                  </div>
                </button>

                {!k.isPrimaryUser && onDeleteKundli && k.id && (
                  <button
                    type="button"
                    onClick={() => onDeleteKundli(k.id!)}
                    title="Remove Profile"
                    className="ml-1 p-0.5 rounded hover:bg-black/20 text-white/80"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={openCreateForOther}
            className={`shrink-0 px-3 py-2 rounded-xl border border-dashed text-xs font-bold flex items-center gap-1 ${
              isLight
                ? 'border-purple-400 text-purple-700 bg-purple-50/50'
                : 'border-[#F5C33B]/50 text-[#F5C33B] bg-[#F5C33B]/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Other's Kundli</span>
          </button>
        </div>
      </div>

      {/* Create Kundli For Others / Edit Birth Details Form */}
      {formMode !== 'view' && (
        <div
          className={`p-5 rounded-2xl border space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-purple-300' : 'bg-[#1C1829] border-[#A855F7]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#F5C33B] font-bold block">
                {formMode === 'create-other'
                  ? 'Generate Kundli for Family / Partner / Friend'
                  : 'Update Birth Particulars'}
              </span>
              <h3 className="font-bold text-base">
                {formMode === 'create-other'
                  ? "Enter Other Person's Birth Details"
                  : `Edit ${activeKundli.name}'s Birth Details`}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFormMode('view')}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel ✕
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Verma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Relation (संबंध — Self / Partner / Child / Friend)
                </label>
                <select
                  value={relationLabel}
                  onChange={(e) => setRelationLabel(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                >
                  <option value="Family / Partner">Partner / Spouse (जीवनसाथी)</option>
                  <option value="Son / Daughter">Child (पुत्र / पुत्री)</option>
                  <option value="Parents / Sibling">Parent / Sibling (माता-पिता / भाई-बहन)</option>
                  <option value="Friend / Client">Friend / Business Partner (मित्र)</option>
                  <option value="Self (मेरी कुंडली)">Self (स्वयं)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#A855F7]" /> {t.birthDateLabel}
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-mono ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#A855F7]" /> {t.birthTimeLabel}
                </label>
                <input
                  type="time"
                  required
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-mono ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                />
              </div>
            </div>

            <CityAutocomplete
              label={t.birthCityLabel}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>
                {isLoading
                  ? t.calculatingBtn
                  : formMode === 'create-other'
                  ? `Generate & Save ${name || "Other's"} Kundli`
                  : t.generateKundliBtn}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* North / South Indian SVG Lagna Kundli Chart */}
      <NorthIndianChart
        lagnaNumber={activeKundli.lagnaNumber}
        planets={activeKundli.planets}
        title={`${activeKundli.name} • ${t.navKundli} (${activeKundli.lagnaSign})`}
      />

      {/* Key Avakhada Attributes Strip */}
      <div
        className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
        }`}
      >
        <div className={`p-2.5 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-[#211D2D]'}`}>
          <span className="text-[10px] text-gray-400 block">{t.lagnaLabel}</span>
          <span className="font-bold block mt-0.5">{activeKundli.lagnaSign}</span>
        </div>
        <div className={`p-2.5 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-[#211D2D]'}`}>
          <span className="text-[10px] text-gray-400 block">{t.moonSignLabel}</span>
          <span className="font-bold block mt-0.5">{activeKundli.moonSign}</span>
        </div>
        <div className={`p-2.5 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-[#211D2D]'}`}>
          <span className="text-[10px] text-gray-400 block">{t.nakshatraLabel}</span>
          <span className="font-bold text-[#F5C33B] block mt-0.5">
            {activeKundli.nakshatra.split('•')[0]}
          </span>
        </div>
        <div className={`p-2.5 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-[#211D2D]'}`}>
          <span className="text-[10px] text-gray-400 block">{t.manglikLabel}</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
            {activeKundli.manglikStatus === 'Non-Manglik' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            )}
            {activeKundli.manglikStatus}
          </span>
        </div>
      </div>

      {/* Planetary Degree Rows Card (Exact Screenshot 4 Design: Jupiter 8° Scorpio, Saturn 23° Sagittarius, etc.) */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 ${
          isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-[#17141F] border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm">
            {t.planetaryPositionsTitle} ({activeKundli.name})
          </h3>
          <span className="text-[11px] font-mono text-[#A855F7]">
            {activeKundli.latitude?.toFixed(2)}°N, {activeKundli.longitude?.toFixed(2)}°E
          </span>
        </div>

        {activeKundli.planets.map((p) => (
          <div
            key={p.planet}
            className={`px-4 py-3 rounded-xl flex items-center justify-between ${
              isLight ? 'bg-gray-100 text-gray-900' : 'bg-[#211D2D] text-white'
            }`}
          >
            <span className="font-bold text-sm">
              {p.planet} ({p.sanskritName}) {p.isRetrograde ? '(R)' : ''}
            </span>
            <span className={`text-xs font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              {p.degree.split(' ')[0]} {p.sign} • H{p.house}
            </span>
          </div>
        ))}
      </div>

      {/* "Houses" Card (Exact Screenshot 4 Design: 1st House, 5th House, 7th House, 10th House) */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-[#17141F] border-white/10'
        }`}
      >
        <h3 className="font-bold text-base">Houses</h3>
        <div className="space-y-2.5">
          {KEY_HOUSES_DESCRIPTIONS.map((h) => (
            <div
              key={h.house}
              className={`p-4 rounded-xl ${
                isLight ? 'bg-gray-100 text-gray-900' : 'bg-[#211D2D] text-white'
              }`}
            >
              <h4 className="font-bold text-sm">{h.title}</h4>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isLight ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* "⚡ Strengths" Card */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-[#17141F] border-white/10'
        }`}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#10B981]" />
          <h3 className="font-bold text-base">Strengths &amp; Yogas</h3>
        </div>
        <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
          <p className="text-xs font-semibold text-[#10B981]">
            {activeKundli.mahadasha} • {activeKundli.nakshatra}
          </p>
          <p
            className={`text-xs mt-1.5 leading-relaxed ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            {activeKundli.aiSummary}
          </p>
        </div>

        {/* Remedies */}
        <div className="p-4 rounded-xl bg-[#FDFBF7] text-[#2A1810] border border-[#C89B3C]">
          <div className="flex items-center gap-1.5 text-[#9E2A2B] font-bold text-xs uppercase mb-2">
            <Flame className="w-4 h-4" />
            <span>{t.remediesTitle}</span>
          </div>
          <ul className="space-y-1.5 text-xs">
            {activeKundli.remedies.map((rem, i) => (
              <li key={i}>
                <strong>0{i + 1}.</strong> {rem}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={onConsultAstrologer}
          className="w-full py-3 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-bold text-xs transition"
        >
          Consult AI Astrologer About {activeKundli.name}'s Kundli →
        </button>
      </div>
    </div>
  );
};
