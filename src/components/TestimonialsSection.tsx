import React from 'react';
import { Star, MapPin, CheckCircle2, TrendingUp, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <div id="testimonials-section" className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real Nigerian Reviews
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          What Nigerian Creatives Are Saying <span className="text-amber-400">🔥</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Real people from Lagos, Abuja, Port Harcourt &amp; Enugu landing international gigs and scaling their income.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS_DATA.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/50 shadow-xl transition-all flex flex-col justify-between text-white"
          >
            <div>
              {/* Star Rating & Verified Pill */}
              <div className="flex items-center justify-between gap-1 mb-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Verified Buyer
                </span>
              </div>

              {/* Earnings Proof Pill */}
              {t.earningsProof && (
                <div className="mb-3 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t.earningsProof}</span>
                </div>
              )}

              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            {/* User Profile */}
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2.5">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white truncate">{t.name}</h4>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <MapPin className="w-2.5 h-2.5 text-amber-400" />
                  <span className="truncate">{t.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
