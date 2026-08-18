import React, { useState } from 'react';
import { Sparkles, Gift, Check, ArrowRight, ShieldCheck, Zap, Tag, Copy, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrencyCode } from '../types';
import { insertWaitlistToDatabase } from '../utils/waitlistDatabase';

interface VipOfferBannerProps {
  currency?: CurrencyCode;
  onJoinedWaitlist?: (email: string, promoCode?: string, discount?: number, status?: string) => void;
  onClaimCoupon?: (discountCode: string) => void;
  onOpenAuth?: () => void;
}

export const VipOfferBanner: React.FC<VipOfferBannerProps> = ({
  currency = 'NGN',
  onJoinedWaitlist,
  onClaimCoupon,
  onOpenAuth
}) => {
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('ARIMO50');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [claimedCode, setClaimedCode] = useState('ARIMO50');
  const [discountPercent, setDiscountPercent] = useState(50);
  const [waitlistStatus, setWaitlistStatus] = useState<'VIP Waitlist' | 'Regular Waitlist'>('VIP Waitlist');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    // Execute requested logic:
    // if promo_code.upper() == "ARIMO50":
    //     discount = 50  # 50% off
    //     status = "VIP Waitlist"
    // else:
    //     discount = 0
    //     status = "Regular Waitlist"
    // DB.insert(email=email, promo_code=promo_code, discount=discount, status=status)
    const result = insertWaitlistToDatabase(email, promoCode, {
      country: currency === 'NGN' ? 'Nigeria' : 'Global'
    });

    setClaimedCode(result.promo_code);
    setDiscountPercent(result.discount);
    setWaitlistStatus(result.status);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF']
      });
    } catch {
      // ignore
    }

    if (onJoinedWaitlist) {
      onJoinedWaitlist(email, result.promo_code, result.discount, result.status);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(claimedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPrompts = () => {
    const content = `================================================================================
ARIMO STORE HUB - 3 VIP HIGH-INCOME AI PROMPTS
50% OFF VIP COUPON CODE: ${claimedCode || 'ARIMO50'}
================================================================================

PROMPT 1: ULTRA-LUXURY COMMERCIAL COSMETICS & PERFUME MOCKUP (MIDJOURNEY v6)
Formula:
"A hyper-realistic studio commercial product photograph of an ultra-luxury frosted obsidian black perfume bottle with embossed metallic 24k gold calligraphy typography 'ARIMO LUXE PARFUM'. Situated on a polished dark nero marquina marble pedestal with gentle shallow water ripples and golden caustic light refractions. Moody cinematic chiaroscuro studio lighting, 85mm portrait prime lens, f/1.8 aperture, octane render, 8k resolution, photorealistic details --ar 16:9 --v 6.0 --style raw"

PROMPT 2: HIGH-TICKET B2B COLD OUTREACH SCRIPT (CHATGPT / CLAUDE 3.5)
Formula:
"Act as a top 1% B2B digital sales consultant. Write a 4-sentence hyper-personalized cold outreach email to a London & New York design agency director offering AI-automated branding mockup workflows. Highlight a guaranteed 70% reduction in production turnaround time and offer a zero-risk 1-asset sample preview before payment."

PROMPT 3: VIRAL TIKTOK / INSTAGRAM REELS RETENTION HOOK
Formula:
"Create a 15-second high-energy video script showcasing how any Nigerian creator or remote worker can monetize Canva and Midjourney assets for international clients paying in USD. Include on-screen text overlays, B-roll sound design cues, and an irresistible call-to-action to join ARIMO STORE HUB."

================================================================================
© ${new Date().getFullYear()} ARIMO STORE HUB. ALL RIGHTS RESERVED.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ARIMO_VIP_3_Prompts_Gift.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="vip-offer-section"
      className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 sm:p-8 md:p-10 shadow-[0_0_40px_rgba(212,175,55,0.15)] my-6 sm:my-8"
    >
      {/* Background Decorative Gold Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-yellow-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left Column: Heading, Badge, Pricing */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[11px] sm:text-xs font-black tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>LIMITED TIME VIP OFFER</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Join VIP Waitlist -{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                50% OFF Launch
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Lock in lifetime discounts, priority access to our 8K Midjourney Prompt Engines, remote dollar earning masterclasses, and receive 3 High-Income AI Prompts instantly upon joining.
            </p>

            {/* Minimum Price Placeholder */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>VIP Access from ₦2,000 / $15</span>
              </div>
              <span className="text-[11px] text-zinc-400">
                • 50% discount applies across all digital assets &amp; kits
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Form / Confirmation State */}
          <div className="w-full lg:w-96 shrink-0">
            {!isSubmitted ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/95 border border-zinc-800/90 shadow-2xl backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Claim 50% Discount Coupon</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Enter email to reveal instant VIP code + download prompt file
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder:text-zinc-500 text-xs sm:text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                    />
                  </div>

                  {/* Promo Code Input */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      placeholder="Promo code (ARIMO50)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-amber-300 font-mono font-bold text-xs uppercase placeholder:text-zinc-600 outline-none"
                    />
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black uppercase whitespace-nowrap">
                      {promoCode.trim().toUpperCase() === 'ARIMO50' ? '50% OFF' : 'REGULAR'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    id="vip-join-waitlist-btn"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>
                      {promoCode.trim().toUpperCase() === 'ARIMO50'
                        ? 'Join VIP Waitlist (50% OFF)'
                        : 'Join Regular Waitlist'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No spam. Instant code generation + TXT file.</span>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-emerald-500/50 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Check className="w-5 h-5" />
                </div>

                <div>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 border ${waitlistStatus === 'VIP Waitlist' ? 'bg-amber-400/20 text-amber-300 border-amber-400/50' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{waitlistStatus}</span>
                    {discountPercent > 0 && <span className="text-amber-400">({discountPercent}% OFF)</span>}
                  </div>
                  <h3 className="text-base font-black text-white">
                    {waitlistStatus === 'VIP Waitlist' ? 'VIP Waitlist Confirmed!' : 'Waitlist Registered!'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {discountPercent > 0 ? 'Your 50% discount coupon is active:' : 'Your spot has been saved in the database:'}
                  </p>
                </div>

                {/* Coupon Code Display Box */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-amber-500/40">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Coupon Code</span>
                    <div className="text-base font-mono font-black text-amber-400 tracking-wider">
                      {claimedCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleDownloadPrompts}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download 3 VIP Prompts (.txt)</span>
                  </button>

                  {onClaimCoupon && (
                    <button
                      onClick={() => onClaimCoupon(claimedCode)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Code &amp; Go to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
