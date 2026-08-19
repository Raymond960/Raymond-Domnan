import React, { useState } from 'react';

interface BrandLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  showSubtitle?: boolean;
  showPulse?: boolean;
  variant?: 'full' | 'icon-only';
  rounded?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 44,
  className = '',
  showText = false,
  showSubtitle = false,
  showPulse = false,
  variant = 'icon-only',
  rounded = 'rounded-2xl'
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgSrc, setImgSrc] = useState('/arimz-logo.png');

  const numericSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 44;

  const handleImgError = () => {
    if (imgSrc === '/arimz-logo.png') {
      setImgSrc('/logo.png');
    } else if (imgSrc === '/logo.png') {
      setImgSrc('/favicon.png');
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo Container */}
      <div
        style={{
          width: `${numericSize}px`,
          height: `${numericSize}px`,
          minWidth: `${numericSize}px`,
          minHeight: `${numericSize}px`
        }}
        className={`relative ${rounded} overflow-hidden p-0.5 bg-gradient-to-br from-amber-300 via-[#FFC107] to-amber-600 shadow-[0_0_20px_rgba(255,193,7,0.4)] flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt="ARIMO Logo"
            className={`w-full h-full object-cover object-center ${rounded}`}
            onError={handleImgError}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-Definition Master Vector Logo Mark (Never breaks, 100% vector SVG) */
          <div className="w-full h-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black rounded-[inherit] flex items-center justify-center p-1">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,193,7,0.6)]"
            >
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="50%" stopColor="#FFC107" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
                <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
              </defs>
              
              {/* Outer Hexagon Shield */}
              <polygon
                points="50,6 92,28 92,72 50,94 8,72 8,28"
                fill="url(#darkGrad)"
                stroke="url(#goldGrad)"
                strokeWidth="4"
              />
              
              {/* Stylized Geometric 'A' Monogram */}
              <path
                d="M50 18 L76 78 L62 78 L54 58 L46 58 L38 78 L24 78 Z M50 36 L48 50 L52 50 Z"
                fill="url(#goldGrad)"
              />

              {/* Sparkle Accent at Peak */}
              <circle cx="50" cy="18" r="3.5" fill="#FFFFFF" />
            </svg>
          </div>
        )}

        {/* Optional Online Pulse Dot */}
        {showPulse && (
          <span
            className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 shadow-sm"
            title="Online"
          />
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
              ARIMO STORE HUB
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse hidden sm:inline-block" />
          </div>
          {showSubtitle && (
            <p className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-wide">
              Learn AI • Design • Digital Products ($ &amp; ₦)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
