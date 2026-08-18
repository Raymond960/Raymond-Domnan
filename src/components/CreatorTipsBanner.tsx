import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight, Zap, Lightbulb, MessageCircle, DollarSign, TrendingUp } from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface CreatorTipItem {
  id: string;
  tag: string;
  text: string;
  actionText?: string;
  actionType?: 'whatsapp' | 'explore' | 'vip';
}

const CREATOR_TIPS: CreatorTipItem[] = [
  {
    id: 'tip-1',
    tag: 'Trending Tip',
    text: 'Post 3 AI products this week to get featured on the trending page.',
    actionText: 'Explore Assets',
    actionType: 'explore'
  },
  {
    id: 'tip-2',
    tag: 'Conversion Tip',
    text: 'Use gold thumbnails for your digital products. They convert 40% better on mobile.',
    actionText: 'Get Templates',
    actionType: 'explore'
  },
  {
    id: 'tip-3',
    tag: 'Community Tip',
    text: 'Join our WhatsApp Channel for daily remote job opportunities & money-making prompt drops.',
    actionText: 'Join Our WhatsApp Channel',
    actionType: 'whatsapp'
  },
  {
    id: 'tip-4',
    tag: 'Monetization Tip',
    text: 'Bundle Midjourney prompt formulas with ready-to-edit Canva links to 3x your average checkout value.',
    actionText: 'View Bundles',
    actionType: 'explore'
  },
  {
    id: 'tip-5',
    tag: 'VIP Launch',
    text: 'Join the VIP Waitlist today to lock in 50% discount and instantly get 3 High-Income AI Prompts (.txt).',
    actionText: 'Claim 50% OFF',
    actionType: 'vip'
  }
];

interface CreatorTipsBannerProps {
  onExploreProducts?: () => void;
  onOpenVipOffer?: () => void;
}

export const CreatorTipsBanner: React.FC<CreatorTipsBannerProps> = ({
  onExploreProducts,
  onOpenVipOffer
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const dismissedDate = localStorage.getItem('arimo_creator_tip_dismissed_date');

      // Only show once per day
      if (dismissedDate !== today) {
        // Randomize initial tip index for freshness
        const randomIndex = Math.floor(Math.random() * CREATOR_TIPS.length);
        setTipIndex(randomIndex);
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('arimo_creator_tip_dismissed_date', today);
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleNextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTipIndex((prev) => (prev + 1) % CREATOR_TIPS.length);
  };

  const currentTip = CREATOR_TIPS[tipIndex];

  if (!isVisible || !currentTip) return null;

  return (
    <div
      id="creator-tips-banner"
      className="relative mb-5 w-full rounded-2xl bg-zinc-950 border border-amber-500/50 p-3 sm:p-4 shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-sm">
            <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          <div className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
            {currentTip.tag}
          </div>
        </div>

        {/* Center: Tip Text */}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-tight line-clamp-2">
            <span className="text-amber-400 font-bold mr-1.5 sm:hidden">Tip:</span>
            {currentTip.text}
          </p>
        </div>

        {/* Right: Actions & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Action Trigger Button */}
          {currentTip.actionType === 'whatsapp' ? (
            <a
              id="creator-tip-whatsapp-action"
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
              </svg>
              <span>{currentTip.actionText}</span>
            </a>
          ) : currentTip.actionType === 'vip' ? (
            <button
              id="creator-tip-vip-action"
              onClick={() => {
                if (onOpenVipOffer) onOpenVipOffer();
                else {
                  const el = document.getElementById('vip-offer-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTip.actionText}</span>
            </button>
          ) : (
            <button
              id="creator-tip-explore-action"
              onClick={onExploreProducts}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-zinc-700 transition-colors cursor-pointer"
            >
              <span>{currentTip.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cycle next tip */}
          <button
            onClick={handleNextTip}
            title="Next Creator Tip"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Small Close 'X' */}
          <button
            id="creator-tip-dismiss-btn"
            onClick={handleDismiss}
            title="Dismiss tip for today"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
