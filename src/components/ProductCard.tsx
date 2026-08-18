import React from 'react';
import {
  Star,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  Zap,
  MessageCircle,
  Copy
} from 'lucide-react';
import { CurrencyCode, ProductItem } from '../types';
import { shareToWhatsApp } from '../utils/fileDownloader';
import { formatCurrency } from '../utils/currencyUtils';

interface ProductCardProps {
  product: ProductItem;
  currency: CurrencyCode;
  onViewDetails: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  onDirectBuy: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onViewDetails,
  onAddToCart,
  onDirectBuy
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-zinc-950 rounded-3xl border border-zinc-800/90 hover:border-amber-500/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] transition-all flex flex-col justify-between overflow-hidden text-white"
    >
      <div>
        {/* Thumbnail with overlay */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-[11px] uppercase tracking-wider shadow-lg">
              {product.badge}
            </div>
          )}

          {/* Share to WhatsApp Quick Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              shareToWhatsApp(product.title, product.priceNaira);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/90 hover:bg-emerald-600 text-zinc-300 hover:text-white border border-zinc-700 transition-all backdrop-blur-md cursor-pointer"
            title="Share product to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-bold backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>{product.rating}</span>
            <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
          </div>

          {/* Instant Download Tag */}
          {product.isDigital && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold backdrop-blur-md">
              <Zap className="w-3 h-3 fill-current" />
              <span>Instant Download</span>
            </div>
          )}
        </div>

        {/* Info Content */}
        <div className="p-5">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {product.subcategory}
          </span>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-black text-white group-hover:text-amber-300 transition-colors mt-1 cursor-pointer line-clamp-2 leading-snug"
          >
            {product.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Instant Benefit */}
          {product.instantBenefit && (
            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-zinc-300 font-medium bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{product.instantBenefit}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-5 pt-0 border-t border-zinc-900 mt-2">
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Instant Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-amber-400 tracking-tight">
                {formatCurrency(product.priceUsd, currency, product.priceNaira)}
              </span>
              {(product.originalPriceUsd || product.originalPriceNaira) && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatCurrency(product.originalPriceUsd || product.priceUsd * 2.5, currency, product.originalPriceNaira)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs border border-zinc-800 transition-all cursor-pointer"
          >
            + Add to Cart
          </button>

          <button
            type="button"
            onClick={() => onDirectBuy(product)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

