import React from 'react';
import {
  Sparkles,
  Award,
  Users,
  Target,
  Heart,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

export const AboutSection: React.FC = () => {
  const milestones = [
    { year: '2020', title: 'The Humble Beginning', desc: 'Started with an old, broken-screen laptop and 3G phone in Nigeria. Spent sleepless nights watching YouTube tutorials on Photoshop and Figma.' },
    { year: '2023', title: 'The AI Revolution', desc: 'Discovered generative AI (ChatGPT, Midjourney). Re-engineered the entire design process, speeding up turnaround from 7 days to 24 hours.' },
    { year: '2024', title: 'Global Breakthrough', desc: 'Started landing high-ticket clients across US, UK, Canada & Nigeria. Landed remote AI data annotation roles paying $20+/hr.' },
    { year: '2026', title: 'Arimo Community Movement', desc: 'Built the Arimo AI & Design platform. Trained 2,400+ Nigerian students, helping them earn in both Naira (₦) and Dollars ($).' }
  ];

  return (
    <div id="about-section" className="space-y-8">
      {/* Main Story Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-amber-500/40 p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Story (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> My Authentic Story
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              "Built from Nothing. Now Seeing <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Breakthrough</span>."
            </h2>

            <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
              <p>
                I didn't start with wealthy parents, an Ivy League degree, or a MacBook. I started right here in Nigeria with an old laptop that turned off whenever NEPA took the light.
              </p>
              <p>
                When AI tools emerged, everyone was scared designers would lose their jobs. But I realized the opposite: <strong>AI is the great equalizer for Nigerians</strong>. A designer with AI superpowers can compete directly with any top agency in New York or London.
              </p>
              <p>
                Today, I’ve built a thriving digital studio serving clients worldwide and earning consistently in Dollars and Naira. My sole mission with <strong>Arimo AI &amp; Design</strong> is to give you the exact templates, prompt toolkits, and remote job blueprints so you can experience your own breakthrough.
              </p>
            </div>

            {/* Quick Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2.5">
                <Target className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-white">Action-Driven</div>
                  <div className="text-[11px] text-zinc-400">Zero fluff or theory</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-white">Dollar ($) Earning</div>
                  <div className="text-[11px] text-zinc-400">Global remote gigs</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-white">2,400+ Family</div>
                  <div className="text-[11px] text-zinc-400">Active WhatsApp VIPs</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
                </svg>
                <span>Join Our WhatsApp Channel</span>
              </a>
            </div>
          </div>

          {/* Profile Card (4 Cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-zinc-900/90 border border-amber-500/30 text-center relative overflow-hidden shadow-2xl">
            <div className="relative w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_25px_#f59e0b] mb-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Raymond Arimo"
                loading="lazy"
                decoding="async"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="text-lg font-black text-white">Raymond Arimo</h3>
            <p className="text-xs font-bold text-amber-400 mt-0.5">Lead AI Designer &amp; Career Coach</p>
            <p className="text-[11px] text-zinc-400 mt-1">Lagos, Nigeria 🇳🇬</p>

            <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-left">
              <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-bold block">COMMUNITY</span>
                <span className="text-xs font-black text-amber-400">2,400+ Creatives</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-bold block">SATISFACTION</span>
                <span className="text-xs font-black text-emerald-400">4.98 / 5.0 Stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakthrough Timeline */}
      <div className="w-full p-4 sm:p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          The Journey Timeline
        </h3>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ padding: '1rem', flex: 1 }}>
          {milestones.map((m, idx) => (
            <div
              key={idx}
              id={`timeline-card-${m.year}`}
              className="w-full p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-start relative shadow-sm"
              style={{ width: '100%' }}
            >
              <span className="self-start px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-black text-xs">
                {m.year}
              </span>
              <h4 className="text-sm font-bold text-white mt-2">{m.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
