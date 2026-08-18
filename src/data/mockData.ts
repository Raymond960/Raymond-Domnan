import { ProductItem, AiTipItem, PortfolioItem, TestimonialItem, ServiceBooking, ClientPurchase, LeadMagnetSubscriber } from '../types';

export const WHATSAPP_COMMUNITY_URL = 'https://whatsapp.com/channel/0029VbDzzfH4NVitnLwuYk0P';
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDzzfH4NVitnLwuYk0P';
export const WHATSAPP_DIRECT_NUMBER = '2348000000000';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-chatgpt-prompts',
    title: '50 ChatGPT Prompts for Designers & Creatives',
    category: 'file',
    subcategory: 'AI Prompts Vault',
    priceUsd: 5,
    originalPriceUsd: 15,
    priceNaira: 7500,
    originalPriceNaira: 22500,
    rating: 4.98,
    reviewCount: 384,
    shortDescription: 'Copy-paste ChatGPT prompts to generate killer design briefs, color palettes, client pitch proposals, and UX copy in seconds.',
    fullDescription: 'Stop struggling with blank pages or undercharging clients. This curated prompt kit gives you battle-tested prompts for branding, typography pairing, logo concepts, client discovery calls, and design critique. Designed for global freelance designers and African creatives looking to close international high-paying gigs.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PDF', 'NOTION', 'TXT', 'DOCX'],
    fileSizeBytes: '12 MB',
    version: 'v2026.2 Global Edition',
    includedItems: [
      '50 High-Converting Designer Prompts (Categorized)',
      'Client Email & DM Pitch Templates that close deals',
      'Prompt Optimization Cheatsheet for ChatGPT-4o & Claude 3.7',
      'Notion Database Link + Offline PDF Guide',
      'Instant Download & Lifetime Free Updates'
    ],
    specifications: [
      { label: 'Format', value: 'Instant PDF Guide + Notion Hub' },
      { label: 'Compatibility', value: 'ChatGPT, Claude, DeepSeek, Gemini' },
      { label: 'Language', value: 'English (Worldwide Freelance Context)' },
      { label: 'Delivery', value: 'Instant Digital Download ($ & ₦)' }
    ],
    downloadFileName: 'Arimo_50_ChatGPT_Prompts_For_Designers.pdf',
    featured: true,
    badge: '🔥 Global Best Seller ($5 / ₦7,500)',
    instantBenefit: 'Generate client-winning design copy and briefs in 60 seconds.',
    targetAudience: 'Graphic designers, UI/UX creatives, freelancers, brand strategists'
  },
  {
    id: 'prod-canva-templates',
    title: 'Canva Social Media Template Pack (30 Templates)',
    category: 'template',
    subcategory: 'Social Media Assets',
    priceUsd: 15,
    originalPriceUsd: 35,
    priceNaira: 22500,
    originalPriceNaira: 50000,
    rating: 4.95,
    reviewCount: 219,
    shortDescription: '30 modern, editable Instagram and LinkedIn templates in Black & Gold luxury aesthetics. Edit in free Canva app in 5 minutes.',
    fullDescription: 'Elevate your personal brand or client social channels. Perfectly formatted for Instagram Carousels, Square Posts, Stories, and LinkedIn single-image cards. Easily swap colors, photos, and typography right inside the free Canva mobile or desktop app.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['CANVA LINK', 'PNG 4K', 'PDF GUIDE'],
    fileSizeBytes: 'Cloud Access (45 MB Assets)',
    version: 'v3.5',
    includedItems: [
      '30 One-Click Editable Canva Templates (Free & Pro)',
      '10 High-Engagement Carousel Slides',
      '10 Viral Quote & Testimonial Layouts',
      '10 Promo & Product Launch Graphics',
      'Video Tutorial on phone customization'
    ],
    specifications: [
      { label: 'Software', value: 'Free Canva Mobile & Web App' },
      { label: 'Aspect Ratio', value: '1:1 (Square) & 4:5 (Portrait) & 9:16 (Story)' },
      { label: 'License', value: 'Commercial / Client Re-use allowed' }
    ],
    downloadFileName: 'Arimo_Canva_30_Luxury_Templates_Access.pdf',
    featured: true,
    badge: '30 Luxury Templates ($15 / ₦22.5k)',
    instantBenefit: 'Post consistently without hiring expensive marketing agencies.',
    targetAudience: 'Small business owners, Instagram coaches, consultants, creators'
  },
  {
    id: 'prod-data-annotation-kit',
    title: 'Data Annotation Resume + Remote Portfolio Kit',
    category: 'kit',
    subcategory: 'Remote Jobs & Careers',
    priceUsd: 25,
    originalPriceUsd: 60,
    priceNaira: 37500,
    originalPriceNaira: 90000,
    rating: 4.97,
    reviewCount: 312,
    shortDescription: 'The proven blueprint, ATS-friendly resume templates, and qualification test answers to land $15–$30/hour remote AI training jobs worldwide.',
    fullDescription: 'Get hired by top international AI training companies (DataAnnotation.tech, Remotasks/Outlier, Appen, OneForma, Alignerr) from anywhere in the world including Nigeria, USA, UK, Ghana. Includes ATS-optimized resume files, test prep guides, English prompt evaluation samples, and dollar payout setup instructions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['DOCX', 'PDF', 'NOTION', 'VIDEO GUIDE'],
    fileSizeBytes: '54 MB',
    version: 'v2026.3 Global',
    includedItems: [
      '3 ATS-Approved Data Annotation Resume Templates',
      'Step-by-Step Global Application & Country Setup Guide',
      'Pass-The-Test Screening Answers & Prompt Rubrics',
      'Dollar Payout Setup Guide (Geegpay, Grey, Payoneer to Local Bank)',
      'Exclusive Access to Weekly Job Drops in WhatsApp Community'
    ],
    specifications: [
      { label: 'Earning Potential', value: '$15 to $35 / hour' },
      { label: 'Location', value: '100% Remote (Global & Nigeria)' },
      { label: 'Requirements', value: 'Basic English, Internet, Laptop/Phone' }
    ],
    downloadFileName: 'Data_Annotation_Job_Landing_Kit_Global.zip',
    featured: true,
    badge: '💰 Earn $15–$30/hr ($25 / ₦37.5k)',
    instantBenefit: 'Land high-paying remote AI evaluation gigs from your bedroom.',
    targetAudience: 'Graduates, NYSC corps members, writers, tech enthusiasts, remote job seekers'
  },
  {
    id: 'prod-1on1-coaching',
    title: '1-on-1 AI & Design Coaching (1 Hour Call)',
    category: 'coaching',
    subcategory: 'Direct Mentorship',
    priceUsd: 50,
    originalPriceUsd: 120,
    priceNaira: 75000,
    originalPriceNaira: 180000,
    rating: 5.0,
    reviewCount: 84,
    shortDescription: 'One full hour private coaching with Raymond Arimo via Google Meet / Zoom. Live portfolio audit, AI workflow setup, and personalized income blueprint.',
    fullDescription: 'Get personalized feedback on your design portfolio, master exact prompt strategies to save 10 hours a week, and build a concrete strategy to earn $500–$2,000+ monthly doing AI and design for local and foreign clients. Call recording and action plan document provided.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['LIVE 1-ON-1 CALL', 'RECORDING', 'CUSTOM PDF BLUEPRINT'],
    fileSizeBytes: 'Live 60-Minute Session',
    version: 'Live Session',
    includedItems: [
      '60 Minutes Intensive 1-on-1 Video Strategy Call',
      'Full Portfolio & Resume Live Audit',
      'Customized 30-Day Dollar & Naira Client Acquisition Plan',
      'Lifetime VIP WhatsApp Priority DM Access',
      'Session Recording & Action Step Notes'
    ],
    specifications: [
      { label: 'Platform', value: 'Google Meet / Zoom / WhatsApp Video' },
      { label: 'Duration', value: '60 Minutes Deep Dive' },
      { label: 'Scheduling', value: 'Flexible booking within 48 hours' }
    ],
    downloadFileName: 'Coaching_Prep_Sheet_&_Booking_Calendar.pdf',
    featured: true,
    badge: '⭐ VIP 1-on-1 ($50 / ₦75k)',
    instantBenefit: 'Skip 2 years of trial and error with direct personal mentorship.',
    targetAudience: 'Aspiring creators, designers stuck at low income, career switchers'
  },
  {
    id: 'prod-logo-service',
    title: 'Custom Brand & Logo Design Service',
    category: 'design_service',
    subcategory: 'Bespoke Client Services',
    priceUsd: 100,
    originalPriceUsd: 220,
    priceNaira: 150000,
    originalPriceNaira: 320000,
    rating: 4.98,
    reviewCount: 112,
    shortDescription: 'Professional, custom logo and visual identity crafted for modern startups, corporate brands, and creators worldwide. Delivered in 3-5 days.',
    fullDescription: 'We create iconic, modern logos that position your company as an industry leader. Receive multiple unique creative directions, revisions until you are 100% satisfied, and master vector files ready for websites, social media, signage, and merchandise.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['AI', 'SVG', 'PNG 4K', 'PDF', 'PSD'],
    fileSizeBytes: 'Full Vector Package (85 MB)',
    version: 'Custom Delivery',
    includedItems: [
      '3 Unique Logo Concepts based on your brief',
      'Full Vector & High-Res PNG Exports with Transparent Backgrounds',
      'Color Palette & Font Pairing Guide',
      '3D Realistic Mockup Previews (Merch & Office Wall)',
      'Full Commercial & Trademark Ownership'
    ],
    specifications: [
      { label: 'Turnaround', value: '3 to 5 Days' },
      { label: 'Revisions', value: '3 Free Iteration Rounds' },
      { label: 'Service Type', value: 'Done-For-You Design Service' }
    ],
    serviceTiers: [
      {
        name: 'Starter Logo Package',
        priceUsd: 100,
        priceNaira: 150000,
        turnaround: '3 Days',
        revisions: '2 Rounds',
        features: ['2 Logo Concepts', 'High-Res PNG & JPEG', 'Color Code Guide', 'Social Avatar Assets']
      },
      {
        name: 'Complete Brand Identity Pack',
        priceUsd: 200,
        priceNaira: 300000,
        turnaround: '5 Days',
        revisions: '4 Rounds',
        features: ['3 Premium Concepts', 'Master Vector Source Files (AI, SVG, PDF)', 'Letterhead & Business Card Design', 'Social Media Kit (Profile + 5 Banners)', '3D Signboard Mockups']
      },
      {
        name: 'VIP Global Corporate Suite',
        priceUsd: 350,
        priceNaira: 500000,
        turnaround: '7 Days',
        revisions: 'Unlimited',
        features: ['Complete Corporate Identity', 'Full Brand Guidelines PDF Book', 'Staff ID Card & Invoice Templates', 'Custom Website Landing Page Banner Set', 'Priority WhatsApp / Zoom Support']
      }
    ],
    featured: true,
    badge: 'From $100 / ₦150k',
    instantBenefit: 'Position your business as a world-class luxury brand.',
    targetAudience: 'Startup founders, tech entrepreneurs, corporate firms, creators'
  },
  {
    id: 'prod-midjourney-bible',
    title: 'Midjourney & Leonardo AI Art Mastery Bible',
    category: 'file',
    subcategory: 'AI Art & Graphics',
    priceUsd: 12,
    originalPriceUsd: 28,
    priceNaira: 18000,
    originalPriceNaira: 42000,
    rating: 4.96,
    reviewCount: 96,
    shortDescription: '100+ master prompts to generate ultra-realistic African & global character portraits, luxury gold & black branding visuals, and 3D product renders.',
    fullDescription: 'Unlock breathtaking imagery using Midjourney v6 and Leonardo AI. Contains detailed parameter breakdowns (--stylize, --chaos, lighting rigs, camera lenses, cultural aesthetics) so your generated art looks like high-end 8K photography.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PDF', 'PROMPT REPO', 'IMAGE GALLERY'],
    fileSizeBytes: '82 MB',
    version: 'v3.5',
    includedItems: [
      '100+ Plug-and-Play Prompts with Target Output Examples',
      'Realistic Lighting & Skin Tone Formulas',
      '3D Isometric Tech & UI Illustration Prompts',
      'Commercial Print-On-Demand Merch Formulas'
    ],
    specifications: [
      { label: 'Tools', value: 'Midjourney v6, Leonardo AI, DALL-E 3' },
      { label: 'Format', value: 'Visual PDF Catalog + Prompt Text' }
    ],
    downloadFileName: 'Midjourney_Leonardo_AI_Mastery_Bible.pdf',
    featured: false,
    badge: '100+ Prompts ($12 / ₦18k)',
    instantBenefit: 'Generate ultra-photorealistic 8K images for clients in seconds.',
    targetAudience: 'Digital artists, graphic designers, print-on-demand sellers, creative directors'
  },
  {
    id: 'prod-3d-ecommerce-mockups',
    title: '3D Product & Packaging AI Mockup Studio Kit',
    category: 'template',
    subcategory: '3D Mockups & Branding',
    priceUsd: 10,
    originalPriceUsd: 25,
    priceNaira: 15000,
    originalPriceNaira: 37500,
    rating: 4.97,
    reviewCount: 142,
    shortDescription: '40+ drag-and-drop 3D mockup scenes for perfume bottles, skincare tubes, tech devices, apparel, and luxury packaging in PSD & Canva.',
    fullDescription: 'Create high-converting e-commerce product photos and portfolio presentations without paying for physical 3D studio renders. Includes smart object PSDs and one-click Canva editable scenes with realistic lighting, shadows, and obsidian gold pedestals.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608248597359-59754f9a35e4?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PSD (Smart Objects)', 'CANVA PRO', 'PNG 4K Transparent'],
    fileSizeBytes: '140 MB Assets',
    version: 'v2.8 Studio',
    includedItems: [
      '40+ Ultra-Realistic 3D Packaging Scenes (Cosmetics, Bottles, Boxes, Apparel)',
      'Obsidian, Marble & Gold Studio Pedestal Backgrounds',
      'Smart Object 1-Click Replace Layer in Photoshop & Photopea',
      'Canva Drag-and-Drop Mockup Templates',
      'Commercial Client Presentation Guide'
    ],
    specifications: [
      { label: 'Resolution', value: '4K Ultra HD (4000x3000px)' },
      { label: 'Compatibility', value: 'Photoshop, Photopea (Free), Canva' },
      { label: 'License', value: 'Unlimited Commercial Use' }
    ],
    downloadFileName: 'Arimo_3D_Product_Mockup_Studio_Kit.zip',
    featured: true,
    badge: '🔥 40+ 3D Scenes ($10 / ₦15k)',
    instantBenefit: 'Present your designs like a $10,000 branding agency.',
    targetAudience: 'E-commerce store owners, packaging designers, 3D artists, freelancers'
  },
  {
    id: 'prod-client-acquisition-system',
    title: 'Cold DM & International Client Acquisition System',
    category: 'kit',
    subcategory: 'Client Acquisition & Upwork',
    priceUsd: 20,
    originalPriceUsd: 45,
    priceNaira: 30000,
    originalPriceNaira: 67500,
    rating: 4.99,
    reviewCount: 204,
    shortDescription: 'The exact email scripts, LinkedIn outreach templates, and Upwork proposal formulas used to land $500–$2,500 foreign design clients from Nigeria.',
    fullDescription: 'Stop competing in low-budget local bidding wars. This battle-tested client acquisition system provides proven outreach scripts that open doors with founders in the US, UK, Canada, and UAE. Includes contract templates, pricing negotiation scripts, and dollar invoicing guides.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PDF', 'NOTION PIPELINE', 'DOCX CONTRACTS'],
    fileSizeBytes: '32 MB',
    version: 'v2026.4',
    includedItems: [
      '15 High-Response Cold Email & LinkedIn DM Scripts',
      'Winning Upwork Proposal Templates (80%+ Open Rate)',
      'Client Onboarding & International Contract Templates',
      'Price Negotiation & Objection Handling Playbook',
      'Dollar Payment & Bank Invoicing Setup Checklist'
    ],
    specifications: [
      { label: 'Target Clients', value: 'US, UK, European & GCC Founders' },
      { label: 'Average Deal Size', value: '$500 to $2,500 per project' },
      { label: 'Delivery', value: 'Instant Download & Notion Workspace' }
    ],
    downloadFileName: 'International_Client_Acquisition_System_Arimo.zip',
    featured: true,
    badge: '💼 Land Foreign Clients ($20 / ₦30k)',
    instantBenefit: 'Close international clients paying in USD/GBP without leaving home.',
    targetAudience: 'Freelance designers, copywriters, agency owners, video editors'
  },
  {
    id: 'prod-viral-reels-scripts',
    title: 'Viral AI Video & Instagram Reels Script Engine',
    category: 'file',
    subcategory: 'Video Scripts & UGC',
    priceUsd: 8,
    originalPriceUsd: 20,
    priceNaira: 12000,
    originalPriceNaira: 30000,
    rating: 4.94,
    reviewCount: 167,
    shortDescription: '75 viral short-form video hooks, ChatGPT script prompts, and storytelling frameworks engineered for TikTok, YouTube Shorts & Instagram Reels.',
    fullDescription: 'Grow your personal brand and generate inbound leads effortlessly. Includes high-retention 3-second visual hooks, psychological pacing frameworks, call-to-action formulas, and AI avatar video prompts compatible with CapCut, HeyGen, and ElevenLabs.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PDF', 'NOTION DATABASE', 'AUDIO HOOKS'],
    fileSizeBytes: '24 MB',
    version: 'v2026.1 Viral',
    includedItems: [
      '75 High-Engagement 3-Second Hook Formulas',
      '20 Done-For-You Educational & Sales Script Blueprints',
      'ElevenLabs AI Voiceover & Sound Effect Prompt Guide',
      'CapCut Mobile Editing Pacing Cheatsheet'
    ],
    specifications: [
      { label: 'Platforms', value: 'TikTok, Instagram Reels, YouTube Shorts' },
      { label: 'Format', value: 'Interactive Notion Hub + Mobile PDF' },
      { label: 'Niches', value: 'Tech, AI, Business, Design, Motivation' }
    ],
    downloadFileName: 'Viral_Video_Reels_Script_Engine_Arimo.pdf',
    featured: false,
    badge: '📱 75 Viral Hooks ($8 / ₦12k)',
    instantBenefit: 'Blow up your social media views and convert followers into buyers.',
    targetAudience: 'Content creators, digital coaches, video editors, brand builders'
  },
  {
    id: 'prod-nysc-remote-blueprint',
    title: 'NYSC & Nigerian Graduate $1,000/mo Remote Income Blueprint',
    category: 'kit',
    subcategory: 'Career Blueprints',
    priceUsd: 18,
    originalPriceUsd: 40,
    priceNaira: 27000,
    originalPriceNaira: 60000,
    rating: 4.98,
    reviewCount: 289,
    shortDescription: 'Step-by-step roadmap for Nigerian graduates and NYSC corps members to build a sustainable $500–$1,500/month remote digital career.',
    fullDescription: 'Written specifically for Nigerian youths tackling currency inflation. Step-by-step guidance on identifying high-demand remote skills, bypassing payment hurdles with Geegpay/Grey/Stripe, setting up an international-standard online presence, and landing your first foreign gig within 30 days.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80'
    ],
    isDigital: true,
    fileFormats: ['PDF MASTER GUIDE', 'VIDEO WALKTHROUGHS', 'RESOURCE LINKS'],
    fileSizeBytes: '65 MB Package',
    version: 'v2026 Edition',
    includedItems: [
      'Comprehensive 70-Page Digital Career Roadmap PDF',
      'List of 25+ Verified Companies Hiring Nigerians Remotely',
      'Dollar Payout Setup (Zero hassle account creation walkthrough)',
      'Resume & LinkedIn Profile Optimization Templates',
      'Free 1-Month Access to Weekly VIP Q&A Sessions'
    ],
    specifications: [
      { label: 'Author', value: 'Raymond Arimo' },
      { label: 'Target Audience', value: 'NYSC Members, Nigerian Graduates, Youths' },
      { label: 'Target Income', value: '$500 to $1,500+ monthly' }
    ],
    downloadFileName: 'NYSC_Graduate_Remote_Income_Blueprint_2026.zip',
    featured: true,
    badge: '🇳🇬 Graduate Special ($18 / ₦27k)',
    instantBenefit: 'Earn in stable foreign currency while serving in Nigeria.',
    targetAudience: 'Nigerian corps members, university students, fresh graduates, career changers'
  }
];

export const AI_TIPS_DATA: AiTipItem[] = [
  {
    id: 'tip-1',
    title: 'How to make $20–$35/hour doing AI Data Annotation globally',
    category: 'Data Jobs',
    summary: 'International AI companies hire remotely to evaluate chatbot outputs, fact-check responses, and annotate text with zero coding required.',
    fullTip: 'Websites like DataAnnotation.tech, Outlier.ai, and Alignerr hire worldwide. To pass the screening assessment: 1) Answer every test question with structured reasoning (mention grammar, truthfulness, tone). 2) Use Grammarly to ensure zero typos. 3) Set up a Stripe/Geegpay/Payoneer account to receive direct payouts. You can work 15–20 hours a week from home with just a laptop and internet.',
    actionablePrompt: 'Act as an expert AI evaluator. Critique the following 2 responses for accuracy, helpfulness, and safety. Provide specific ratings on a 1-5 scale with detailed justifications.',
    estimatedEarnings: '$15 - $35 / hour (Paid weekly)',
    difficulty: 'Beginner',
    dateAdded: 'Today',
    likes: 482
  },
  {
    id: 'tip-2',
    title: 'The "Golden Ratio" ChatGPT prompt for high-converting brand briefs',
    category: 'ChatGPT',
    summary: 'Stop asking ChatGPT generic questions. Use this structured prompt framework to generate client brand identities in 30 seconds.',
    fullTip: 'Instead of saying "Give me a logo idea", feed the AI your client industry, psychological archetype, target demographic in Nigeria/Abroad, and key color constraints. You will receive 3 distinct creative concepts with taglines and visual metaphors ready for Figma.',
    actionablePrompt: 'I am designing a brand identity for a modern fintech company targeting young professionals worldwide. Brand values: Trust, Speed, Gold & Black prestige. Give me 3 unique logo concept ideas, typography pairings (header + body), color hex codes, and a 1-sentence brand manifesto.',
    estimatedEarnings: 'Saves 3 hours per client project',
    difficulty: 'Beginner',
    dateAdded: 'Yesterday',
    likes: 310
  },
  {
    id: 'tip-3',
    title: 'Turn smartphone photos into luxury studio product shots with AI',
    category: 'Midjourney',
    summary: 'Charge e-commerce stores $50–$150 to upgrade their basic phone pictures into studio-quality marketing mockups.',
    fullTip: 'Take a clear photo of any product (perfume, sneakers, clothing) on a plain white table. Remove the background with Canva or Photoroom, then use Leonardo AI / Midjourney inpainting with luxury studio lighting prompts.',
    actionablePrompt: 'Commercial studio product photography, modern luxury glass bottle placed on dark obsidian marble pedestal, subtle golden ambient rim lighting, hyper-realistic, 8k resolution, cinematic depth of field --ar 4:5 --v 6.0',
    estimatedEarnings: '$50 - $200 per client catalog',
    difficulty: 'Intermediate',
    dateAdded: '2 days ago',
    likes: 388
  },
  {
    id: 'tip-4',
    title: 'Global Dollar Virtual Accounts & Fast Bank Payouts in 2026',
    category: 'Global Earning',
    summary: 'How to easily receive freelance payments from US, UK & European clients and withdraw directly to your local bank account.',
    fullTip: 'Top platforms working reliably worldwide: 1) Stripe & Paystack for direct checkout processing. 2) Geegpay by Raenest & Grey Finance for instant USD/GBP virtual accounts. 3) Payoneer for direct Upwork and Fiverr withdrawals. Always verify your identity with government ID for instant tier limits.',
    actionablePrompt: 'Generate a professional international invoice message requesting bank transfer payment via US ACH routing, Wire, or Stripe checkout link.',
    estimatedEarnings: 'Global payments at zero stress',
    difficulty: 'Beginner',
    dateAdded: '3 days ago',
    likes: 560
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Fintech App Brand System & Monogram',
    category: 'Brand Identity',
    client: 'PayPulse Global',
    clientLocation: 'Lagos & London, UK',
    clientFlag: '🇬🇧 🇳🇬',
    description: 'Transformed an outdated, clunky emblem into a sleek, high-precision golden monogram and dark mode design system.',
    beforeImage: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    beforeLabel: 'Old Outdated Logo',
    afterLabel: 'New Arimo Gold Brand System',
    toolsUsed: ['Figma', 'Midjourney v6', 'Adobe Illustrator', 'Custom Tokens'],
    aiPromptSnippet: 'Minimalist geometric fintech monogram, golden ratio symmetry, matte black background with subtle gold sheen, luxury vector --v 6.0',
    outcomeStats: '340% increase in investor deck engagement'
  },
  {
    id: 'port-2',
    title: 'Luxury E-Commerce: AI Creative Transformation',
    category: 'AI Transformation',
    client: 'Aura Botanicals',
    clientLocation: 'Toronto, Canada',
    clientFlag: '🇨🇦',
    description: 'Upgraded low-quality mobile phone snapshots into world-class Vogue-style luxury beauty product advertisements.',
    beforeImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1608248597359-59754f9a35e4?auto=format&fit=crop&w=800&q=80',
    beforeLabel: 'Raw Phone Snapshot',
    afterLabel: 'AI Generative Lighting & Pedestal',
    toolsUsed: ['Photoshop Generative Fill', 'Leonardo AI', 'Canva Pro'],
    aiPromptSnippet: 'Luxury skincare packaging on floating dark stone pedestal, surrounded by botanical mist and warm gold morning rays --ar 4:5',
    outcomeStats: '$12,400 sales in 14-day launch campaign'
  },
  {
    id: 'port-3',
    title: 'Social Media Mastery: Viral Carousel Campaign',
    category: 'Social Media',
    client: 'The Wealth Shift Academy',
    clientLocation: 'Atlanta, USA & Lagos',
    clientFlag: '🇺🇸 🇳🇬',
    description: 'Designed a 10-slide high-retention Instagram carousel with high-contrast Black, Gold & White typography that generated massive reach.',
    beforeImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    beforeLabel: 'Plain Boring Text Post',
    afterLabel: 'Arimo Luxury Visual Carousel',
    toolsUsed: ['Canva', 'Figma', 'ChatGPT Copywriting'],
    aiPromptSnippet: 'High-contrast editorial typography, bold gold headers, dark charcoal card layout with clean bullet points',
    outcomeStats: '185,000+ impressions & 3,400 new followers'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Tunde Adebayo',
    role: 'Freelance Designer & Data Annotator',
    location: 'Ikeja, Lagos',
    countryCode: 'NG',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productOrService: 'Data Annotation Kit ($25 / ₦37,500)',
    comment: 'Bro, I was skeptical at first. But I bought the Data Annotation kit, prepared my resume with the template, and got approved by Outlier in 4 days! I earned $320 last week alone. Raymond is the real deal.',
    earningsProof: 'Earned $320 in 1 week'
  },
  {
    id: 'test-2',
    name: 'Marcus Sterling',
    role: 'Creative Director',
    location: 'Houston, Texas, USA',
    countryCode: 'US',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productOrService: 'ChatGPT Prompts + Logo Brand Kit',
    comment: 'Raymond and Arimo AI delivered exceptional design standards. The prompts saved my agency at least 15 hours on our last 3 client briefs. Paid seamlessly in USD via Stripe.',
    earningsProof: 'Saved 15+ hrs/week'
  },
  {
    id: 'test-3',
    name: 'Chioma Okonkwo',
    role: 'Agency Founder & Content Creator',
    location: 'Enugu & Remote',
    countryCode: 'NG',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productOrService: 'Canva 30 Templates + 1-on-1 Coaching',
    comment: 'The Canva templates saved my team so much stress. We use them for 4 different client accounts. Then the 1-hour coaching session with Raymond helped me restructure my pricing to ₦250k+ per retainer. God bless you!',
    earningsProof: 'Scaled agency to ₦800k/mo'
  },
  {
    id: 'test-4',
    name: 'Sophie Bennett',
    role: 'Brand Consultant',
    location: 'London, UK',
    countryCode: 'GB',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productOrService: 'Brand Identity & Logo Service',
    comment: 'Flawless execution on our logo project. Raymond listened to our requirements and delivered a bold, timeless visual identity. The black and gold palette looks stunning on our pitch decks.',
    earningsProof: '5-Star Agency Deliverable'
  }
];

export const INITIAL_SERVICE_BOOKINGS: ServiceBooking[] = [
  {
    id: 'SERV-GL-9042',
    clientName: 'David Adeleke',
    clientEmail: 'david@afriwealth.ng',
    clientPhone: '+2348039281744',
    clientCountry: 'Nigeria',
    serviceTitle: 'Custom Brand & Logo Design Service',
    tier: 'Complete Brand Identity Pack',
    budgetUsd: 200,
    budgetNaira: 300000,
    currency: 'NGN',
    paymentGateway: 'paystack',
    projectBrief: 'Need an ultra-clean fintech mark for a micro-investment app. Gold and obsidian black with high contrast. Include 3D logo mockups and vector SVG.',
    deadlineDate: '2026-08-22',
    status: 'proof_ready',
    createdAt: '2026-08-14T09:30:00Z',
    proofPreviewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    revisionsLeft: 3,
    clientFeedback: 'Initial proof looks stunning! Please send the final transparent vector SVG files.'
  }
];

export const INITIAL_PURCHASES: ClientPurchase[] = [
  {
    orderId: 'ORD-GL-7731',
    purchaseDate: '2026-08-15T18:20:00Z',
    customerName: 'Emeka Nwosu',
    customerEmail: 'emeka.design@gmail.com',
    customerPhone: '+2348123456789',
    customerCountry: 'Nigeria',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // 50 ChatGPT Prompts
        quantity: 1,
        selectedLicense: 'commercial',
        tierPriceNaira: 7500,
        tierPriceUsd: 5
      }
    ],
    currency: 'NGN',
    subtotal: 7500,
    discount: 0,
    total: 7500,
    subtotalNaira: 7500,
    totalNaira: 7500,
    totalUsd: 5,
    paymentGateway: 'paystack',
    paymentMethod: 'Paystack Card / Transfer (₦)',
    paymentReference: 'pstk_ref_9928172648',
    status: 'paid',
    licenseKeys: [
      {
        productId: 'prod-chatgpt-prompts',
        productTitle: '50 ChatGPT Prompts for Designers & Creatives',
        key: 'ARIMO-GL-7731-X99-2026',
        licenseType: 'commercial'
      }
    ],
    downloads: [
      {
        productId: 'prod-chatgpt-prompts',
        fileName: 'Arimo_50_ChatGPT_Prompts_For_Designers.pdf',
        format: 'PDF / Notion Hub',
        fileSize: '12 MB',
        version: 'v2026.2 Global'
      }
    ]
  }
];

export const INITIAL_SUBSCRIBERS: LeadMagnetSubscriber[] = [
  {
    id: 'sub-1',
    name: 'Samuel Eze',
    email: 'samuel.eze@gmail.com',
    phone: '+2348031122334',
    country: 'Nigeria',
    subscribedAt: '2026-08-15T12:00:00Z',
    downloaded: true
  }
];
