import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt,
  Gift,
  Compass,
  Flame,
  X,
  Sun,
  CheckCircle2,
} from 'lucide-react';
import { DAILY_SHUBH_SANKALPA, TODAY_PANCHANG } from '../constants';
import { AppTheme, IndianLanguageOption } from '../types';

interface DailyBlessingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  appTheme: AppTheme;
  appLanguage: IndianLanguageOption;
}

export const DailyBlessingPopup: React.FC<DailyBlessingPopupProps> = ({
  isOpen,
  onClose,
  appTheme,
}) => {
  if (!isOpen) return null;

  const isLight = appTheme === 'divya-light' || appTheme === 'saffron';
  const dayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
  const todayBlessing = DAILY_SHUBH_SANKALPA[dayIndex] || DAILY_SHUBH_SANKALPA[4];

  return (
    <AnimatePresence>
      {/* Semi-transparent overlay inside the Home screen so underlying UI stays softly visible */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[3px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          className={`relative w-full max-w-[390px] rounded-3xl border overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl ${
            isLight
              ? 'bg-white/85 border-amber-400/70 text-[#1F1610]'
              : 'bg-[#171226]/85 border-[#F5C33B]/45 text-white'
          }`}
        >
          {/* Semi-transparent Golden Header Banner */}
          <div className="bg-gradient-to-r from-[#F5C33B]/90 via-[#FFB800]/90 to-[#F5C33B]/90 px-4 py-3 text-[#14111C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#14111C] text-[#F5C33B] flex items-center justify-center font-serif font-bold text-base">
                ॐ
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold block leading-none">
                  Aaj Ka Shubh Sankalpa • Daily Guide
                </span>
                <h3 className="font-bold text-xs sm:text-sm leading-tight mt-0.5">
                  {todayBlessing.day} ({todayBlessing.planet})
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-[#14111C] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Panchang Pill */}
            <div
              className={`px-3 py-2 rounded-2xl border flex items-center justify-between text-xs ${
                isLight
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-white/10 border-white/15 text-gray-100'
              }`}
            >
              <span className="font-semibold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#F5C33B]" />
                {TODAY_PANCHANG.tithi}
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                Abhijit: {TODAY_PANCHANG.abhijitMuhurat}
              </span>
            </div>

            {/* 1. Today's Lucky Cloth Color (Shubh Vastra Rang) */}
            <div
              className={`p-3 rounded-2xl border flex items-start gap-3 ${
                isLight
                  ? 'bg-purple-50/75 border-purple-200'
                  : 'bg-white/10 border-purple-400/30'
              }`}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-md"
                style={{ backgroundColor: todayBlessing.colorHex }}
              >
                <Shirt className="w-5 h-5 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A855F7] font-bold block">
                  Shubh Vastra (Today's Cloth Color)
                </span>
                <h4 className="font-bold text-xs sm:text-sm mt-0.5">
                  {todayBlessing.clothColor}
                </h4>
                <p className="text-[11px] text-red-400 mt-0.5">
                  Avoid wearing: {todayBlessing.avoidColor}
                </p>
              </div>
            </div>

            {/* 2. Today's Sacred Daan (Shubh Daan Seva) */}
            <div
              className={`p-3 rounded-2xl border flex items-start gap-3 ${
                isLight
                  ? 'bg-emerald-50/75 border-emerald-200'
                  : 'bg-white/10 border-emerald-400/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Aaj Ka Shubh Daan (Sacred Donation)
                </span>
                <h4 className="font-bold text-xs sm:text-sm mt-0.5">
                  {todayBlessing.daanItem}
                </h4>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {todayBlessing.benefit}
                </p>
              </div>
            </div>

            {/* 3. Tilak & Lucky Direction */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div
                className={`p-2.5 rounded-2xl border ${
                  isLight ? 'bg-white/80 border-gray-200' : 'bg-white/10 border-white/15'
                }`}
              >
                <span className="text-[10px] font-mono text-[#F5C33B] uppercase font-bold block">
                  Shubh Tilak
                </span>
                <span className="font-semibold mt-0.5 block text-[11px]">
                  {todayBlessing.tilak}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-2xl border ${
                  isLight ? 'bg-white/80 border-gray-200' : 'bg-white/10 border-white/15'
                }`}
              >
                <span className="text-[10px] font-mono text-[#A855F7] uppercase font-bold flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Disha Shool / Lucky
                </span>
                <span className="font-semibold mt-0.5 block text-[11px]">
                  {todayBlessing.luckyDirection}
                </span>
              </div>
            </div>

            {/* 4. Daily Beeja Mantra */}
            <div className="p-3 rounded-2xl bg-[#FDFBF7]/90 text-[#2A1810] border border-[#C89B3C]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#9E2A2B] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Today's Graha Mantra (Chant 11×)</span>
              </div>
              <p className="font-serif font-bold text-xs text-[#9E2A2B] mt-0.5">
                {todayBlessing.mantra}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#F5C33B] to-[#FF8A00] text-[#14111C] font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 hover:opacity-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Receive Today's Blessings</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
