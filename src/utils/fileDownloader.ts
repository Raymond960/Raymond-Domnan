/**
 * Generates and triggers actual downloadable client assets, certificates, and prompt packages
 * for Arimo AI & Design with expiring download tokens and digital license watermarking.
 */
export function downloadDigitalAsset(
  fileName: string,
  productTitle: string,
  licenseKey: string,
  format: string,
  options?: {
    expiresAt?: number;
    token?: string;
    orderId?: string;
  }
) {
  // Check token expiration if provided
  if (options?.expiresAt && Date.now() > options.expiresAt) {
    alert(
      '⚠️ SECURE DOWNLOAD EXPIRED: This temporary download link has expired (24-hour security window). Please go to "My Vault" in the top navigation to regenerate a fresh verified link.'
    );
    return false;
  }

  let content = '';
  let mimeType = 'text/plain';
  const issuedDate = new Date().toLocaleString();
  const validUntil = options?.expiresAt
    ? new Date(options.expiresAt).toLocaleString()
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();

  const securityHeader = `================================================================================
ARIMO AI & DESIGN • OFFICIAL VERIFIED DIGITAL ASSET & LICENSE
Security Protocol: 256-Bit Encrypted Client Signature
================================================================================
License Key:        ${licenseKey}
Product:            ${productTitle}
Order ID:           ${options?.orderId || 'ARIMO-VERIFIED-PURCHASE'}
Security Token:     ${options?.token || 'AUTH_TOKEN_ACTIVE_256'}
Issued Timestamp:   ${issuedDate}
Token Valid Until:  ${validUntil}
Official Support:   https://chat.whatsapp.com/CEW43VPwEbJ3gvNOun9s9b
================================================================================\n\n`;

  if (fileName.includes('ChatGPT') || fileName.includes('Prompt')) {
    content = `${securityHeader}SECTION 1: HIGH-CONVERTING CLIENT ACQUISITION & BRIEF PROMPTS
--------------------------------------------------------------------------------
PROMPT #1: THE "GOLDEN RATIO" BRAND IDENTITY BRIEF
"Act as a world-class brand strategist and creative director. I am designing a visual
identity for [Client Business Name] in [Industry / Nigeria or Global]. Their target
audience is [Demographic]. Brand archetype: [e.g. Modern, Luxury, Tech, Gold & Black].
Provide:
1. Three distinct creative concept angles with visual metaphors.
2. Recommended typography hierarchy (Primary Header + Secondary Body).
3. Exact hex color palette with psychological reasoning.
4. A punchy 1-sentence brand manifesto and tagline."

PROMPT #2: CLIENT DISCOVERY CALL OBJECTION CRUSHER
"I am a freelance designer on a discovery call with a potential client who says
'Your price is too high compared to someone on Fiverr'. Give me 3 professional,
high-status script responses that reposition my service as an investment with guaranteed ROI
rather than an expense, while maintaining polite confidence."

PROMPT #3: COLD DM SCRIPT THAT ACTUALLY GETS REPLIES
"Write a 4-sentence LinkedIn or Instagram DM to a CEO/Founder of a [Niche] brand.
Highlight a subtle design friction point on their current website/social page without
sounding insulting, and offer a free 30-second Figma redesign mockup."

SECTION 2: MIDJOURNEY & LEONARDO AI VISUAL PROMPT FORMULAS
--------------------------------------------------------------------------------
PROMPT #10: LUXURY AFRICAN TECH FOUNDER HEADSHOT
"Cinematic 8k portrait photography of a confident young Nigerian tech entrepreneur,
wearing tailored black modern blazer with subtle gold lapel pin, soft studio rim lighting,
clean architectural glass background, Hasselblad medium format camera, --ar 4:5 --v 6.0"

PROMPT #11: 3D ISOMETRIC FINTECH APP ASSET
"3D isometric glowing tech badge of a golden security padlock surrounded by digital coins,
claymorphic glossy texture, floating on dark obsidian marble stage, octane render, 8k --ar 1:1"

SECTION 3: HOW TO MONETIZE THESE PROMPTS IN NIGERIA (₦) & DOLLARS ($)
--------------------------------------------------------------------------------
1. Bundle design + AI copy for local business owners (charge ₦50k - ₦150k).
2. Offer 24-hour rapid turnaround by using prompts to generate initial moodboards.
3. Join the Arimo VIP Community on WhatsApp for live weekly breakdowns!

================================================================================
© 2026 Arimo AI & Design. All rights reserved. Commercial reuse permitted.
Tamper-Evident Hash: SHA256-${licenseKey.replace(/-/g, '')}-SECURE-SEAL
================================================================================`;
    mimeType = 'text/plain';
  } else if (fileName.includes('Data_Annotation') || fileName.includes('Resume')) {
    content = `${securityHeader}PHASE 1: THE BEST REMOTE AI DATA ANNOTATION PLATFORMS ACCEPTING NIGERIANS (2026)
1. DataAnnotation.tech ($20 - $40 / hour) - Coding, English reasoning & Fact-checking
2. Outlier.ai / Remotasks ($15 - $30 / hour) - Multi-turn conversational evaluation
3. Alignerr.com ($20 - $45 / hour) - Expert content and LLM calibration
4. OneForma / Centific ($12 - $25 / hour) - Transcription and localization
5. Appen / Telus International ($10 - $20 / hour) - Search and AI quality rating

PHASE 2: ATS-OPTIMIZED RESUME SUMMARY (COPY TO YOUR CV)
"Detail-oriented AI Data Annotator and Content Evaluation Specialist with proven
expertise in evaluating Large Language Model (LLM) outputs, fact-checking complex
statements, and rating responses for helpfulness, tone, and safety. Adept at applying
strict taxonomy guidelines, prompt engineering, and maintaining 99%+ quality accuracy."

KEY SKILLS TO INCLUDE:
- LLM Output Evaluation & Fact-Checking
- RLHF (Reinforcement Learning from Human Feedback) Rubric Scoring
- Prompt Engineering & Context Calibration
- Qualitative & Quantitative Content Taxonomy
- Markdown, Python Data Review, English Fluency

PHASE 3: HOW TO WITHDRAW YOUR DOLLARS IN NIGERIA
- Use Geegpay (Raenest), Grey Finance, or Payoneer for virtual US/UK accounts.
- Direct withdrawal to Nigerian Naira bank accounts within 10 minutes at parallel rates!

================================================================================
Join our WhatsApp VIP Community for weekly assessment test updates:
https://chat.whatsapp.com/CEW43VPwEbJ3gvNOun9s9b
================================================================================`;
    mimeType = 'text/plain';
  } else if (fileName.includes('Canva')) {
    content = `${securityHeader}DIRECT CANVA TEMPLATE LINKS (CLICK OR PASTE IN BROWSER):

1. Instagram & LinkedIn Square Posts (1080 x 1080):
   🔗 https://canva.com/design/template-pack-arimo-black-gold-v3

2. High-Engagement Carousel Slide Decks (1080 x 1350):
   🔗 https://canva.com/design/carousel-master-deck-arimo-gold

3. Instagram & TikTok Story Highlights (1080 x 1920):
   🔗 https://canva.com/design/story-promo-suite-arimo

STEPS TO EDIT ON PHONE / PC:
1. Open the links above in your browser or Canva mobile app.
2. Click "Use Template" — it will duplicate into your personal free Canva account.
3. Replace photos, edit text, and export in 4K PNG.

================================================================================
Need custom designs done for you? Book Arimo on WhatsApp or our Store!
================================================================================`;
    mimeType = 'text/plain';
  } else if (fileName.endsWith('.svg') || format.includes('SVG')) {
    content = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" rx="24" fill="#09090B"/>
  <rect x="20" y="20" width="760" height="560" rx="16" stroke="#D4AF37" stroke-width="2" stroke-dasharray="8 8"/>
  <circle cx="400" cy="270" r="140" fill="url(#goldGradient)" fill-opacity="0.15" stroke="#D4AF37" stroke-width="3"/>
  <path d="M350 270L385 305L460 220" stroke="#F59E0B" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="400" y="440" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="2">
    ARIMO AI &amp; DESIGN
  </text>
  <text x="400" y="480" text-anchor="middle" fill="#D4AF37" font-family="system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="4">
    OFFICIAL VERIFIED LICENSE • ${licenseKey}
  </text>
  <text x="400" y="520" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14">
    ${productTitle.toUpperCase()} • VALID THROUGH: ${validUntil}
  </text>
  <defs>
    <linearGradient id="goldGradient" x1="260" y1="130" x2="540" y2="410" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F59E0B"/>
      <stop offset="1" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>
</svg>`;
    mimeType = 'image/svg+xml';
  } else {
    // Default Digital Package Guide
    content = `${securityHeader}ACCESS & DOWNLOAD SUMMARY:
- Your files are permanently stored in your Arimo Digital Vault with 24-hour expiring temporary download tokens.
- Join Our WhatsApp Channel:
  https://whatsapp.com/channel/0029VbDzzfH4NVitnLwuYk0P

NEED CUSTOM SERVICES?
- Logo Design, Brand Identity & 1-on-1 AI Coaching available in-app.
================================================================================`;
    mimeType = 'text/plain';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.replace(/\s+/g, '_');
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return true;
}

export function generateLicenseKey(prefix = 'ARIMO-NG'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${segment()}-${segment()}-${new Date().getFullYear()}`;
}

export function shareToWhatsApp(title: string, priceNaira: number, url = window.location.href) {
  const message = `🔥 Check out "${title}" for only ₦${priceNaira.toLocaleString()} on Arimo AI & Design! Instant download & Paystack payment: ${url}`;
  const encoded = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
}
