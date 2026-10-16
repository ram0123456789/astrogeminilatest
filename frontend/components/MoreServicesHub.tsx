import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ScanFace,
  Moon,
  Layers,
  Home,
  Hash,
  Hand,
  ArrowLeft,
  Camera,
  Upload,
  Flame,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  ActiveTab,
  AppTheme,
  FaceReadingResult,
  DreamAnalysisResult,
  TarotCardReading,
  VastuAnalysisResult,
  IndianLanguageOption,
} from '../types';
import {
  analyzeFaceImageAI,
  analyzeDreamSwapnaAI,
  generateTarotSpreadAI,
  analyzeVastuShastraAI,
} from '../services/geminiService';

interface MoreServicesHubProps {
  initialTool?: 'hub' | 'face' | 'dream' | 'tarot' | 'vastu';
  appTheme: AppTheme;
  appLanguage: IndianLanguageOption;
  onNavigateTab: (tab: ActiveTab) => void;
}

const TAROT_MAJOR_ARCANA = [
  'The Sun (Surya)',
  'The Empress (Shakti)',
  'The Magician (Siddhi)',
  'Wheel of Fortune (Kala Chakra)',
  'The Lovers (Prem Yoga)',
  'The Star (Nakshatra)',
  'The Emperor (Raja Yoga)',
  'The High Priestess (Gyan)',
  'The World (Poornatva)',
];

const INITIAL_FACE_RESULT: FaceReadingResult = {
  faceShapeElement: 'Agni-Tejas Mukha (Radiant Leadership Face)',
  foreheadLalat: {
    score: 93,
    insight: 'Broad, smooth Lalat (forehead) indicates strong Guru (Jupiter) grace, early intellectual maturity, and administrative respect.',
  },
  eyesNetra: {
    score: 90,
    insight: 'Clear, magnetic eyes reflect deep intuition, truthfulness, and strong Chandra-Surya balance.',
  },
  noseNasika: {
    score: 88,
    insight: 'Well-proportioned Nasika bridge signifies self-earned financial prosperity and strong willpower after age 26.',
  },
  lipsAdhara: {
    score: 91,
    insight: 'Balanced Adhara (lips) show persuasive speech (Vak-Siddhi) and warm family devotion.',
  },
  auraAndPersonality:
    'Your facial Samudrika aura radiates calm authority and artistic sensitivity. People naturally trust your counsel.',
  careerAndWealthYoga:
    'High Dhan-Labha yoga in leadership, technology, consulting, or independent enterprise.',
  sacredRemedy:
    'Apply a small Kesar (saffron) or white Chandan tilak at the center of your Agya Chakra (forehead) every morning.',
};

const INITIAL_DREAM_RESULT: DreamAnalysisResult = {
  dreamSymbolism: 'Sacred Temple / Flowing Water & Golden Light',
  swapnaShastraCategory: 'Daivik Shubh Swapna (Auspicious Divine Vision)',
  spiritualMeaning:
    'In Swapna Shastra, seeing clear water, temples, or rising light during Brahma Muhurta signifies the clearing of past karmic blocks and the awakening of Jupiter’s grace.',
  nearFutureIndication:
    'Good news regarding career elevation, financial inflow, or family celebration within the next 15 to 40 days.',
  auspiciousIndex: 94,
  morningUpay:
    'Share auspicious dreams only with a Guru or before Tulsi/Surya Dev, and offer water to a Peepal or Tulsi plant.',
};

const INITIAL_TAROT_RESULT: TarotCardReading = {
  pastCard: {
    name: 'The Magician (Siddhi)',
    sanskritArchetype: 'Budh-Guru Kriya Shakti',
    meaning: 'You have built strong foundational skills and overcome early self-doubt through perseverance.',
  },
  presentCard: {
    name: 'Wheel of Fortune (Kala Chakra)',
    sanskritArchetype: 'Shubh Dasha Parivartan',
    meaning: 'A major karmic turning point is underway right now—new doors in career and relationships are opening.',
  },
  futureCard: {
    name: 'The Sun (Surya)',
    sanskritArchetype: 'Aditya Rajyoga',
    meaning: 'Radiant success, clarity, financial abundance, and joyful recognition await you in the coming months.',
  },
  overallGuidance:
    'Trust the timing of your life. Step forward boldly with new initiatives during this favorable planetary transit.',
  luckyAffirmation: 'ॐ आदित्याय नमः — I align with divine abundance and clarity.',
};

const INITIAL_VASTU_RESULT: VastuAnalysisResult = {
  vastuScore: 87,
  directionalEnergy: 'North-East (Ishanya Kon) & East Pranic Flow',
  doshaDetected: 'Minor clutter or heavy storage in the North-East / Center Brahmasthan zone.',
  simpleCorrections: [
    'Keep a copper or glass bowl with clean water and fresh flower petals in the North-East corner.',
    'Place a small sea-salt bowl in washrooms to absorb negative Vastu vibrations.',
    'Light a cow-ghee lamp or camphor near the main entrance every evening at sunset.',
  ],
  auspiciousPlacement: 'Face East or North while working or studying for maximum Mercury-Jupiter focus.',
};

export const MoreServicesHub: React.FC<MoreServicesHubProps> = ({
  initialTool = 'hub',
  appTheme,
  appLanguage,
  onNavigateTab,
}) => {
  const isLight = appTheme === 'divya-light' || appTheme === 'saffron';
  const [activeTool, setActiveTool] = useState<'hub' | 'face' | 'dream' | 'tarot' | 'vastu'>(
    initialTool
  );
  const [isLoading, setIsLoading] = useState(false);

  // 1. Face Reading State
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [faceResult, setFaceResult] = useState<FaceReadingResult>(INITIAL_FACE_RESULT);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 2. Dream Analysis State
  const [dreamText, setDreamText] = useState('');
  const [dreamTime, setDreamTime] = useState('Brahma Muhurta (3:30 AM – 6:00 AM)');
  const [dreamResult, setDreamResult] = useState<DreamAnalysisResult>(INITIAL_DREAM_RESULT);

  // 3. Tarot Reading State
  const [tarotQuestion, setTarotQuestion] = useState('');
  const [pickedCards, setPickedCards] = useState<string[]>([
    'The Magician (Siddhi)',
    'Wheel of Fortune (Kala Chakra)',
    'The Sun (Surya)',
  ]);
  const [tarotResult, setTarotResult] = useState<TarotCardReading>(INITIAL_TAROT_RESULT);

  // 4. Vastu Shastra State
  const [vastuRoom, setVastuRoom] = useState('Main Entrance (Mukhya Dwar)');
  const [vastuDirection, setVastuDirection] = useState('North-East (Ishanya)');
  const [vastuConcern, setVastuConcern] = useState('');
  const [vastuResult, setVastuResult] = useState<VastuAnalysisResult>(INITIAL_VASTU_RESULT);

  // Camera handlers for Face Reading
  const startFaceCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setIsCameraOpen(false);
    }
  };

  const stopFaceCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((tr) => tr.stop());
    }
    setIsCameraOpen(false);
  };

  const captureFacePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopFaceCamera();
    setFacePreview(dataUrl);
    const base64 = dataUrl.split(',')[1];
    setIsLoading(true);
    try {
      const res = await analyzeFaceImageAI(base64, 'image/jpeg', appLanguage.nativeName);
      setFaceResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setFacePreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setIsLoading(true);
      try {
        const res = await analyzeFaceImageAI(
          base64,
          file.type || 'image/jpeg',
          appLanguage.nativeName
        );
        setFaceResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamText.trim()) return;
    setIsLoading(true);
    try {
      const res = await analyzeDreamSwapnaAI(dreamText, dreamTime, appLanguage.nativeName);
      setDreamResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffleAndDrawTarot = async () => {
    const shuffled = [...TAROT_MAJOR_ARCANA].sort(() => Math.random() - 0.5).slice(0, 3);
    setPickedCards(shuffled);
    setIsLoading(true);
    try {
      const res = await generateTarotSpreadAI(tarotQuestion, shuffled, appLanguage.nativeName);
      setTarotResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunVastu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await analyzeVastuShastraAI(
        vastuRoom,
        vastuDirection,
        vastuConcern,
        appLanguage.nativeName
      );
      setVastuResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-full p-4 space-y-5 transition-colors ${
        isLight ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-white'
      }`}
    >
      {/* Top Tool Selector Pills (No Horizontal Scrollbar) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'hub', label: 'All Services', icon: Sparkles },
          { id: 'face', label: 'Face Reading', icon: ScanFace },
          { id: 'dream', label: 'Dream Analysis', icon: Moon },
          { id: 'tarot', label: 'Tarot Reading', icon: Layers },
          { id: 'vastu', label: 'Vastu Shastra', icon: Home },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTool(tab.id as typeof activeTool)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border shrink-0 transition ${
                active
                  ? 'bg-[#F5C33B] border-[#F5C33B] text-[#14111C] shadow-xs'
                  : isLight
                  ? 'bg-white border-gray-200 text-gray-700'
                  : 'bg-[#17141F] border-white/10 text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          1. ALL SERVICES HUB VIEW
         ===================================================================== */}
      {activeTool === 'hub' && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isLight
                ? 'bg-gradient-to-br from-purple-100 to-amber-50 border-purple-200'
                : 'bg-gradient-to-br from-[#28183B] to-[#171224] border-purple-500/30'
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A855F7] font-bold">
              Sacred AI Divination Suite
            </span>
            <h2 className="font-bold text-xl mt-0.5">
              Explore All Vedic &amp; Mystic Services
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              Face Reading, Swapna Dream Interpretation, 3-Card Tarot, Numerology, Palmistry &amp; Vastu
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: 'AI Face Reading',
                sub: 'Mukha Samudrika Scan',
                desc: 'Analyze forehead, eyes, nose & aura via camera or photo.',
                icon: ScanFace,
                color: 'bg-rose-500/20 text-rose-400',
                onClick: () => setActiveTool('face'),
              },
              {
                title: 'Dream Analysis',
                sub: 'Vedic Swapna Shastra',
                desc: 'Decode spiritual meaning & future signals of your dreams.',
                icon: Moon,
                color: 'bg-indigo-500/20 text-indigo-400',
                onClick: () => setActiveTool('dream'),
              },
              {
                title: 'Tarot Reading',
                sub: '3-Card Past/Present/Future',
                desc: 'Draw sacred cards for love, career, and karmic guidance.',
                icon: Layers,
                color: 'bg-purple-500/20 text-purple-400',
                onClick: () => setActiveTool('tarot'),
              },
              {
                title: 'Vedic Numerology',
                sub: 'Mulank, Bhagyank & Lo Shu',
                desc: '3×3 Lo Shu Grid, Chaldean name correction & lucky dates.',
                icon: Hash,
                color: 'bg-amber-500/20 text-amber-400',
                onClick: () => onNavigateTab(ActiveTab.NUMEROLOGY),
              },
              {
                title: 'AI Palm Reading',
                sub: 'Hastrekha Camera Scan',
                desc: 'Read Life, Heart, Head & Fate lines with gemstone advice.',
                icon: Hand,
                color: 'bg-emerald-500/20 text-emerald-400',
                onClick: () => onNavigateTab(ActiveTab.PALMISTRY),
              },
              {
                title: 'Vastu Shastra',
                sub: 'Directional Energy Check',
                desc: 'Non-demolition Vastu remedies for home & workplace.',
                icon: Home,
                color: 'bg-blue-500/20 text-blue-400',
                onClick: () => setActiveTool('vastu'),
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={card.onClick}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isLight
                      ? 'bg-white border-gray-200 hover:border-purple-400 shadow-2xs'
                      : 'bg-[#17141F] border-white/10 hover:border-[#A855F7]/50'
                  }`}
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm">{card.title}</h3>
                    <span className="text-[10px] font-semibold text-[#A855F7] block">
                      {card.sub}
                    </span>
                    <p
                      className={`text-[11px] mt-1.5 leading-relaxed ${
                        isLight ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-[#F5C33B] inline-block">
                    Open Tool →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          2. AI FACE READING (MUKHA SAMUDRIKA SHASTRA)
         ===================================================================== */}
      {activeTool === 'face' && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">
              Mukha Samudrika Shastra • Gemini Vision AI
            </span>
            <h3 className="font-bold text-lg mt-0.5">AI Face Reading &amp; Aura Scan</h3>
            <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Upload a portrait photo or use your selfie camera to analyze your Forehead (Lalat), Eyes (Netra), Nose (Nasika), and Tejas Aura.
            </p>

            <div className="mt-4 relative aspect-square max-w-[280px] mx-auto rounded-2xl bg-black/40 border-2 border-dashed border-[#F5C33B]/50 overflow-hidden flex items-center justify-center">
              {isCameraOpen ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 inset-x-3 flex gap-2">
                    <button
                      type="button"
                      onClick={captureFacePhoto}
                      className="flex-1 py-2 rounded-xl bg-[#F5C33B] text-[#14111C] font-bold text-xs"
                    >
                      Capture &amp; Read Face
                    </button>
                    <button
                      type="button"
                      onClick={stopFaceCamera}
                      className="px-3 py-2 rounded-xl bg-black/70 text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : facePreview ? (
                <img
                  src={facePreview}
                  alt="Face Scan"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <ScanFace className="w-16 h-16 text-[#F5C33B] mx-auto mb-2 opacity-80" />
                  <p className="text-xs text-gray-300">
                    Align your face in good lighting
                  </p>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-8 h-8 text-[#F5C33B] animate-spin mb-2" />
                  <span className="text-xs font-bold text-white">
                    Scanning Mukha Samudrika Features...
                  </span>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <label className="cursor-pointer py-2.5 px-3 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-xs flex items-center justify-center gap-1.5 text-center">
                <Upload className="w-4 h-4" />
                <span>Upload Face Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaceUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={startFaceCamera}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 ${
                  isLight
                    ? 'border-gray-300 text-gray-800'
                    : 'border-white/15 bg-[#211D2D] text-[#F5C33B]'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Selfie Camera</span>
              </button>
            </div>
          </div>

          {/* Face Reading Results */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-[#F5C33B] font-bold">
                Mukha Tattva Classification
              </span>
              <h4 className="font-bold text-base mt-0.5">{faceResult.faceShapeElement}</h4>
              <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                {faceResult.auraAndPersonality}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Forehead (ललाट / Jupiter)', data: faceResult.foreheadLalat },
                { label: 'Eyes (नेत्र / Sun-Moon)', data: faceResult.eyesNetra },
                { label: 'Nose (नासिका / Wealth Bridge)', data: faceResult.noseNasika },
                { label: 'Lips & Speech (अधर / Mercury)', data: faceResult.lipsAdhara },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3.5 rounded-xl ${
                    isLight ? 'bg-gray-100' : 'bg-[#211D2D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#A855F7]">{item.label}</span>
                    <span className="font-mono text-xs font-bold">{item.data.score}/100</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{item.data.insight}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#FDFBF7] text-[#2A1810] border border-[#C89B3C] text-xs">
              <strong className="text-[#9E2A2B] block mb-1">
                🔥 Mukha Tejas Vedic Remedy:
              </strong>
              {faceResult.sacredRemedy}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. DREAM ANALYSIS (SWAPNA SHASTRA)
         ===================================================================== */}
      {activeTool === 'dream' && (
        <div className="space-y-4">
          <form
            onSubmit={handleRunDream}
            className={`p-5 rounded-2xl border space-y-3.5 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">
                Vedic Swapna Shastra • Agni Purana Tradition
              </span>
              <h3 className="font-bold text-lg mt-0.5">AI Dream Interpretation</h3>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Describe what you saw in your dream
              </label>
              <textarea
                rows={3}
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="e.g. I saw a white snake near a temple, or flying over clear water..."
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                  isLight
                    ? 'bg-gray-50 border-gray-300 text-gray-900'
                    : 'bg-[#0F0D15] border-white/15 text-white'
                }`}
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Approximate Time of Dream (Swapna Prahar)
              </label>
              <select
                value={dreamTime}
                onChange={(e) => setDreamTime(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium ${
                  isLight
                    ? 'bg-gray-50 border-gray-300 text-gray-900'
                    : 'bg-[#0F0D15] border-white/15 text-white'
                }`}
              >
                <option>Brahma Muhurta (3:30 AM – 6:00 AM — Manifests in 10 days)</option>
                <option>Midnight to 3:00 AM (Manifests in 1-3 months)</option>
                <option>Early Night (Before 12:00 AM — Subconscious thoughts)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4" />
              <span>
                {isLoading ? 'Decoding Swapna Sanket...' : 'Decode Dream Meaning'}
              </span>
            </button>
          </form>

          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-[#A855F7] font-mono text-[10px] font-bold">
                {dreamResult.swapnaShastraCategory}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                Auspiciousness: {dreamResult.auspiciousIndex}%
              </span>
            </div>
            <h4 className="font-bold text-base">{dreamResult.dreamSymbolism}</h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              {dreamResult.spiritualMeaning}
            </p>
            <div
              className={`p-3.5 rounded-xl ${
                isLight ? 'bg-gray-100' : 'bg-[#211D2D]'
              } text-xs`}
            >
              <strong className="text-[#F5C33B] block mb-0.5">Near Future Indication:</strong>
              {dreamResult.nearFutureIndication}
            </div>
            <div className="p-3.5 rounded-xl bg-[#FDFBF7] text-[#2A1810] border border-[#C89B3C] text-xs">
              <strong className="text-[#9E2A2B] block mb-0.5">Morning Swapna Upay:</strong>
              {dreamResult.morningUpay}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. 3-CARD TAROT READING (PAST / PRESENT / FUTURE)
         ===================================================================== */}
      {activeTool === 'tarot' && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border space-y-3.5 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">
              Sacred 3-Card Tarot &amp; Nakshatra Spread
            </span>
            <h3 className="font-bold text-lg">Past • Present • Future Tarot</h3>

            <input
              type="text"
              value={tarotQuestion}
              onChange={(e) => setTarotQuestion(e.target.value)}
              placeholder="Focus on a question (Love, Career, 2025 Decision)..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                isLight
                  ? 'bg-gray-50 border-gray-300 text-gray-900'
                  : 'bg-[#0F0D15] border-white/15 text-white'
              }`}
            />

            <button
              type="button"
              disabled={isLoading}
              onClick={handleShuffleAndDrawTarot}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isLoading ? 'Drawing Sacred Cards...' : 'Shuffle Deck & Draw 3 Cards'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { pos: 'PAST (भूतकाल)', card: tarotResult.pastCard },
              { pos: 'PRESENT (वर्तमान)', card: tarotResult.presentCard },
              { pos: 'FUTURE (भविष्य)', card: tarotResult.futureCard },
            ].map((slot) => (
              <div
                key={slot.pos}
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#F5C33B] font-bold">
                    {slot.pos}
                  </span>
                  <span className="text-[10px] font-mono text-[#A855F7]">
                    {slot.card.sanskritArchetype}
                  </span>
                </div>
                <h4 className="font-bold text-sm">{slot.card.name}</h4>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}
                >
                  {slot.card.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VEDIC VASTU SHASTRA ADVISOR
         ===================================================================== */}
      {activeTool === 'vastu' && (
        <div className="space-y-4">
          <form
            onSubmit={handleRunVastu}
            className={`p-5 rounded-2xl border space-y-3.5 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">
              Vishwakarma Prakash • Vastu Purusha Mandala
            </span>
            <h3 className="font-bold text-lg">AI Vastu Shastra Check</h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Area / Room</label>
                <select
                  value={vastuRoom}
                  onChange={(e) => setVastuRoom(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                >
                  <option>Main Entrance (Mukhya Dwar)</option>
                  <option>Master Bedroom</option>
                  <option>Kitchen (Agneya)</option>
                  <option>Pooja Mandir</option>
                  <option>Office / Study Desk</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Direction</label>
                <select
                  value={vastuDirection}
                  onChange={(e) => setVastuDirection(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${
                    isLight
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-[#0F0D15] border-white/15 text-white'
                  }`}
                >
                  <option>North-East (Ishanya)</option>
                  <option>East (Purva)</option>
                  <option>North (Kubera)</option>
                  <option>South-East (Agneya)</option>
                  <option>South-West (Nairutya)</option>
                  <option>West (Varuna)</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              value={vastuConcern}
              onChange={(e) => setVastuConcern(e.target.value)}
              placeholder="Any specific concern (financial block, sleep, harmony)..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                isLight
                  ? 'bg-gray-50 border-gray-300 text-gray-900'
                  : 'bg-[#0F0D15] border-white/15 text-white'
              }`}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#F5C33B] text-[#14111C] font-extrabold text-xs flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>{isLoading ? 'Evaluating Vastu...' : 'Analyze Vastu & Remedies'}</span>
            </button>
          </form>

          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">{vastuResult.directionalEnergy}</h4>
              <span className="font-mono text-sm font-extrabold text-emerald-400">
                Vastu Score: {vastuResult.vastuScore}/100
              </span>
            </div>
            <p className="text-xs text-amber-400">{vastuResult.doshaDetected}</p>
            <ul className="space-y-1.5 text-xs">
              {vastuResult.simpleCorrections.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
