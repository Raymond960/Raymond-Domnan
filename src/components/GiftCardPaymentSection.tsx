import React, { useState } from 'react';
import {
  CreditCard,
  Gift,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Lock,
  ExternalLink
} from 'lucide-react';
import { CurrencyCode, GiftCardBrand, GiftCardItem } from '../types';
import {
  GIFT_CARD_BRANDS,
  GiftCardBrandMeta,
  autoDetectBrand,
  verifyGiftCard,
  deductGiftCardBalance,
  VerificationResult
} from '../utils/giftCardUtils';
import { formatCurrency } from '../utils/currencyUtils';
import { GiftCardBrandIcon } from './GiftCardIcons';
import { triggerSecurityAlert, logSecurityEvent } from '../utils/securitySystem';

interface AppliedGiftCard {
  card: GiftCardItem;
  appliedAmountNaira: number;
  appliedAmountUsd: number;
  remainingCardBalanceNaira: number;
  remainingCardBalanceUsd: number;
}

interface GiftCardPaymentSectionProps {
  totalNaira: number;
  totalUsd: number;
  currency: CurrencyCode;
  customerName: string;
  customerEmail: string;
  onPaymentComplete: (details: {
    appliedCards: AppliedGiftCard[];
    totalPaidNaira: number;
    totalPaidUsd: number;
    paymentMethodSummary: string;
  }) => void;
  onPayRemainingWithGateway?: (remainingNaira: number, remainingUsd: number) => void;
  onOpenBuyGiftCard?: () => void;
}

export const GiftCardPaymentSection: React.FC<GiftCardPaymentSectionProps> = ({
  totalNaira,
  totalUsd,
  currency,
  customerName,
  customerEmail,
  onPaymentComplete,
  onPayRemainingWithGateway,
  onOpenBuyGiftCard
}) => {
  const [cardCode, setCardCode] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<GiftCardBrand>('arimo');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedCard, setVerifiedCard] = useState<GiftCardItem | null>(null);
  const [verificationSource, setVerificationSource] = useState<string | null>(null);
  const [appliedCards, setAppliedCards] = useState<AppliedGiftCard[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [failedCardAttempts, setFailedCardAttempts] = useState(0);

  const isNgn = currency === 'NGN';

  // Calculate cumulative applied totals
  const totalAppliedNaira = appliedCards.reduce((acc, c) => acc + c.appliedAmountNaira, 0);
  const totalAppliedUsd = appliedCards.reduce((acc, c) => acc + c.appliedAmountUsd, 0);

  const remainingDueNaira = Math.max(0, totalNaira - totalAppliedNaira);
  const remainingDueUsd = Math.max(0, totalUsd - totalAppliedUsd);

  const isFullyCovered = isNgn ? remainingDueNaira <= 0 : remainingDueUsd <= 0;

  // Auto-detect brand when typing/pasting
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCardCode(val);
    setVerificationError(null);
    if (val.length >= 3) {
      const detected = autoDetectBrand(val);
      setSelectedBrand(detected);
    }
  };

  const handleVerifyCard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerificationError(null);

    if (!cardCode.trim()) {
      setVerificationError('Please enter your 16-25 digit gift card code.');
      return;
    }

    // Check if card is already applied
    const alreadyApplied = appliedCards.some(
      (c) => c.card.code.toUpperCase() === cardCode.trim().toUpperCase()
    );
    if (alreadyApplied) {
      setVerificationError('This gift card code is already applied to this order.');
      return;
    }

    setIsVerifying(true);

    try {
      // Pass currency to enforce strict multi-currency matching at checkout
      const result: VerificationResult = await verifyGiftCard(cardCode, selectedBrand, currency);
      setIsVerifying(false);

      if (!result.success || !result.card) {
        const nextFailed = failedCardAttempts + 1;
        setFailedCardAttempts(nextFailed);
        setVerificationError(result.error || 'Gift card verification failed. Please check the code.');

        if (nextFailed >= 3) {
          triggerSecurityAlert({
            type: 'giftcard_failed_attempts',
            reason: `3 failed gift card code redemption attempts at checkout: "${cardCode}"`,
            ip: '102.89.44.18',
            location: 'Nigeria',
            actionTaken: 'Flagged'
          });
        }

        logSecurityEvent({
          action: 'giftcard_failed_attempts',
          description: `Failed gift card redemption: ${cardCode}`,
          ip: '102.89.44.18',
          location: 'Nigeria',
          status: 'BLOCKED',
          riskLevel: nextFailed >= 3 ? 'HIGH' : 'MEDIUM'
        });
        return;
      }

      if (result.card.currency !== currency) {
        setVerificationError(
          `Currency Mismatch: This order is in ${currency}. You entered a ${result.card.currency} gift card. Please use a ${currency} gift card.`
        );
        return;
      }

      setVerifiedCard(result.card);
      setVerificationSource(result.sourceApi || 'Paystack & Verified Gift Card Network');
    } catch (err: any) {
      setIsVerifying(false);
      setVerificationError(err?.message || 'Verification service timed out. Please try again.');
    }
  };

  const handleApplyVerifiedCard = () => {
    if (!verifiedCard) return;

    if (isNgn) {
      const availableNaira = verifiedCard.currentBalanceNaira;
      const neededNaira = remainingDueNaira;
      const coverNaira = Math.min(availableNaira, neededNaira);
      const remainingCardNaira = availableNaira - coverNaira;

      const newApplied: AppliedGiftCard = {
        card: verifiedCard,
        appliedAmountNaira: coverNaira,
        appliedAmountUsd: 0,
        remainingCardBalanceNaira: remainingCardNaira,
        remainingCardBalanceUsd: 0
      };

      setAppliedCards((prev) => [...prev, newApplied]);
    } else {
      const availableUsd = verifiedCard.currentBalanceUsd;
      const neededUsd = remainingDueUsd;
      const coverUsd = Math.min(availableUsd, neededUsd);
      const remainingCardUsd = availableUsd - coverUsd;

      const newApplied: AppliedGiftCard = {
        card: verifiedCard,
        appliedAmountNaira: 0,
        appliedAmountUsd: coverUsd,
        remainingCardBalanceNaira: 0,
        remainingCardBalanceUsd: remainingCardUsd
      };

      setAppliedCards((prev) => [...prev, newApplied]);
    }

    setVerifiedCard(null);
    setCardCode('');
  };

  const handleCompleteOrder = () => {
    setIsProcessingOrder(true);

    setTimeout(() => {
      // Deduct from storage for each applied card in its native currency
      appliedCards.forEach((c) => {
        const deductAmount = isNgn ? c.appliedAmountNaira : c.appliedAmountUsd;
        deductGiftCardBalance(c.card.code, deductAmount, currency);
      });

      const summary =
        appliedCards.length === 1
          ? `GIFT CARD (${appliedCards[0].card.brandName})`
          : `GIFT CARDS (${appliedCards.map((c) => c.card.brandName).join(', ')})`;

      setIsProcessingOrder(false);
      onPaymentComplete({
        appliedCards,
        totalPaidNaira: totalAppliedNaira,
        totalPaidUsd: totalAppliedUsd,
        paymentMethodSummary: summary
      });
    }, 850);
  };

  const handleQuickPasteDemo = (code: string, brand: GiftCardBrand) => {
    setCardCode(code);
    setSelectedBrand(brand);
    setVerificationError(null);
  };

  const currentBrandMeta = GIFT_CARD_BRANDS.find((b) => b.id === selectedBrand) || GIFT_CARD_BRANDS[0];

  // Tailored demo chips strictly filtered by the order currency
  const ngnDemoChips = [
    { code: 'ARIMO-NGN-10000', label: 'ARIMO ₦10,000', brand: 'arimo' as GiftCardBrand },
    { code: 'ARIMO-NGN-5000', label: 'ARIMO ₦5,000', brand: 'arimo' as GiftCardBrand },
    { code: 'ARIMO-NGN-20000', label: 'ARIMO ₦20,000', brand: 'arimo' as GiftCardBrand },
    { code: 'STEAM-NGN-15000', label: 'Steam ₦15,000', brand: 'steam' as GiftCardBrand },
    { code: 'AMZN-NGN-10000', label: 'Amazon ₦10,000', brand: 'amazon' as GiftCardBrand }
  ];

  const usdDemoChips = [
    { code: 'ARIMO-USD-50', label: 'ARIMO $50 USD', brand: 'arimo' as GiftCardBrand },
    { code: 'ARIMO-USD-25', label: 'ARIMO $25 USD', brand: 'arimo' as GiftCardBrand },
    { code: 'ARIMO-USD-10', label: 'ARIMO $10 USD', brand: 'arimo' as GiftCardBrand },
    { code: 'STEAM-W79K-88Q2-99XP', label: 'Steam $50 USD', brand: 'steam' as GiftCardBrand },
    { code: 'APPL-992K-11PL-44XZ', label: 'Apple $25 USD', brand: 'apple' as GiftCardBrand },
    { code: 'AMZN-4819-2048-9102', label: 'Amazon $20 USD', brand: 'amazon' as GiftCardBrand },
    { code: 'GPLAY-7712-9901-3321', label: 'Google $15 USD', brand: 'googleplay' as GiftCardBrand }
  ];

  const activeDemoChips = isNgn ? ngnDemoChips : usdDemoChips;

  return (
    <div id="gift-card-payment-section" className="space-y-5 animate-in fade-in duration-200">
      {/* Trust & Security Badge */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
              <span>Pay With Gift Card</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40">
                {currency} Only
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                Live Verification
              </span>
            </h4>
            <span className="text-[10px] text-zinc-400">Verified by Paystack + Card API</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {isNgn
              ? 'This checkout is in NGN (₦). Redeem valid NGN gift cards or official ARIMO NGN vouchers.'
              : 'This checkout is in USD ($). Redeem valid USD gift cards or official ARIMO USD vouchers.'}
          </p>
        </div>
      </div>

      {/* Brand Selection Chips */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          1. Select Gift Card Provider
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GIFT_CARD_BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                type="button"
                id={`select-brand-${brand.id}`}
                onClick={() => {
                  setSelectedBrand(brand.id);
                  setVerificationError(null);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="shrink-0">
                  <GiftCardBrandIcon brand={brand.id} size="sm" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{brand.shortLabel}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">16-25 digits</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Input & Verification Box */}
      {!isFullyCovered && (
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-zinc-300">
              2. Enter {currency} Gift Card Code <span className="text-amber-400">*</span>
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">
              {currentBrandMeta.formatDescription}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="gift-card-code-input"
                value={cardCode}
                onChange={handleCodeChange}
                placeholder={
                  isNgn
                    ? 'e.g. ARIMO-NGN-10000 or STEAM-NGN-XXXX'
                    : 'e.g. ARIMO-USD-50 or STEAM-W79K-88Q2-99XP'
                }
                className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 uppercase transition-colors"
              />
              {cardCode && (
                <button
                  type="button"
                  onClick={() => setCardCode('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              id="verify-gift-card-btn"
              onClick={handleVerifyCard}
              disabled={isVerifying || !cardCode.trim()}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying API...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Card</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Test Code Chips */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
              <span>{currency} Test Codes (Click to auto-fill):</span>
              {onOpenBuyGiftCard && (
                <button
                  type="button"
                  onClick={onOpenBuyGiftCard}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Buy {currency} Gift Card →
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeDemoChips.map((chip) => (
                <button
                  key={chip.code}
                  type="button"
                  onClick={() => handleQuickPasteDemo(chip.code, chip.brand)}
                  className="px-2 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Error */}
          {verificationError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{verificationError}</span>
            </div>
          )}

          {/* Verified Card Result Popover */}
          {verifiedCard && (
            <div className="p-4 rounded-2xl bg-zinc-950 border-2 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">
                      {verifiedCard.brandName} Verified
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Code: {verifiedCard.code}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Available Balance</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400">
                    {isNgn
                      ? `₦${verifiedCard.currentBalanceNaira.toLocaleString()} NGN`
                      : `$${verifiedCard.currentBalanceUsd} USD`}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-300">
                  Will apply to order:{' '}
                  <strong className="text-amber-400">
                    {isNgn
                      ? `₦${Math.min(verifiedCard.currentBalanceNaira, remainingDueNaira).toLocaleString()}`
                      : `$${Math.min(verifiedCard.currentBalanceUsd, remainingDueUsd).toFixed(2)}`}
                  </strong>
                </span>
                <span className="text-zinc-400 text-[11px]">
                  {verificationSource}
                </span>
              </div>

              <button
                type="button"
                id="apply-gift-card-btn"
                onClick={handleApplyVerifiedCard}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply This {currency} Gift Card to Order</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Applied Cards List */}
      {appliedCards.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Applied {currency} Gift Cards ({appliedCards.length})</span>
            </h4>
            <span className="text-xs font-bold text-amber-400">
              Total Applied:{' '}
              {isNgn
                ? `₦${totalAppliedNaira.toLocaleString()} NGN`
                : `$${totalAppliedUsd.toFixed(2)} USD`}
            </span>
          </div>

          <div className="space-y-2">
            {appliedCards.map((applied, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <GiftCardBrandIcon brand={applied.card.brand} size="sm" />
                  <div>
                    <span className="font-bold text-white block">{applied.card.brandName}</span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {applied.card.code}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">
                    {isNgn
                      ? `-₦${applied.appliedAmountNaira.toLocaleString()}`
                      : `-$${applied.appliedAmountUsd.toFixed(2)}`}
                  </span>
                  {isNgn && applied.remainingCardBalanceNaira > 0 && (
                    <span className="text-[10px] text-zinc-500">
                      Card Left: ₦{applied.remainingCardBalanceNaira.toLocaleString()}
                    </span>
                  )}
                  {!isNgn && applied.remainingCardBalanceUsd > 0 && (
                    <span className="text-[10px] text-zinc-500">
                      Card Left: ${applied.remainingCardBalanceUsd.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mathematical Balance vs Order Total Breakdown */}
          <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Order Subtotal:</span>
              <span>{formatCurrency(totalUsd, currency, totalNaira)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Gift Card Deduction:</span>
              <span>
                {isNgn
                  ? `-₦${totalAppliedNaira.toLocaleString()}`
                  : `-$${totalAppliedUsd.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-black pt-1 border-t border-zinc-800/80">
              <span className="text-white">Remaining Balance Due:</span>
              <span className={(isNgn ? remainingDueNaira : remainingDueUsd) > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                {isNgn
                  ? remainingDueNaira > 0
                    ? `₦${remainingDueNaira.toLocaleString()} NGN`
                    : '₦0.00 (Fully Paid! 🎉)'
                  : remainingDueUsd > 0
                  ? `$${remainingDueUsd.toFixed(2)} USD`
                  : '$0.00 (Fully Paid! 🎉)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACTION SCENARIOS */}
      {/* CASE A: FULLY COVERED -> Complete Order Instantly */}
      {isFullyCovered ? (
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Order 100% Covered by Gift Card</strong>
              <span>No additional bank transfer or card charge required. Click below to complete your order and get your download link.</span>
            </div>
          </div>

          <button
            type="button"
            id="complete-gift-card-order-btn"
            onClick={handleCompleteOrder}
            disabled={isProcessingOrder}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessingOrder ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating Digital Tokens &amp; Licenses...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span>Complete Order with Gift Card (Instant Delivery)</span>
              </>
            )}
          </button>
        </div>
      ) : appliedCards.length > 0 ? (
        /* CASE B: PARTIALLY COVERED -> Show Split Options */
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Partial Coverage Applied (
                {isNgn
                  ? `₦${totalAppliedNaira.toLocaleString()} of ₦${totalNaira.toLocaleString()}`
                  : `$${totalAppliedUsd.toFixed(2)} of $${totalUsd.toFixed(2)}`}
                )
              </span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Remaining balance of{' '}
              <strong>
                {isNgn
                  ? `₦${remainingDueNaira.toLocaleString()}`
                  : `$${remainingDueUsd.toFixed(2)}`}
              </strong>{' '}
              can be paid by adding another {currency} gift card or using Paystack / Card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option 1: Add another card */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('gift-card-code-input');
                el?.focus();
              }}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Another {currency} Gift Card</span>
            </button>

            {/* Option 2: Pay remaining with bank/card */}
            {onPayRemainingWithGateway && (
              <button
                type="button"
                id="pay-remaining-bank-btn"
                onClick={() => onPayRemainingWithGateway(remainingDueNaira, remainingDueUsd)}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>
                  {isNgn
                    ? `Pay Remaining ₦${remainingDueNaira.toLocaleString()} with Bank/Card`
                    : `Pay Remaining $${remainingDueUsd.toFixed(2)} with Paystack/Card`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
