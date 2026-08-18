import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Search,
  Plus,
  ArrowRight,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  Share2,
  Globe
} from 'lucide-react';
import { CurrencyCode, GiftCardBrand, GiftCardItem } from '../types';
import {
  GIFT_CARD_BRANDS,
  NGN_PRESET_AMOUNTS,
  USD_PRESET_AMOUNTS,
  USD_TO_NGN_RATE,
  getAllGiftCards,
  verifyGiftCard,
  VerificationResult
} from '../utils/giftCardUtils';
import { formatCurrency } from '../utils/currencyUtils';
import { GiftCardBrandIcon } from './GiftCardIcons';

interface GiftCardStorePageProps {
  currency: CurrencyCode;
  onOpenBuyModal: (initialCurrency?: CurrencyCode, initialAmount?: number) => void;
  onNavigateShop: () => void;
}

export const GiftCardStorePage: React.FC<GiftCardStorePageProps> = ({
  currency: initialCurrency,
  onOpenBuyModal,
  onNavigateShop
}) => {
  // Currency Toggle State (NGN | USD)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(initialCurrency || 'NGN');

  // Saved user cards in storage
  const [savedCards, setSavedCards] = useState<GiftCardItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Balance Checker State
  const [checkCode, setCheckCode] = useState('');
  const [checkBrand, setCheckBrand] = useState<GiftCardBrand>('arimo');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    setSavedCards(getAllGiftCards());
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;

    setIsChecking(true);
    setCheckResult(null);

    try {
      const res = await verifyGiftCard(checkCode, checkBrand, selectedCurrency);
      setCheckResult(res);
      setIsChecking(false);
    } catch {
      setIsChecking(false);
      setCheckResult({
        success: false,
        error: 'Balance verification network timed out. Please try again.'
      });
    }
  };

  return (
    <div id="gift-card-store-page" className="space-y-12 animate-in fade-in duration-300">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-amber-500/50 p-6 sm:p-10 md:p-14 shadow-[0_0_80px_rgba(212,175,55,0.2)]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/50 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Official ARIMO Multi-Currency Gift Card Hub</span>
            </div>

            {/* CURRENCY TOGGLE: NGN | USD */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md">
              <button
                onClick={() => setSelectedCurrency('NGN')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCurrency === 'NGN'
                    ? 'bg-amber-500 text-zinc-950 shadow-md scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>🇳🇬 NGN (₦)</span>
              </button>
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCurrency === 'USD'
                    ? 'bg-sky-500 text-zinc-950 shadow-md scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>🇺🇸 USD ($)</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Gift AI Blueprints, Prompts &amp;{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              Digital Assets
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Surprise your friends, students, or team with instant-delivery ARIMO Gift Cards in{' '}
            <strong>NGN (₦1,000, ₦5,000, ₦10,000, ₦20,000)</strong> or{' '}
            <strong>USD ($5, $10, $25, $50, $100)</strong>. We also accept Steam, Apple/iTunes, Amazon, and Google Play Gift Cards at checkout!
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBuyModal(selectedCurrency)}
              className="py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buy {selectedCurrency} Gift Card (Instant Delivery)</span>
            </button>

            <button
              onClick={onNavigateShop}
              className="py-3.5 sm:py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Redeem in Store</span>
            </button>
          </div>
        </div>
      </section>

      {/* SUPPORTED GIFT CARD PLATFORMS SHOWCASE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Accepted Gift Card Networks</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                5 Major Providers
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select "Pay With Gift Card" during checkout to redeem cards with automatic real-time balance deduction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GIFT_CARD_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/40 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GiftCardBrandIcon brand={brand.id} size="md" />
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                      {brand.name}
                    </h3>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {brand.codePlaceholder}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-amber-400 font-bold">
                  Verified API
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{brand.description}</p>

              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                <span>Format: {brand.formatDescription}</span>
                <span className="text-emerald-400 font-bold">Instant Deduct</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARIMO GIFT CARD DENOMINATIONS WITH CURRENCY TOGGLE */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Popular ARIMO {selectedCurrency} Denominations</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  selectedCurrency === 'NGN'
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    : 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                }`}
              >
                {selectedCurrency === 'NGN' ? '🇳🇬 Nigerian Naira (₦)' : '🇺🇸 US Dollars ($)'}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select your preferred denomination to customize and generate an official voucher delivered instantly via email &amp; dashboard.
            </p>
          </div>

          {/* Secondary Currency Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setSelectedCurrency('NGN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCurrency === 'NGN'
                  ? 'bg-amber-500 text-zinc-950 font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇳🇬 NGN Cards (₦)
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCurrency === 'USD'
                  ? 'bg-sky-500 text-zinc-950 font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇺🇸 USD Cards ($)
            </button>
          </div>
        </div>

        {/* NGN DENOMINATIONS: ₦1,000, ₦5,000, ₦10,000, ₦20,000 */}
        {selectedCurrency === 'NGN' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NGN_PRESET_AMOUNTS.map((item) => (
              <div
                key={item.amount}
                className={`relative rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                  item.popular
                    ? 'bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950 border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    Most Popular Gift
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                    <Gift className="w-5 h-5" />
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-widest block">
                      Voucher Value
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">{item.label}</span>
                      <span className="text-xs text-zinc-400 font-bold">
                        (~${Math.round(item.amount / USD_TO_NGN_RATE)} USD)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.amount === 1000
                      ? 'Perfect for mini AI prompt bundles and quick cheatsheets.'
                      : item.amount === 5000
                      ? 'Covers the full Complete Remote Job Kit or 5+ Canva packs.'
                      : item.amount === 10000
                      ? 'Unlocks masterclasses, comprehensive prompt vaults, and kits.'
                      : 'Unlocks complete studio coaching, VIP packages, and masterclass suites.'}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-zinc-800/80 space-y-2">
                  <ul className="text-xs text-zinc-400 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Delivered instantly via email &amp; dashboard</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp shareable gift link</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Never expires • 100% redeemable</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => onOpenBuyModal('NGN', item.amount)}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Buy {item.label} Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USD DENOMINATIONS: $5, $10, $25, $50, $100 */}
        {selectedCurrency === 'USD' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {USD_PRESET_AMOUNTS.map((item) => (
              <div
                key={item.amount}
                className={`relative rounded-3xl p-5 flex flex-col justify-between border transition-all ${
                  item.popular
                    ? 'bg-gradient-to-b from-sky-950/40 via-zinc-950 to-zinc-950 border-sky-500/80 shadow-[0_0_40px_rgba(14,165,233,0.25)]'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    Most Popular Gift
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold">
                    <Gift className="w-5 h-5" />
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-widest block">
                      Voucher Value
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">{item.label}</span>
                      <span className="text-xs text-zinc-400 font-bold">
                        (~₦{(item.amount * USD_TO_NGN_RATE).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.amount === 5
                      ? 'Starter gift for AI prompt libraries.'
                      : item.amount === 10
                      ? 'Covers bestselling templates and toolkits.'
                      : item.amount === 25
                      ? 'All-access kit or masterclass modules.'
                      : item.amount === 50
                      ? 'Executive bundle + priority support.'
                      : 'VIP Pass to complete catalog & consulting.'}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-zinc-800/80 space-y-2">
                  <ul className="text-[11px] text-zinc-400 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant email delivery</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Global Paystack USD payment</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => onOpenBuyModal('USD', item.amount)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Buy {item.label} Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INTERACTIVE LIVE GIFT CARD BALANCE CHECKER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Real-Time Verification Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Check Gift Card Balance</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Check the live remaining balance and validity of any ARIMO (NGN/USD), Steam, Apple, Amazon, or Google Play Gift Card before checkout.
          </p>
        </div>

        <form onSubmit={handleCheckBalance} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">Brand Provider</label>
              <select
                value={checkBrand}
                onChange={(e) => setCheckBrand(e.target.value as GiftCardBrand)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {GIFT_CARD_BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Enter Gift Card Code (16-25 digits)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={checkCode}
                  onChange={(e) => setCheckCode(e.target.value)}
                  placeholder="e.g. ARIMO-NGN-10000 or STEAM-W79K-88Q2"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="submit"
                  disabled={isChecking || !checkCode.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isChecking ? (
                    <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Check</span>
                </button>
              </div>
            </div>
          </div>

          {/* Balance Checker Results Box */}
          {checkResult && (
            <div
              className={`p-4 rounded-2xl border ${
                checkResult.success
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/30 border-red-800/50 text-red-300'
              } text-xs space-y-2 animate-in fade-in`}
            >
              {checkResult.success && checkResult.card ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-black text-white text-sm">
                        {checkResult.card.brandName} Valid &amp; Active
                      </h4>
                      <p className="text-zinc-400 font-mono text-[11px]">
                        Code: {checkResult.card.code}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      Available Balance
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      {checkResult.card.currency === 'USD'
                        ? `$${checkResult.card.currentBalanceUsd} USD`
                        : `₦${checkResult.card.currentBalanceNaira.toLocaleString()} NGN`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{checkResult.error || 'Gift card could not be verified.'}</span>
                </div>
              )}
            </div>
          )}
        </form>
      </section>

      {/* SAVED & ACTIVE GIFT CARDS IN VAULT */}
      {savedCards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>My Active Gift Cards &amp; Vouchers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {savedCards.length} Cards
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCards.map((card) => {
              const isNgn = card.currency === 'NGN';
              return (
                <div
                  key={card.code}
                  className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GiftCardBrandIcon brand={card.brand} size="sm" />
                      <span className="text-xs font-bold text-white">{card.brandName}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        card.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : card.status === 'partially_used'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {card.currency} • {card.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 font-black">
                      {card.code}
                    </span>
                    <button
                      onClick={() => handleCopy(card.code)}
                      className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === card.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px]">{copiedCode === card.code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-900">
                    <span className="text-zinc-500">Balance:</span>
                    <span className="font-black text-emerald-400">
                      {isNgn
                        ? `₦${card.currentBalanceNaira.toLocaleString()} NGN`
                        : `$${card.currentBalanceUsd} USD`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
