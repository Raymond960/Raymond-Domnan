import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  Phone,
  CheckCircle2,
  Download,
  FolderHeart,
  Lock,
  Copy,
  Check,
  Zap,
  Globe,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Clock,
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { CartItem, ClientPurchase, CurrencyCode, LicenseType, PaymentGateway, ProductItem } from '../types';
import { downloadDigitalAsset, generateLicenseKey } from '../utils/fileDownloader';
import { CURRENCY_CONFIGS, formatCurrency, getAvailableGateways } from '../utils/currencyUtils';
import { generateExpiringDownloadToken } from '../utils/securityUtils';
import { AntiSpamCaptcha } from './AntiSpamCaptcha';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';
import { GiftCardPaymentSection } from './GiftCardPaymentSection';
import { Gift } from 'lucide-react';
import { triggerSecurityAlert, logSecurityEvent } from '../utils/securitySystem';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  totalAmount: number;
  totalNaira: number;
  totalUsd: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess: (purchase: ClientPurchase) => void;
  onOpenVault?: () => void;
  onOpenBuyGiftCard?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  totalAmount,
  totalNaira,
  totalUsd,
  customerName: initialName = '',
  customerEmail: initialEmail = '',
  customerPhone: initialPhone = '',
  onPaymentSuccess,
  onOpenVault,
  onOpenBuyGiftCard
}) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(
    currency === 'NGN' ? 'paystack' : 'stripe'
  );

  // Form input state
  const [fullName, setFullName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [country, setCountry] = useState(currency === 'NGN' ? 'Nigeria' : 'United States');

  // Anti-spam captcha state
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(true);

  // Test mode flag
  const [isTestMode, setIsTestMode] = useState(true);

  // Checkout sub-tabs / methods
  const [payMethod, setPayMethod] = useState<'card' | 'transfer' | 'ussd' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0840 8408 4081');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [completedPurchase, setCompletedPurchase] = useState<ClientPurchase | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableGateways = getAvailableGateways(currency);
  const currentConfig = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;

  const handleGiftCardPaymentComplete = (details: {
    appliedCards: any[];
    totalPaidNaira: number;
    totalPaidUsd: number;
    paymentMethodSummary: string;
  }) => {
    try {
      const custName = fullName.trim() || 'Arimo Gift Card User';
      const custEmail = email.trim() || 'customer@arimostore.com';
      const custPhone = phone.trim() || '+2348000000000';

      const orderId = `ORD-GIFT-${Math.floor(100000 + Math.random() * 900000)}`;
      const ref = `gift_ref_${Math.random().toString(36).substring(2, 10)}`;

      const licenseKeys = items.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        key: generateLicenseKey(`ARIMO-GIFT`),
        licenseType: item.selectedLicense
      }));

      const downloads = items.map((item) => {
        const tokenData = generateExpiringDownloadToken(orderId, item.product.id, 24);
        return {
          productId: item.product.id,
          fileName: item.product.downloadFileName || `${item.product.title.replace(/\s+/g, '_')}_Package.pdf`,
          format: item.product.fileFormats?.[0] || 'PDF & Digital Access',
          fileSize: item.product.fileSizeBytes || '15 MB',
          version: item.product.version || 'v2026.1',
          downloadToken: tokenData.token,
          downloadExpiresAt: tokenData.expiresAt
        };
      });

      const purchase: ClientPurchase = {
        orderId,
        purchaseDate: new Date().toISOString(),
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        customerCountry: country,
        items,
        currency,
        subtotal: totalAmount,
        discount: 0,
        total: totalAmount,
        subtotalNaira: totalNaira,
        totalNaira: totalNaira,
        totalUsd: totalUsd,
        paymentGateway: 'giftcard',
        paymentMethod: details.paymentMethodSummary,
        paymentReference: ref,
        status: 'paid',
        licenseKeys,
        downloads
      };

      setCompletedPurchase(purchase);
      setIsProcessing(false);
      setIsCompleted(true);
      onPaymentSuccess(purchase);
    } catch (err: any) {
      setPaymentError(err?.message || 'Error processing gift card payment. Please retry.');
    }
  };

  const handleFillTestData = (gw: PaymentGateway) => {
    setPaymentError(null);
    setFullName('Raymond Arimo (Tester)');
    setEmail('tester@arimodesign.com');
    setPhone('+2348001234567');
    setIsCaptchaVerified(true);
    if (gw === 'paystack' || gw === 'flutterwave') {
      setCardNumber('4084 0840 8408 4081');
      setCardExpiry('12/28');
      setCardCvv('123');
    } else {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvv('123');
    }
  };

  const handleSimulatePaymentFailure = () => {
    setPaymentError(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentError(
        selectedGateway === 'paystack'
          ? 'Paystack Error: Transaction declined by issuing bank (Insufficient funds / Invalid CVV). No money was debited.'
          : 'Stripe Error: Card verification failed (Do not honor / 3DS authentication expired). No money was debited.'
      );
    }, 700);
  };

  const handleInstantQuickTestCheckout = (gateway: PaymentGateway) => {
    try {
      setPaymentError(null);
      const custName = fullName.trim() || 'Raymond Test User';
      const custEmail = email.trim() || 'raymond.test@arimocreator.com';
      const custPhone = phone.trim() || '+2348012345678';
      
      setIsProcessing(true);

      setTimeout(() => {
        try {
          const orderId = `ORD-TEST-${gateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
          const ref = `${gateway}_test_ref_${Math.random().toString(36).substring(2, 10)}`;

          const licenseKeys = items.map((item) => ({
            productId: item.product.id,
            productTitle: item.product.title,
            key: generateLicenseKey(`ARIMO-${currency}`),
            licenseType: item.selectedLicense
          }));

          const downloads = items.map((item) => {
            const tokenData = generateExpiringDownloadToken(orderId, item.product.id, 24);
            return {
              productId: item.product.id,
              fileName: item.product.downloadFileName || `${item.product.title.replace(/\s+/g, '_')}_Package.pdf`,
              format: item.product.fileFormats?.[0] || 'PDF & Digital Access',
              fileSize: item.product.fileSizeBytes || '15 MB',
              version: item.product.version || 'v2026.1',
              downloadToken: tokenData.token,
              downloadExpiresAt: tokenData.expiresAt
            };
          });

          const purchase: ClientPurchase = {
            orderId,
            purchaseDate: new Date().toISOString(),
            customerName: custName,
            customerEmail: custEmail,
            customerPhone: custPhone,
            customerCountry: country,
            items,
            currency,
            subtotal: totalAmount,
            discount: 0,
            total: totalAmount,
            subtotalNaira: totalNaira,
            totalNaira: totalNaira,
            totalUsd: totalUsd,
            paymentGateway: gateway,
            paymentMethod: `${gateway.toUpperCase()} (TEST SIMULATION)`,
            paymentReference: ref,
            status: 'paid',
            licenseKeys,
            downloads
          };

          setCompletedPurchase(purchase);
          setIsProcessing(false);
          setIsCompleted(true);
          onPaymentSuccess(purchase);

          // Security Alert for High-Value Orders (>₦50,000 or >$100)
          if ((purchase.totalNaira && purchase.totalNaira >= 50000) || (purchase.totalUsd && purchase.totalUsd >= 100) || purchase.total >= 50000) {
            triggerSecurityAlert({
              type: 'large_payment_detected',
              reason: `High-value order captured: ${purchase.currency === 'NGN' ? '₦' : '$'}${purchase.total.toLocaleString()} from ${purchase.customerEmail}`,
              ip: '102.89.44.18',
              location: `${purchase.customerCountry || 'Nigeria'}`,
              actionTaken: 'Flagged'
            });

            logSecurityEvent({
              action: 'large_payment_detected',
              description: `High-value payment captured: ${purchase.orderId} (${purchase.currency} ${purchase.total})`,
              ip: '102.89.44.18',
              location: `${purchase.customerCountry || 'Nigeria'}`,
              status: 'ALERT_TRIGGERED',
              riskLevel: 'MEDIUM'
            });
          }
        } catch (err: any) {
          setIsProcessing(false);
          setPaymentError(err?.message || 'A network error occurred while generating your digital tokens. Please try again.');
        }
      }, 600);
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err?.message || 'Payment service is temporarily unreachable. Please try again.');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!email || !fullName) {
      alert('Please fill in your name and email to receive your digital download license.');
      return;
    }

    if (!isCaptchaVerified) {
      alert('Please complete the anti-spam security verification before continuing.');
      return;
    }

    // Check if card is explicitly flagged for test failure
    if (cardNumber.replace(/\s+/g, '').startsWith('0000')) {
      handleSimulatePaymentFailure();
      return;
    }

    setIsProcessing(true);

    // Secure tokenized payment transaction flow
    setTimeout(() => {
      try {
        const orderId = `ORD-${selectedGateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const ref = `${selectedGateway}_ref_${Math.random().toString(36).substring(2, 12)}`;

        const licenseKeys = items.map((item) => ({
          productId: item.product.id,
          productTitle: item.product.title,
          key: generateLicenseKey(`ARIMO-${currency}`),
          licenseType: item.selectedLicense
        }));

        // Generate 24-hour expiring temporary download tokens for each item
        const downloads = items.map((item) => {
          const tokenData = generateExpiringDownloadToken(orderId, item.product.id, 24);
          return {
            productId: item.product.id,
            fileName: item.product.downloadFileName || `${item.product.title.replace(/\s+/g, '_')}_Package.pdf`,
            format: item.product.fileFormats?.[0] || 'PDF & Digital Access',
            fileSize: item.product.fileSizeBytes || '15 MB',
            version: item.product.version || 'v2026.1',
            downloadToken: tokenData.token,
            downloadExpiresAt: tokenData.expiresAt
          };
        });

        const purchase: ClientPurchase = {
          orderId,
          purchaseDate: new Date().toISOString(),
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          customerCountry: country,
          items,
          currency,
          subtotal: totalAmount,
          discount: 0,
          total: totalAmount,
          subtotalNaira: totalNaira,
          totalNaira: totalNaira,
          totalUsd: totalUsd,
          paymentGateway: selectedGateway,
          paymentMethod: `${selectedGateway.toUpperCase()} (${payMethod.toUpperCase()})`,
          paymentReference: ref,
          status: 'paid',
          licenseKeys,
          downloads
        };

        setCompletedPurchase(purchase);
        setIsProcessing(false);
        setIsCompleted(true);
        onPaymentSuccess(purchase);

        // Security Alert for High-Value Orders (>₦50,000 or >$100)
        if ((purchase.totalNaira && purchase.totalNaira >= 50000) || (purchase.totalUsd && purchase.totalUsd >= 100) || purchase.total >= 50000) {
          triggerSecurityAlert({
            type: 'large_payment_detected',
            reason: `High-value order captured: ${purchase.currency === 'NGN' ? '₦' : '$'}${purchase.total.toLocaleString()} from ${purchase.customerEmail}`,
            ip: '102.89.44.18',
            location: `${purchase.customerCountry || 'Nigeria'}`,
            actionTaken: 'Flagged'
          });

          logSecurityEvent({
            action: 'large_payment_detected',
            description: `High-value payment captured: ${purchase.orderId} (${purchase.currency} ${purchase.total})`,
            ip: '102.89.44.18',
            location: `${purchase.customerCountry || 'Nigeria'}`,
            status: 'ALERT_TRIGGERED',
            riskLevel: 'MEDIUM'
          });
        }
      } catch (err: any) {
        setIsProcessing(false);
        setPaymentError(err?.message || 'Payment processing was interrupted by a network timeout. Please click Try Again.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden my-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Secure Checkout</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">
                  256-Bit SSL Encrypted
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Instant delivery to your email and Arimo Digital Vault
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentError ? (
          /* PAYMENT ERROR / DECLINE SCREEN - NEVER WHITE SCREEN */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_30px_rgba(239,68,68,0.25)]">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
                Transaction Incomplete
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Payment Unsuccessful</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                No funds were deducted from your account. Your cart and selected items are preserved safely.
              </p>
            </div>

            {/* Error Details Box */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-red-900/40 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Gateway Notice ({selectedGateway.toUpperCase()}):</span>
              </div>
              <p className="text-xs text-zinc-300 font-mono pl-6 leading-relaxed">
                {paymentError}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Primary Try Again Button */}
              <button
                type="button"
                id="payment-try-again-btn"
                onClick={() => setPaymentError(null)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again &amp; Retry Checkout</span>
              </button>

              {/* 1-Click Test Bypass */}
              <button
                type="button"
                onClick={() => handleInstantQuickTestCheckout(selectedGateway)}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Switch to 1-Click Instant Test Mode</span>
              </button>

              {/* Alternative WhatsApp Support */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                    `Hello Raymond, my checkout for ${items.map((i) => i.product.title).join(', ')} (${formatCurrency(totalAmount, currency, totalNaira)}) had an issue: ${paymentError}. I want to complete my order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pay via Direct WhatsApp Transfer</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel &amp; Return to Store
                </button>
              </div>
            </div>
          </div>
        ) : !isCompleted ? (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            {/* Prominent Test Mode Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>🧪 Test Mode Active (Paystack &amp; Stripe)</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/40">
                  Zero Real Charges
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                You are in test sandbox mode. Click below to simulate an instant purchase or test the error recovery flow.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleInstantQuickTestCheckout(selectedGateway)}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-zinc-950" />
                  <span>⚡ 1-Click Success</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePaymentFailure}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>🧪 Test "Try Again" Screen</span>
                </button>
              </div>
            </div>

            {/* PAYMENT METHOD TABS (Card, Bank Transfer, USSD, Gift Cards) */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  id="pay-method-card"
                  onClick={() => {
                    setPayMethod('card');
                    if (selectedGateway === 'giftcard') setSelectedGateway(currency === 'NGN' ? 'paystack' : 'stripe');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    payMethod === 'card' && selectedGateway !== 'giftcard'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Card</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Visa, Mastercard</p>
                </button>

                <button
                  type="button"
                  id="pay-method-transfer"
                  onClick={() => {
                    setPayMethod('transfer');
                    if (selectedGateway === 'giftcard') setSelectedGateway('paystack');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    payMethod === 'transfer' && selectedGateway !== 'giftcard'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Bank Transfer</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Direct Transfer</p>
                </button>

                <button
                  type="button"
                  id="pay-method-ussd"
                  onClick={() => {
                    setPayMethod('ussd');
                    if (selectedGateway === 'giftcard') setSelectedGateway('paystack');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    payMethod === 'ussd' && selectedGateway !== 'giftcard'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>USSD (NG)</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">*737#, *919#</p>
                </button>

                <button
                  type="button"
                  id="pay-method-giftcard"
                  onClick={() => {
                    setSelectedGateway('giftcard');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedGateway === 'giftcard'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Gift Cards</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Steam, Apple, Arimo</p>
                </button>
              </div>
            </div>

            {/* Order Summary Pill */}
            <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/90 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                <span className="font-bold text-zinc-300">
                  {items.map((i) => i.product.title).join(', ').substring(0, 45)}...
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-xs font-bold text-zinc-300">Total Due Today:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-400">
                    {formatCurrency(totalUsd, currency, totalNaira)}
                  </span>
                  {currency !== 'NGN' && (
                    <span className="block text-[11px] text-zinc-500 font-medium">
                      ≈ ₦{totalNaira.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Details Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Your Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Raymond Arimo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Your Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Ghana">🇬🇭 Ghana</option>
                    <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                    <option value="South Africa">🇿🇦 South Africa</option>
                    <option value="Other">🌍 Other International</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GATEWAY SPECIFIC UI OR GIFT CARD PAYMENT SECTION */}
            {selectedGateway === 'giftcard' ? (
              <GiftCardPaymentSection
                totalNaira={totalNaira}
                totalUsd={totalUsd}
                currency={currency}
                customerName={fullName}
                customerEmail={email}
                onPaymentComplete={handleGiftCardPaymentComplete}
                onPayRemainingWithGateway={(remNaira, remUsd) => {
                  setSelectedGateway(currency === 'NGN' ? 'paystack' : 'stripe');
                  setPayMethod('card');
                }}
                onOpenBuyGiftCard={onOpenBuyGiftCard}
              />
            ) : payMethod === 'transfer' ? (
              /* =========================================================================
                 METHOD 2: PAY DIRECTLY FROM BANK (BANK TRANSFER)
              ========================================================================= */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>DIRECT BANK TRANSFER DETAILS</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      Live Virtual Account
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Bank Name</span>
                      <span className="font-black text-white">Wema Bank / Paystack Titan</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Account Number</span>
                        <span className="font-mono font-black text-amber-400 text-sm">9920148592</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('9920148592');
                          alert('Account number copied: 9920148592');
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs cursor-pointer"
                        title="Copy Account Number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Account Name</span>
                      <span className="font-bold text-zinc-200">ARIMO STORE HUB / DIGITAL</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Exact Amount to Send</span>
                      <span className="font-black text-emerald-400">
                        {currency === 'NGN' ? `₦${totalNaira.toLocaleString()}` : `$${totalUsd.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Make a transfer from your banking app or USSD to the account above. Your download token will activate automatically once confirmed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Bank Transfer Receipt...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Sent the Money • Confirm Payment</span>
                    </>
                  )}
                </button>
              </div>
            ) : payMethod === 'ussd' ? (
              /* =========================================================================
                 METHOD 3: USSD (FOR NIGERIA)
              ========================================================================= */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>NIGERIA USSD INSTANT PAYMENT</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">*737#, *919#, *966#</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { bank: 'GTBank', code: `*737*2*${totalNaira}*9920148592#` },
                      { bank: 'Zenith Bank', code: `*966*${totalNaira}*9920148592#` },
                      { bank: 'UBA', code: `*919*3*9920148592*${totalNaira}#` },
                      { bank: 'Access Bank', code: `*901*3*${totalNaira}*9920148592#` },
                      { bank: 'First Bank', code: `*894*${totalNaira}*9920148592#` }
                    ].map((item) => (
                      <div
                        key={item.bank}
                        className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{item.bank}</span>
                          <span className="text-xs font-mono text-amber-400 font-bold">{item.code}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.code);
                            alert(`USSD string copied: ${item.code}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-zinc-400">
                    Dial the USSD string on your registered phone, enter your PIN to authorize, then click below to verify.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Confirming USSD Authorization...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Completed USSD Payment</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* =========================================================================
                 METHOD 1: PAY WITH CARD (VISA, MASTERCARD, VERVE)
              ========================================================================= */
              <>
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Card Details (Visa, Mastercard, Verve)</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-wider">
                      Paystack Protected
                    </span>
                  </div>

                  {/* Card info inputs */}
                  <div className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242 (or any valid card)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors font-mono text-center"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV (123)"
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Channel badges */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>Mastercard • Visa • Verve • Apple Pay</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <Zap className="w-3 h-3 fill-current" /> Instant Vault Activation
                    </span>
                  </div>
                </div>

                {/* Zero-Card Retention Security */}
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-200">Zero-Card-Retention Security:</span>{' '}
                    Your card numbers &amp; CVV are processed directly via PCI-DSS Level 1 tokenized encrypted tunnels. No card details are ever stored on Arimo servers.
                  </div>
                </div>

                {/* Anti-Spam / Bot Challenge */}
                <AntiSpamCaptcha onVerify={(isValid) => setIsCaptchaVerified(isValid)} id="checkout-captcha" />

                {/* Submit Button */}
                <button
                  type="submit"
                  id="confirm-pay-btn"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Card Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay {formatCurrency(totalUsd, currency, totalNaira)} with Card
                      </span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        ) : (
          /* Payment Success Screen */
          <div className="p-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 fill-emerald-500/20" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Payment Successful!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Thank you, <span className="text-amber-400 font-bold">{completedPurchase?.customerName}</span>. Your digital products and commercial licenses have been generated.
              </p>
            </div>

            {/* License Keys & Instant Downloads Box */}
            <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span>Order Reference:</span>
                <span className="font-mono text-amber-400">{completedPurchase?.paymentReference}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                {completedPurchase?.licenseKeys.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-black text-white block">{item.productTitle}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                          {item.key}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(item.key)}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === item.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === item.key ? 'Copied' : 'Copy Key'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        downloadDigitalAsset(
                          completedPurchase.downloads[idx]?.fileName || 'Digital_Package.pdf',
                          item.productTitle,
                          item.key,
                          completedPurchase.downloads[idx]?.format || 'PDF'
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVault();
                }}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FolderHeart className="w-4 h-4 text-amber-400" />
                <span>Open Digital Vault</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
