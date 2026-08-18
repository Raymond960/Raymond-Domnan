import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ExternalLink, Users, Sparkles } from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';
import { logSecurityEvent } from '../utils/securitySystem';

export const StickyWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [clickCount, setClickCount] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arimo_whatsapp_channel_clicks')) || 0;
    } catch {
      return 0;
    }
  });

  // Requirement: Gently pop/fade in after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Measurement & Analytics click handler
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    try {
      localStorage.setItem('arimo_whatsapp_channel_clicks', newCount.toString());
      localStorage.setItem('arimo_last_whatsapp_click', new Date().toISOString());

      // Send to global window dataLayer/gtag if analytics script is active
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'whatsapp_channel_click',
          category: 'Engagement',
          action: 'Join WhatsApp Channel',
          label: 'Floating Sticky WhatsApp Button',
          value: newCount
        });
      }

      // Log event for audit and admin tracking
      logSecurityEvent({
        action: 'whatsapp_channel_joined',
        description: `User clicked 'Join Our WhatsApp Channel' (Total Clicks: ${newCount})`,
        status: 'ALLOWED',
        riskLevel: 'LOW'
      });
    } catch (err) {
      console.warn('Analytics storage notice:', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-[74px] sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-auto transition-all duration-500 animate-in fade-in zoom-in-90"
      style={{ position: 'fixed', zIndex: 50 }}
    >
      {/* Floating Tooltip Pill */}
      {showTooltip && (
        <div className="mb-2 max-w-[240px] bg-zinc-950/95 border border-amber-500/50 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-left relative animate-bounce duration-1000">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full p-0.5 border border-zinc-700 transition-colors"
            title="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              WhatsApp Channel
            </span>
          </div>
          <p className="text-[11px] text-zinc-200 font-medium leading-snug">
            Daily AI money prompts &amp; remote job drops!
          </p>
        </div>
      )}

      {/* Main Floating "Join WhatsApp Channel" Button Container with subtle pulsing animation */}
      <div className="relative group flex items-center justify-center">
        {/* Subtle glowing animated pulse aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/35 blur-md animate-pulse pointer-events-none" />
        <span className="absolute -inset-2 rounded-full border border-emerald-400/30 animate-ping opacity-30 pointer-events-none" />

        <a
          id="floating-join-whatsapp-channel-btn"
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label="Join WhatsApp Channel"
          data-tracking="join-whatsapp-channel"
          data-category="engagement"
          data-action="click"
          data-label="floating-whatsapp-channel-button"
          data-channel-url={WHATSAPP_COMMUNITY_URL}
          data-clicks-count={clickCount}
          className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white pl-2.5 pr-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] border-2 border-emerald-400/70 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer ring-2 ring-emerald-400/40"
        >
          {/* WhatsApp Green Icon with animated ping */}
          <div className="relative w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-md">
            {/* Official WhatsApp SVG icon */}
            <svg className="w-5 h-5 fill-emerald-600" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </div>

          {/* Text: WhatsApp Channel + "Join Our WhatsApp Channel" */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black tracking-wide text-white whitespace-nowrap">Join Our WhatsApp Channel</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow-sm">
              Official
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
