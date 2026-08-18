export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Remote Jobs' | 'Dollar Payouts' | 'AI Prompts' | 'Client Pitching' | 'Canva & Design' | 'Mobile AI Tools';
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featuredImage: string;
  summary: string;
  tags: string[];
  likes: number;
  featured?: boolean;
  contentSections: {
    heading: string;
    body: string;
    bulletPoints?: string[];
    calloutBox?: {
      title: string;
      text: string;
      type: 'tip' | 'warning' | 'prompt' | 'dollar';
    };
  }[];
  relatedProductId?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'pass-data-annotation-tests-nigeria',
    title: 'How to Pass DataAnnotation.tech & Outlier AI Tests from Nigeria ($20–$35/hr in USD)',
    category: 'Remote Jobs',
    readTime: '6 min read',
    date: 'August 14, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    summary: 'A step-by-step breakdown of how Nigerian creatives and graduates are landing remote AI model training gigs paying $20 to $35 every hour directly to their dollar accounts.',
    tags: ['DataAnnotation', 'Remote Work', 'Earn in Dollars', 'Nigeria AI'],
    likes: 642,
    featured: true,
    relatedProductId: 'prod-data-annotation-kit',
    contentSections: [
      {
        heading: 'Why AI Training Companies are Hiring Globally in 2026',
        body: 'Large language models (like ChatGPT, Claude, and Gemini) need human feedback (RLHF) to become accurate, safe, and helpful. Companies like DataAnnotation.tech, Outlier.ai, Alignerr, and OneForma hire independent contractors worldwide to evaluate AI responses.',
        bulletPoints: [
          'No coding knowledge required for standard generalist and creative writing tracks.',
          'Flexible schedule: work anywhere from 5 to 40 hours per week from your home.',
          'Weekly payouts directly in US Dollars ($20 to $35/hour).'
        ]
      },
      {
        heading: 'The 3 Golden Rules to Pass the Initial Assessment',
        body: 'Most applicants fail the test because they write lazy, one-sentence feedback. When evaluating Model A vs. Model B:',
        bulletPoints: [
          'Rule 1: Always provide structured reasoning (mention Truthfulness, Instruction Following, Grammar, and Tone).',
          'Rule 2: Never use ChatGPT to write your assessment test answers (they use strict AI detection tools during screening).',
          'Rule 3: Use Grammarly or LanguageTool to eliminate all punctuation and spelling slips before hitting submit.'
        ],
        calloutBox: {
          title: '🔥 Pro Rubric Example',
          text: 'When justifying why Model A is superior, write: "Model A followed all user constraints by organizing the response into 4 distinct bullet points with concise headings, whereas Model B hallucinated outdated 2023 pricing and ignored the word limit constraint."',
          type: 'prompt'
        }
      },
      {
        heading: 'Setting Up Your Payout Channel in Nigeria',
        body: 'Do not use local Nigerian domiciliary accounts with high bank maintenance fees or slow clearance. Use Geegpay (by Raenest), Grey Finance, or direct Stripe/PayPal linkages to receive payouts instantly at the prevailing parallel market exchange rate.',
        calloutBox: {
          title: '💰 Dollar Earning Impact',
          text: 'Working just 15 hours a week at $20/hr equates to $300/week (approx. ₦450,000/week), far exceeding average entry-level corporate salaries in Lagos or Abuja.',
          type: 'dollar'
        }
      }
    ]
  },
  {
    id: 'blog-2',
    slug: 'receive-dollar-payments-nigeria-geegpay-grey-stripe',
    title: 'Bypassing Nigerian Bank Limits: How to Receive International Dollar Payments Safely',
    category: 'Dollar Payouts',
    readTime: '5 min read',
    date: 'August 12, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    summary: 'Everything you need to know about setting up virtual US, UK, and Euro accounts to get paid by international clients and withdrawal to any Nigerian bank in 60 seconds.',
    tags: ['Dollar Virtual Account', 'Geegpay', 'Grey Finance', 'Payoneer', 'Freelance Nigeria'],
    likes: 519,
    featured: true,
    relatedProductId: 'prod-client-acquisition-system',
    contentSections: [
      {
        heading: 'The Problem with Traditional Nigerian Bank Cards',
        body: 'Due to Central Bank restrictions, standard Naira debit cards have severe international spending limits ($20-$50/month) and cannot receive foreign wire transfers easily. To thrive as an online creator or remote worker, you need dedicated foreign virtual bank routing numbers.',
        bulletPoints: [
          'US Virtual Account with ACH Routing Number and Account Number',
          'UK Virtual Account with Sort Code and IBAN',
          'Euro SEPA Account for European clients'
        ]
      },
      {
        heading: 'The Top 3 Platforms Tested & Working in 2026',
        body: 'Here is our curated ranking of platforms with zero account maintenance fees and instant Naira settlement:',
        bulletPoints: [
          '1. Geegpay by Raenest: Best for direct employer direct deposits and automated USD virtual debit cards.',
          '2. Grey Finance: Best for fast currency swap (USD/GBP/EUR to NGN) directly into Kuda, OPay, GTBank, or Zenith.',
          '3. Payoneer: Essential for Upwork, Fiverr, and Amazon KDP payouts.'
        ],
        calloutBox: {
          title: '💡 Quick Verification Tip',
          text: 'Use your NIN Slip (National Identification Number) or International Passport along with a recent utility bill (or bank statement bearing your exact home address) to get instant Tier-3 verification in less than 2 hours.',
          type: 'tip'
        }
      }
    ]
  },
  {
    id: 'blog-3',
    slug: 'midjourney-prompts-african-skin-tones-luxury',
    title: 'The 7 Secret Midjourney Prompts for Hyper-Realistic African Skin Tones & Luxury Branding',
    category: 'AI Prompts',
    readTime: '7 min read',
    date: 'August 10, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    summary: 'Stop generating generic waxy faces. Master the exact lighting modifiers, camera lenses, and cultural parameter tokens for stunning 8K commercial visuals.',
    tags: ['Midjourney v6', 'African Art', 'AI Prompt Engineering', 'Leonardo AI'],
    likes: 830,
    featured: false,
    relatedProductId: 'prod-midjourney-bible',
    contentSections: [
      {
        heading: 'Why AI Image Generators Struggle with Melanin Rich Skin',
        body: 'Default Midjourney outputs often apply excessive plastic smoothing or incorrect specular lighting on dark skin tones. By specifying key photographic lenses and physical lighting rigs, you can achieve natural pores, rich undertones, and editorial sheen.',
        bulletPoints: [
          'Add modifier: "Subtle warm gold rim lighting, subsurface scattering, natural skin texture, 85mm portrait lens"',
          'Avoid words like "hyperrealistic" or "photorealistic" (they actually degrade Midjourney v6 output quality)',
          'Use shutter and aperture tokens: "f/1.8 aperture, softbox studio lighting, Hasselblad H6D-100c"'
        ]
      },
      {
        heading: 'Copy-Paste Luxury Prompt Formula',
        body: 'Here is our tested prompt template for commercial fashion and product campaigns:',
        calloutBox: {
          title: '📋 Tested Midjourney v6 Prompt',
          text: 'Editorial portrait of an elegant young Nigerian woman in a structured obsidian black and gold haute couture blazer, minimalist gold geometric earrings, luminous dark skin with subtle natural glow, warm amber rim lighting, shot on 85mm f/1.4 lens, clean dark studio background --ar 4:5 --stylize 250 --v 6.0',
          type: 'prompt'
        }
      }
    ]
  },
  {
    id: 'blog-4',
    slug: 'chatgpt-pitch-foreign-clients-upwork-linkedin',
    title: 'How to Use ChatGPT to Pitch Foreign Clients on Upwork & LinkedIn (Without Sounding Robotic)',
    category: 'Client Pitching',
    readTime: '6 min read',
    date: 'August 08, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    summary: 'Foreign clients delete generic "I hope this email finds you well" messages instantly. Here is how to use AI to write bespoke, punchy 3-sentence proposals that get 80%+ reply rates.',
    tags: ['Upwork', 'Cold Outreach', 'ChatGPT', 'Freelancing'],
    likes: 476,
    featured: false,
    relatedProductId: 'prod-client-acquisition-system',
    contentSections: [
      {
        heading: 'The 3-Sentence Proposal Architecture',
        body: 'High-earning foreign founders read proposals on their phones between meetings. Your entire pitch must be digestible in 10 seconds:',
        bulletPoints: [
          'Sentence 1: The Observation — Mention a specific detail from their website or job post.',
          'Sentence 2: The Solution — Explain the exact outcome you will deliver in 3 days.',
          'Sentence 3: The Low-Friction CTA — Ask if they would like a free 2-minute video mockup.'
        ],
        calloutBox: {
          title: '🤖 The AI Prompt Framework',
          text: 'Act as an elite design copywriter. Read this client job description: [Insert Job Brief]. Write a 3-sentence proposal. Avoid clichés like "I am writing to express my interest". Start immediately with an observation of their brand problem, offer a 48-hour solution, and end with a low-friction question.',
          type: 'prompt'
        }
      }
    ]
  },
  {
    id: 'blog-5',
    slug: 'monetizing-canva-and-ai-nigeria',
    title: 'Canva + AI Monetization: How to Make ₦300k–₦600k/mo Selling Digital Templates',
    category: 'Canva & Design',
    readTime: '5 min read',
    date: 'August 05, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    summary: 'A comprehensive guide on creating digital assets once and selling them on Selar, Gumroad, and Paystack on complete autopilot.',
    tags: ['Canva', 'Passive Income', 'Selar', 'Digital Products Nigeria'],
    likes: 712,
    featured: false,
    relatedProductId: 'prod-canva-templates',
    contentSections: [
      {
        heading: 'Why Digital Templates Beat Physical E-Commerce in Nigeria',
        body: 'Physical products come with dispatch rider headaches, damaged goods, and high inventory costs. Digital products have 95%+ profit margins and deliver instantly to customer emails 24/7.',
        bulletPoints: [
          'Zero delivery fees or logistics stress.',
          'Create once in Canva or Figma, sell to 10,000 customers worldwide.',
          'Automated checkout in Naira (₦) via Paystack and Dollars ($) via Stripe.'
        ]
      }
    ]
  },
  {
    id: 'blog-6',
    slug: 'low-data-mobile-ai-tools-for-nigerians',
    title: 'Top 7 Free, Low-Data Mobile AI Apps for Nigerian Creatives and NYSC Corps Members',
    category: 'Mobile AI Tools',
    readTime: '4 min read',
    date: 'August 01, 2026',
    author: {
      name: 'Raymond Arimo',
      role: 'Founder & AI Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    summary: 'You do not need a ₦2,000,000 MacBook to master AI. These mobile-friendly AI applications work smoothly on budget Android & iPhone devices with minimal internet data.',
    tags: ['Mobile AI', 'NYSC', 'Budget Tools', 'Nigeria Tech'],
    likes: 589,
    featured: false,
    relatedProductId: 'prod-nysc-remote-blueprint',
    contentSections: [
      {
        heading: 'Mobile-First AI Stack for Nigerians',
        body: 'Here are the essential apps you can download on your smartphone right now to start creating professional client deliverables:',
        bulletPoints: [
          '1. ChatGPT Official Mobile App: Turn on Voice Mode for real-time interview practice and design critiques.',
          '2. Leonardo AI Web App: Generate 150 free high-resolution images daily directly in your Chrome or Safari browser.',
          '3. CapCut Mobile: Use the auto-captions and AI script-to-video generator to produce viral TikToks in 3 minutes.',
          '4. Photoroom: Instant background removal and studio product staging on your phone.'
        ]
      }
    ]
  }
];
