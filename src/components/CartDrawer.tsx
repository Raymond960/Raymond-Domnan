import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Tag,
  Check
} from 'lucide-react';
import { CartItem, CurrencyCode, LicenseType } from '../types';
import { formatCurrency } from '../utils/currencyUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  // Auto-apply waitlist 50% discount if user joined or signed up
  useEffect(() => {
    if (isOpen && discountPercent === 0) {
      const waitlistJoined = localStorage.getItem('arimo_waitlist_joined');
      const activeCoupon = localStorage.getItem('arimo_active_coupon');
      if (waitlistJoined === 'true' || activeCoupon === 'ARIMO50') {
        setDiscountPercent(50);
        setAppliedCode('ARIMO50');
        setCouponCode('ARIMO50');
      }
    }
  }, [isOpen, discountPercent]);

  if (!isOpen) return null;

  const totalNairaRaw = items.reduce((acc, item) => {
    const price = item.tierPriceNaira || item.product.priceNaira;
    return acc + price * item.quantity;
  }, 0);

  const totalUsdRaw = items.reduce((acc, item) => {
    const price = item.tierPriceUsd || item.product.priceUsd;
    return acc + price * item.quantity;
  }, 0);

  const discountNaira = (totalNairaRaw * discountPercent) / 100;
  const discountUsd = (totalUsdRaw * discountPercent) / 100;

  const finalTotalNaira = Math.max(0, totalNairaRaw - discountNaira);
  const finalTotalUsd = Math.max(0, totalUsdRaw - discountUsd);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'ARIMO50' || code === 'WAITLIST50' || code === 'VIP50') {
      setDiscountPercent(50);
      setAppliedCode(code);
    } else if (code === 'ARIMO20' || code === 'VIP20') {
      setDiscountPercent(20);
      setAppliedCode(code);
    } else if (code === 'GOLDEN10' || code === 'CREATIVE10') {
      setDiscountPercent(10);
      setAppliedCode(code);
    } else {
      setCouponError('Invalid coupon code. Try ARIMO50 for 50% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Your Cart ({items.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600 mb-3 border border-zinc-800">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-zinc-300">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                  Explore our high-converting ChatGPT prompts, Canva templates &amp; data annotation resume kits.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const itemPriceNaira = item.tierPriceNaira || item.product.priceNaira;
                const itemPriceUsd = item.tierPriceUsd || item.product.priceUsd;
                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex gap-3.5 relative"
                  >
                    <img
                      src={item.product.thumbnailUrl}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-800 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white line-clamp-2">{item.product.title}</h4>
                      <div className="text-sm font-black text-amber-400 mt-1">
                        {formatCurrency(itemPriceUsd * item.quantity, currency, itemPriceNaira * item.quantity)}
                      </div>

                      {item.product.isDigital && (
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                          <Zap className="w-3 h-3" /> Instant Digital Download
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Coupon Code Section */}
            {items.length > 0 && (
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. ARIMO20)"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedCode && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Code {appliedCode} applied ({discountPercent}% OFF)
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
                )}
              </form>
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">
                    {formatCurrency(totalUsdRaw, currency, totalNairaRaw)}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountUsd, currency, discountNaira)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Instant Delivery</span>
                  <span className="font-bold text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t border-zinc-900">
                  <span className="text-white">Total Amount</span>
                  <span className="text-amber-400 text-lg">
                    {formatCurrency(finalTotalUsd, currency, finalTotalNaira)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onProceedToCheckout();
                  onClose();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Checkout ({formatCurrency(finalTotalUsd, currency, finalTotalNaira)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paystack • Flutterwave • Stripe Protected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
