import React, { useState, useEffect } from 'react';
import {
  Gift,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Download,
  Zap,
  ArrowRight,
  Heart,
  Mail,
  User,
  CreditCard,
  Lock,
  Share2,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrencyCode, GiftCardItem } from '../types';
import {
  NGN_PRESET_AMOUNTS,
  USD_PRESET_AMOUNTS,
  USD_TO_NGN_RATE,
  generateArimoGiftCard,
  saveAllGiftCards,
  getAllGiftCards
} from '../utils/giftCardUtils';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface BuyGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onGiftCardPurchased?: (giftCard: GiftCardItem) => void;
  onRedeemNow?: (giftCard: GiftCardItem) => void;
}

type CardTheme = 'gold' | 'dark' | 'creator' | 'vip';

export const BuyGiftCardModal: React.FC<BuyGiftCardModalProps> = ({
  isOpen,
  onClose,
  currency: initialCurrency,
  onGiftCardPurchased,
  onRedeemNow
}) => {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    initialCurrency === 'USD' ? 'USD' : 'NGN'
  );

  // Amounts for NGN & USD
  const [selectedNgnAmount, setSelectedNgnAmount] = useState<number>(5000);
  const [selectedUsdAmount, setSelectedUsdAmount] = useState<number>(25);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Sync initial currency when opened
  useEffect(() => {
    if (initialCurrency === 'USD' || initialCurrency === 'NGN') {
      setActiveCurrency(initialCurrency);
    }
  }, [initialCurrency, isOpen]);

  // Card customization fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [personalMessage, setPersonalMessage] = useState(
    'Enjoy your digital assets and AI blueprints on ARIMO STORE HUB!'
  );
  const [cardTheme, setCardTheme] = useState<CardTheme>('gold');

  // Checkout & Completion State
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState<GiftCardItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const isNgn = activeCurrency === 'NGN';

  const currentAmount = isCustomAmount
    ? parseFloat(customAmountInput) || (isNgn ? 1000 : 5)
    : isNgn
    ? selectedNgnAmount
    : selectedUsdAmount;

  const currentDisplayFormatted = isNgn
    ? `₦${currentAmount.toLocaleString()}`
    : `$${currentAmount.toFixed(2)}`;

  const currentEquivalentFormatted = isNgn
    ? `~$${(currentAmount / USD_TO_NGN_RATE).toFixed(2)} USD`
    : `~₦${(currentAmount * USD_TO_NGN_RATE).toLocaleString()} NGN`;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newCard = generateArimoGiftCard({
        currency: activeCurrency,
        amount: currentAmount,
        recipientName: recipientName.trim() || 'Friend',
        recipientEmail: recipientEmail.trim() || 'friend@example.com',
        senderName: senderName.trim() || 'Valued Customer',
        personalMessage: personalMessage.trim(),
        theme: cardTheme
      });

      setIsProcessing(false);
      setPurchasedCard(newCard);

      if (onGiftCardPurchased) {
        onGiftCardPurchased(newCard);
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: isNgn
          ? ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF']
          : ['#38BDF8', '#818CF8', '#10B981', '#FFFFFF']
      });
    }, 1100);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadVoucher = (card: GiftCardItem) => {
    const cardValFormatted =
      card.currency === 'NGN'
        ? `₦${card.initialBalanceNaira.toLocaleString()}`
        : `$${card.initialBalanceUsd}`;

    const textContent = `=====================================================
         ARIMO STORE HUB OFFICIAL GIFT VOUCHER
=====================================================
Gift Card Code: ${card.code}
Currency: ${card.currency}
Initial Value: ${cardValFormatted}
Recipient: ${card.recipientName || 'Gift Recipient'} (${card.recipientEmail})
From: ${card.senderName || 'Arimo Supporter'}
Personal Note: "${card.personalMessage}"

How to Redeem:
1. Visit https://arimostore.com
2. Select your AI prompts, Canva templates, or remote work kits
3. At Checkout, select "Pay With Gift Card"
4. Paste code: ${card.code}
(Note: Gift cards must match checkout order currency: ${card.currency})

Issued: ${new Date(card.createdAt).toLocaleDateString()}
Security Verification: 256-Bit SSL Secured • Paystack Multi-Currency Verified
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARIMO_GiftCard_${card.code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const themeStyles = {
    gold: {
      cardBg: 'from-amber-950/90 via-zinc-950 to-black',
      border: 'border-amber-500/70',
      glow: 'shadow-[0_0_40px_rgba(212,175,55,0.3)]',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      foilText: 'from-amber-300 via-yellow-200 to-amber-500'
    },
    dark: {
      cardBg: 'from-zinc-900 via-black to-zinc-950',
      border: 'border-zinc-700',
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]',
      badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
      foilText: 'from-zinc-100 via-zinc-300 to-zinc-400'
    },
    creator: {
      cardBg: 'from-indigo-950/80 via-zinc-950 to-black',
      border: 'border-indigo-500/60',
      glow: 'shadow-[0_0_35px_rgba(99,102,241,0.25)]',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      foilText: 'from-indigo-300 via-purple-200 to-amber-400'
    },
    vip: {
      cardBg: 'from-emerald-950/80 via-zinc-950 to-black',
      border: 'border-emerald-500/60',
      glow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      foilText: 'from-emerald-300 via-teal-200 to-yellow-400'
    }
  }[cardTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-[0_0_60px_rgba(212,175,55,0.25)] overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Buy ARIMO Gift Card</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold uppercase">
                  {activeCurrency} Edition
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Gift friends instant digital store credit in {activeCurrency === 'NGN' ? 'Nigerian Naira (₦)' : 'US Dollars ($)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!purchasedCard ? (
          <form onSubmit={handlePurchase} className="p-5 sm:p-6 space-y-6">
            {/* CURRENCY TOGGLE */}
            <div className="flex items-center justify-between bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
              <span className="text-xs font-bold text-zinc-300 pl-3 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Card Currency:</span>
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCurrency('NGN');
                    setIsCustomAmount(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCurrency === 'NGN'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>🇳🇬 NGN (₦)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCurrency('USD');
                    setIsCustomAmount(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCurrency === 'USD'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>🇺🇸 USD ($)</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE 3D VIRTUAL GIFT CARD PREVIEW */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Live Card Preview
              </span>

              <div
                className={`relative w-full h-48 sm:h-56 rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ${themeStyles.glow}`}
              >
                {/* Gold Sheen Background Mesh */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl" />

                {/* Top Row: Brand & Chip */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                      A
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-wider text-white uppercase block">
                        ARIMO STORE HUB
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                        {activeCurrency} Official Digital Voucher
                      </span>
                    </div>
                  </div>

                  {/* Gold EMV Chip Graphic */}
                  <div className="w-10 h-7 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200/50 shadow-inner flex items-center justify-center">
                    <div className="w-6 h-4 border border-zinc-950/40 rounded-sm" />
                  </div>
                </div>

                {/* Center: Card Amount */}
                <div className="relative z-10 my-auto">
                  <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block">
                    Voucher Value ({activeCurrency})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${themeStyles.foilText} bg-clip-text text-transparent`}
                    >
                      {currentDisplayFormatted}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">
                      ({currentEquivalentFormatted})
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Recipient & Security Token */}
                <div className="relative z-10 flex items-end justify-between text-xs pt-1 border-t border-zinc-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">For</span>
                    <span className="text-xs font-bold text-white block truncate max-w-[180px]">
                      {recipientName.trim() || 'Valued Recipient'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Code Format</span>
                    <span className="font-mono text-amber-400 text-xs font-black">
                      ARIMO-{activeCurrency}-••••-••••
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 1: SELECT GIFT CARD AMOUNT */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                1. Select {activeCurrency} Denomination
              </label>

              {isNgn ? (
                /* NGN DENOMINATIONS: ₦1,000, ₦5,000, ₦10,000, ₦20,000 */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NGN_PRESET_AMOUNTS.map((item) => (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => {
                        setSelectedNgnAmount(item.amount);
                        setIsCustomAmount(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        !isCustomAmount && selectedNgnAmount === item.amount
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-sm font-black block text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block truncate">{item.desc}</span>
                      {item.popular && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}

                  {/* Custom Amount Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomAmount(true)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isCustomAmount
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-black block text-white">Custom ₦</span>
                    <span className="text-[10px] text-zinc-400">Enter Any Amount</span>
                  </button>
                </div>
              ) : (
                /* USD DENOMINATIONS: $5, $10, $25, $50, $100 */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {USD_PRESET_AMOUNTS.map((item) => (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => {
                        setSelectedUsdAmount(item.amount);
                        setIsCustomAmount(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        !isCustomAmount && selectedUsdAmount === item.amount
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-sm font-black block text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block truncate">{item.desc}</span>
                      {item.popular && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}

                  {/* Custom USD Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomAmount(true)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isCustomAmount
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-black block text-white">Custom $</span>
                    <span className="text-[10px] text-zinc-400">Enter Any USD</span>
                  </button>
                </div>
              )}

              {isCustomAmount && (
                <div className="mt-2">
                  <input
                    type="number"
                    min={isNgn ? 1000 : 5}
                    step={isNgn ? 500 : 1}
                    value={customAmountInput}
                    onChange={(e) => setCustomAmountInput(e.target.value)}
                    placeholder={
                      isNgn
                        ? 'Enter amount in ₦ (minimum ₦1,000)'
                        : 'Enter amount in $ (minimum $5)'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* STEP 2: RECIPIENT & SENDER DETAILS */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                2. Recipient Information &amp; Message
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Recipient Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Victor Okafor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Recipient Email <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Your Name (Sender)</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Raymond"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Card Theme</label>
                  <select
                    value={cardTheme}
                    onChange={(e) => setCardTheme(e.target.value as CardTheme)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="gold">✨ Luxury Gold Edition</option>
                    <option value="dark">🖤 Midnight Dark Edition</option>
                    <option value="creator">🎨 Creator Studio Edition</option>
                    <option value="vip">💎 VIP Emerald Edition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Gift Note / Message</label>
                <textarea
                  rows={2}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Add a personalized greeting for your friend..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Paystack Multi-Currency Processing Notice */}
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isNgn
                    ? 'Paystack NGN Gateway (Bank, Card, USSD)'
                    : 'Paystack Multi-Currency USD Checkout (International Cards)'}
                </span>
              </span>
              <span className="text-amber-400 font-bold">Instant 100% Redemption</span>
            </div>

            {/* Submit Purchase Button */}
            <button
              type="submit"
              id="buy-gift-card-submit-btn"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing {activeCurrency} Paystack Payment &amp; Voucher...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay {currentDisplayFormatted} via Paystack &amp; Generate {activeCurrency} Card
                  </span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* SUCCESS SCREEN WITH INSTANT VOUCHER DELIVERY */
          <div className="p-6 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 fill-emerald-500/20" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                {purchasedCard.currency} Gift Card Successfully Created
              </span>
              <h3 className="text-2xl font-black text-white mt-2">ARIMO Gift Card Ready!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Your{' '}
                <strong className="text-amber-400">
                  {purchasedCard.currency === 'NGN'
                    ? `₦${purchasedCard.initialBalanceNaira.toLocaleString()}`
                    : `$${purchasedCard.initialBalanceUsd}`}
                </strong>{' '}
                gift card has been generated and delivered to{' '}
                <strong className="text-white">{purchasedCard.recipientEmail}</strong>.
              </p>
            </div>

            {/* Claim Code Box */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-zinc-300">Official Claim Code:</span>
                <span className="text-emerald-400 font-bold">
                  {purchasedCard.currency} Active &amp; Ready
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-wider">
                  {purchasedCard.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(purchasedCard.code)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800">
                <div>
                  <span className="text-zinc-500 block">Recipient:</span>
                  <span className="text-zinc-200 font-bold">{purchasedCard.recipientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block">Currency &amp; Value:</span>
                  <span className="text-amber-400 font-black">
                    {purchasedCard.currency === 'NGN'
                      ? `₦${purchasedCard.initialBalanceNaira.toLocaleString()} NGN`
                      : `$${purchasedCard.initialBalanceUsd} USD`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: WhatsApp Share + Download Voucher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🎁 Hello ${purchasedCard.recipientName}! You have received an official ARIMO STORE HUB Gift Card worth ${
                    purchasedCard.currency === 'NGN'
                      ? `₦${purchasedCard.initialBalanceNaira.toLocaleString()}`
                      : `$${purchasedCard.initialBalanceUsd}`
                  }.\n\nYour Gift Card Code: *${purchasedCard.code}*\n\nRedeem here: https://arimostore.com`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => handleDownloadVoucher(purchasedCard)}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Voucher (.txt)</span>
              </button>
            </div>

            {/* Quick Redeem Now Shortcut */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onRedeemNow) onRedeemNow(purchasedCard);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span>Shop Digital Products &amp; Redeem Code Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
