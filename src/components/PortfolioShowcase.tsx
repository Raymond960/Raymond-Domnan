import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Maximize2,
  SplitSquareVertical,
  Terminal
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { PORTFOLIO_DATA } from '../data/mockData';

export const PortfolioShowcase: React.FC = () => {
  const [items] = useState<PortfolioItem[]>(PORTFOLIO_DATA);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 - 100%
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const activeItem = items[activeItemIndex];

  return (
    <div id="portfolio-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Real Client Transformations
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            AI &amp; Design Portfolio <span className="text-amber-400">⚡</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            See how we transform everyday Nigerian brand concepts into world-class luxury assets using AI &amp; Figma.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 self-start">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Interactive Slider
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeItem && (
        <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Transformation Canvas (7 Cols) */}
            <div className="lg:col-span-7 bg-black relative flex items-center justify-center min-h-[360px] md:min-h-[440px] select-none overflow-hidden">
              {viewMode === 'slider' ? (
                /* Interactive Before / After Slider */
                <div className="relative w-full h-full min-h-[380px] md:min-h-[450px]">
                  {/* After Image (Background full) */}
                  <img
                    src={activeItem.afterImage}
                    alt={activeItem.afterLabel || 'After Design'}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-amber-500/90 text-zinc-950 font-black text-xs shadow-lg uppercase tracking-wider backdrop-blur-md">
                    {activeItem.afterLabel || 'After (AI & Design)'}
                  </div>

                  {/* Before Image (Clipped overlay) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={activeItem.beforeImage}
                      alt={activeItem.beforeLabel || 'Before Design'}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%', minWidth: '600px' }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-900/90 text-zinc-300 font-bold text-xs shadow-lg uppercase tracking-wider border border-zinc-700 backdrop-blur-md">
                      {activeItem.beforeLabel || 'Before'}
                    </div>
                  </div>

                  {/* Slider Control Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize z-20 shadow-[0_0_15px_#f59e0b]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 border-2 border-zinc-950 shadow-[0_0_20px_#f59e0b] flex items-center justify-center text-zinc-950 font-black text-xs">
                      ↔
                    </div>
                  </div>

                  {/* Hidden range input for smooth touch/mouse control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                    aria-label="Before after comparison slider"
                  />
                </div>
              ) : (
                /* Side-by-Side View */
                <div className="grid grid-cols-2 w-full h-full min-h-[380px]">
                  <div className="relative border-r border-zinc-800">
                    <img
                      src={activeItem.beforeImage}
                      alt="Before"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-300 text-[11px] font-bold">
                      {activeItem.beforeLabel || 'Before'}
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={activeItem.afterImage}
                      alt="After"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 text-[11px] font-black uppercase">
                      {activeItem.afterLabel || 'After'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Case Study Details (5 Cols) */}
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-4 text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/40">
                    {activeItem.category}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {activeItem.clientLocation}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-amber-400 font-bold mt-0.5">
                  Client: {activeItem.client}
                </p>

                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                  {activeItem.description}
                </p>

                {/* Outcome Stats */}
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-4 h-4 flex-shrink-0" />
                  <span>Result: {activeItem.outcomeStats}</span>
                </div>

                {/* Tools Used */}
                <div className="mt-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block mb-1.5">
                    Tools &amp; Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Prompt formula snippet */}
                {activeItem.aiPromptSnippet && (
                  <div className="mt-4 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-1">
                      <Terminal className="w-3 h-3" />
                      <span>Prompt Used:</span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 line-clamp-2 italic">
                      "{activeItem.aiPromptSnippet}"
                    </p>
                  </div>
                )}
              </div>

              {/* Selector Thumbnails */}
              <div className="pt-4 border-t border-zinc-900">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                  Select Project
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItemIndex(idx);
                        setSliderPosition(50);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video border transition-all cursor-pointer ${
                        idx === activeItemIndex
                          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.afterImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white truncate max-w-[90%]">
                        {item.client.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
