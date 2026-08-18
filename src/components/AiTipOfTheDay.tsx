import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  Share2,
  ThumbsUp,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  Zap,
  Bookmark
} from 'lucide-react';
import { AiTipItem } from '../types';
import { AI_TIPS_DATA, WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface AiTipOfTheDayProps {
  onExploreProducts?: () => void;
  onOpenAiAssistant?: () => void;
}

export const AiTipOfTheDay: React.FC<AiTipOfTheDayProps> = ({ onExploreProducts, onOpenAiAssistant }) => {
  const [tips, setTips] = useState<AiTipItem[]>(AI_TIPS_DATA);
  const [selectedTipId, setSelectedTipId] = useState<string>(tips[0]?.id || 'tip-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedTips, setSavedTips] = useState<string[]>([]);

  const activeTip = tips.find((t) => t.id === selectedTipId) || tips[0];

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareToWhatsApp = (tip: AiTipItem) => {
    const text = `🔥 *Arimo AI Tip of the Day*: "${tip.title}"\n\n💡 *Actionable Prompt*:\n"${tip.actionablePrompt}"\n\n💰 *Potential Earning*: ${tip.estimatedEarnings}\n\n👉 Learn more & join free community: ${WHATSAPP_COMMUNITY_URL}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLikeTip = (id: string) => {
    setTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  const toggleSaveTip = (id: string) => {
    setSavedTips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = ['All', 'Data Jobs', 'ChatGPT', 'Midjourney', 'Monetization'];
  const filteredTips = selectedCategory === 'All'
    ? tips
    : tips.filter((t) => t.category === selectedCategory);

  return (
    <div id="ai-tips-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 fill-current" /> Daily AI Money-Making Knowledge
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            AI Tip of the Day <span className="text-amber-400">⚡</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Actionable prompts, dollar earning hacks, and AI design workflows updated daily for Nigerians.
          </p>
        </div>

        {/* Category Pill Filters & ARIMZ AI Trigger */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-900 hover:from-zinc-900 hover:to-zinc-850 text-amber-300 border border-amber-500/50 text-xs font-black flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-amber-400 bg-zinc-900 shrink-0">
                <img
                  src="/arimz-avatar.jpg"
                  alt="ARIMZ AI"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span>Ask ARIMZ AI</span>
            </button>
          )}

          <div className="flex flex-wrap gap-1.5 bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Main Tip Card */}
      {activeTip && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-amber-500/40 p-6 md:p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/40">
                {activeTip.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">Added {activeTip.dateAdded}</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-bold">
                {activeTip.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLikeTip(activeTip.id)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeTip.likes}</span>
              </button>

              <button
                onClick={() => toggleSaveTip(activeTip.id)}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  savedTips.includes(activeTip.id)
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Bookmark Tip"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => handleShareToWhatsApp(activeTip)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Share to WhatsApp</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>

          {/* Tip Title & Explanation */}
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
            {activeTip.title}
          </h3>

          <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
            {activeTip.fullTip}
          </p>

          {/* Actionable Prompt Box */}
          {activeTip.actionablePrompt && (
            <div className="mt-5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Copyable Prompt
                </span>

                <button
                  onClick={() => handleCopyPrompt(activeTip.actionablePrompt!, activeTip.id)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black uppercase flex items-center gap-1 shadow-md transition-all cursor-pointer"
                >
                  {copiedId === activeTip.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3px]" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-200 select-all leading-relaxed">
                "{activeTip.actionablePrompt}"
              </div>
            </div>
          )}

          {/* Estimated Earning / Benefit Badge */}
          {activeTip.estimatedEarnings && (
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl w-fit">
              <TrendingUp className="w-4 h-4" />
              <span>Earnings / Benefit: {activeTip.estimatedEarnings}</span>
            </div>
          )}
        </div>
      )}

      {/* Tip List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTips.map((tip) => {
          const isSelected = tip.id === activeTip?.id;
          return (
            <div
              key={tip.id}
              onClick={() => setSelectedTipId(tip.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-amber-500/80 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20">
                    {tip.category}
                  </span>
                  <span className="text-[11px] text-zinc-500">{tip.dateAdded}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2">{tip.title}</h4>
                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {tip.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-900">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  Read Full Breakdown <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-zinc-400" /> {tip.likes}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
