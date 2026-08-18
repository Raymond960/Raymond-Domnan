import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  ArrowRight,
  MessageCircle,
  FileText,
  Copy
} from 'lucide-react';
import { CurrencyCode, ProductItem } from '../types';
import { shareToWhatsApp } from '../utils/fileDownloader';
import { formatCurrency } from '../utils/currencyUtils';

interface ProductDetailModalProps {
  product: ProductItem | null;
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onDirectBuy: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  onDirectBuy
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.thumbnailUrl];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-3xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(212,175,55,0.18)] text-white my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Visuals (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={images[selectedImageIndex] || product.thumbnailUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-zinc-950 font-black text-xs uppercase shadow-md">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Instant Digital Download After Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Paystack, Flutterwave &amp; Stripe Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>VIP WhatsApp Community Access Included</span>
              </div>
            </div>
          </div>

          {/* Right Info (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                  {product.subcategory}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => shareToWhatsApp(product.title, product.priceNaira)}
                    className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white mt-2 leading-snug">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <span className="text-xs text-zinc-400">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Instant License Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400 tracking-tight">
                      {formatCurrency(product.priceUsd, currency, product.priceNaira)}
                    </span>
                    {(product.originalPriceUsd || product.originalPriceNaira) && (
                      <span className="text-sm text-zinc-500 line-through">
                        {formatCurrency(product.originalPriceUsd || product.priceUsd * 2.5, currency, product.originalPriceNaira)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs border border-emerald-500/30">
                  Instant Access
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* What's Included */}
              <div className="mt-4">
                <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">
                  What You Receive Inside:
                </h4>
                <div className="space-y-1.5">
                  {product.includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200">
                      <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs */}
              {product.specifications && (
                <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-2 text-xs">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 font-bold block">{spec.label}</span>
                      <span className="font-semibold text-zinc-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs border border-zinc-800 transition-all cursor-pointer text-center"
              >
                + Add to Shopping Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  onDirectBuy(product);
                  onClose();
                }}
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Instant Checkout ({formatCurrency(product.priceUsd, currency, product.priceNaira)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
