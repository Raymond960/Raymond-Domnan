import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2000
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fade out 450ms before duration finishes
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, Math.max(1550, duration - 450));

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      id="splash-screen-overlay"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] text-white select-none transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#000000', width: '100vw', height: '100vh', margin: 0, padding: 0 }}
    >
      {/* Apple/Nike Minimalist Ambient Glow */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#FFD700]/12 blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Big Glowing App Logo with Pulse & Glow Effect */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-4 rounded-3xl bg-[#FFD700]/20 blur-2xl animate-pulse" />
          
          <BrandLogo
            size={120}
            rounded="rounded-3xl"
            className="shadow-[0_0_50px_rgba(255,215,0,0.5)] transform transition-all duration-1000 animate-[pulse_2.2s_ease-in-out_infinite]"
          />
        </div>

        {/* Elegant White Typography: "ARIMO STORE HUB" */}
        <div className="space-y-2">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.3em] uppercase text-white antialiased"
            style={{
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '0.28em',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)'
            }}
          >
            ARIMO STORE HUB
          </h1>
          
          {/* Subtle Minimalist Line Accent */}
          <p
            className="text-[10px] sm:text-[11px] font-medium tracking-[0.4em] uppercase text-zinc-400"
            style={{ letterSpacing: '0.35em' }}
          >
            PREMIUM DIGITAL ASSETS
          </p>
        </div>

        {/* Ultra-Slim Progress Line (Apple/Nike subtle aesthetic) */}
        <div className="mt-8 w-28 sm:w-36 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] rounded-full"
            style={{
              animation: 'progressFill 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
            }}
          />
        </div>
      </div>
    </div>
  );
};
