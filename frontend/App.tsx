import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Sun,
  Moon,
  PhoneCall,
  Flame,
  LogOut,
  User,
  Home,
  Share2,
  Briefcase,
  CheckCircle2,
  Hash,
  Menu,
  Globe,
  Calendar,
  Gift,
  MessageCircle,
  Zap,
  BookOpen,
  Check,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Bell,
  Palette,
} from 'lucide-react';
import {
  ActiveTab,
  AppTheme,
  Astrologer,
  ChatMessage,
  ChatSessionRecord,
  IndianLanguageOption,
  KundliData,
  DakshinaReceipt,
  UserProfile,
} from './types';
import {
  ASTROLOGERS,
  COSMIC_ENERGY_METERS,
  INDIAN_LANGUAGES,
  RASHI_LIST,
  getDynamicFestivalBanner,
} from './constants';
import { getTranslation } from './i18n';
import { LiveConsultation } from './components/LiveConsultation';
import { KundliGenerator } from './components/KundliGenerator';
import { KundliMatching } from './components/KundliMatching';
import { PalmReader } from './components/PalmReader';
import { DailyHoroscope } from './components/DailyHoroscope';
import { NumerologyCalculator } from './components/NumerologyCalculator';
import { MoreServicesHub } from './components/MoreServicesHub';
import { DailyBlessingPopup } from './components/DailyBlessingPopup';
import { DakshinaModal } from './components/DakshinaModal';
import { AuthModal } from './components/AuthModal';
import {
  DivineSplashScreen,
  ModernOnboardingFlow,
} from './components/DivineSplashAndOnboarding';

export function App() {
  // 1. Divine Splash Screen on every app launch
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // 2. Stored Kundli Database (Primary User + Others)
  const [allSavedKundlis, setAllSavedKundlis] = useState<KundliData[]>(() => {
    try {
      const rawList = localStorage.getItem('astroveda_kundli_list');
      if (rawList) {
        const parsed = JSON.parse(rawList);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const single = localStorage.getItem('astroveda_kundli');
      if (single) {
        const p = JSON.parse(single);
        return [{ ...p, id: p.id || 'kundli-self', isPrimaryUser: true, relationLabel: 'Self' }];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [savedKundli, setSavedKundli] = useState<KundliData | null>(() => {
    return allSavedKundlis[0] || null;
  });

  // Show modern birth-details onboarding flow if the user hasn't created their primary Kundli yet
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(() => {
    return allSavedKundlis.length === 0;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.HOME);
  const [moreServicesTool, setMoreServicesTool] = useState<
    'hub' | 'face' | 'dream' | 'tarot' | 'vastu'
  >('hub');

  // Global App Theme: All 4 themes controlled exclusively from the top Header Theme Button
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('astroveda_theme') as AppTheme | null;
    if (
      saved === 'divya-dark' ||
      saved === 'divya-light' ||
      saved === 'cosmic' ||
      saved === 'saffron'
    ) {
      return saved;
    }
    return 'divya-light';
  });

  // Global App Language (All 13 Indian Languages)
  const [appLanguage, setAppLanguage] = useState<IndianLanguageOption>(() => {
    const savedCode = localStorage.getItem('astroveda_lang');
    return INDIAN_LANGUAGES.find((l) => l.code === savedCode) || INDIAN_LANGUAGES[1]; // Default Hindi
  });

  // Semi-transparent Daily Cloth Color & Daan Popup on Home Screen
  const [isDailyPopupOpen, setIsDailyPopupOpen] = useState<boolean>(true);

  // Top Header Dropdowns for Global Language & Global Theme
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const topControlsRef = useRef<HTMLDivElement>(null);

  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer>(ASTROLOGERS[0]);
  const [chatViewMode, setChatViewMode] = useState<'directory' | 'chat' | 'history'>('directory');
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  // Persistent Chat Histories per Astrologer
  const [chatHistories, setChatHistories] = useState<Record<string, ChatSessionRecord>>(() => {
    try {
      const raw = localStorage.getItem('astroveda_chat_histories');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(() => ({
    name: allSavedKundlis[0]?.name || 'Anjul Chouksey',
    email: 'anjul@example.com',
    phone: '+91 98765 43210',
    location: allSavedKundlis[0]?.place || 'Mumbai, India',
    memberSince: 'January 2024',
  }));

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem('astroveda_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [receipts, setReceipts] = useState<DakshinaReceipt[]>(() => {
    try {
      const raw = localStorage.getItem('astroveda_receipts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [quickDakshinaOpen, setQuickDakshinaOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('astroveda_theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    localStorage.setItem('astroveda_lang', appLanguage.code);
  }, [appLanguage]);

  useEffect(() => {
    if (savedKundli) {
      localStorage.setItem('astroveda_kundli', JSON.stringify(savedKundli));
    }
  }, [savedKundli]);

  useEffect(() => {
    if (allSavedKundlis.length > 0) {
      localStorage.setItem('astroveda_kundli_list', JSON.stringify(allSavedKundlis));
    }
  }, [allSavedKundlis]);

  // Close top menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (topControlsRef.current && !topControlsRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Complete Initial Onboarding -> Save primary Kundli to database & open Kundli section!
  const handleCompleteOnboarding = (primaryKundli: KundliData) => {
    const list = [primaryKundli];
    setAllSavedKundlis(list);
    setSavedKundli(primaryKundli);
    setProfileForm((prev) => ({
      ...prev,
      name: primaryKundli.name,
      location: primaryKundli.place,
    }));
    localStorage.setItem('astroveda_kundli', JSON.stringify(primaryKundli));
    localStorage.setItem('astroveda_kundli_list', JSON.stringify(list));
    setNeedsOnboarding(false);
    // Automatically take the user to their newly generated Kundli under Kundli section
    setActiveTab(ActiveTab.KUNDLI);
  };

  // Save or update Kundli (either Self or Other)
  const handleSaveKundliProfile = (data: KundliData, isNewOther = false) => {
    setSavedKundli(data);
    setAllSavedKundlis((prev) => {
      if (isNewOther) {
        return [...prev, data];
      }
      const exists = prev.some((item) => item.id === data.id);
      if (exists) {
        return prev.map((item) => (item.id === data.id ? data : item));
      }
      return [data, ...prev];
    });
  };

  const handleDeleteKundliProfile = (id: string) => {
    setAllSavedKundlis((prev) => {
      const filtered = prev.filter((k) => k.id !== id);
      if (savedKundli?.id === id && filtered.length > 0) {
        setSavedKundli(filtered[0]);
      }
      return filtered;
    });
  };

  const handleUpdateChatHistory = (astrologer: Astrologer, messages: ChatMessage[]) => {
    const lastMsg = messages[messages.length - 1]?.text || '';
    const record: ChatSessionRecord = {
      id: `sess-${astrologer.id}`,
      astrologerId: astrologer.id,
      astrologerName: astrologer.name,
      astrologerAvatar: astrologer.avatar,
      astrologerTitle: astrologer.title,
      lastMessage: lastMsg,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages,
    };
    setChatHistories((prev) => {
      const next = { ...prev, [astrologer.id]: record };
      localStorage.setItem('astroveda_chat_histories', JSON.stringify(next));
      return next;
    });
  };

  const handleClearChatHistory = (astrologerId: string) => {
    setChatHistories((prev) => {
      const next = { ...prev };
      delete next[astrologerId];
      localStorage.setItem('astroveda_chat_histories', JSON.stringify(next));
      return next;
    });
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setProfileForm((prev) => ({
      ...prev,
      name: user.name,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
    }));
    localStorage.setItem('astroveda_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('astroveda_user');
  };

  const handleSaveReceipt = (receipt: DakshinaReceipt) => {
    setReceipts((prev) => {
      const updated = [receipt, ...prev];
      localStorage.setItem('astroveda_receipts', JSON.stringify(updated));
      return updated;
    });
  };

  const startConsultationWith = (astrologer: Astrologer, startVoice = false) => {
    setSelectedAstrologer(astrologer);
    setChatViewMode('chat');
    setAutoStartVoice(startVoice);
    setActiveTab(ActiveTab.CHAT);
  };

  const openMoreServiceTool = (tool: 'hub' | 'face' | 'dream' | 'tarot' | 'vastu') => {
    setMoreServicesTool(tool);
    setActiveTab(ActiveTab.MORE_SERVICES);
  };

  const isLightMode = appTheme === 'divya-light' || appTheme === 'saffron';
  const isDivyaFamily = appTheme === 'divya-dark' || appTheme === 'divya-light';
  const t = getTranslation(appLanguage.code);
  const dynamicFestival = getDynamicFestivalBanner(appLanguage.code);
  const primaryUserChart = allSavedKundlis.find((k) => k.isPrimaryUser) || savedKundli;
  const greetingName =
    currentUser?.name ||
    primaryUserChart?.name ||
    (appLanguage.code === 'hi' || appLanguage.code === 'sa' || appLanguage.code === 'mr'
      ? 'अंजुल चौकसे'
      : profileForm.name);

  return (
    <div className="min-h-screen bg-[#070510] text-[#F4EFE6] flex flex-col items-center justify-center sm:py-3 relative select-none">
      {/* MOBILE APP SHELL CONTAINER */}
      <div
        className={`w-full ${
          phoneFrameMode
            ? 'sm:max-w-[425px] sm:h-[870px] sm:rounded-[40px] sm:border-[6px] sm:border-[#251E3E]'
            : 'max-w-5xl min-h-screen'
        } h-screen flex flex-col overflow-hidden relative shadow-[0_0_90px_rgba(0,0,0,0.85)] transition-colors ${
          appTheme === 'divya-light'
            ? 'bg-white text-[#1E1B2E]'
            : appTheme === 'divya-dark'
            ? 'bg-[#0F0D15] text-white'
            : appTheme === 'saffron'
            ? 'bg-[#FFFDF9] text-[#1F1610]'
            : 'bg-[#0E0A1C] text-[#F4EFE6]'
        }`}
      >
        {/* 1. DIVINE SPLASH SCREEN ON LAUNCH */}
        {showSplash ? (
          <DivineSplashScreen onSplashComplete={() => setShowSplash(false)} />
        ) : needsOnboarding ? (
          /* 2. INITIAL BIRTH DETAILS ONBOARDING FLOW -> GENERATES & SAVES PRIMARY KUNDLI */
          <ModernOnboardingFlow onCompleteOnboarding={handleCompleteOnboarding} />
        ) : (
          <>
            {/* =====================================================================
                TOP HEADER BAR — ALL THEMES & ALL LANGUAGES UNDER TOP BUTTONS (NO WALLET)
               ===================================================================== */}
            <header
              ref={topControlsRef}
              className={`px-3.5 py-2.5 flex items-center justify-between shrink-0 z-40 relative transition-colors ${
                isDivyaFamily
                  ? 'bg-[#F5C33B] text-[#14111C] shadow-xs'
                  : appTheme === 'saffron'
                  ? 'bg-gradient-to-r from-[#FFB800] to-[#FF8A00] text-[#1F1610] shadow-sm'
                  : 'bg-[#151029] border-b border-gold-400/20 text-white'
              }`}
            >
              {/* Left: Hamburger Menu + Brand Greeting */}
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveTab(ActiveTab.HOME)}
                  className="p-1 rounded-lg hover:bg-black/10 transition"
                  aria-label="Home"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab(ActiveTab.HOME)}
                  className="text-left min-w-0"
                >
                  <span className="font-extrabold text-sm sm:text-base tracking-tight truncate block leading-tight">
                    {activeTab === ActiveTab.CHAT
                      ? 'Astrofree'
                      : `${t.namaste} ${greetingName}`}
                  </span>
                </button>
              </div>

              {/* Right: Daily Shubh Daan Bell + Global Language (Globe) + Global Theme Button + User Profile */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDailyPopupOpen(true)}
                  title="Today's Lucky Cloth Color & Daan"
                  className={`relative p-1.5 rounded-full transition ${
                    appTheme === 'cosmic'
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-black/10 text-[#14111C]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-1 ring-[#F5C33B]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLangMenuOpen((o) => !o);
                    setIsThemeMenuOpen(false);
                  }}
                  title="Change App Language (13 Indian Languages)"
                  className={`p-1.5 rounded-full transition flex items-center gap-0.5 ${
                    appTheme === 'cosmic'
                      ? 'hover:bg-white/10 text-gold-300'
                      : 'hover:bg-black/10 text-[#14111C]'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase">
                    {appLanguage.code.slice(0, 2)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsThemeMenuOpen((o) => !o);
                    setIsLangMenuOpen(false);
                  }}
                  title="Change App Theme (Divya Light / Divya Dark / Cosmic / Saffron)"
                  className={`p-1.5 rounded-full transition flex items-center gap-1 ${
                    appTheme === 'cosmic'
                      ? 'hover:bg-white/10 text-gold-300'
                      : 'hover:bg-black/10 text-[#14111C]'
                  }`}
                >
                  {isLightMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    currentUser ? setActiveTab(ActiveTab.PROFILE) : setIsAuthModalOpen(true)
                  }
                  title={t.navProfile}
                  className={`p-1.5 rounded-full transition ${
                    appTheme === 'cosmic'
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-black/10 text-[#14111C]'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
              </div>

              {/* DROPDOWN 1: GLOBAL 13 INDIAN LANGUAGES MENU */}
              {isLangMenuOpen && (
                <div className="absolute top-full right-3 mt-1.5 w-64 rounded-2xl bg-[#18122B] text-white border border-gold-400/40 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                  <div className="px-2.5 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-gold-300 uppercase">
                    <span>Full App Language</span>
                    <span>13 Languages</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 mt-1">
                    {INDIAN_LANGUAGES.map((lang) => {
                      const active = lang.code === appLanguage.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setAppLanguage(lang);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                            active
                              ? 'bg-[#A855F7] text-white font-bold'
                              : 'hover:bg-white/10 text-[#F4EFE6]'
                          }`}
                        >
                          <span>{lang.nativeName}</span>
                          {active && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DROPDOWN 2: ALL THEMES UNDER THE TOP THEME BUTTON */}
              {isThemeMenuOpen && (
                <div className="absolute top-full right-3 mt-1.5 w-64 rounded-2xl bg-[#18122B] text-white border border-gold-400/40 shadow-2xl p-2 z-50">
                  <div className="px-2.5 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-gold-300 uppercase">
                    <span className="flex items-center gap-1">
                      <Palette className="w-3 h-3" /> All App Themes
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhoneFrameMode((f) => !f)}
                      className="underline text-emerald-300"
                    >
                      {phoneFrameMode ? 'Full Width' : 'Phone Frame'}
                    </button>
                  </div>
                  <div className="space-y-1 mt-1.5">
                    {[
                      {
                        id: 'divya-light' as AppTheme,
                        title: '☀️ Divya Light Theme',
                        desc: 'Gold header + pastel circles & crisp white cards',
                      },
                      {
                        id: 'divya-dark' as AppTheme,
                        title: '🌙 Divya Dark Theme',
                        desc: 'Gold header + sleek dark cards & purple accents',
                      },
                      {
                        id: 'cosmic' as AppTheme,
                        title: '✨ Cosmic Leo Dark Theme',
                        desc: 'Deep purple night sky & gold constellations',
                      },
                      {
                        id: 'saffron' as AppTheme,
                        title: '🌼 AstroTalk Saffron Theme',
                        desc: 'Vibrant yellow-orange directory layout',
                      },
                    ].map((opt) => {
                      const active = appTheme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setAppTheme(opt.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left transition flex items-start justify-between gap-2 ${
                            active
                              ? 'bg-[#F5C33B] text-[#14111C] font-bold'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{opt.title}</p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                active ? 'text-[#14111C]/80' : 'text-[#C4B5A6]'
                              }`}
                            >
                              {opt.desc}
                            </p>
                          </div>
                          {active && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </header>

            {/* SCROLLABLE NATIVE APP VIEWPORT */}
            <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar relative">
              {activeTab === ActiveTab.HOME && (
                <div>
                  {/* DIVYA LIGHT & DIVYA DARK HOME */}
                  {isDivyaFamily ? (
                    <div
                      className={`p-4 space-y-6 transition-colors ${
                        appTheme === 'divya-light'
                          ? 'bg-white text-[#1E1B2E]'
                          : 'bg-[#0F0D15] text-white'
                      }`}
                    >
                      {/* 1. DYNAMIC FESTIVAL & RELIGIOUS DATE ZODIAC WHEEL HERO BANNER */}
                      <button
                        type="button"
                        onClick={() => startConsultationWith(ASTROLOGERS[0], false)}
                        className="w-full relative h-44 rounded-2xl overflow-hidden shadow-md flex items-center justify-center text-center group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4A3520] via-[#261436] to-[#4A3520]" />
                        <svg
                          viewBox="0 0 400 180"
                          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                        >
                          <circle cx="200" cy="90" r="68" fill="none" stroke="#E5B84B" strokeWidth="1.5" />
                          <circle cx="200" cy="90" r="50" fill="none" stroke="#E5B84B" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx="200" cy="90" r="28" fill="none" stroke="#E5B84B" strokeWidth="1" />
                          {Array.from({ length: 12 }, (_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const x1 = 200 + 28 * Math.cos(angle);
                            const y1 = 90 + 28 * Math.sin(angle);
                            const x2 = 200 + 68 * Math.cos(angle);
                            const y2 = 90 + 68 * Math.sin(angle);
                            return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#E5B84B"
                                strokeWidth="0.8"
                              />
                            );
                          })}
                        </svg>

                        <div className="relative z-10 px-4 space-y-1.5">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#F5C33B] bg-black/50 px-2.5 py-0.5 rounded-full border border-[#F5C33B]/40">
                            ✨ {dynamicFestival.festivalName} • {dynamicFestival.tithiTag}
                          </span>
                          <h2 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-snug group-hover:scale-[1.02] transition-transform">
                            {dynamicFestival.headline}
                          </h2>
                          <span className="inline-block text-[11px] font-medium text-amber-200 bg-black/40 px-3 py-0.5 rounded-full border border-amber-300/30">
                            {dynamicFestival.subText}
                          </span>
                        </div>
                      </button>

                      {/* 2. EXACTLY 7 CORE SERVICES + 8th "More Tools" BUTTON (2x4 Grid) */}
                      <div>
                        <h3 className="font-bold text-base mb-3.5">{t.exploreServices}</h3>
                        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                          {[
                            {
                              label: t.dailyHoroscope,
                              tab: ActiveTab.HOROSCOPE,
                              bg: appTheme === 'divya-light' ? 'bg-[#F3E8FF]' : 'bg-purple-500/20',
                              iconColor: 'text-[#A855F7]',
                              icon: Calendar,
                            },
                            {
                              label: t.freeKundli,
                              tab: ActiveTab.KUNDLI,
                              bg: appTheme === 'divya-light' ? 'bg-[#FFEDD5]' : 'bg-orange-500/20',
                              iconColor: 'text-[#EA580C]',
                              icon: Gift,
                            },
                            {
                              label: t.matchMaking,
                              tab: ActiveTab.MATCHING,
                              bg: appTheme === 'divya-light' ? 'bg-[#FCE7F3]' : 'bg-pink-500/20',
                              iconColor: 'text-[#E11D48]',
                              icon: Heart,
                            },
                            {
                              label: t.freeChat,
                              onClick: () => {
                                setChatViewMode('directory');
                                setActiveTab(ActiveTab.CHAT);
                              },
                              bg: appTheme === 'divya-light' ? 'bg-[#DCFCE7]' : 'bg-emerald-500/20',
                              iconColor: 'text-[#10B981]',
                              icon: MessageCircle,
                            },
                            {
                              label: 'Numerology',
                              tab: ActiveTab.NUMEROLOGY,
                              bg: appTheme === 'divya-light' ? 'bg-[#FEF9C3]' : 'bg-amber-500/20',
                              iconColor: 'text-[#CA8A04]',
                              icon: Hash,
                            },
                            {
                              label: t.vastu,
                              onClick: () => openMoreServiceTool('vastu'),
                              bg: appTheme === 'divya-light' ? 'bg-[#DBEAFE]' : 'bg-blue-500/20',
                              iconColor: 'text-[#2563EB]',
                              icon: Home,
                            },
                            {
                              label: 'Dream Analysis',
                              onClick: () => openMoreServiceTool('dream'),
                              bg: appTheme === 'divya-light' ? 'bg-[#FFE4E6]' : 'bg-rose-500/20',
                              iconColor: 'text-[#E11D48]',
                              icon: Zap,
                            },
                            {
                              label: 'More Tools',
                              onClick: () => openMoreServiceTool('hub'),
                              bg: appTheme === 'divya-light' ? 'bg-[#F3F4F6]' : 'bg-white/10',
                              iconColor: appTheme === 'divya-light' ? 'text-[#4B5563]' : 'text-gray-300',
                              icon: BookOpen,
                            },
                          ].map((srv) => {
                            const Icon = srv.icon;
                            return (
                              <button
                                key={srv.label}
                                type="button"
                                onClick={() =>
                                  srv.onClick ? srv.onClick() : srv.tab && setActiveTab(srv.tab)
                                }
                                className="flex flex-col items-center text-center gap-1.5 group"
                              >
                                <div
                                  className={`w-14 h-14 rounded-full ${srv.bg} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}
                                >
                                  <Icon className={`w-6 h-6 ${srv.iconColor}`} />
                                </div>
                                <span
                                  className={`text-[11px] font-medium leading-tight ${
                                    appTheme === 'divya-light' ? 'text-gray-800' : 'text-gray-200'
                                  }`}
                                >
                                  {srv.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Live Astrologers Horizontal Cards */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-base">{t.liveAstrologers}</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setChatViewMode('directory');
                              setActiveTab(ActiveTab.CHAT);
                            }}
                            className="text-xs font-semibold text-[#A855F7] hover:underline"
                          >
                            {t.viewAll}
                          </button>
                        </div>

                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                          {ASTROLOGERS.map((astro) => (
                            <div
                              key={astro.id}
                              className={`min-w-[205px] p-3.5 rounded-2xl border flex flex-col justify-between shrink-0 ${
                                appTheme === 'divya-light'
                                  ? 'bg-white border-gray-200 shadow-xs'
                                  : 'bg-[#17141F] border-white/10 shadow-md'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="flex flex-col items-center shrink-0">
                                  <div className="relative">
                                    <img
                                      src={astro.avatar}
                                      alt={astro.name}
                                      className="w-12 h-12 rounded-full object-cover border-2 border-[#F5C33B]"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                  </div>
                                  <span className="text-[11px] font-bold mt-1 flex items-center gap-0.5">
                                    {astro.rating.toFixed(1)}{' '}
                                    <span className="text-[#F5C33B]">★</span>
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-bold text-xs truncate">{astro.name}</h4>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                  </div>
                                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                    {astro.title}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {astro.languages.join(', ')}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Exp: {astro.experienceYears} Years
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startConsultationWith(astro, false)}
                                  className={`flex-1 py-1.5 px-3 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 transition ${
                                    appTheme === 'divya-light'
                                      ? 'border-gray-300 text-gray-800 hover:border-purple-600'
                                      : 'border-white/15 bg-[#211D2D] text-[#F5C33B] hover:border-[#F5C33B]'
                                  }`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>{t.chatBtn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startConsultationWith(astro, true)}
                                  title={t.callBtn}
                                  className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition"
                                >
                                  <PhoneCall className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Your Daily Horoscope Zodiac Strip */}
                      <div
                        className={`p-4 rounded-2xl border text-center ${
                          appTheme === 'divya-light'
                            ? 'bg-[#F4F6FF] border-indigo-100'
                            : 'bg-[#17141F] border-white/10'
                        }`}
                      >
                        <h3 className="font-bold text-base flex items-center justify-center gap-1.5">
                          <span>✨</span>
                          <span>{t.yourDailyHoroscope}</span>
                          <span>✨</span>
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{t.tapSignSub}</p>

                        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar mt-3.5 pb-2">
                          {RASHI_LIST.map((rashi) => (
                            <button
                              key={rashi.id}
                              type="button"
                              onClick={() => setActiveTab(ActiveTab.HOROSCOPE)}
                              className="flex flex-col items-center gap-1.5 shrink-0 group"
                            >
                              <div
                                className={`w-12 h-12 rounded-full border flex items-center justify-center group-hover:scale-105 transition ${
                                  appTheme === 'divya-light'
                                    ? 'bg-white border-indigo-100 shadow-2xs'
                                    : 'bg-[#211D2D] border-white/10'
                                }`}
                              >
                                <span className="w-6 h-6 rounded-md bg-[#7C3AED] text-white text-xs flex items-center justify-center font-bold">
                                  {rashi.symbol}
                                </span>
                              </div>
                              <span className="text-[11px] font-medium">
                                {t.rashis[rashi.id] || rashi.english}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : appTheme === 'cosmic' ? (
                    /* COSMIC LEO DARK HOME */
                    <div className="px-5 pt-4 pb-6 space-y-6 relative">
                      <div className="pt-4 relative z-10">
                        <div className="flex items-center gap-1.5 text-gold-400 text-xs font-mono tracking-[0.2em] uppercase">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{dynamicFestival.festivalName}</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-normal text-white mt-2 leading-tight">
                          {t.namaste},
                          <span className="block italic text-gold-300 font-serif mt-0.5">
                            {greetingName.split(' ')[0]}
                          </span>
                        </h1>
                      </div>

                      <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#2A1B4E]/95 to-[#1E1438]/95 border border-white/10 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="font-serif text-lg text-white">{dynamicFestival.tithiTag}</h2>
                          <button
                            type="button"
                            onClick={() => setActiveTab(ActiveTab.HOROSCOPE)}
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-[#D6CBE6] leading-relaxed">
                          <span className="text-gold-300 font-medium">{dynamicFestival.headline}</span> — {dynamicFestival.subText}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab(ActiveTab.HOROSCOPE)}
                          className="mt-5 w-full py-3.5 rounded-full bg-[#E8C574] text-[#1A132B] font-bold text-sm"
                        >
                          {t.dailyHoroscope}
                        </button>
                      </div>

                      <div className="space-y-3.5 pt-1">
                        <h3 className="font-serif text-lg text-white">{t.cosmicEnergy}</h3>
                        <div className="space-y-3">
                          {COSMIC_ENERGY_METERS.map((meter) => (
                            <div key={meter.id} className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-[#1E1636] border border-white/10 flex items-center justify-center shrink-0">
                                {meter.id === 'love' ? (
                                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                                ) : meter.id === 'career' ? (
                                  <Briefcase className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <Flame className="w-4 h-4 text-amber-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs text-[#C4B5A6]">
                                    {meter.id === 'love'
                                      ? t.love
                                      : meter.id === 'career'
                                      ? t.career
                                      : t.vitality}
                                  </span>
                                  <span className="font-serif text-lg text-white">{meter.score}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${meter.bg}`}
                                    style={{ width: `${meter.score}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SAFFRON DIRECTORY HOME */
                    <div className="p-4 space-y-5 bg-[#FFFDF9] text-[#1F1610]">
                      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FF8008] to-[#FFC837] text-white shadow-lg flex items-center justify-between gap-3">
                        <div className="space-y-2 max-w-[65%]">
                          <span className="text-[10px] font-mono uppercase bg-black/20 px-2 py-0.5 rounded-full">
                            {dynamicFestival.festivalName}
                          </span>
                          <h2 className="font-display font-bold text-base leading-tight">
                            {dynamicFestival.headline}
                          </h2>
                          <button
                            type="button"
                            onClick={() => startConsultationWith(ASTROLOGERS[0], true)}
                            className="px-4 py-2 rounded-full bg-white text-[#FF6B00] font-bold text-xs shadow"
                          >
                            {t.freeChat} →
                          </button>
                        </div>
                        <img
                          src={ASTROLOGERS[0].avatar}
                          alt="Astrologer"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white/80 shadow-md shrink-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === ActiveTab.CHAT && (
                <div className="h-[calc(100vh-128px)] sm:h-[740px]">
                  <LiveConsultation
                    astrologer={selectedAstrologer}
                    onSelectAstrologer={setSelectedAstrologer}
                    allAstrologers={ASTROLOGERS}
                    savedKundli={savedKundli}
                    allSavedKundlis={allSavedKundlis}
                    onSelectActiveKundli={setSavedKundli}
                    onSaveNewOtherKundli={(k) => handleSaveKundliProfile(k, true)}
                    onSaveReceipt={handleSaveReceipt}
                    onBack={() => {
                      setAutoStartVoice(false);
                      setActiveTab(ActiveTab.HOME);
                    }}
                    autoStartVoice={autoStartVoice}
                    appTheme={appTheme}
                    selectedLang={appLanguage}
                    onSelectLang={setAppLanguage}
                    initialViewMode={chatViewMode}
                    chatHistories={chatHistories}
                    onUpdateChatHistory={handleUpdateChatHistory}
                    onClearChatHistory={handleClearChatHistory}
                  />
                </div>
              )}

              {activeTab === ActiveTab.KUNDLI && (
                <KundliGenerator
                  savedKundli={savedKundli}
                  allSavedKundlis={allSavedKundlis}
                  onSaveKundli={handleSaveKundliProfile}
                  onSelectActiveKundli={setSavedKundli}
                  onDeleteKundli={handleDeleteKundliProfile}
                  onConsultAstrologer={() => {
                    setChatViewMode('chat');
                    setActiveTab(ActiveTab.CHAT);
                  }}
                  appLanguage={appLanguage}
                  appTheme={appTheme}
                  onBack={() => setActiveTab(ActiveTab.HOME)}
                />
              )}

              {activeTab === ActiveTab.MATCHING && (
                <KundliMatching
                  appLanguage={appLanguage}
                  appTheme={appTheme}
                  savedKundli={savedKundli}
                  onBack={() => setActiveTab(ActiveTab.HOME)}
                />
              )}

              {activeTab === ActiveTab.NUMEROLOGY && (
                <div
                  className={`p-4 ${
                    isLightMode ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-[#F4EFE6]'
                  }`}
                >
                  <NumerologyCalculator
                    initialName={currentUser?.name || savedKundli?.name || profileForm.name}
                    initialDob={savedKundli?.dob || '1996-08-14'}
                    onConsultAstrologer={() => {
                      setChatViewMode('chat');
                      setActiveTab(ActiveTab.CHAT);
                    }}
                    appLanguage={appLanguage}
                  />
                </div>
              )}

              {activeTab === ActiveTab.MORE_SERVICES && (
                <MoreServicesHub
                  initialTool={moreServicesTool}
                  appTheme={appTheme}
                  appLanguage={appLanguage}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === ActiveTab.PALMISTRY && (
                <div
                  className={`p-4 ${
                    isLightMode ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-[#F4EFE6]'
                  }`}
                >
                  <PalmReader appLanguage={appLanguage} />
                </div>
              )}

              {activeTab === ActiveTab.HOROSCOPE && (
                <div
                  className={`p-4 ${
                    isLightMode ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-[#F4EFE6]'
                  }`}
                >
                  <DailyHoroscope appLanguage={appLanguage} />
                </div>
              )}

              {/* =====================================================================
                  SCREENSHOT 5: PROFILE SCREEN
                 ===================================================================== */}
              {activeTab === ActiveTab.PROFILE && (
                <div
                  className={`p-4 space-y-5 min-h-full transition-colors ${
                    isLightMode ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-white'
                  }`}
                >
                  <div
                    className={`p-6 rounded-2xl border text-center ${
                      isLightMode
                        ? 'bg-white border-gray-200 shadow-2xs'
                        : 'bg-[#17141F] border-white/10'
                    }`}
                  >
                    <img
                      src={
                        currentUser?.avatar ||
                        'https://picsum.photos/seed/anjul-chouksey/200/200'
                      }
                      alt={greetingName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#F5C33B] mx-auto mb-3"
                    />
                    <h2 className="font-bold text-xl">{greetingName}</h2>
                    <p
                      className={`text-xs mt-1 ${
                        isLightMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      Premium Member • {allSavedKundlis.length} Saved Kundli(s)
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile((v) => !v)}
                        className={`w-full py-2.5 rounded-xl border text-xs font-bold transition ${
                          isLightMode
                            ? 'border-gray-300 hover:bg-gray-100 text-gray-800'
                            : 'border-white/15 bg-[#1E1B29] hover:bg-white/10 text-white'
                        }`}
                      >
                        {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                      </button>

                      {!currentUser ? (
                        <button
                          type="button"
                          onClick={() => setIsAuthModalOpen(true)}
                          className="w-full py-2 rounded-xl bg-[#A855F7] text-white text-xs font-bold"
                        >
                          {t.signInTitle} (OTP / Google)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full py-2 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.signOutBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base mb-2.5">Contact Information</h3>
                    <div
                      className={`p-5 rounded-2xl border space-y-4 ${
                        isLightMode
                          ? 'bg-white border-gray-200 shadow-2xs'
                          : 'bg-[#17141F] border-white/10'
                      }`}
                    >
                      {isEditingProfile ? (
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-gray-400 block mb-1">Full Name</label>
                            <input
                              type="text"
                              value={profileForm.name}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/15"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 block mb-1">Email</label>
                            <input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, email: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/15"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 block mb-1">Phone</label>
                            <input
                              type="text"
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, phone: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/15"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 block mb-1">Location</label>
                            <input
                              type="text"
                              value={profileForm.location}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, location: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/15"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3.5">
                            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                            <div>
                              <span className="text-xs text-gray-400 block">Email</span>
                              <span className="text-sm font-semibold">
                                {currentUser?.email || profileForm.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5">
                            <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                            <div>
                              <span className="text-xs text-gray-400 block">Phone</span>
                              <span className="text-sm font-semibold">
                                {currentUser?.phone || profileForm.phone}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5">
                            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                            <div>
                              <span className="text-xs text-gray-400 block">Location</span>
                              <span className="text-sm font-semibold">
                                {savedKundli?.place || profileForm.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5">
                            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                            <div>
                              <span className="text-xs text-gray-400 block">Member Since</span>
                              <span className="text-sm font-semibold">
                                {currentUser?.joinedAt || profileForm.memberSince}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base mb-2.5">Preferences</h3>
                    <div
                      className={`rounded-2xl border divide-y ${
                        isLightMode
                          ? 'bg-white border-gray-200 divide-gray-100 shadow-2xs'
                          : 'bg-[#17141F] border-white/10 divide-white/5'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsDailyPopupOpen(true)}
                        className="w-full px-5 py-3.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between hover:opacity-80"
                      >
                        <span>Notification Settings &amp; Daily Sankalpa</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab(ActiveTab.KUNDLI)}
                        className="w-full px-5 py-3.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between hover:opacity-80"
                      >
                        <span>Saved Kundli Profiles ({allSavedKundlis.length})</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickDakshinaOpen(true)}
                        className="w-full px-5 py-3.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between hover:opacity-80"
                      >
                        <span>Sacred Dakshina &amp; Ashirwad Scrolls ({receipts.length})</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setChatViewMode('history');
                          setActiveTab(ActiveTab.CHAT);
                        }}
                        className="w-full px-5 py-3.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between hover:opacity-80"
                      >
                        <span className="flex items-center gap-2">
                          <span>Consultation History</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#A855F7] text-[10px] font-bold">
                            {Object.keys(chatHistories).length} Chats
                          </span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* 6-ITEM BOTTOM NAVIGATION BAR */}
            <nav
              className={`absolute bottom-0 inset-x-0 h-16 border-t px-2 flex items-center justify-around z-30 transition-colors ${
                isLightMode
                  ? 'bg-white border-gray-200'
                  : 'bg-[#13101C] border-white/10'
              }`}
            >
              {[
                { id: ActiveTab.HOME, label: t.navHome, icon: Home },
                {
                  id: ActiveTab.CHAT,
                  label: t.navChat,
                  icon: MessageCircle,
                  onClick: () => {
                    setChatViewMode('directory');
                    setActiveTab(ActiveTab.CHAT);
                  },
                },
                { id: ActiveTab.KUNDLI, label: t.navKundli, icon: Heart },
                { id: ActiveTab.MATCHING, label: t.navMatch, icon: Sparkles },
                {
                  id: ActiveTab.MORE_SERVICES,
                  label: t.navRemedy,
                  icon: Sparkles,
                  onClick: () => openMoreServiceTool('hub'),
                },
                { id: ActiveTab.PROFILE, label: t.navProfile, icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => (item.onClick ? item.onClick() : setActiveTab(item.id))}
                    className={`flex flex-col items-center justify-center gap-1 py-1 px-2 transition ${
                      active
                        ? 'text-[#A855F7] font-bold'
                        : isLightMode
                        ? 'text-gray-500 hover:text-gray-900'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Semi-Transparent Daily Cloth Color, Daan, Tilak & Mantra Popup on Home Screen */}
            <DailyBlessingPopup
              isOpen={isDailyPopupOpen}
              onClose={() => setIsDailyPopupOpen(false)}
              appTheme={appTheme}
              appLanguage={appLanguage}
            />

            {/* Optional Dakshina Modal */}
            <DakshinaModal
              isOpen={quickDakshinaOpen}
              astrologer={selectedAstrologer}
              onClose={() => setQuickDakshinaOpen(false)}
              onComplete={handleSaveReceipt}
              appLanguage={appLanguage}
            />

            {/* Google & Phone OTP Auth Modal */}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={handleAuthSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
