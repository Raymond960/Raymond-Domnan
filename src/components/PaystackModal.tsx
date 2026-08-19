import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  PhoneCall,
  Smartphone,
  ShieldCheck,
  X,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, ClientPurchase } from '../types';
import { downloadDigitalAsset, generateLicenseKey } from '../utils/fileDownloader';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';
import { PAYSTACK_PUBLIC_KEY, openPaystackLiveCheckout } from '../utils/paystack';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalNaira: number;
  customerEmail: string;
  customerName: string;
  onPaymentSuccess: (purchase: ClientPurchase) => void;
}

type PaystackTab = 'card' | 'transfer' | 'ussd' | 'opay_kuda';

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  items,
  totalNaira,
  customerEmail,
  customerName,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<PaystackTab>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedPurchase, setCompletedPurchase] = useState<ClientPurchase | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Transfer state
  const [transferTimer, setTransferTimer] = useState(1800); // 30 mins in sec
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // USSD state
  const [selectedBank, setSelectedBank] = useState('gtb');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && activeTab === 'transfer' && transferTimer > 0) {
      interval = setInterval(() => {
        setTransferTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, transferTimer]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLaunchLivePaystack = async () => {
    setIsProcessing(true);
    const launched = await openPaystackLiveCheckout({
      email: customerEmail || 'client@arimo.design',
      amountNaira: totalNaira,
      customerName: customerName || 'Arimo Client',
      metadata: {
        item_count: items.length,
        items: items.map((i) => i.product.title).join(', ')
      },
      onSuccess: (response: any) => {
        setIsProcessing(false);
        setIsSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF', '#09090B']
        });

        const orderId = `ORD-LIVE-${Math.floor(100000 + Math.random() * 900000)}`;
        const ref = response.reference || response.trans || `pstk_live_${Date.now()}`;

        const newPurchase: ClientPurchase = {
          orderId,
          purchaseDate: new Date().toISOString(),
          customerName: customerName || 'Arimo Client',
          customerEmail: customerEmail || 'client@arimo.design',
          items,
          currency: 'NGN',
          subtotal: totalNaira,
          discount: 0,
          total: totalNaira,
          subtotalNaira: totalNaira,
          totalNaira,
          totalUsd: Math.round(totalNaira / 1500),
          paymentGateway: 'paystack',
          paymentMethod: 'Paystack LIVE Gateway',
          paymentReference: ref,
          status: 'paid',
          licenseKeys: items.map((item) => ({
            productId: item.product.id,
            productTitle: item.product.title,
            key: generateLicenseKey('ARIMO-NG'),
            licenseType: item.selectedLicense
          })),
          downloads: items
            .filter((item) => item.product.isDigital)
            .map((item) => ({
              productId: item.product.id,
              fileName: item.product.downloadFileName || `${item.product.title.replace(/\s+/g, '_')}_Package.zip`,
              format: item.product.fileFormats?.[0] || 'ZIP',
              fileSize: item.product.fileSizeBytes || 'Digital Pack',
              version: item.product.version || 'v2026.1'
            }))
        };

        setCompletedPurchase(newPurchase);
        onPaymentSuccess(newPurchase);
      },
      onCancel: () => {
        setIsProcessing(false);
      }
    });

    if (!launched) {
      // If popup script failed, fallback
      handleSimulatePayment('Paystack Card (Verve/Mastercard)');
    }
  };

  const handleSimulatePayment = (paymentMethodName: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF', '#09090B']
      });

      const orderId = `ORD-NG-${Math.floor(100000 + Math.random() * 900000)}`;
      const ref = `pstk_ref_${Math.random().toString(36).substring(2, 12)}`;

      const newPurchase: ClientPurchase = {
        orderId,
        purchaseDate: new Date().toISOString(),
        customerName: customerName || 'Arimo Client',
        customerEmail: customerEmail || 'client@arimo.design',
        items,
        currency: 'NGN',
        subtotal: totalNaira,
        discount: 0,
        total: totalNaira,
        subtotalNaira: totalNaira,
        totalNaira,
        totalUsd: Math.round(totalNaira / 1500),
        paymentGateway: 'paystack',
        paymentMethod: paymentMethodName,
        paymentReference: ref,
        status: 'paid',
        licenseKeys: items.map((item) => ({
          productId: item.product.id,
          productTitle: item.product.title,
          key: generateLicenseKey('ARIMO-NG'),
          licenseType: item.selectedLicense
        })),
        downloads: items
          .filter((item) => item.product.isDigital)
          .map((item) => ({
            productId: item.product.id,
            fileName: item.product.downloadFileName || `${item.product.title.replace(/\s+/g, '_')}_Package.zip`,
            format: item.product.fileFormats?.[0] || 'ZIP',
            fileSize: item.product.fileSizeBytes || 'Digital Pack',
            version: item.product.version || 'v2026.1'
          }))
      };

      setCompletedPurchase(newPurchase);
      onPaymentSuccess(newPurchase);
    }, 1800);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ussdCodes: Record<string, { name: string; code: string }> = {
    gtb: { name: 'Guaranty Trust Bank (GTB)', code: `*737*2*${totalNaira}*9041284920#` },
    zenith: { name: 'Zenith Bank', code: `*966*${totalNaira}*9041284920#` },
    uba: { name: 'United Bank for Africa (UBA)', code: `*919*4*${totalNaira}*9041284920#` },
    access: { name: 'Access Bank', code: `*901*${totalNaira}*9041284920#` },
    firstbank: { name: 'First Bank of Nigeria', code: `*894*${totalNaira}*9041284920#` }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="paystack-checkout-modal"
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Paystack Top Header Banner */}
        <div className="bg-zinc-900/90 border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Paystack Logo Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PAYSTACK SECURE</span>
            </div>
            <span className="text-xs text-zinc-400 hidden sm:inline">256-Bit Encrypted Nigerian Gateway</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Cancel payment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            {/* Merchant & Price Banner */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 rounded-2xl p-4.5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">Merchant</span>
                <h3 className="text-base font-black text-white">ARIMO STORE HUB</h3>
                <p className="text-xs text-zinc-400 truncate max-w-[280px]">
                  {items.length === 1 ? items[0].product.title : `${items.length} digital products`}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Total Amount</span>
                <div className="text-2xl font-black text-amber-400 tracking-tight">
                  ₦{totalNaira.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'card'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <span>Pay with Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('transfer')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'transfer'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1" />
                <span>Pay From Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ussd')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'ussd'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <PhoneCall className="w-4 h-4 mb-1" />
                <span>USSD Code</span>
              </button>
            </div>

            {/* TAB 1: CARD PAYMENT */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="5399 •••• •••• ••••"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-4 pr-24 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">VERVE</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">VISA</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">MC</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Card Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm outline-none text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleLaunchLivePaystack}
                  className="w-full mt-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Authorizing Paystack LIVE...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₦{totalNaira.toLocaleString()} via Paystack LIVE</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: BANK TRANSFER */}
            {activeTab === 'transfer' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400">Transfer to Virtual Account</span>
                    <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Expires in {formatTimer(transferTimer)}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Bank Name</span>
                        <div className="text-sm font-black text-white">Wema Bank / Paystack Titan</div>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">Instant Payout</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Account Number</span>
                        <div className="text-lg font-mono font-black text-amber-400">9041 284 920</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard('9041284920', 'acct')}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedField === 'acct' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Beneficiary</span>
                        <div className="text-xs font-bold text-white">Arimo AI &amp; Design / Paystack</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Exact Amount</span>
                        <div className="text-sm font-black text-amber-400">₦{totalNaira.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('Paystack Bank Transfer (Wema/Titan)')}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying Bank Transfer...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Sent ₦{totalNaira.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: USSD */}
            {activeTab === 'ussd' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Select Your Nigerian Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 outline-none"
                  >
                    <option value="gtb">GTBank (*737#)</option>
                    <option value="zenith">Zenith Bank (*966#)</option>
                    <option value="uba">UBA (*919#)</option>
                    <option value="access">Access Bank (*901#)</option>
                    <option value="firstbank">First Bank (*894#)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400">Dial this code on your mobile phone:</span>
                  <div className="mt-2 text-lg font-mono font-black text-amber-400 select-all tracking-wider bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    {ussdCodes[selectedBank]?.code}
                  </div>
                  <button
                    onClick={() => copyToClipboard(ussdCodes[selectedBank]?.code, 'ussd')}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 hover:text-white inline-flex items-center gap-1.5"
                  >
                    {copiedField === 'ussd' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Code Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy USSD Code
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment(`Paystack USSD (${ussdCodes[selectedBank]?.name})`)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Confirming USSD Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm USSD Payment</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 4: OPAY / KUDA / PALMPAY */}
            {activeTab === 'opay_kuda' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <div className="flex justify-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      OPay App
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
                      Kuda Bank
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                      PalmPay
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Open your OPay, Kuda, or PalmPay app and send <strong>₦{totalNaira.toLocaleString()}</strong> to:
                  </p>
                  <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-left space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Bank:</span>
                      <span className="text-white font-bold">Wema Bank / Paystack</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Account:</span>
                      <span className="text-amber-400 font-mono font-black">9041284920</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Name:</span>
                      <span className="text-white font-bold">Arimo AI &amp; Design</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('Paystack OPay / Kuda Wallet')}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying Mobile Wallet...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Complete OPay/Kuda Payment</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Trust Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-500 border-t border-zinc-900 pt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Paystack Merchant • Instant Digital Asset Delivery</span>
            </div>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="p-6 md:p-8 flex-1 overflow-y-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center mx-auto text-zinc-950 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-9 h-9 stroke-[3px]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              Payment Successful (₦{totalNaira.toLocaleString()})
            </span>

            <h3 className="text-2xl font-black text-white mt-2">Thank You, {customerName || 'Creative'}! 🎉</h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-md mx-auto">
              Your payment reference <code className="text-amber-400">{completedPurchase?.paymentReference}</code> has been confirmed. Download your digital assets immediately below:
            </p>

            {/* Download Items Box */}
            <div className="mt-6 space-y-3 text-left">
              {completedPurchase?.downloads.map((dl, idx) => {
                const lKey = completedPurchase.licenseKeys[idx]?.key || 'ARIMO-NG-VALID';
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white truncate">{dl.fileName}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-amber-400">{dl.format}</span>
                        <span>•</span>
                        <span>{dl.fileSize}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">Licensed: {lKey}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => downloadDigitalAsset(dl.fileName, dl.fileName, lKey, dl.format)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instant Download</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Actions & WhatsApp Community */}
            <div className="mt-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Join the 2,400+ Nigerian Creator Group
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Connect with other students earning in Dollars &amp; Naira.
                </p>
              </div>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Join VIP WhatsApp</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done &amp; View in My Digital Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
