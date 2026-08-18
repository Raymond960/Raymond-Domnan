import React, { useState, useEffect } from 'react';
import {
  X,
  FolderHeart,
  Download,
  Key,
  Clock,
  ShieldCheck,
  Search,
  MessageCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
  Gift,
  Copy,
  Check,
  Plus,
  Sparkles,
  Tag
} from 'lucide-react';
import { ClientPurchase, ServiceBooking, GiftCardItem } from '../types';
import { downloadDigitalAsset } from '../utils/fileDownloader';
import { WHATSAPP_DIRECT_NUMBER } from '../data/mockData';
import { generateExpiringDownloadToken, validateDownloadToken } from '../utils/securityUtils';
import { getAllGiftCards } from '../utils/giftCardUtils';
import { GiftCardBrandIcon } from './GiftCardIcons';

interface ClientVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: ClientPurchase[];
  serviceBookings: ServiceBooking[];
  onOpenBuyGiftCard?: () => void;
}

export const ClientVaultModal: React.FC<ClientVaultModalProps> = ({
  isOpen,
  onClose,
  purchases,
  serviceBookings,
  onOpenBuyGiftCard
}) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'orders' | 'giftcards'>('downloads');
  const [searchQuery, setSearchQuery] = useState('');
  const [regeneratedTokens, setRegeneratedTokens] = useState<Record<string, { token: string; expiresAt: number }>>({});
  const [savedGiftCards, setSavedGiftCards] = useState<GiftCardItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedGiftCards(getAllGiftCards());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const allDownloads = purchases.flatMap((p) =>
    p.downloads.map((dl, idx) => {
      const key = `${p.orderId}_${dl.productId || idx}`;
      const activeTokenData = regeneratedTokens[key] || {
        token: dl.downloadToken || 'ARIMO_INIT_TOKEN',
        expiresAt: dl.downloadExpiresAt || Date.now() + 24 * 60 * 60 * 1000
      };

      const validation = validateDownloadToken(activeTokenData.expiresAt);

      return {
        ...dl,
        orderId: p.orderId,
        purchaseDate: p.purchaseDate,
        licenseKey: p.licenseKeys[idx]?.key || 'ARIMO-NG-VALID',
        tokenKey: key,
        activeToken: activeTokenData.token,
        activeExpiresAt: activeTokenData.expiresAt,
        isValidToken: validation.valid,
        timeLeftFormatted: validation.timeLeftFormatted
      };
    })
  );

  const handleRegenerateToken = (tokenKey: string, orderId: string, productId: string) => {
    const newToken = generateExpiringDownloadToken(orderId, productId, 24);
    setRegeneratedTokens((prev) => ({
      ...prev,
      [tokenKey]: {
        token: newToken.token,
        expiresAt: newToken.expiresAt
      }
    }));
  };

  const filteredDownloads = allDownloads.filter((dl) =>
    dl.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dl.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGiftCards = savedGiftCards.filter((card) =>
    card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (card.recipientName && card.recipientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="client-vault-modal"
        className="relative w-full max-w-3xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(212,175,55,0.18)] text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">My Digital Vault &amp; Dashboard</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Encrypted Asset &amp; Card Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400">Access verified digital assets, service bookings, and active gift cards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active VIP Waitlist 50% Discount Coupon Card */}
        {localStorage.getItem('arimo_waitlist_joined') === 'true' && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">VIP Waitlist 50% Discount Active</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-zinc-950 font-black text-[9px] uppercase">
                    50% OFF
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Applied to your account. Voucher code is active at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('ARIMO50')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-400/40 text-amber-300 font-mono font-black text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Copy Coupon Code"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>ARIMO50</span>
                {copiedCode === 'ARIMO50' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>
        )}

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('downloads')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'downloads'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Downloads ({allDownloads.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Bookings ({serviceBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('giftcards')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'giftcards'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Gift Cards ({savedGiftCards.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search downloads, cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs focus:border-amber-400 outline-none"
            />
          </div>
        </div>

        {/* TAB 1: DIGITAL DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredDownloads.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-zinc-300">No downloads found</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Once you purchase a product through Paystack or Stripe, your download files appear here permanently.
                </p>
              </div>
            ) : (
              filteredDownloads.map((dl, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    dl.isValidToken
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/40'
                      : 'bg-red-950/20 border-red-800/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white truncate">{dl.fileName}</h4>
                      {dl.isValidToken ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {dl.timeLeftFormatted}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Link Expired (24h)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-amber-400 font-bold">{dl.format}</span>
                      <span>•</span>
                      <span>Order: {dl.orderId}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <Key className="w-3 h-3" /> {dl.licenseKey}
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center gap-2">
                    {dl.isValidToken ? (
                      <button
                        onClick={() =>
                          downloadDigitalAsset(dl.fileName, dl.fileName, dl.licenseKey, dl.format, {
                            expiresAt: dl.activeExpiresAt,
                            token: dl.activeToken,
                            orderId: dl.orderId
                          })
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Asset</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegenerateToken(dl.tokenKey, dl.orderId, dl.productId || 'PROD')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Regenerate 24h Link</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SERVICE BOOKINGS TRACKER */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {serviceBookings.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-zinc-300">No active service bookings</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Book a Logo Design or AI Consulting service to track live design progress here.
                </p>
              </div>
            ) : (
              serviceBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Booking ID: {b.id}</span>
                      <h4 className="text-base font-black text-white">{b.serviceTitle}</h4>
                      <span className="text-xs text-amber-400 font-bold">{b.tier} • ₦{b.budgetNaira.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
                        {b.status === 'brief_received' && 'Brief Received'}
                        {b.status === 'in_progress' && 'In Progress'}
                        {b.status === 'proof_ready' && 'Proof Ready for Review'}
                        {b.status === 'completed' && 'Completed'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <strong className="text-amber-400">Brief:</strong> {b.projectBrief}
                  </p>

                  {/* Progress Milestone Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] font-bold text-center">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      1. Brief Logged ✓
                    </div>
                    <div className={`p-1.5 rounded-lg border ${
                      b.status !== 'brief_received'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                    }`}>
                      2. In Production
                    </div>
                    <div className={`p-1.5 rounded-lg border ${
                      b.status === 'proof_ready' || b.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                    }`}>
                      3. Proof Review
                    </div>
                    <div className={`p-1.5 rounded-lg border ${
                      b.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                    }`}>
                      4. Completed
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Target Delivery: <strong className="text-white">{b.deadlineDate}</strong></span>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${WHATSAPP_DIRECT_NUMBER}&text=${encodeURIComponent(`Hello Raymond! Regarding my booking ${b.id} (${b.serviceTitle}), can I get a quick update?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Direct Chat
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: GIFT CARDS & VOUCHERS DASHBOARD */}
        {activeTab === 'giftcards' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Balances displayed strictly in authentic card currency (NGN / USD).
              </span>
              {onOpenBuyGiftCard && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBuyGiftCard();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buy Gift Card</span>
                </button>
              )}
            </div>

            {filteredGiftCards.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-zinc-300">No Gift Cards Found</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Purchase an official ARIMO Gift Card or redeem external Steam, Apple, Amazon, Google Play cards at checkout.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredGiftCards.map((card) => {
                  const isNgn = card.currency === 'NGN';
                  const balanceDisplay = isNgn
                    ? `₦${card.currentBalanceNaira.toLocaleString()} NGN`
                    : `$${card.currentBalanceUsd} USD`;

                  return (
                    <div
                      key={card.code}
                      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
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

                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
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

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800">
                        <span className="text-zinc-500">Available Balance:</span>
                        <span className="font-black text-emerald-400">
                          {balanceDisplay}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
