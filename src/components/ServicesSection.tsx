import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Check,
  ArrowRight,
  MessageCircle,
  Calendar,
  Layers,
  Clock,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL, WHATSAPP_DIRECT_NUMBER } from '../data/mockData';
import { ServiceBooking } from '../types';
import confetti from 'canvas-confetti';
import { AntiSpamCaptcha } from './AntiSpamCaptcha';

interface ServicesSectionProps {
  onBookServicePaystack?: (serviceName: string, priceNaira: number) => void;
  onNewBookingCreated?: (booking: ServiceBooking) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onBookServicePaystack,
  onNewBookingCreated
}) => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('Standard');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<ServiceBooking | null>(null);

  const services = [
    {
      id: 'serv-logo',
      title: 'Brand & Logo Design Service',
      priceNaira: 15000,
      priceLabel: 'From ₦15,000',
      turnaround: '3-5 Days',
      badge: 'Most Booked',
      description: 'Handcrafted modern logos, 3D mockups, color palettes, and full vector master files ready for print & digital.',
      features: [
        '3 Unique Creative Logo Concepts',
        'Master Vector Files (AI, SVG, PDF, PNG)',
        '3D Realistic Signboard & Merch Mockups',
        'Color Palette & Font Pairing Guide',
        '3 Free Iteration & Revision Rounds'
      ],
      tiers: [
        { name: 'Starter Logo', priceNaira: 15000, turnaround: '3 Days' },
        { name: 'Complete Brand Identity Pack', priceNaira: 35000, turnaround: '5 Days' },
        { name: 'Corporate Business Suite', priceNaira: 75000, turnaround: '7 Days' }
      ]
    },
    {
      id: 'serv-social',
      title: 'Social Media Design Retainer (15 Posts)',
      priceNaira: 25000,
      priceLabel: 'From ₦25,000',
      turnaround: 'Weekly Delivery',
      badge: 'High Engagement',
      description: 'Stop posting boring graphics. Get 15 high-converting, viral carousel & single posts in Black, Gold & White luxury aesthetics.',
      features: [
        '15 Custom Designed Carousel & Single Posts',
        'AI Prompt Copywriting for Engaged Captions',
        'Canva & Photoshop Source Files Included',
        'Instagram, LinkedIn & WhatsApp Status Formats',
        'Weekly Scheduled Delivery Batches'
      ],
      tiers: [
        { name: 'Starter (10 Posts)', priceNaira: 25000, turnaround: '5 Days' },
        { name: 'Growth (20 Posts + Carousels)', priceNaira: 45000, turnaround: 'Weekly' },
        { name: 'Agency Pro (30 Posts + Video Covers)', priceNaira: 70000, turnaround: 'Monthly' }
      ]
    },
    {
      id: 'serv-coaching',
      title: '1-on-1 AI & Design Mentorship Call',
      priceNaira: 10000,
      priceLabel: '₦10,000 / Session',
      turnaround: 'Book within 48 hrs',
      badge: 'VIP Mentorship',
      description: '1 full hour video call with Raymond Arimo. Portfolio audit, dollar client acquisition blueprint, and custom AI prompt secrets.',
      features: [
        '60 Minutes Private Strategy Session (Meet/WhatsApp)',
        'Live Portfolio & Resume Critique',
        'Actionable $ & ₦ Monetization Gameplan',
        'Full Session Video Recording & Notes',
        'Priority DM Access in VIP WhatsApp Community'
      ],
      tiers: [
        { name: '1-Hour Deep Dive', priceNaira: 10000, turnaround: 'Instant Booking' },
        { name: '4-Week Intensive Mentorship (4 Calls)', priceNaira: 35000, turnaround: '1 Month' }
      ]
    },
    {
      id: 'serv-ai-consulting',
      title: 'AI Consulting & Business Automation Setup',
      priceNaira: 35000,
      priceLabel: 'From ₦35,000',
      turnaround: '5-7 Days',
      badge: 'For Business Owners',
      description: 'Integrate ChatGPT, Claude, and automated customer response bots into your WhatsApp business or website.',
      features: [
        'WhatsApp AI Customer Support Auto-Responder',
        'Custom Business Knowledge Base Trained on your Data',
        'AI Content & Marketing Generation Workflow',
        'Staff Training & Video Guide for your Team'
      ],
      tiers: [
        { name: 'WhatsApp Bot Starter', priceNaira: 35000, turnaround: '4 Days' },
        { name: 'Full Business AI Integration', priceNaira: 85000, turnaround: '7 Days' }
      ]
    }
  ];

  const handleOpenBooking = (service: any) => {
    setSelectedService(service);
    setSelectedTier(service.tiers[0]?.name || 'Standard');
    setBookingSuccess(null);
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !projectBrief) return;

    if (!isCaptchaVerified) {
      alert('Please complete the anti-spam security verification.');
      return;
    }

    const currentTierObj = selectedService.tiers.find((t: any) => t.name === selectedTier) || selectedService.tiers[0];
    const budget = currentTierObj?.priceNaira || selectedService.priceNaira;

    const booking: ServiceBooking = {
      id: `SERV-NG-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      clientEmail,
      clientPhone,
      serviceTitle: selectedService.title,
      tier: selectedTier,
      budgetNaira: budget,
      budgetUsd: Math.round(budget / 1500),
      currency: 'NGN',
      projectBrief,
      deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'brief_received',
      createdAt: new Date().toISOString(),
      revisionsLeft: 3
    };

    setBookingSuccess(booking);
    if (onNewBookingCreated) {
      onNewBookingCreated(booking);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF']
    });
  };

  const handleWhatsAppConsult = (serviceTitle: string) => {
    const text = `Hello Arimo AI & Design! 👋 I would like to inquire about booking the "${serviceTitle}". My name is ${clientName || 'Creative'} and I have a project ready.`;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_DIRECT_NUMBER}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div id="services-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Bespoke Client Solutions
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Book AI &amp; Design Services <span className="text-amber-400">⚡</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Need a high-converting brand identity, viral social media graphics, or 1-on-1 coaching? We deliver excellence in 3-5 days.
          </p>
        </div>

        <a
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 self-start transition-colors"
        >
          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
          </svg>
          <span>Join Our WhatsApp Channel</span>
        </a>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((serv) => (
          <div
            key={serv.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all flex flex-col justify-between text-white group"
          >
            <div>
              {/* Badge & Price */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-black text-xs border border-amber-500/30">
                  {serv.badge}
                </span>
                <span className="text-lg font-black text-amber-400">{serv.priceLabel}</span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                {serv.title}
              </h3>

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {serv.description}
              </p>

              {/* Turnaround Pill */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Turnaround: {serv.turnaround}</span>
              </div>

              {/* Feature Checklist */}
              <div className="mt-4 space-y-2 border-t border-zinc-900 pt-4">
                {serv.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleOpenBooking(serv)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
              >
                <span>Book Service Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleWhatsAppConsult(serv.title)}
                className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Ask question on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Ask Question</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Brief Modal */}
      {isBookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-white my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingSuccess ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase mb-2">
                  <Briefcase className="w-3.5 h-3.5" /> Project Reservation
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white">
                  Book {selectedService.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Fill in your project details. We will assign your lead designer and begin within 24 hours.
                </p>

                <form onSubmit={handleSubmitBooking} className="mt-5 space-y-4">
                  {/* Select Package Tier */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Select Package Tier</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedService.tiers.map((tier: any) => (
                        <div
                          key={tier.name}
                          onClick={() => setSelectedTier(tier.name)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedTier === tier.name
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="text-xs font-black">{tier.name}</div>
                          <div className="text-sm font-black text-amber-400 mt-0.5">
                            ₦{tier.priceNaira.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{tier.turnaround}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Raji"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Project Brief &amp; Requirements *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your brand name, target audience, preferred colors (e.g. Black & Gold), or any references..."
                      value={projectBrief}
                      onChange={(e) => setProjectBrief(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white text-xs outline-none resize-none"
                    />
                  </div>

                  <AntiSpamCaptcha onVerify={(v) => setIsCaptchaVerified(v)} id="service-booking-captcha" theme="compact" />

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Booking &amp; Submit Brief</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center mx-auto text-zinc-950 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <Check className="w-7 h-7 stroke-[3px]" />
                </div>

                <h4 className="text-2xl font-black text-white">Booking Received! 🎉</h4>
                <p className="text-xs text-amber-400 font-bold mt-1">
                  Order ID: {bookingSuccess.id}
                </p>

                <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{bookingSuccess.clientName}</strong>! Your project brief for <strong>{bookingSuccess.serviceTitle} ({bookingSuccess.tier})</strong> has been logged in our queue.
                </p>

                <div className="mt-5 p-3.5 bg-zinc-900 rounded-2xl border border-zinc-800 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service:</span>
                    <span className="text-white font-bold">{bookingSuccess.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tier Budget:</span>
                    <span className="text-amber-400 font-black">₦{bookingSuccess.budgetNaira.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estimated Delivery:</span>
                    <span className="text-emerald-400 font-bold">{bookingSuccess.deadlineDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-amber-400 font-bold">Brief Received (In Queue)</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      if (onBookServicePaystack) {
                        onBookServicePaystack(bookingSuccess.serviceTitle, bookingSuccess.budgetNaira);
                      }
                      setIsBookingModalOpen(false);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Pay Deposit on Paystack</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_DIRECT_NUMBER}&text=${encodeURIComponent(`Hi Raymond Arimo! I just booked ${bookingSuccess.serviceTitle} (ID: ${bookingSuccess.id}). Let's discuss my brief.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Notify on WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                >
                  Track in My Digital Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
