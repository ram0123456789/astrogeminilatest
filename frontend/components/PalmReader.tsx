import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Hand, Gem, Flame } from 'lucide-react';
import { IndianLanguageOption, PalmReadingResult } from '../types';
import { getTranslation } from '../i18n';
import { analyzePalmImageAI } from '../services/geminiService';

interface PalmReaderProps {
  appLanguage: IndianLanguageOption;
}

const SAMPLE_PALM_RESULT: PalmReadingResult = {
  handDominance: 'Right Hand (Active Karmic Hand)',
  elementalHandType: 'अग्नि-वायु तत्व (Agni-Vayu Tattva)',
  lifeLine: {
    title: 'जीवन रेखा (Life Line)',
    score: 92,
    observation: 'शुक्र पर्वत को घेरती हुई गहरी और स्पष्ट जीवन रेखा।',
    prediction: 'उत्तम दीर्घायु, रोग प्रतिरोधक क्षमता और परिवार का प्रबल सहयोग।',
  },
  heartLine: {
    title: 'हृदय रेखा (Heart Line)',
    score: 88,
    observation: 'गुरु पर्वत की ओर उठती हुई स्पष्ट हृदय रेखा।',
    prediction: 'सच्चा और निष्ठावान प्रेम, आध्यात्मिक और समझदार जीवनसाथी।',
  },
  headLine: {
    title: 'मस्तिष्क रेखा (Head Line)',
    score: 94,
    observation: 'चंद्र पर्वत की ओर हल्की झुकी हुई संतुलित मस्तिष्क रेखा।',
    prediction: 'तीव्र बौद्धिक क्षमता, रचनात्मक कल्पना और कुशल वित्तीय निर्णय।',
  },
  fateLine: {
    title: 'भाग्य रेखा (Saturn Fate Line)',
    score: 86,
    observation: 'हथेली के मध्य से शनि पर्वत तक जाने वाली स्पष्ट भाग्य रेखा।',
    prediction: 'स्व-परिश्रम से 27 वर्ष की आयु के बाद विशेष धन और पदोन्नति।',
  },
  mountsSummary:
    'उभरा हुआ गुरु पर्वत (Mount of Jupiter) समाज में मान-सम्मान, नेतृत्व और आध्यात्मिक झुकाव दर्शाता है। सूर्य पर्वत की शुभ स्थिति से प्रतिष्ठा प्राप्त होती है।',
  luckyGemstone: 'पीला पुखराज (Yellow Sapphire) सोने की अंगूठी में तर्जनी उंगली में धारण करें',
  sacredRemedy:
    'प्रातः उठकर दोनों हथेलियों को देखकर "कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती" मंत्र का जाप करें।',
};

export const PalmReader: React.FC<PalmReaderProps> = ({ appLanguage }) => {
  const t = getTranslation(appLanguage.code);
  const [selectedHand, setSelectedHand] = useState(t.rightHand);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PalmReadingResult>(SAMPLE_PALM_RESULT);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((tTrack) => tTrack.stop());
    }
    setIsCameraOpen(false);
  };

  const captureFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    setPreviewUrl(dataUrl);
    const base64 = dataUrl.split(',')[1];
    await runPalmAnalysis(base64, 'image/jpeg');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      const base64 = dataUrl.split(',')[1];
      await runPalmAnalysis(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const runPalmAnalysis = async (base64: string, mimeType: string) => {
    setIsScanning(true);
    try {
      const reading = await analyzePalmImageAI(
        base64,
        mimeType,
        selectedHand,
        appLanguage.nativeName
      );
      setResult(reading);
    } catch (err) {
      console.error('Palm analysis error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 space-y-5">
        <div className="p-5 rounded-3xl bg-cosmic-800/90 border border-gold-400/30 shadow-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Samudrika Shastra • Gemini Vision AI
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
            {t.palmTitle}
          </h2>
          <p className="text-xs text-[#C4B5A6] mt-1">{t.palmSubtitle}</p>

          <div className="mt-4 flex gap-2">
            {[t.rightHand, t.leftHand].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHand(h)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  selectedHand === h
                    ? 'bg-saffron-500/20 border-gold-400 text-gold-300'
                    : 'bg-cosmic-900 border-white/10 text-[#C4B5A6]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="mt-4 relative aspect-square rounded-2xl bg-cosmic-950 border-2 border-dashed border-gold-400/40 overflow-hidden flex flex-col items-center justify-center">
            {isCameraOpen ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 inset-x-4 flex gap-2">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="flex-1 py-2.5 rounded-xl bg-saffron-500 text-white font-semibold text-xs shadow-lg"
                  >
                    Capture &amp; Scan ({appLanguage.name})
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl bg-black/70 text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Uploaded Palm"
                  className="w-full h-full object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-cosmic-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                    <Sparkles className="w-10 h-10 text-gold-400 animate-spin mb-3" />
                    <p className="font-display font-bold text-white text-base">
                      {t.calculatingBtn} ({appLanguage.nativeName})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center flex flex-col items-center">
                <svg viewBox="0 0 240 260" className="w-44 h-44 text-gold-400/80 mb-2">
                  <path
                    d="M70,235 C45,210 38,165 44,125 L48,75 C49,64 62,64 63,75 L65,112 M65,112 L72,45 C73,33 88,33 89,45 L91,105 M91,105 L102,32 C104,20 120,20 121,32 L121,103 M121,103 L135,45 C137,34 152,35 150,47 L145,115 M145,115 L168,85 C176,76 189,85 182,96 L158,155 C148,195 135,225 110,235 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path d="M148,132 Q105,130 72,112" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeDasharray="4 2" />
                  <path d="M65,138 Q108,142 140,162" fill="none" stroke="#E5B84B" strokeWidth="2.5" />
                  <path d="M65,138 Q95,168 92,215" fill="none" stroke="#34D399" strokeWidth="2.5" />
                  <path d="M112,212 L114,122" fill="none" stroke="#C084FC" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
                <p className="text-xs text-[#F4EFE6] font-medium">{t.palmSubtitle}</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="cursor-pointer py-3 px-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg text-center">
              <Upload className="w-4 h-4 shrink-0" />
              <span>{t.uploadPalmBtn}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={startCamera}
              className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-gold-400/40 text-gold-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>{t.openCameraBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-5">
        <div className="p-6 rounded-3xl bg-cosmic-800/90 border border-gold-400/30">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-gold-400 uppercase tracking-wider">
                {result.handDominance}
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                {result.elementalHandType}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5" /> {appLanguage.nativeName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {[
              { data: result.lifeLine, color: 'text-emerald-400', bar: 'bg-emerald-400' },
              { data: result.heartLine, color: 'text-saffron-400', bar: 'bg-saffron-400' },
              { data: result.headLine, color: 'text-gold-400', bar: 'bg-gold-400' },
              { data: result.fateLine, color: 'text-purple-400', bar: 'bg-purple-400' },
            ].map(({ data, color, bar }) => (
              <div
                key={data.title}
                className="p-4 rounded-2xl bg-cosmic-900/90 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-display font-bold text-sm ${color}`}>{data.title}</h4>
                    <span className="font-mono text-xs font-bold text-white">
                      {data.score}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${bar}`}
                      style={{ width: `${Math.min(100, Math.max(20, data.score))}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/90 font-medium mb-1.5">{data.observation}</p>
                  <p className="text-xs text-[#C4B5A6] leading-relaxed">{data.prediction}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-display font-bold text-sm text-gold-300 mb-1">
              {t.mountsTitle}
            </h4>
            <p className="text-xs text-[#F4EFE6] leading-relaxed">{result.mountsSummary}</p>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gold-400/10 border border-gold-400/30">
              <div className="flex items-center gap-2 text-gold-300 font-display font-bold text-xs uppercase">
                <Gem className="w-4 h-4" />
                <span>{t.luckyGemstoneTitle}</span>
              </div>
              <p className="text-xs text-white mt-1.5 font-medium">{result.luckyGemstone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-saffron-500/10 border border-saffron-500/30">
              <div className="flex items-center gap-2 text-saffron-400 font-display font-bold text-xs uppercase">
                <Flame className="w-4 h-4" />
                <span>{t.remediesTitle}</span>
              </div>
              <p className="text-xs text-white mt-1.5">{result.sacredRemedy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
