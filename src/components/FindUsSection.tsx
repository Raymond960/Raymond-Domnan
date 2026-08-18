import React from 'react';
import { ExternalLink } from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

// Official Social Links Configuration in EXACT requested order:
// 1. Twitter/X
// 2. Instagram
// 3. Facebook
// 4. TikTok
// 5. WhatsApp
// 6. Telegram
export const OFFICIAL_SOCIAL_LINKS = [
  {
    id: 'x',
    name: 'X (Twitter)',
    url: 'https://twitter.com/arimostorehub',
    ariaLabel: 'Follow us on X (Twitter)',
    // Official Twitter/X SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/arimostorehub',
    ariaLabel: 'Follow us on Instagram',
    // Official Instagram SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/arimostorehub',
    ariaLabel: 'Follow us on Facebook',
    // Official Facebook SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://tiktok.com/@arimostorehub',
    ariaLabel: 'Follow us on TikTok',
    // Official TikTok SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.74 1.33-.07 2.54-.88 3.05-2.09.34-.73.47-1.55.44-2.36.03-4.52.02-9.04.02-13.56z" />
      </svg>
    )
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: WHATSAPP_COMMUNITY_URL,
    ariaLabel: 'Join our WhatsApp Channel & Community',
    // Official WhatsApp SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
      </svg>
    )
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://t.me/arimostorehub',
    ariaLabel: 'Join our Telegram Channel',
    // Official Telegram SVG logo
    svgPath: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z" />
      </svg>
    )
  }
];

interface FindUsSectionProps {
  className?: string;
  isCompact?: boolean;
}

export const FindUsSection: React.FC<FindUsSectionProps> = ({
  className = '',
  isCompact = false
}) => {
  if (isCompact) {
    return (
      <div id="find-us-compact" className={`flex items-center gap-2.5 ${className}`}>
        {OFFICIAL_SOCIAL_LINKS.map((platform) => (
          <a
            key={platform.id}
            id={`find-us-${platform.id}-btn`}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.ariaLabel}
            title={platform.name}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-zinc-800 flex items-center justify-center transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
          >
            {platform.svgPath}
          </a>
        ))}
      </div>
    );
  }

  return (
    <section
      id="find-us-section"
      className={`rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 sm:p-8 md:p-10 text-center shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background ambient gold aura */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
          Find Us
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
          Connect With Us Globally
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Official social channels for daily AI prompts, dollar earning blueprints, graphic assets, and fast creator support.
        </p>

        {/* Clean, simple, modern, white/gold on black ONLY official logos with NO text */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {OFFICIAL_SOCIAL_LINKS.map((platform) => (
            <a
              key={platform.id}
              id={`social-link-${platform.id}`}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.ariaLabel}
              title={platform.name}
              className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 hover:text-amber-400 hover:border-amber-500/60 hover:bg-zinc-800/90 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:-translate-y-1 active:scale-95"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {platform.svgPath}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
