import React, { useState } from 'react';
import { Sparkles, X, Gift, Check, ArrowRight, Download, MessageCircle, Percent, Copy, Tag, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';
import { AntiSpamCaptcha } from './AntiSpamCaptcha';
import { insertWaitlistToDatabase } from '../utils/waitlistDatabase';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriberCaptured?: (name: string, email: string, phone: string, promo_code?: string, discount?: number, status?: string) => void;
  onApplyDiscountCode?: (code: string) => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  isOpen,
  onClose,
  onSubscriberCaptured,
  onApplyDiscountCode
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('ARIMO50');
  const [country, setCountry] = useState('Nigeria');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    discount: number;
    status: 'VIP Waitlist' | 'Regular Waitlist';
    promo_code: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const DISCOUNT_CODE = promoCode.trim().toUpperCase() === 'ARIMO50' ? 'ARIMO50' : promoCode.trim().toUpperCase();

  const freePrompts = [
    {
      title: 'Prompt #1: High-Ticket Client Redesign Pitch',
      prompt: 'Act as a senior creative director in Nigeria. I am pitching a brand redesign to [Client Name / Industry]. Give me 3 bold visual positioning angles with high-status vocabulary, color psychology reasoning, and a 1-sentence value hook.'
    },
    {
      title: 'Prompt #2: 30-Second Instagram Viral Caption',
      prompt: 'Write a high-converting Instagram carousel caption about [AI/Design Topic]. Hook reader in first 5 words, provide 3 practical bullet points with Nigerian context, and end with a call to action to comment "PROMPT".'
    },
    {
      title: 'Prompt #3: Luxury Obsidian Gold Product Mockup',
      prompt: 'Cinematic 8k product photography of [Product] on luxury black and gold obsidian stage, soft warm studio rim lighting, photorealistic, depth of field, Octane render --ar 4:5 --v 6.0'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (!isCaptchaVerified) {
      alert('Please complete the anti-spam security verification.');
      return;
    }

    // Process logic requested by user:
    // if promo_code.upper() == "ARIMO50":
    //     discount = 50  # 50% off
    //     status = "VIP Waitlist"
    // else:
    //     discount = 0
    //     status = "Regular Waitlist"
    // DB.insert(email=email, promo_code=promo_code, discount=discount, status=status)
    const result = insertWaitlistToDatabase(email, promoCode, {
      name,
      phone,
      country
    });

    setSubmissionResult({
      discount: result.discount,
      status: result.status,
      promo_code: result.promo_code
    });

    setIsSubmitted(true);

    if (onSubscriberCaptured) {
      onSubscriberCaptured(name, email, phone, result.promo_code, result.discount, result.status);
    }

    if (result.discount > 0 && onApplyDiscountCode) {
      onApplyDiscountCode(result.promo_code);
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FFD700', '#F59E0B', '#10B981', '#FFFFFF']
    });
  };

  const copyDiscountCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopiedCode(true);
    if (onApplyDiscountCode) {
      onApplyDiscountCode(DISCOUNT_CODE);
    }
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2500);
  };

  const handleDownloadFreePack = () => {
    const text = `================================================================================
ARIMO STORE HUB • VIP 50% OFF COUPON & 3 FREE HIGH-INCOME AI PROMPTS
================================================================================
Claimed by: ${name || 'VIP Member'} (${email || 'Subscriber'})
Date: ${new Date().toLocaleString()}
YOUR 50% OFF DISCOUNT CODE: ${DISCOUNT_CODE} (Apply in checkout for 50% discount)

--------------------------------------------------------------------------------
YOUR 3 FREE HIGH-INCOME AI PROMPTS
--------------------------------------------------------------------------------
${freePrompts.map((p, idx) => `[${idx + 1}] ${p.title}\n${p.prompt}\n`).join('\n--------------------------------------------------------------------------------\n')}

================================================================================
Join our 2,400+ member WhatsApp Community for weekly remote job drops & prompt gifts:
${WHATSAPP_COMMUNITY_URL}
================================================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Arimo_VIP_50Percent_Coupon_&_Prompts.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="waitlist-discount-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/50 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(255,215,0,0.25)] text-white my-6 max-h-[90vh] overflow-y-auto"
        id="lead-magnet-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>Limited Time VIP Offer</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              Join Waitlist for{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                ARIMO STORE HUB
              </span>
            </h2>

            <p className="mt-2 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              Enter your email to receive an instant <strong>50% discount coupon code</strong> for any digital prompt kit, Canva template pack, or remote job blueprint + <strong>3 free high-income AI prompts</strong>.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raymond Arimo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder:text-zinc-600 outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder:text-zinc-600 outline-none text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white outline-none text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Nigeria">Nigeria (₦)</option>
                    <option value="United States">United States ($)</option>
                    <option value="United Kingdom">United Kingdom (£)</option>
                    <option value="Canada">Canada (CAD)</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="UAE">UAE / Dubai</option>
                    <option value="Other">Other Global</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  WhatsApp Number <span className="text-zinc-500 font-normal">(For direct prompt delivery)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder:text-zinc-600 outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Promo Code Input (Defaults to ARIMO50 for 50% VIP discount) */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Promo / Referral Code
                  </label>
                  {promoCode.trim().toUpperCase() === 'ARIMO50' ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black uppercase">
                      VIP Waitlist • 50% OFF
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                      Regular Waitlist
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter ARIMO50 for 50% off"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-amber-500/40 text-amber-400 font-mono font-bold text-xs uppercase placeholder:text-zinc-600 outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Use <strong className="text-amber-300">ARIMO50</strong> to qualify for <strong>VIP Waitlist (50% Discount)</strong>.
                </p>
              </div>

              {/* Anti-Spam Security Challenge */}
              <AntiSpamCaptcha onVerify={(isValid) => setIsCaptchaVerified(isValid)} id="waitlist-captcha" theme="compact" />

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>
                  {promoCode.trim().toUpperCase() === 'ARIMO50'
                    ? 'Join VIP Waitlist (50% Off)'
                    : 'Submit Waitlist Form'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="mt-3 text-[11px] text-zinc-500 text-center">
              🔒 100% Free. Instant 50% discount code + free prompts provided on next screen.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto text-zinc-950 shadow-[0_0_25px_#f59e0b]">
              <Check className="w-7 h-7 stroke-[3px]" />
            </div>

            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border shadow-sm ${submissionResult?.status === 'VIP Waitlist' ? 'bg-amber-400/20 text-amber-300 border-amber-400/50' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Status: {submissionResult?.status || 'VIP Waitlist'}</span>
                {submissionResult?.discount ? (
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-black ml-1">
                    {submissionResult.discount}% OFF
                  </span>
                ) : null}
              </div>
              <h3 className="text-2xl font-black text-white">You are In, {name}! 🎉</h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {submissionResult?.status === 'VIP Waitlist'
                  ? 'Your 50% VIP discount code & 3 free prompts have been activated!'
                  : 'Your waitlist spot and 3 free prompts have been saved to the database.'}
              </p>
            </div>

            {/* BIG 50% DISCOUNT CODE BOX */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-500/20 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <div className="text-xs text-zinc-400 uppercase font-black tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Your 50% Off Promo Code:</span>
              </div>

              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-widest bg-zinc-950 px-4 py-1.5 rounded-xl border border-amber-500/40">
                  {DISCOUNT_CODE}
                </span>

                <button
                  onClick={copyDiscountCode}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-950 stroke-[3px]" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-amber-300/90 mt-2 font-medium">
                Applied automatically to your current cart. 50% off total checkout!
              </p>
            </div>

            {/* Prompt Cards */}
            <div className="space-y-2.5 text-left">
              <div className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Bonus Gift: 3 High-Income AI Prompts
              </div>
              {freePrompts.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-amber-400">{p.title}</h4>
                    <button
                      onClick={() => copyToClipboard(p.prompt, idx)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedPromptIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        'Copy'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-800/50 select-all">
                    &quot;{p.prompt}&quot;
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownloadFreePack}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Save Prompts (.txt)</span>
              </button>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
                </svg>
                <span>Join Our WhatsApp Channel</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-2 text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Start Shopping with 50% Off &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
