import React, { useState } from 'react';

interface AiAssistantLogoProps {
  className?: string;
  size?: number;
  showPulse?: boolean;
  pulseSize?: 'sm' | 'md' | 'lg';
}

export const AiAssistantLogo: React.FC<AiAssistantLogoProps> = ({
  className = '',
  size = 40,
  showPulse = false,
  pulseSize = 'md'
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/arimz-logo.png');

  const pulseDimension = pulseSize === 'sm' ? 'w-2 h-2' : pulseSize === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3';

  const handleImageError = () => {
    if (imgSrc === '/arimz-logo.png') {
      setImgSrc('/logo.png');
    } else if (imgSrc === '/logo.png') {
      setImgSrc('/favicon.png');
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      id="arimz-ai-assistant-avatar"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
      className={`relative rounded-2xl overflow-hidden border-2 border-amber-400/90 bg-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {!imgError ? (
        <img
          src={imgSrc}
          alt="ARIMZ AI Assistant Logo"
          className="w-full h-full object-cover object-center transition-transform hover:scale-105"
          onError={handleImageError}
        />
      ) : (
        /* High-Definition Master Vector Logo Mark */
        <div
          id="arimz-logo-vector-fallback"
          className="w-full h-full rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-1"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="aiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFC107" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
            </defs>
            <polygon points="50,8 90,28 90,72 50,92 10,72 10,28" fill="#18181b" stroke="url(#aiGold)" strokeWidth="4" />
            <path d="M50 22 L74 76 L60 76 L53 58 L47 58 L40 76 L26 76 Z M50 38 L48 50 L52 50 Z" fill="url(#aiGold)" />
          </svg>
        </div>
      )}

      {showPulse && (
        <span
          className={`absolute bottom-0 right-0 ${pulseDimension} rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm`}
          title="Online"
        />
      )}
    </div>
  );
};
