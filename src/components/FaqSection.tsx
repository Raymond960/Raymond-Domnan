import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Briefcase,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL, WHATSAPP_DIRECT_NUMBER } from '../data/mockData';

interface FaqItem {
  id: string;
  category: 'Payments' | 'Downloads' | 'Remote Jobs' | 'Design Services' | 'Community & Safety';
  question: string;
  answer: string;
  highlights?: string[];
  popular?: boolean;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Payments',
    question: 'How do I pay in Nigerian Naira (₦) or US Dollars ($)?',
    answer: 'We support instant multi-currency checkout. If you are in Nigeria or Africa, you can pay in Naira (₦) using Paystack or Flutterwave via Card, Bank Transfer, USSD, or OPay. If you are outside Nigeria or prefer paying in Dollars, you can pay seamlessly with any international Visa, Mastercard, Apple Pay, Google Pay, or Stripe.',
    highlights: ['Paystack & Flutterwave in ₦ (Naira)', 'Stripe & Apple Pay in $ (USD)', 'Instant automated access upon payment verification'],
    popular: true
  },
  {
    id: 'faq-2',
    category: 'Downloads',
    question: 'How immediately do I get access to my digital files after paying?',
    answer: 'Access is 100% instant! As soon as your payment is processed, you are redirected to your private Client Vault page where you can download your files, copy your commercial license keys, and access Notion/Canva links immediately. A backup copy with your download links is also sent to your email.',
    highlights: ['Instant download on screen', 'Email backup with lifetime link', 'Saved in your browser "My Vault" tab'],
    popular: true
  },
  {
    id: 'faq-3',
    category: 'Remote Jobs',
    question: 'Can I really get paid $20 to $35/hour from Nigeria for Data Annotation?',
    answer: 'Yes! Major international AI data training companies (such as DataAnnotation.tech, Outlier.ai, Alignerr, and Appen) hire remote workers globally to evaluate English prompt responses and train large language models. Our Data Annotation Kit provides the exact ATS-compliant resumes, screening test preparation rubrics, and virtual dollar account setup (Geegpay/Grey) needed to pass and get paid.',
    highlights: ['No coding required for generalist roles', 'Work 10–30 hours/week from home', 'Direct USD payouts to your virtual dollar account'],
    popular: true
  },
  {
    id: 'faq-4',
    category: 'Downloads',
    question: 'Can I edit the Canva templates on my smartphone?',
    answer: 'Absolutely! All our Canva templates are 100% compatible with both the free Canva mobile app (iOS and Android) and desktop browsers. You can customize text, change colors to your brand, swap images, and export in 4K resolution in under 5 minutes.',
    highlights: ['Works with 100% Free Canva account', 'Editable on iPhone and Android', 'Commercial re-use allowed for client projects']
  },
  {
    id: 'faq-5',
    category: 'Design Services',
    question: 'How does booking a bespoke design service or 1-on-1 coaching call work?',
    answer: 'When you book a design service (like Logo & Brand Identity), you will provide your project brief during checkout. Our team begins work immediately and provides initial concept proofs within 3–5 business days with 3 revision rounds. For 1-on-1 coaching, you will receive an instant Google Meet/Zoom scheduling calendar link to select your preferred date and time.',
    highlights: ['3–5 days delivery for logos', 'Direct Google Meet/Zoom calendar booking', 'Includes recording & action blueprint'],
    popular: true
  },
  {
    id: 'faq-6',
    category: 'Payments',
    question: 'What if my bank transfer takes time to confirm on Paystack?',
    answer: 'Paystack and Flutterwave bank transfers confirm in less than 60 seconds. In rare cases where a bank network experiences lag, our system verifies your payment reference automatically in the background. If you ever experience any delay, you can click the WhatsApp button and our team will activate your order within 5 minutes.',
    highlights: ['Automated background payment verification', '24/7 Priority WhatsApp support']
  },
  {
    id: 'faq-7',
    category: 'Community & Safety',
    question: 'How do I join the free 2,400+ member WhatsApp VIP community?',
    answer: 'Joining is 100% free! Simply click on the green "Free WhatsApp Group" button on the website. Inside the group, Raymond Arimo shares weekly remote job drops, free AI prompts, design critiques, and dollar income opportunities.',
    highlights: ['2,400+ active creators', 'Weekly job drops & prompt gifts', 'Network with top designers in Nigeria & abroad']
  },
  {
    id: 'faq-8',
    category: 'Community & Safety',
    question: 'Are there refunds for digital downloads?',
    answer: 'Due to the immediate downloadable nature of digital prompt kits, Canva links, and Notion templates, digital purchases are non-refundable once downloaded. However, if you experience any technical issues or need assistance, our support team will resolve it immediately via WhatsApp or Email.',
    highlights: ['Lifetime access guarantee', 'Free updates to all future versions']
  }
];

export const FaqSection: React.FC<{ onNavigateShop?: () => void }> = ({ onNavigateShop }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
    'faq-3': true
  });

  const categories = ['All', 'Payments', 'Downloads', 'Remote Jobs', 'Design Services', 'Community & Safety'];

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="faq-section-container" className="space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Clear Answers on Payments, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Instant Downloads &amp; Remote Gigs
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Everything you need to know about purchasing digital assets, accessing your downloads in Nigeria and worldwide, and earning in foreign currencies.
          </p>
        </div>
      </div>

      {/* Category Pills & Search Input */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g., Paystack, refunds, jobs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openFaqIds[faq.id];

          return (
            <div
              key={faq.id}
              id={`faq-item-${faq.id}`}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-zinc-950 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.08)]'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {faq.category === 'Payments' && <CreditCard className="w-4 h-4" />}
                    {faq.category === 'Downloads' && <Download className="w-4 h-4" />}
                    {faq.category === 'Remote Jobs' && <Briefcase className="w-4 h-4" />}
                    {faq.category === 'Design Services' && <Sparkles className="w-4 h-4" />}
                    {faq.category === 'Community & Safety' && <ShieldCheck className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 font-mono">
                        {faq.category}
                      </span>
                      {faq.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                          ★ Most Asked
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isOpen ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Answer Content */}
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-zinc-900/80 space-y-4">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-4">
                    {faq.answer}
                  </p>

                  {faq.highlights && faq.highlights.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Key Takeaways:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {faq.highlights.map((hl, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
          <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No questions found matching &quot;{searchQuery}&quot;</h3>
          <p className="text-xs text-zinc-400 mt-1">Need instant help? Chat with Raymond Arimo directly.</p>
        </div>
      )}

      {/* Need More Help WhatsApp Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Direct Human Support</span>
          </div>
          <h3 className="text-lg font-black text-white">Still have questions before purchasing?</h3>
          <p className="text-xs text-zinc-400 max-w-xl">
            Chat directly with Raymond Arimo on WhatsApp for fast answers about custom packages, bulk team orders, or remote job coaching.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href={`https://wa.me/${WHATSAPP_DIRECT_NUMBER}?text=${encodeURIComponent(
              'Hello Raymond! I have a question about ARIMO STORE HUB digital products.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

          {onNavigateShop && (
            <button
              onClick={onNavigateShop}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
