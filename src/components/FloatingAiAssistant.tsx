import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface FloatingAiAssistantProps {
  onOpen: () => void;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({ onOpen }) => {
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);

  return (
    <div
      id="floating-ai-assistant-container"
      className="fixed z-[9998] flex items-center gap-2"
      style={{
        position: 'fixed',
        bottom: '170px',
        right: '20px',
        zIndex: 9998
      }}
    >
      {/* Interactive Speech Bubble Tooltip (Desktop) */}
      {!isTooltipDismissed && (
        <div className="hidden md:flex items-center gap-2 bg-zinc-950/95 text-white border border-amber-500/50 shadow-[0_0_20px_rgba(255,193,7,0.35)] px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-md animate-fade-in max-w-[220px]">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Sparkles className="w-3 h-3 shrink-0 animate-pulse text-amber-400 fill-amber-400" />
            <span className="text-[11px]">AI Designer</span>
          </div>
          <p className="text-[10px] text-zinc-300 truncate">Create with Gemini</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipDismissed(true);
            }}
            className="p-0.5 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Round AI Launcher Button (55px x 55px, #FFC107 Yellow) */}
      <button
        id="arimz-btn"
        onClick={onOpen}
        className="relative flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer select-none"
        title="Open CH-Hub AI Designer"
        aria-label="Open CH-Hub AI Designer"
        style={{
          width: '55px',
          height: '55px',
          minWidth: '55px',
          minHeight: '55px',
          borderRadius: '50%',
          backgroundColor: '#FFC107',
          backgroundImage: 'linear-gradient(135deg, #FFE082 0%, #FFC107 50%, #FFA000 100%)',
          boxShadow: '0 6px 20px rgba(255, 193, 7, 0.5)',
          color: '#09090b'
        }}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <Sparkles className="w-4 h-4 fill-zinc-950 text-zinc-950 mb-0.5" />
          <span className="font-black text-xs tracking-tight text-zinc-950">AI</span>
        </div>

        {/* Pulsing online indicator */}
        <span
          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950 shadow-sm"
          title="Online"
        />
      </button>
    </div>
  );
};

