import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Compass,
  User,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { GeoLocation, KundliData } from '../types';
import { computeRealVedicKundli, POPULAR_CITIES } from '../services/vedicAstrologyEngine';
import { CityAutocomplete } from './CityAutocomplete';

interface DivineSplashProps {
  onSplashComplete: () => void;
}

export const DivineSplashScreen: React.FC<DivineSplashProps> = ({ onSplashComplete }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSplashComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <div
      onClick={onSplashComplete}
      className="h-full w-full bg-gradient-to-b from-[#090514] via-[#1A0E30] to-[#090514] flex flex-col items-center justify-between p-8 text-center relative overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient Golden Mandala Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,195,59,0.22),transparent_65%)]" />

      {/* Top Sanskrit Invocation */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-2"
      >
        <span className="text-[11px] font-serif text-[#F5C33B] tracking-widest uppercase block">
          ॥ श्री गणेशाय नमः • ॐ आदित्याय नमः ॥
        </span>
      </motion.div>

      {/* Center Rotating Sacred Sri Yantra & Zodiac Chakra */}
      <div className="relative flex items-center justify-center my-auto z-10">
        {/* Outer rotating zodiac ring */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 260 260"
          className="w-60 h-60 text-[#F5C33B]/35"
        >
          <circle cx="130" cy="130" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="130" cy="130" r="102" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <polygon points="130,12 248,130 130,248 12,130" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <polygon points="46,46 214,46 214,214 46,214" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 130 + 82 * Math.cos(angle);
            const y1 = 130 + 82 * Math.sin(angle);
            const x2 = 130 + 120 * Math.cos(angle);
            const y2 = 130 + 120 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
          })}
        </motion.svg>

        {/* Inner Counter-Rotating Lotus Ring */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 160 160"
          className="w-36 h-36 text-saffron-400/50 absolute"
        >
          <polygon points="80,8 152,80 80,152 8,80" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="54" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        </motion.svg>

        {/* Sacred Pulsing Om Emblem */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.95, 1.06, 1], opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#F5C33B] via-[#FF8A00] to-[#9E2A2B] p-0.5 shadow-[0_0_50px_rgba(245,195,59,0.6)] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-[#120B22] flex items-center justify-center">
            <span className="font-serif text-4xl font-bold text-[#F5C33B] drop-shadow-[0_0_12px_rgba(245,195,59,0.8)]">
              ॐ
            </span>
          </div>
        </motion.div>
      </div>

      {/* Brand Title & Vedic Shloka Footer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative z-10 space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C33B]/15 border border-[#F5C33B]/40 text-[#F5C33B] text-[10px] font-mono uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          <span>Sanatana Jyotish &amp; AI Sanctuary</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-wide">
          Astro<span className="text-[#F5C33B]">Veda</span> AI
        </h1>
        <p className="text-xs text-[#C4B5A6] max-w-xs mx-auto leading-relaxed">
          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
        </p>
        <div className="pt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono text-gold-300/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Aligning Sidereal Lahiri Ephemeris...</span>
        </div>
      </motion.div>
    </div>
  );
};

interfaceModernOnboardingProps {
  onCompleteOnboarding: (primaryKundli: KundliData) => void;
}

export const ModernOnboardingFlow: React.FC<interfaceModernOnboardingProps> = ({
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('1997-08-15');
  const [tob, setTob] = useState('10:30');
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(POPULAR_CITIES[0]);
  const [isComputing, setIsComputing] = useState(false);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Anjul Chouksey';
    setIsComputing(true);

    setTimeout(() => {
      const base = computeRealVedicKundli(finalName, dob, tob, selectedLocation);
      const newPrimaryKundli: KundliData = {
        ...base,
        id: `kundli-self-${Date.now()}`,
        isPrimaryUser: true,
        relationLabel: 'Self (मेरी कुंडली)',
        gender,
        aiSummary: `जन्म कुंडली सारांश (${base.place}): आपका जन्म ${base.lagnaSign} लग्न और ${base.moonSign} राशि (${base.nakshatra}) में हुआ है। वर्तमान में ${base.mahadasha} गतिमान है जो आपके कर्म, ज्ञान और भाग्योदय को सशक्त बना रही है।`,
        careerPrediction: `दशम कर्म भाव और ${base.mahadasha} के प्रभाव से करियर में नेतृत्व, उच्च पद और स्वतंत्र निर्णय क्षमता का प्रबल योग है।`,
        relationshipPrediction: `सप्तम भाव और शुक्र-गुरु की स्थिति से जीवनसाथी निष्ठावान, सहयोगी और आध्यात्मिक विचारों वाला प्राप्त होगा।`,
        healthPrediction: `प्राण ऊर्जा उत्तम है; नियमित सूर्य अर्घ्य और ध्यान से मानसिक शांति बनी रहेगी।`,
        remedies: [
          'प्रतिदिन प्रातः तांबे के पात्र से सूर्य देव को जल (अर्घ्य) अर्पित करें।',
          'गुरुवार को माथे पर केसर या हल्दी का तिलक लगाएं और "ॐ बृहस्पतये नमः" जपें।',
          'सोमवार को शिवलिंग पर कच्चा दूध और अक्षत अर्पित करें।',
        ],
      };
      setIsComputing(false);
      onCompleteOnboarding(newPrimaryKundli);
    }, 650);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#120C24] via-[#1B1233] to-[#0E091A] text-white flex flex-col justify-between p-6 relative overflow-y-auto custom-scrollbar">
      {/* Top Progress Stepper */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F5C33B] text-[#14111C] font-serif font-bold text-base flex items-center justify-center shadow">
              ॐ
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5C33B] block">
                Sacred Janam Kundli Setup
              </span>
              <h2 className="font-bold text-sm text-white">Step {step} of 3</h2>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Sidereal Lahiri
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#F5C33B]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="my-auto space-y-5 py-4"
          >
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-[#F5C33B]/15 border border-[#F5C33B]/40 flex items-center justify-center mx-auto text-[#F5C33B] mb-2">
                <User className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                What is your auspicious name?
              </h3>
              <p className="text-xs text-[#C4B5A6]">
                आपका नाम आपकी जन्म कुंडली और नामांक (Numerology) के लिए सहेजा जाएगा
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gold-300 font-medium block mb-1.5">
                  Your Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anjul Chouksey"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/20 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#F5C33B]"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 font-medium block mb-1.5">
                  Gender (लिंग)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'male', label: 'Male (पुरुष)' },
                    { id: 'female', label: 'Female (स्त्री)' },
                    { id: 'other', label: 'Other (अन्य)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as 'male' | 'female' | 'other')}
                      className={`py-3 rounded-xl text-xs font-bold border transition ${
                        gender === g.id
                          ? 'bg-[#F5C33B] border-[#F5C33B] text-[#14111C] shadow-md'
                          : 'bg-white/5 border-white/15 text-gray-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F5C33B] to-[#FF8A00] text-[#14111C] font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue to Birth Date &amp; Time</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="my-auto space-y-5 py-4"
          >
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center mx-auto text-[#A855F7] mb-2">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                When were you born?
              </h3>
              <p className="text-xs text-[#C4B5A6]">
                सटीक लग्न, नक्षत्र और विंशोत्तरी महादशा की गणना के लिए जन्म तिथि व समय चुनें
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gold-300 flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-4 h-4 text-[#F5C33B]" />
                  <span>Date of Birth (जन्म तिथि)</span>
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/20 text-sm text-white font-mono focus:outline-none focus:border-[#F5C33B]"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-4 h-4 text-[#F5C33B]" />
                  <span>Exact Time of Birth (जन्म समय)</span>
                </label>
                <input
                  type="time"
                  required
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/20 text-sm text-white font-mono focus:outline-none focus:border-[#F5C33B]"
                />
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 text-xs font-bold text-gray-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5C33B] to-[#FF8A00] text-[#14111C] font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>Next: Birth Place</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            onSubmit={handleFinish}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="my-auto space-y-5 py-4"
          >
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Where were you born?
              </h3>
              <p className="text-xs text-[#C4B5A6]">
                अक्षांश और देशांतर (Latitude/Longitude) के अनुसार आपकी वास्तविक लग्न कुंडली बनेगी
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/35 border border-white/15 space-y-3">
              <CityAutocomplete
                label="Search Birth City & Country (जन्म स्थान)"
                selectedLocation={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
              />

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Seeker Name:</span>
                  <span className="font-bold text-[#F5C33B]">{name || 'Anjul Chouksey'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Birth Date &amp; Time:</span>
                  <span className="font-mono text-white">
                    {dob} • {tob}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coordinates:</span>
                  <span className="font-mono text-emerald-400">
                    {selectedLocation.latitude.toFixed(2)}°N, {selectedLocation.longitude.toFixed(2)}°E
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 text-xs font-bold text-gray-300"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isComputing}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5C33B] via-[#FFB800] to-[#FF8A00] text-[#14111C] font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
              >
                {isComputing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Your Kundli...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create My Kundli &amp; Enter App</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bottom Sacred Note */}
      <div className="text-center text-[11px] text-[#C4B5A6]/80 flex items-center justify-center gap-1.5 pt-2">
        <Flame className="w-3.5 h-3.5 text-saffron-400" />
        <span>Your Kundli is automatically saved &amp; shared with all AI Astrologers</span>
      </div>
    </div>
  );
};
