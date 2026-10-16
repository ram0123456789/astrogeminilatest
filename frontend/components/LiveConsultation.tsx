import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  PhoneCall,
  PhoneOff,
  Sparkles,
  Mic,
  MicOff,
  ArrowLeft,
  Flame,
  Radio,
  Zap,
  Globe,
  Search,
  MessageCircle,
  CheckCircle2,
  History,
  Clock,
  Trash2,
  Camera,
  UserPlus,
  Users,
  Hand,
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import {
  AppTheme,
  Astrologer,
  ChatMessage,
  ChatSessionRecord,
  GeoLocation,
  KundliData,
  DakshinaReceipt,
  IndianLanguageOption,
} from '../types';
import { INDIAN_LANGUAGES } from '../constants';
import { getTranslation } from '../i18n';
import { sendAstrologerMessage } from '../services/geminiService';
import { computeRealVedicKundli, POPULAR_CITIES } from '../services/vedicAstrologyEngine';
import { DakshinaModal } from './DakshinaModal';
import { CityAutocomplete } from './CityAutocomplete';

interface LiveConsultationProps {
  astrologer: Astrologer;
  onSelectAstrologer: (a: Astrologer) => void;
  allAstrologers: Astrologer[];
  savedKundli: KundliData | null;
  allSavedKundlis: KundliData[];
  onSelectActiveKundli: (k: KundliData) => void;
  onSaveNewOtherKundli: (k: KundliData) => void;
  onSaveReceipt: (r: DakshinaReceipt) => void;
  onBack?: () => void;
  autoStartVoice?: boolean;
  appTheme?: AppTheme;
  selectedLang: IndianLanguageOption;
  onSelectLang: (lang: IndianLanguageOption) => void;
  initialViewMode?: 'directory' | 'chat' | 'history';
  chatHistories: Record<string, ChatSessionRecord>;
  onUpdateChatHistory: (astrologer: Astrologer, messages: ChatMessage[]) => void;
  onClearChatHistory?: (astrologerId: string) => void;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCMData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const LiveConsultation: React.FC<LiveConsultationProps> = ({
  astrologer,
  onSelectAstrologer,
  allAstrologers,
  savedKundli,
  allSavedKundlis,
  onSelectActiveKundli,
  onSaveNewOtherKundli,
  onSaveReceipt,
  autoStartVoice = false,
  appTheme = 'divya-dark',
  selectedLang,
  onSelectLang,
  initialViewMode = 'directory',
  chatHistories,
  onUpdateChatHistory,
  onClearChatHistory,
}) => {
  const isLight = appTheme === 'divya-light' || appTheme === 'saffron';
  const t = getTranslation(selectedLang.code);

  const [viewMode, setViewMode] = useState<'directory' | 'chat' | 'history'>(
    autoStartVoice ? 'chat' : initialViewMode
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDakshinaModal, setShowDakshinaModal] = useState(false);

  // Quick "Ask About Someone Else" drawer inside Chat
  const [showOtherPersonDrawer, setShowOtherPersonDrawer] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [otherRelation, setOtherRelation] = useState('Partner / Family');
  const [otherDob, setOtherDob] = useState('1998-06-15');
  const [otherTob, setOtherTob] = useState('11:20');
  const [otherLoc, setOtherLoc] = useState<GeoLocation>(POPULAR_CITIES[1]);

  // Palm / Image attachment state for Palmist & Astrologer chat
  const [hasUploadedPalmInChat, setHasUploadedPalmInChat] = useState(false);
  const palmInputRef = useRef<HTMLInputElement>(null);

  // Real-time Full-Duplex Voice Call State (with Barge-in Interruption Management)
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [voiceState, setVoiceState] = useState<
    'connecting' | 'ai-speaking' | 'user-speaking' | 'listening' | 'interrupted'
  >('connecting');
  const [liveAiTranscript, setLiveAiTranscript] = useState<string>('');
  const [liveUserTranscript, setLiveUserTranscript] = useState<string>('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [bargeInCount, setBargeInCount] = useState(0);

  const isMicMutedRef = useRef(false);
  const liveSessionRef = useRef<{ close: () => void; sendRealtimeInput: (data: unknown) => void } | null>(null);
  const audioCtxRef = useRef<{
    input?: AudioContext;
    output?: AudioContext;
    stream?: MediaStream;
    sources?: Set<AudioBufferSourceNode>;
    nextStartTime?: number;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  // Build specialty-specific opening message so each Jyotish asks relevant questions for their field!
  const getSpecialtyOpeningMessage = (): ChatMessage[] => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isHindiLike = ['hi', 'mr', 'gu', 'bn', 'pa', 'or', 'sa'].includes(selectedLang.code);
    const baseGreeting = isHindiLike
      ? astrologer.specialtyOpeningHi
      : astrologer.specialtyOpeningEn;

    const chartTag = savedKundli
      ? `\n\n📜 [Active Profile: ${savedKundli.name} (${savedKundli.relationLabel || 'Self'}) • ${savedKundli.lagnaSign} Lagna • ${savedKundli.moonSign} Rashi]`
      : '';

    return [
      {
        id: `welcome-${astrologer.id}-${selectedLang.code}`,
        sender: 'astrologer',
        text: `${baseGreeting}${chartTag}`,
        timestamp: nowTime,
      },
    ];
  };

  // Start clean at the beginning with the astrologer's specialty greeting (or load saved session)
  useEffect(() => {
    const existing = chatHistories[astrologer.id];
    if (existing && existing.messages.length > 0) {
      setMessages(existing.messages);
      setHasUploadedPalmInChat(existing.messages.some((m) => Boolean(m.imageUrl)));
    } else {
      setMessages(getSpecialtyOpeningMessage());
      setHasUploadedPalmInChat(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [astrologer.id, selectedLang.code]);

  const handleResetCurrentChat = () => {
    const fresh = getSpecialtyOpeningMessage();
    setMessages(fresh);
    setHasUploadedPalmInChat(false);
    onClearChatHistory?.(astrologer.id);
  };

  // Handle adding another person's birth details directly inside chat
  const handleAddOtherPersonInChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherName.trim()) return;
    const computed = computeRealVedicKundli(otherName.trim(), otherDob, otherTob, otherLoc);
    const newProfile: KundliData = {
      ...computed,
      id: `kundli-other-${Date.now()}`,
      isPrimaryUser: false,
      relationLabel: otherRelation,
      aiSummary: `Born under ${computed.lagnaSign} Lagna and ${computed.moonSign} Rashi (${computed.nakshatra}).`,
      careerPrediction: `Active ${computed.mahadasha} supports steady progress.`,
      relationshipPrediction: `Harmonious planetary alignment.`,
      healthPrediction: `Balanced vitality.`,
      remedies: ['Chant Gayatri Mantra daily.'],
    };

    onSaveNewOtherKundli(newProfile);
    onSelectActiveKundli(newProfile);
    setShowOtherPersonDrawer(false);

    // Automatically inform the astrologer in chat about the newly selected person
    handleSend(
      `मैंने ${newProfile.name} (${otherRelation}) की कुंडली चुनी है — जन्म: ${otherDob}, समय: ${otherTob}, स्थान: ${newProfile.place}। कृपया इनकी कुंडली (${newProfile.lagnaSign} लग्न, ${newProfile.moonSign} राशि) के अनुसार मार्गदर्शन करें।`
    );
  };

  // Handle Palm / Face Image Upload directly inside Chat (Especially for Palmist Guruji Siddharth)
  const handleChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setHasUploadedPalmInChat(true);

      const userMsg: ChatMessage = {
        id: `u-img-${Date.now()}`,
        sender: 'user',
        text:
          astrologer.category === 'Palmistry'
            ? '🤚 यह मेरी हथेली (Palm) की फोटो है। कृपया मेरी जीवन रेखा, भाग्य रेखा, हृदय रेखा और ग्रह पर्वतों का विश्लेषण करें।'
            : '📷 कृपया इस फोटो का सामुद्रिक/ज्योतिषीय विश्लेषण करें।',
        imageUrl: dataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedWithUser = [...messages, userMsg];
      setMessages(updatedWithUser);
      onUpdateChatHistory(astrologer, updatedWithUser);
      setIsTyping(true);

      const result = await sendAstrologerMessage(
        astrologer,
        updatedWithUser,
        userMsg.text,
        savedKundli,
        selectedLang.nativeName,
        { base64, mimeType: file.type || 'image/jpeg' }
      );

      const botMsg: ChatMessage = {
        id: `a-img-${Date.now()}`,
        sender: 'astrologer',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        remedyCard: result.remedyCard,
      };

      const finalMessages = [...updatedWithUser, botMsg];
      setMessages(finalMessages);
      onUpdateChatHistory(astrologer, finalMessages);
      setIsTyping(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (autoStartVoice) {
      setViewMode('chat');
      if (!isVoiceCallActive) {
        startVoiceCall();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartVoice]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, viewMode]);

  useEffect(() => {
    return () => {
      stopVoiceCall();
    };
  }, []);

  const flushAiAudioPlayback = () => {
    const sources = audioCtxRef.current.sources;
    if (sources && sources.size > 0) {
      for (const src of sources.values()) {
        try {
          src.stop();
        } catch {
          // already stopped
        }
        sources.delete(src);
      }
      audioCtxRef.current.nextStartTime = 0;
      setVoiceState('interrupted');
      setBargeInCount((c) => c + 1);
    }
  };

  const startVoiceCall = async () => {
    try {
      setIsVoiceCallActive(true);
      setVoiceState('connecting');
      setLiveAiTranscript(`Connecting call in ${selectedLang.nativeName}...`);
      setLiveUserTranscript('');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      const sources = new Set<AudioBufferSourceNode>();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioCtxRef.current = {
        input: inputAudioContext,
        output: outputAudioContext,
        stream,
        sources,
        nextStartTime: 0,
      };

      const kundliNote = savedKundli
        ? `User's Real Sidereal Kundli: Name ${savedKundli.name}, Place ${savedKundli.place}, Lagna ${savedKundli.lagnaSign}, Rashi ${savedKundli.moonSign}, Nakshatra ${savedKundli.nakshatra}, Dasha ${savedKundli.mahadasha}.`
        : '';

      let currentInputText = '';
      let currentOutputText = '';

      const sessionPromise = ai.live.connect({
        model: 'gemini-live-2.5-flash-native-audio',
        callbacks: {
          onopen: () => {
            setVoiceState('listening');
            setLiveAiTranscript(astrologer.specialtyOpeningHi);

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(2048, 1, 1);

            let consecutiveSpeechFrames = 0;

            scriptProcessor.onaudioprocess = (event) => {
              if (isMicMutedRef.current) return;
              const inputData = event.inputBuffer.getChannelData(0);

              let sumSquares = 0;
              for (let i = 0; i < inputData.length; i++) {
                sumSquares += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sumSquares / inputData.length);

              if (rms > 0.045) {
                consecutiveSpeechFrames++;
                if (consecutiveSpeechFrames >= 2) {
                  if (audioCtxRef.current.sources && audioCtxRef.current.sources.size > 0) {
                    flushAiAudioPlayback();
                  } else {
                    setVoiceState('user-speaking');
                  }
                }
              } else {
                consecutiveSpeechFrames = 0;
              }

              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: GenAIBlob = {
                data: encodeBase64(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const txt = message.serverContent.outputTranscription.text;
              currentOutputText += txt;
              setLiveAiTranscript(currentOutputText);
            } else if (message.serverContent?.inputTranscription) {
              const txt = message.serverContent.inputTranscription.text;
              currentInputText += txt;
              setLiveUserTranscript(currentInputText);
            }

            if (message.serverContent?.turnComplete) {
              setMessages((prev) => {
                const next = [...prev];
                if (currentInputText.trim()) {
                  next.push({
                    id: `vu-${Date.now()}`,
                    sender: 'user',
                    text: `🎙️ ${currentInputText.trim()}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  });
                }
                if (currentOutputText.trim()) {
                  next.push({
                    id: `va-${Date.now() + 1}`,
                    sender: 'astrologer',
                    text: currentOutputText.trim(),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  });
                }
                onUpdateChatHistory(astrologer, next);
                return next;
              });
              currentInputText = '';
              currentOutputText = '';
              setVoiceState('listening');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setVoiceState('ai-speaking');
              const currentNext = audioCtxRef.current.nextStartTime || 0;
              const startAt = Math.max(currentNext, outputAudioContext.currentTime);
              const audioBuffer = await decodePCMData(
                decodeBase64(base64Audio),
                outputAudioContext,
                24000,
                1
              );
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => {
                sources.delete(source);
                if (sources.size === 0) {
                  setVoiceState('listening');
                }
              });
              source.start(startAt);
              audioCtxRef.current.nextStartTime = startAt + audioBuffer.duration;
              sources.add(source);
            }

            if (message.serverContent?.interrupted) {
              flushAiAudioPlayback();
              currentOutputText = '';
            }
          },
          onerror: () => {
            setLiveAiTranscript('Voice connection paused — tap Call to reconnect or chat below.');
          },
          onclose: () => {
            setIsVoiceCallActive(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: astrologer.voiceName },
            },
          },
          systemInstruction: `${astrologer.voiceSystemPrompt}
CRITICAL LANGUAGE REQUIREMENT: Speak and respond fluently in **${selectedLang.nativeName}** (${selectedLang.name}). Keep turns super short (1-2 sentences) and handle interruptions with immediate empathy. ${kundliNote}`,
        },
      });

      sessionPromise.then((s) => {
        liveSessionRef.current = s;
      });
    } catch (err) {
      console.error('Voice Call Error:', err);
      setIsVoiceCallActive(false);
    }
  };

  const stopVoiceCall = () => {
    try {
      flushAiAudioPlayback();
      liveSessionRef.current?.close();
      audioCtxRef.current.stream?.getTracks().forEach((tr) => tr.stop());
      audioCtxRef.current.input?.close();
      audioCtxRef.current.output?.close();
    } catch {
      // ignore cleanup errors
    }
    setIsVoiceCallActive(false);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText ?? input).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    onUpdateChatHistory(astrologer, updatedWithUser);
    setInput('');
    setIsTyping(true);

    const result = await sendAstrologerMessage(
      astrologer,
      updatedWithUser,
      textToSend,
      savedKundli,
      selectedLang.nativeName
    );

    const botMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'astrologer',
      text: result.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remedyCard: result.remedyCard,
    };

    const finalMessages = [...updatedWithUser, botMsg];
    setMessages(finalMessages);
    onUpdateChatHistory(astrologer, finalMessages);
    setIsTyping(false);
  };

  const handleEndConsultation = () => {
    if (isVoiceCallActive) {
      stopVoiceCall();
    }
    setShowDakshinaModal(true);
  };

  const filteredAstrologers = allAstrologers.filter((a) => {
    const matchesCategory =
      activeCategory === 'All' ||
      a.category.toLowerCase() === activeCategory.toLowerCase() ||
      a.specialties.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));
    const matchesSearch =
      !searchQuery.trim() ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const savedSessionList = Object.values(chatHistories);

  // Use astrologer's specialty prompts first, followed by general language prompts
  const activeSuggestionChips =
    astrologer.specialtyPrompts && astrologer.specialtyPrompts.length > 0
      ? astrologer.specialtyPrompts
      : selectedLang.samplePrompts;

  /* ============================================================================
     VIEW 1: SCREENSHOT 1 — AVAILABLE ASTROLOGERS DIRECTORY & CHAT HISTORY TAB
     ============================================================================ */
  if (viewMode === 'directory' || viewMode === 'history') {
    return (
      <div
        className={`min-h-full p-4 space-y-4 transition-colors ${
          isLight ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border ${
              isLight
                ? 'bg-white border-gray-200 text-gray-800'
                : 'bg-[#181520] border-white/10 text-white'
            }`}
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search astrologers..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setViewMode((v) => (v === 'history' ? 'directory' : 'history'))
            }
            title="Chat History"
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition ${
              viewMode === 'history'
                ? 'bg-[#A855F7] border-[#A855F7] text-white'
                : isLight
                ? 'bg-white border-gray-200 text-gray-700'
                : 'bg-[#181520] border-white/10 text-gray-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({savedSessionList.length})</span>
          </button>
        </div>

        {viewMode === 'directory' && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1.5">
            {['All', 'Vedic', 'Numerology', 'Tarot', 'Palmistry'].map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition shrink-0 ${
                    active
                      ? 'bg-[#F5C33B] border-[#F5C33B] text-[#14111C] shadow-xs'
                      : isLight
                      ? 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      : 'bg-[#181520] border-white/10 text-gray-200 hover:border-white/25'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'history' ? (
          <div className="space-y-3 pb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Your Past Chat Sessions</h3>
              <button
                type="button"
                onClick={() => setViewMode('directory')}
                className="text-xs font-bold text-[#A855F7]"
              >
                ← All Astrologers
              </button>
            </div>

            {savedSessionList.length === 0 ? (
              <div
                className={`p-6 rounded-2xl border text-center ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#17141F] border-white/10'
                }`}
              >
                <History className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-bold">No Saved Chat History Yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Start a live chat with Sadhana, Payal Soni, Guruji Siddharth, or Guru ji Ashutosh and your conversation will be automatically saved here.
                </p>
              </div>
            ) : (
              savedSessionList.map((sess) => {
                const foundAstro =
                  allAstrologers.find((a) => a.id === sess.astrologerId) ||
                  allAstrologers[0];
                return (
                  <div
                    key={sess.id}
                    className={`w-full p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isLight
                        ? 'bg-white border-gray-200 hover:border-purple-400'
                        : 'bg-[#17141F] border-white/10 hover:border-[#A855F7]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAstrologer(foundAstro);
                        setViewMode('chat');
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    >
                      <img
                        src={sess.astrologerAvatar}
                        alt={sess.astrologerName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#F5C33B] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm truncate">
                            {sess.astrologerName}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {sess.updatedAt}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {sess.lastMessage}
                        </p>
                        <span className="text-[10px] font-bold text-[#A855F7] mt-1 inline-block">
                          {sess.messages.length} messages • Tap to resume chat →
                        </span>
                      </div>
                    </button>

                    {onClearChatHistory && (
                      <button
                        type="button"
                        onClick={() => onClearChatHistory(sess.astrologerId)}
                        title="Delete Chat Session"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pt-1">
              <h3
                className={`font-bold text-base ${
                  isLight ? 'text-[#1F1610]' : 'text-white'
                }`}
              >
                {t.liveAstrologers}
              </h3>
              <span className="text-xs font-bold text-[#10B981]">
                {filteredAstrologers.length} Online
              </span>
            </div>

            <div className="space-y-3.5 pb-6">
              {filteredAstrologers.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border transition ${
                    isLight
                      ? 'bg-white border-gray-200 shadow-xs'
                      : 'bg-[#17141F] border-white/10 shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-between shrink-0">
                      <div className="relative">
                        <img
                          src={a.avatar}
                          alt={a.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#F5C33B]"
                        />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className={`font-bold text-base truncate ${
                            isLight ? 'text-gray-900' : 'text-white'
                          }`}
                        >
                          {a.name}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      </div>

                      <p
                        className={`text-xs mt-0.5 ${
                          isLight ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {a.title}
                      </p>
                      <p
                        className={`text-xs ${
                          isLight ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {a.languages.join(', ')}
                      </p>
                      <p
                        className={`text-xs ${
                          isLight ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        Exp: {a.experienceYears} Years
                      </p>

                      <div className="flex items-center justify-between mt-2.5 mb-3">
                        <div className="flex items-center gap-1 text-sm font-bold">
                          <span className={isLight ? 'text-gray-900' : 'text-white'}>
                            {a.rating}
                          </span>
                          <span className="text-[#F5C33B]">★</span>
                        </div>

                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                            Free AI Seva
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ₹{a.pricePerMin}/min
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAstrologer(a);
                            setViewMode('chat');
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            isLight
                              ? 'border-amber-400 bg-amber-50/60 text-amber-800 hover:bg-amber-100'
                              : 'border-white/15 bg-[#1E1B29] text-[#F5C33B] hover:border-[#F5C33B]/50'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{t.chatBtn}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectAstrologer(a);
                            setViewMode('chat');
                            startVoiceCall();
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                            isLight
                              ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                              : 'border-white/15 bg-[#1E1B29] text-gray-300 hover:text-white'
                          }`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t.callBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  /* ============================================================================
     VIEW 2: ACTIVE CHAT ROOM SCREEN (WITH SPECIALTY INTAKE & MULTI-USER SWITCHER)
     ============================================================================ */
  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden transition-colors ${
        isLight ? 'bg-[#F8F9FA] text-[#1F1610]' : 'bg-[#0F0D15] text-white'
      }`}
    >
      {/* Top Chat Room Bar */}
      <div
        className={`px-3 py-2.5 border-b flex items-center justify-between gap-2 shrink-0 ${
          isLight
            ? 'bg-white border-gray-200 shadow-2xs'
            : 'bg-[#17141F] border-white/10'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (isVoiceCallActive) stopVoiceCall();
              setViewMode('directory');
            }}
            className={`p-1.5 rounded-full ${
              isLight ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-gray-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img
            src={astrologer.avatar}
            alt={astrologer.name}
            className="w-9 h-9 rounded-full object-cover border border-[#F5C33B] shrink-0"
          />

          <div className="min-w-0">
            <h3
              className={`font-bold text-xs sm:text-sm truncate leading-tight ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              {astrologer.name}
            </h3>
            <p className="text-[10px] text-[#A855F7] font-semibold truncate leading-tight">
              {astrologer.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleEndConsultation}
            className="px-3 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition"
          >
            END
          </button>

          <div
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs ${
              isLight
                ? 'bg-gray-50 border-gray-300 text-gray-800'
                : 'bg-[#1F1B2C] border-white/15 text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              aria-label="Chat Language"
              value={selectedLang.code}
              onChange={(e) => {
                const found = INDIAN_LANGUAGES.find((l) => l.code === e.target.value);
                if (found) onSelectLang(found);
              }}
              className="bg-transparent font-medium text-xs focus:outline-none pr-1"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-[#17141F] text-white"
                >
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={isVoiceCallActive ? stopVoiceCall : startVoiceCall}
            title="Live Voice Call"
            className={`p-2 rounded-lg border transition ${
              isVoiceCallActive
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isVoiceCallActive ? (
              <PhoneOff className="w-4 h-4" />
            ) : (
              <PhoneCall className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleResetCurrentChat}
            title="Clear Chat & Start Fresh"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consulted Person / Kundli Switcher Bar ("Consulting for: Self" or "+ Ask About Someone Else") */}
      <div
        className={`px-3 py-1.5 border-b flex items-center justify-between gap-2 shrink-0 text-[11px] ${
          isLight ? 'bg-purple-50/70 border-purple-200' : 'bg-[#161224] border-white/5'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <Users className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
          <span className="text-gray-400 shrink-0">For:</span>
          {allSavedKundlis.map((k) => {
            const active = k.id === savedKundli?.id || k.name === savedKundli?.name;
            return (
              <button
                key={k.id || k.name}
                type="button"
                onClick={() => onSelectActiveKundli(k)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition ${
                  active
                    ? 'bg-[#A855F7] text-white'
                    : isLight
                    ? 'bg-white border border-gray-300 text-gray-700'
                    : 'bg-white/5 border border-white/10 text-gray-300'
                }`}
              >
                {k.name} ({k.lagnaSign.split(' ')[0]})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowOtherPersonDrawer((v) => !v)}
          className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#F5C33B] text-[#14111C] font-extrabold text-[10px] flex items-center gap-1"
        >
          <UserPlus className="w-3 h-3" />
          <span>+ Ask For Other</span>
        </button>
      </div>

      {/* Expandable "Ask About Someone Else" Birth Details Drawer inside Chat */}
      {showOtherPersonDrawer && (
        <form
          onSubmit={handleAddOtherPersonInChat}
          className={`mx-3 mt-2 p-3.5 rounded-2xl border space-y-2.5 shrink-0 z-20 shadow-lg ${
            isLight ? 'bg-white border-purple-300' : 'bg-[#1E192E] border-[#A855F7]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5C33B]">
              Ask {astrologer.name} About Another Person
            </span>
            <button
              type="button"
              onClick={() => setShowOtherPersonDrawer(false)}
              className="text-xs text-gray-400"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              placeholder="Person's Name"
              className={`px-3 py-1.5 rounded-xl border text-xs ${
                isLight ? 'bg-gray-50 border-gray-300' : 'bg-black/40 border-white/15 text-white'
              }`}
            />
            <select
              value={otherRelation}
              onChange={(e) => setOtherRelation(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs ${
                isLight ? 'bg-gray-50 border-gray-300' : 'bg-black/40 border-white/15 text-white'
              }`}
            >
              <option value="Partner / Spouse">Partner / Spouse</option>
              <option value="Child">Son / Daughter</option>
              <option value="Family Member">Parent / Sibling</option>
              <option value="Friend / Business">Friend / Colleague</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              value={otherDob}
              onChange={(e) => setOtherDob(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono ${
                isLight ? 'bg-gray-50 border-gray-300' : 'bg-black/40 border-white/15 text-white'
              }`}
            />
            <input
              type="time"
              required
              value={otherTob}
              onChange={(e) => setOtherTob(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono ${
                isLight ? 'bg-gray-50 border-gray-300' : 'bg-black/40 border-white/15 text-white'
              }`}
            />
          </div>
          <CityAutocomplete
            label="Birth City"
            selectedLocation={otherLoc}
            onSelectLocation={(loc) => setOtherLoc(loc)}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-[#A855F7] text-white font-bold text-xs"
          >
            Calculate Kundli &amp; Ask {astrologer.name} →
          </button>
        </form>
      )}

      {/* SPECIALTY BANNER FOR PALM READER: Prompts user to upload Palm Photo if not yet uploaded */}
      {astrologer.requiresPalmImage && !hasUploadedPalmInChat && (
        <div className="mx-3 mt-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border border-[#F5C33B]/50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F5C33B] text-[#14111C] flex items-center justify-center shrink-0">
              <Hand className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#F5C33B] truncate">
                Palm Image Required for Hastrekha Reading
              </p>
              <p className="text-[10px] text-gray-300 truncate">
                Upload your or someone else's palm photo so {astrologer.name} can read the lines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => palmInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-[#F5C33B] text-[#14111C] font-extrabold text-xs shrink-0 flex items-center gap-1 shadow"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Send Palm</span>
          </button>
        </div>
      )}

      {/* Hidden File Input for Chat Palm / Face Photo Attachment */}
      <input
        ref={palmInputRef}
        type="file"
        accept="image/*"
        onChange={handleChatImageUpload}
        className="hidden"
      />

      {/* FULL-DUPLEX PHONE CALL OVERLAY */}
      {isVoiceCallActive && (
        <div className="mx-3 mt-2.5 p-4 rounded-3xl bg-gradient-to-b from-[#261844] to-[#170F2C] text-white border border-gold-400/40 shadow-2xl relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
              <Zap className="w-3 h-3" />
              {selectedLang.name} Barge-In Active (Speak anytime to interrupt)
            </span>
            {bargeInCount > 0 && (
              <span className="text-[10px] font-mono text-gold-300">
                Interruptions: {bargeInCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className={`w-14 h-14 rounded-full object-cover border-2 ${
                voiceState === 'ai-speaking'
                  ? 'border-gold-400 ring-4 ring-purple-500/40 animate-pulse'
                  : 'border-emerald-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gold-300">
                {voiceState === 'ai-speaking'
                  ? `${astrologer.name} speaking (${selectedLang.name})...`
                  : voiceState === 'interrupted'
                  ? '⚡ Listening to your interruption...'
                  : `🎙️ Speak in ${selectedLang.nativeName}...`}
              </p>
              <div className="mt-1.5 p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/95 line-clamp-2 min-h-[36px]">
                {liveUserTranscript ? (
                  <span className="text-emerald-300">You: "{liveUserTranscript}"</span>
                ) : (
                  <span>{liveAiTranscript}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsMicMuted((m) => !m)}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border bg-white/10 border-white/15 text-white"
            >
              {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isMicMuted ? 'Unmute' : 'Mic On'}</span>
            </button>
            <button
              type="button"
              onClick={flushAiAudioPlayback}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Interrupt</span>
            </button>
            <button
              type="button"
              onClick={stopVoiceCall}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-[#A855F7] text-white text-xs sm:text-sm font-medium shadow-sm space-y-2">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded Palm"
                      className="w-44 h-44 object-cover rounded-xl border border-white/30"
                    />
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 pr-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5">
              <img
                src={astrologer.avatar}
                alt={astrologer.name}
                className="w-8 h-8 rounded-full object-cover border border-[#F5C33B] shrink-0 mt-0.5"
              />
              <div className="flex flex-col items-start max-w-[82%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed border ${
                    isLight
                      ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
                      : 'bg-[#1C1926] border-white/10 text-gray-100 shadow'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.remedyCard && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#FDFBF7] text-[#2A1810] border-l-4 border-[#9E2A2B]">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#9E2A2B] uppercase">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Upay: {msg.remedyCard.title}</span>
                      </div>
                      {msg.remedyCard.mantra && (
                        <p className="font-serif font-bold text-xs text-[#9E2A2B] mt-1 bg-[#9E2A2B]/5 p-1.5 rounded">
                          {msg.remedyCard.mantra}
                        </p>
                      )}
                      <p className="text-[11px] text-[#2A1810]/90 mt-1">
                        {msg.remedyCard.instruction}
                      </p>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 pl-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2.5">
            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className="w-8 h-8 rounded-full object-cover border border-[#F5C33B]"
            />
            <div
              className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-2xl border ${
                isLight
                  ? 'bg-white border-gray-200 text-purple-800'
                  : 'bg-[#1C1926] border-white/10 text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#A855F7]" />
              <span>
                {astrologer.name} examining {astrologer.category}...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Specialty-Specific Quick Suggestion Chips in Chat */}
      <div
        className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 ${
          isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#14111D] border-white/5'
        }`}
      >
        {activeSuggestionChips.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            className={`shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition ${
              isLight
                ? 'bg-white hover:bg-purple-50 border-gray-300 text-gray-800 font-medium'
                : 'bg-[#1C1926] hover:bg-purple-950/40 border-white/10 text-gray-200'
            }`}
          >
            ✨ {q}
          </button>
        ))}
      </div>

      {/* Bottom Input Bar with Camera/Palm Upload Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={`p-3 border-t flex items-center gap-2 shrink-0 ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#13101C] border-white/10'
        }`}
      >
        <button
          type="button"
          onClick={() => palmInputRef.current?.click()}
          title="Upload Palm or Chart Photo"
          className={`p-2.5 rounded-xl border shrink-0 transition ${
            astrologer.requiresPalmImage
              ? 'bg-[#F5C33B] border-[#F5C33B] text-[#14111C]'
              : isLight
              ? 'bg-gray-100 border-gray-300 text-gray-700'
              : 'bg-[#1C1926] border-white/15 text-[#F5C33B]'
          }`}
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            astrologer.requiresPalmImage
              ? 'Upload palm photo (📷) or type your question...'
              : `Ask ${astrologer.name} (${astrologer.category})...`
          }
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs sm:text-sm border focus:outline-none ${
            isLight
              ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#9333EA]'
              : 'bg-[#1C1926] border-white/15 text-white placeholder-gray-500 focus:border-[#A855F7]'
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white flex items-center justify-center shadow disabled:opacity-40 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* End-of-Session Optional Dakshina Modal */}
      <DakshinaModal
        isOpen={showDakshinaModal}
        astrologer={astrologer}
        onClose={() => setShowDakshinaModal(false)}
        onComplete={(receipt) => {
          onSaveReceipt(receipt);
        }}
        appLanguage={selectedLang}
      />
    </div>
  );
};
