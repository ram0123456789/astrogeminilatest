import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  ShieldCheck,
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Lock,
  Smartphone,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91 (IN)' },
  { code: '+1', label: '🇺🇸 +1 (US)' },
  { code: '+44', label: '🇬🇧 +44 (UK)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+65', label: '🇸🇬 +65 (SG)' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authTab, setAuthTab] = useState<'phone' | 'google'>('phone');

  // Phone + OTP State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [seekerName, setSeekerName] = useState('');
  const [otpStep, setOtpStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string>('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Google Account Picker State
  const [googleName, setGoogleName] = useState('Aarav Sharma');
  const [googleEmail, setGoogleEmail] = useState('aarav.sharma@gmail.com');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = window.setInterval(() => {
      setResendTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const triggerSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 8) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpError('');
    setIsSendingOtp(true);
    const code = String(Math.floor(100000 + Math.random() * 900000));

    setTimeout(() => {
      setGeneratedOtp(code);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpStep('verify-otp');
      setIsSendingOtp(false);
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }, 650);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError('');

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const autofillDemoOtp = () => {
    if (!generatedOtp) return;
    setOtpDigits(generatedOtp.split(''));
    setOtpError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length !== 6) {
      setOtpError('Please enter all 6 digits of your OTP.');
      return;
    }

    if (entered !== generatedOtp && entered !== '123456') {
      setOtpError(`Invalid OTP. Use ${generatedOtp} (shown in SMS banner above).`);
      return;
    }

    const formattedPhone = `${countryCode} ${phoneNumber.replace(/\D/g, '')}`;
    const displayName =
      seekerName.trim() || `Seeker ${phoneNumber.replace(/\D/g, '').slice(-4)}`;

    const user: UserProfile = {
      id: `phone-${Date.now()}`,
      name: displayName,
      phone: formattedPhone,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(displayName)}/200/200`,
      authMethod: 'phone',
      joinedAt: new Date().toLocaleDateString(),
    };

    onSuccess(user);
    onClose();
  };

  const handleGoogleLogin = (preset?: { name: string; email: string }) => {
    const finalName = (preset?.name || googleName).trim();
    const finalEmail = (preset?.email || googleEmail).trim();
    if (!finalName || !finalEmail) return;

    setIsGoogleLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `google-${Date.now()}`,
        name: finalName,
        email: finalEmail,
        avatar: `https://picsum.photos/seed/${encodeURIComponent(finalEmail)}/200/200`,
        authMethod: 'google',
        joinedAt: new Date().toLocaleDateString(),
      };
      setIsGoogleLoading(false);
      onSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1E1736] to-[#110D20] border border-gold-400/40 shadow-[0_0_60px_rgba(255,107,0,0.28)] overflow-hidden"
        >
          {/* Decorative Saffron-Gold Top Bar */}
          <div className="h-2 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#C4B5A6] transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-cosmic-950 font-serif font-bold text-2xl mx-auto mb-3 shadow-lg shadow-saffron-500/20">
                ॐ
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                AstroVeda Sanctuary Access
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                Sign In to Your Kundli Profile
              </h3>
              <p className="text-xs text-[#C4B5A6] mt-1">
                Save your Janam Kundli, chat history & Sacred Ashirwad scrolls
              </p>
            </div>

            {/* Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-cosmic-950/90 border border-white/10 mt-5">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('phone');
                  setOtpError('');
                }}
                className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  authTab === 'phone'
                    ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-white shadow'
                    : 'text-[#C4B5A6] hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone + OTP</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('google');
                  setOtpError('');
                }}
                className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  authTab === 'google'
                    ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-white shadow'
                    : 'text-[#C4B5A6] hover:text-white'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.81-1.5 3.34-3.2 4.37v3.62h5.18c3.03-2.79 4.78-6.9 4.78-11.81 0-.8-.08-1.57-.23-2.31Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12.18 22c4.32 0 7.95-1.43 10.6-3.88l-5.18-3.62c-1.43.96-3.26 1.53-5.42 1.53-4.17 0-7.7-2.81-8.96-6.6H.07v3.73C2.71 18.4 7.1 22 12.18 22Z"
                  />
                </svg>
                <span>Google Login</span>
              </button>
            </div>

            {/* PHONE + OTP TAB */}
            {authTab === 'phone' && (
              <div className="mt-5">
                {otpStep === 'enter-phone' ? (
                  <form onSubmit={triggerSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs text-[#C4B5A6] block mb-1.5">
                        Your Name (For Kundli & Ashirwad)
                      </label>
                      <input
                        type="text"
                        value={seekerName}
                        onChange={(e) => setSeekerName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white placeholder-[#C4B5A6]/40 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#C4B5A6] block mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="px-3 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-xs text-gold-300 font-mono focus:outline-none focus:border-gold-400"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white font-mono placeholder-[#C4B5A6]/40 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>

                    {otpError && (
                      <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                        {otpError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Dispatching 6-Digit OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Verification OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {/* Simulated SMS Notification Toast */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div className="text-xs">
                          <span className="text-emerald-300 font-semibold block">
                            Instant OTP Dispatched to {countryCode} {phoneNumber}
                          </span>
                          <span className="text-[#F4EFE6] font-mono">
                            Your AstroVeda code is:{' '}
                            <strong className="text-gold-300 underline">{generatedOtp}</strong>
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={autofillDemoOtp}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 font-mono text-[11px] font-semibold transition"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[#C4B5A6]">Enter 6-Digit OTP</span>
                        <button
                          type="button"
                          onClick={() => setOtpStep('enter-phone')}
                          className="text-gold-400 hover:underline font-mono text-[11px]"
                        >
                          Change Number
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpInputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-full h-12 text-center font-mono text-lg font-bold text-gold-300 bg-cosmic-950 border border-white/20 focus:border-gold-400 rounded-xl focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>

                    {otpError && (
                      <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                        {otpError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify OTP & Enter Sanctuary</span>
                    </button>

                    <div className="flex items-center justify-between text-xs text-[#C4B5A6] pt-1">
                      <span>Didn't receive code?</span>
                      <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={triggerSendOtp}
                        className="font-mono text-gold-300 disabled:opacity-40 flex items-center gap-1 hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* GOOGLE SIGN-IN TAB */}
            {authTab === 'google' && (
              <div className="mt-5 space-y-4">
                {/* One-Tap Quick Google Account Cards */}
                <div className="space-y-2">
                  <span className="text-xs text-[#C4B5A6] block">
                    Choose a Google Account for Instant Sign-In
                  </span>
                  {[
                    { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com' },
                    { name: 'Ananya Nair', email: 'ananya.nair@gmail.com' },
                  ].map((acct) => (
                    <button
                      key={acct.email}
                      type="button"
                      onClick={() => handleGoogleLogin(acct)}
                      className="w-full p-3 rounded-2xl bg-cosmic-950/90 hover:bg-white/10 border border-white/15 hover:border-gold-400/50 flex items-center justify-between transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://picsum.photos/seed/${encodeURIComponent(acct.email)}/100/100`}
                          alt={acct.name}
                          className="w-9 h-9 rounded-full border border-gold-400/50"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{acct.name}</p>
                          <p className="text-[11px] font-mono text-[#C4B5A6]">{acct.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gold-300">Continue →</span>
                    </button>
                  ))}
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="shrink mx-3 text-[10px] font-mono uppercase text-[#C4B5A6]">
                    Or Use Custom Google Profile
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGoogleLogin();
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    required
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white focus:outline-none focus:border-gold-400"
                  />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-gold-400"
                  />
                  <button
                    type="submit"
                    disabled={isGoogleLoading}
                    className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-cosmic-950 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.81-1.5 3.34-3.2 4.37v3.62h5.18c3.03-2.79 4.78-6.9 4.78-11.81 0-.8-.08-1.57-.23-2.31Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12.18 22c4.32 0 7.95-1.43 10.6-3.88l-5.18-3.62c-1.43.96-3.26 1.53-5.42 1.53-4.17 0-7.7-2.81-8.96-6.6H.07v3.73C2.71 18.4 7.1 22 12.18 22Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M3.22 13.43a9.52 9.52 0 0 1 0-6.06V3.64H.07a15.98 15.98 0 0 0 0 13.52l3.15-3.73Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12.18 4.75c2.35 0 4.46.81 6.12 2.4l4.59-4.59C20.12 1.02 16.5 0 12.18 0 7.1 0 2.71 3.6.07 8.84l3.15 3.73c1.26-3.79 4.79-6.6 8.96-6.6Z"
                      />
                    </svg>
                    <span>
                      {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Local Device Storage Transparency Note */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-start gap-2 text-[11px] text-[#C4B5A6]">
              <Lock className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
              <span>
                Offline-ready sanctuary mode: Your session, Janam Kundli, and Ashirwad scrolls are securely stored on this device via browser storage.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
