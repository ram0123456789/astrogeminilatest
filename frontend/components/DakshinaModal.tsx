import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Heart, CheckCircle2, X, Award, Flame } from 'lucide-react';
import { Astrologer, DakshinaReceipt, IndianLanguageOption } from '../types';
import { DAKSHINA_PRESETS } from '../constants';
import { getTranslation } from '../i18n';
import { generateSacredAshirwadAI } from '../services/geminiService';

interface DakshinaModalProps {
  isOpen: boolean;
  astrologer: Astrologer;
  onClose: () => void;
  onComplete: (receipt: DakshinaReceipt) => void;
  appLanguage?: IndianLanguageOption;
}

export const DakshinaModal: React.FC<DakshinaModalProps> = ({
  isOpen,
  astrologer,
  onClose,
  onComplete,
  appLanguage,
}) => {
  const t = getTranslation(appLanguage?.code || 'hi');
  const [rating, setRating] = useState<number>(5);
  const [selectedPreset, setSelectedPreset] = useState<number>(51);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isGeneratingBlessing, setIsGeneratingBlessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DakshinaReceipt | null>(null);

  if (!isOpen) return null;

  const finalAmount = customAmount !== '' ? Number(customAmount) || 0 : selectedPreset;

  const handleOfferOrSkip = async (skipDakshina: boolean) => {
    setIsGeneratingBlessing(true);
    const amountToRecord = skipDakshina ? 0 : finalAmount;
    const presetObj = DAKSHINA_PRESETS.find((p) => p.amount === amountToRecord);
    const tierName = skipDakshina
      ? 'Free Seva Ashirwad'
      : presetObj?.title || 'Custom Guru Dakshina';

    const blessing = await generateSacredAshirwadAI(
      astrologer,
      amountToRecord,
      tierName,
      appLanguage?.nativeName || 'हिन्दी (Hindi)'
    );

    const receipt: DakshinaReceipt = {
      id: `ASH-${Date.now().toString().slice(-6)}`,
      astrologerName: astrologer.name,
      amount: amountToRecord,
      tierName,
      rating,
      blessingShloka: blessing.blessingShloka,
      blessingMeaning: blessing.blessingMeaning,
      personalAshirwad: blessing.personalAshirwad,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIsGeneratingBlessing(false);
    setCompletedReceipt(receipt);
    onComplete(receipt);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#1E1736] to-[#110D20] border border-gold-400/40 shadow-[0_0_60px_rgba(255,107,0,0.25)] overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#C4B5A6] transition"
          >
            <X className="w-5 h-5" />
          </button>

          {!completedReceipt ? (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img
                    src={astrologer.avatar}
                    alt={astrologer.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gold-400 shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-saffron-500 flex items-center justify-center text-white shadow">
                    <Flame className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {t.dakshinaTitle}
                </h3>
                <p className="text-xs text-[#C4B5A6] max-w-md mt-1">
                  {t.dakshinaSubtitle} ({astrologer.name})
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-gold-400 fill-gold-400'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2.5">
                  {DAKSHINA_PRESETS.map((preset) => {
                    const isSelected = customAmount === '' && selectedPreset === preset.amount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(preset.amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-saffron-500/25 to-gold-500/15 border-gold-400'
                            : 'bg-white/5 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-gold-300">
                            {preset.label}
                          </span>
                          <span className="text-[11px] font-semibold text-saffron-400">
                            {preset.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#C4B5A6] mt-0.5 line-clamp-1">
                          {preset.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-gold-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom Dakshina (e.g. 251)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-cosmic-950/90 border border-white/15 text-sm text-white placeholder-[#C4B5A6]/50 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={isGeneratingBlessing}
                  onClick={() => handleOfferOrSkip(false)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  {isGeneratingBlessing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>{t.calculatingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>₹{finalAmount} • {t.offerDakshinaBtn}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isGeneratingBlessing}
                  onClick={() => handleOfferOrSkip(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#C4B5A6] hover:text-white transition"
                >
                  {t.skipDakshinaBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="bg-[#FDFBF7] text-[#2A1810] rounded-2xl p-6 border-2 border-[#C89B3C] shadow-inner relative">
                <div className="w-12 h-12 rounded-full bg-[#9E2A2B]/10 border border-[#9E2A2B]/30 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#9E2A2B]" />
                </div>

                <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E2A2B] font-bold">
                  Sacred Ashirwad Patra • #{completedReceipt.id}
                </span>
                <h4 className="font-display text-xl font-bold text-[#2A1810] mt-1">
                  {completedReceipt.astrologerName}
                </h4>

                {completedReceipt.amount > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-800 font-mono text-xs font-semibold mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Dakshina: ₹{completedReceipt.amount} ({completedReceipt.tierName})
                  </div>
                )}

                <div className="my-4 p-3.5 rounded-xl bg-[#9E2A2B]/5 border border-[#C89B3C]/40">
                  <p className="font-serif text-sm font-bold text-[#9E2A2B] leading-relaxed">
                    {completedReceipt.blessingShloka}
                  </p>
                  <p className="text-xs italic text-[#2A1810]/75 mt-1.5">
                    "{completedReceipt.blessingMeaning}"
                  </p>
                </div>

                <p className="text-sm text-[#2A1810] leading-relaxed">
                  {completedReceipt.personalAshirwad}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-saffron-500 text-cosmic-950 font-bold text-sm hover:opacity-95 transition"
              >
                {t.navHome}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
