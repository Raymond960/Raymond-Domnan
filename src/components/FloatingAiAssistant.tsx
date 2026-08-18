import React, { useState } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';

interface FloatingAiAssistantProps {
  onOpen: () => void;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({ onOpen }) => {
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Interactive Speech Bubble Tooltip */}
      {!isTooltipDismissed && (
        <div className="hidden sm:flex items-center gap-2 bg-zinc-950/95 text-white border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)] px-3.5 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md animate-fade-in max-w-[220px]">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span>Need Help?</span>
          </div>
          <p className="text-[11px] text-zinc-300 truncate">Ask ARIMZ AI Assistant</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipDismissed(true);
            }}
            className="p-1 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Official AI Assistant Avatar Launcher */}
      <button
        id="arimz-btn"
        onClick={onOpen}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-zinc-950 border-2 border-amber-400 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer overflow-visible"
        title="Ask ARIMZ"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center">
          <img
            src="/arimz-avatar.jpg"
            alt="ARIMZ AI Assistant"
            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image path fails
              const target = e.currentTarget;
              target.style.display = 'none';
              target.parentElement?.classList.add('bg-amber-500');
            }}
          />
        </div>

        {/* Live Status Indicator */}
        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
        </span>

        {/* Floating Sparkle Badge */}
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 flex items-center justify-center shadow-md">
          <Sparkles className="w-3 h-3 fill-current" />
        </div>
      </button>
    </div>
  );
};
