import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// In-Memory / File-backed Waitlist Database
interface WaitlistRecord {
  id: string;
  email: string;
  promo_code: string;
  discount: number;
  status: "VIP Waitlist" | "Regular Waitlist";
  created_at: string;
  name?: string;
  phone?: string;
  country?: string;
}

const waitlistDatabase: WaitlistRecord[] = [];

// Waitlist Submission Endpoint
app.post("/api/waitlist", (req, res) => {
  try {
    const email = (req.body.email || (req.body as any)["email"] || "").toString().trim();
    const promo_code = (req.body.promo_code || (req.body as any)["promo_code"] || "").toString().trim();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email address is required" });
    }

    let discount = 0;
    let status: "VIP Waitlist" | "Regular Waitlist" = "Regular Waitlist";

    // Business Logic:
    // if promo_code.upper() == "ARIMO50":
    //     discount = 50  # 50% off
    //     status = "VIP Waitlist"
    // else:
    //     discount = 0
    //     status = "Regular Waitlist"
    if (promo_code.toUpperCase() === "ARIMO50") {
      discount = 50; // 50% off
      status = "VIP Waitlist";
    } else {
      discount = 0;
      status = "Regular Waitlist";
    }

    const record: WaitlistRecord = {
      id: `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email.toLowerCase(),
      promo_code: promo_code.toUpperCase(),
      discount,
      status,
      created_at: new Date().toISOString(),
      name: req.body.name || email.split("@")[0],
      phone: req.body.phone || "",
      country: req.body.country || "Nigeria"
    };

    // DB.insert(email=email, promo_code=promo_code, discount=discount, status=status)
    waitlistDatabase.unshift(record);

    return res.json({
      success: true,
      message: status === "VIP Waitlist" ? "Successfully joined VIP Waitlist with 50% discount!" : "Successfully joined Regular Waitlist",
      email: record.email,
      promo_code: record.promo_code,
      discount: record.discount,
      status: record.status,
      data: record
    });
  } catch (error: any) {
    console.error("Waitlist submission error:", error);
    return res.status(500).json({ success: false, error: "Failed to process waitlist submission" });
  }
});

app.get("/api/waitlist", (req, res) => {
  res.json({ success: true, count: waitlistDatabase.length, records: waitlistDatabase });
});

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "arimo-store-hub",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Load ARIMZ Knowledge Base
function getArimzKnowledge(): string {
  try {
    const faqPath = path.join(process.cwd(), "arimz_faq.txt");
    if (fs.existsSync(faqPath)) {
      return fs.readFileSync(faqPath, "utf-8");
    }
  } catch (err) {
    console.warn("Could not read arimz_faq.txt, using embedded knowledge:", err);
  }
  return `ARIMZ Store Hub offers verified Canva templates, vector illustration kits, AI prompt packs, Data Annotation training guides, and custom design bookings. Prices start from ₦7,500 ($5). Instant downloads in Client Vault. Payments via Paystack, Flutterwave, Stripe, and Crypto. 24/7 WhatsApp support.`;
}

const ARIMZ_SYSTEM_PROMPT = `You are ARIMZ AI Assistant, the official, intelligent, and warm AI expert for ARIMZ Store Hub (founded by Raymond Arimo).

CORE DIRECTIVES:
1. Answer ANY question asked by the user intelligently, clearly, and contextually. Never repeat generic or canned phrases.
2. If the user asks "How do custom design bookings work?" or about custom services, explain this exact 5-step process:
   • Step 1 — Select Category: Choose your service from Custom Services (Brand Identity & Logo, 3D & Vector Typography, UI/UX Design, Social Media Kit, or Motion Graphics).
   • Step 2 — Project Brief: Submit your requirements, brand colors, style references, and deadline using the custom booking form or our AI Design Brief Generator.
   • Step 3 — Milestone Confirmation: Confirm with a 50% milestone deposit via Paystack, Flutterwave, Stripe, or Crypto.
   • Step 4 — Drafts & Revisions: Receive initial creative concepts in 48–72 hours with unlimited revisions until 100% satisfied.
   • Step 5 — Vault Delivery: Final vector and raw master files (AI, SVG, PNG, PDF, Figma, 3D renders) are delivered straight into your permanent Client Vault.
3. If the user asks about digital templates, AI prompt packs, or remote data annotation guides:
   • Describe the premium curated ChatGPT/Midjourney prompts, luxury Canva templates, and $15–$30/hr remote AI training guides starting from ₦7,500 ($5).
   • Note that instant digital downloads unlock right after payment and remain in the Client Vault forever.
4. If the user asks about payments & currency:
   • Naira (₦): Paystack & Flutterwave (Debit Card, Bank Transfer, USSD, OPay, Chipper).
   • USD ($), GBP, CAD: Stripe (Cards, Apple Pay, Google Pay) and Crypto (USDT, BTC).
   • Gift Cards: Instant digital redemption with custom codes.
5. If the user asks general questions about AI prompting, design tips, creative careers, or technology:
   • Provide expert, step-by-step guidance, actionable prompt formulas, or helpful design principles.
6. Tone: Warm, professional, helpful, modern, and encouraging. Format responses with clean bullet points and short readable paragraphs.`;

// Intelligent contextual response engine
function generateSmartArimzReply(userMsg: string): string {
  const query = userMsg.toLowerCase().trim();

  // 1. Custom Design Bookings
  if (
    query.includes("custom design") ||
    query.includes("booking") ||
    query.includes("custom service") ||
    query.includes("hire") ||
    query.includes("how do custom") ||
    query.includes("bespoke") ||
    query.includes("logo design") ||
    query.includes("order custom")
  ) {
    return `Here is how our **Custom Design Bookings** work step-by-step:

1. **Step 1 — Choose Your Service**: Head over to the **Custom Services** tab and select your project type (Logo & Brand Identity, 3D Vector Typography, Social Media Suite, UI/UX Design, or Motion Graphics).
2. **Step 2 — Submit Your Brief**: Fill out the interactive booking form or use our **AI Design Brief Generator** to specify your brand colors, style preferences, target audience, and deadline.
3. **Step 3 — 50% Milestone Deposit**: Lock in your project queue with a secure 50% milestone deposit via Paystack, Flutterwave, Stripe, or Crypto.
4. **Step 4 — Review Initial Concepts**: Receive your tailored design directions within **48 to 72 hours**. You enjoy unlimited revisions until you are 100% thrilled with the outcome.
5. **Step 5 — Instant Vault Delivery**: All final master vector files (AI, SVG, PNG, PDF, Figma, and high-res 3D assets) are permanently uploaded to your **Client Vault** for instant download.

Would you like help preparing a design brief for your project right now?`;
  }

  // 2. Payments & Gateways (Checked before pricing)
  if (
    query.includes("payment") ||
    query.includes("paystack") ||
    query.includes("flutterwave") ||
    query.includes("stripe") ||
    query.includes("opay") ||
    query.includes("bank transfer") ||
    query.includes("crypto") ||
    query.includes("usdt") ||
    query.includes("how to pay") ||
    query.includes("checkout") ||
    query.includes("gateway")
  ) {
    return `We support multiple instant, 256-bit SSL encrypted payment channels:

• **Nigeria & Africa (NGN)**: Paystack & Flutterwave (Debit Cards, Bank Transfer, USSD, OPay, Chipper Cash).
• **International (USD / GBP / CAD / EUR)**: Stripe (Visa, Mastercard, American Express, Apple Pay, Google Pay).
• **Cryptocurrency**: USDT (TRC-20 / ERC-20) and Bitcoin for decentralized global checkout.
• **ARIMZ Digital Gift Cards**: Redeem store credit directly using your 16-character code at checkout.`;
  }

  // 3. Templates & Digital Products
  if (
    query.includes("template") ||
    query.includes("canva") ||
    query.includes("product") ||
    query.includes("store") ||
    query.includes("what do you sell") ||
    query.includes("shop") ||
    query.includes("digital asset")
  ) {
    return `At **ARIMZ Store Hub**, we provide high-converting digital assets for creators, designers, and entrepreneurs:

• **Luxury Canva Templates**: Editable social media kits, luxury pitch decks, carousel bundles, and brand guidelines ready for one-click customization.
• **AI Prompt Engineering Kits**: Master prompt packs for ChatGPT, Midjourney, Claude, and Gemini to generate photorealistic imagery, luxury branding, and high-converting marketing copy.
• **Master Vector Illustration Kits**: Scalable 3D typography, abstract gradients, and modern UI icon packs in SVG, AI, and PNG formats.
• **Data Annotation Mastery Guides**: Complete blueprints for securing $15–$30/hr remote AI trainer jobs worldwide.

All purchases start from just **₦7,500 ($5)** with instant digital delivery to your permanent **Client Vault**!`;
  }

  // 4. Pricing & Currency
  if (
    query.includes("price") ||
    query.includes("pricing") ||
    query.includes("cost") ||
    query.includes("how much") ||
    query.includes("rate") ||
    query.includes("naira") ||
    query.includes("dollar") ||
    query.includes("currency")
  ) {
    return `Our pricing is transparent and multi-currency enabled:

• **Starter Digital Kits & Prompt Packs**: Starting from **₦7,500 ($5)**.
• **Pro Creator & Luxury Canva Bundles**: **₦12,500 – ₦25,000 ($8 – $15)**.
• **Remote AI Job & Data Annotation Blueprints**: **₦15,000 – ₦30,000 ($10 – $20)**.
• **Custom Design & Brand Identity Bookings**: Tailored milestones starting from **₦75,000 ($50)** with a 50% deposit structure.

You can toggle between **NGN (₦)** and **USD ($)** in the top navigation bar at any time!`;
  }

  // 6. Data Annotation & Remote Jobs
  if (
    query.includes("data annotation") ||
    query.includes("remote job") ||
    query.includes("ai trainer") ||
    query.includes("rlhf") ||
    query.includes("earn in dollar") ||
    query.includes("work from home")
  ) {
    return `Our **Data Annotation & AI Remote Job Blueprint** teaches you how to earn **$15 to $30 per hour** from Nigeria and worldwide:

• **What it covers**: High-paying AI training platforms (Outlier, Remotasks, Alignerr, DataAnnotation.tech, OneForma).
• **Assessment Mastery**: Step-by-step answers and evaluation frameworks to pass entry tests on your first attempt.
• **Payout Setup**: Guides for receiving direct USD payouts into Nigerian and African bank accounts via Geegpay, Grey, or Payoneer.

You can find the training guide in our Store section under "Data Annotation"!`;
  }

  // 7. Gift Cards
  if (query.includes("gift card") || query.includes("redeem") || query.includes("voucher")) {
    return `You can buy, gift, or redeem **ARIMZ Digital Gift Cards**:

• **Instant Delivery**: Generated immediately with custom balance amounts in Naira or Dollars.
• **Gifting**: Send personalized cards with custom recipient names and greeting messages.
• **Redemption**: Click **Gift Cards** in the menu to check your balance or apply the code directly during product checkout!`;
  }

  // 8. Human Support / WhatsApp / Contact
  if (
    query.includes("human") ||
    query.includes("support") ||
    query.includes("talk to") ||
    query.includes("whatsapp") ||
    query.includes("contact") ||
    query.includes("help") ||
    query.includes("raymond")
  ) {
    return `Need direct human assistance? Our team is available 24/7:

• **WhatsApp**: Click the floating green WhatsApp icon or chat directly at **+234-814-ARIMZ**.
• **Email Support**: support@arimz.com
• **Lead Designer**: Raymond Arimo (Direct design consultations & corporate branding).

How else can I assist you right now?`;
  }

  // 9. AI Prompts / Writing Help
  if (query.includes("prompt") || query.includes("midjourney") || query.includes("chatgpt") || query.includes("generate")) {
    return `Here is our signature **ARIMZ Prompt Framework** for generating high-end results:

\`[Role] + [Industry Archetype] + [Target Audience] + [Visual/Copy Style] + [Specific Constraints] + [Output Format]\`

*Example prompt for luxury branding*:
*"You are an elite brand strategist for a fintech company in Lagos. Create 3 distinct visual brand concepts with Obsidian Black & Brushed Gold color palettes, modern typography pairings, and a 1-sentence brand manifesto."*

You can download our complete library of 500+ curated prompts directly from the Store tab!`;
  }

  // General smart response
  return `Welcome to **ARIMZ Store Hub**! I'm your dedicated AI Assistant.

I can help you with:
• **Custom Design Bookings** (Brand Identity, 3D Typography, UI/UX, Motion Graphics).
• **Instant Downloads** (Luxury Canva templates, AI Prompt Packs, Data Annotation guides).
• **Payment & Pricing Info** (Support for Naira ₦ via Paystack/OPay, and USD $ via Stripe & Crypto).
• **Client Vault Guidance** (Accessing and re-downloading your purchased assets).

What would you like to explore today?`;
}

const handleArimzAssistant = async (req: express.Request, res: express.Response) => {
  try {
    const { message, history, chat_history } = req.body;
    const userMsg = message || req.body.user_msg;

    if (!userMsg || typeof userMsg !== "string") {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const conversationHistory = history || chat_history || [];
    let historyContext = "";
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      historyContext = "\n\nChat History:\n" + conversationHistory
        .map((item: any) => {
          if (item.user && item.ai) return `User: ${item.user}\nARIMZ AI: ${item.ai}`;
          if (item.sender && item.text) return `${item.sender === 'user' ? 'User' : 'ARIMZ AI'}: ${item.text}`;
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    const client = getGeminiClient();

    if (client) {
      try {
        const arimzKnowledge = getArimzKnowledge();
        const prompt = `ARIMZ STORE HUB KNOWLEDGE:\n${arimzKnowledge}\n\n${historyContext ? historyContext + "\n\n" : ""}User Query: ${userMsg}\n\nProvide an intelligent, helpful, and contextual answer.`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction: ARIMZ_SYSTEM_PROMPT,
          },
        });

        const reply = response.text?.trim();
        if (reply && reply.length > 0) {
          return res.json({ success: true, reply });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, using smart contextual engine:", geminiError?.message || geminiError);
      }
    }

    // Dynamic contextual fallback
    const dynamicReply = generateSmartArimzReply(userMsg);
    return res.json({ success: true, reply: dynamicReply });
  } catch (error: any) {
    console.error("ARIMZ AI Assistant error:", error);
    const userMsg = req.body.message || req.body.user_msg || "";
    return res.json({
      success: true,
      reply: generateSmartArimzReply(userMsg)
    });
  }
};

app.post("/api/gemini/arimz-assistant", handleArimzAssistant);
app.post("/ask-arimz", handleArimzAssistant);

// AI Design Brief & Concept Generator
app.post("/api/gemini/design-assistant", async (req, res) => {
  try {
    const { taskType, projectType, clientBrief, targetAudience, stylePreferences, brandColors } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Return smart structured fallback if key is not yet set
      return res.json({
        success: true,
        data: {
          enhancedBrief: `Comprehensive design strategy for ${projectType || "custom design project"} focusing on clean aesthetics, responsive hierarchy, and modern brand alignment.`,
          deliverablesList: [
            "Vector Master Files (.AI, .SVG, .EPS)",
            "High-Resolution Export Package (PNG, WebP, PDF)",
            "Brand Color Palette & Typographic Scale Guidelines",
            "Interactive Figma / Component Spec Sheet"
          ],
          suggestedPalettes: [
            { name: "Nordic Minimal", colors: ["#0F172A", "#3B82F6", "#64748B", "#F8FAFC"] },
            { name: "Warm Editorial", colors: ["#18181B", "#D97706", "#78716C", "#FAF5FF"] },
            { name: "Vibrant Neo", colors: ["#4F46E5", "#06B6D4", "#10B981", "#F3F4F6"] }
          ],
          creativeDirection: "Focus on bold typographic balance, refined negative space, and modular asset scaling for multi-platform delivery."
        }
      });
    }

    const prompt = `You are a world-class senior design director and brand strategist.
Task: Analyze and elevate the client's custom design request or product brief.
Input details:
- Project/Product Type: ${projectType || "Custom Creative Project"}
- Client's Initial Idea: ${clientBrief || "Modern creative project for digital and physical use"}
- Target Audience: ${targetAudience || "Modern creators, clients, and professionals"}
- Preferred Style / Vibe: ${stylePreferences || "Clean, high-end, contemporary"}
- Desired Colors/Theme: ${brandColors || "Professional modern palette"}
- Action Type: ${taskType || "enhance_brief"}

Return a strictly valid JSON object with the following schema:
{
  "enhancedBrief": "A polished, structured 2-3 paragraph creative brief specifying art direction, key visual hooks, and practical execution details",
  "deliverablesList": ["array of 4 to 6 specific industry-standard file formats and deliverables"],
  "suggestedPalettes": [
    { "name": "Palette Name", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"] },
    { "name": "Palette Name 2", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"] },
    { "name": "Palette Name 3", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"] }
  ],
  "creativeDirection": "Strategic art direction guidelines highlighting typography pairing, visual balance, and key motifs",
  "estimatedTimeline": "e.g. 2-4 business days with 3 revision rounds"
}`;

    const client = getGeminiClient();
    if (!client) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini design assistant error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate design assistance",
    });
  }
});

// AI Design Concept Generator for in-app customizer
app.post("/api/gemini/generate-concept", async (req, res) => {
  try {
    const { prompt: userPrompt, templateType, brandName, tagline } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          headline: brandName ? `${brandName} Studio` : "Modern Design System",
          subheadline: tagline || "Crafted for creators & forward-thinking brands",
          theme: "Obsidian & Azure Minimal",
          accentColor: "#3B82F6",
          bgColor: "#0F172A",
          textColor: "#F8FAFC",
          fontFamily: "sans-serif",
          layoutStyle: "centered-hero",
          badgeText: "VERIFIED ORIGINAL",
          decorativeElements: ["geometric-grid", "subtle-glow", "vector-badge"]
        }
      });
    }

    const aiPrompt = `Generate creative graphic layout parameters for a design template customizer.
User Prompt: ${userPrompt}
Template Type: ${templateType || "Social & Branding"}
Brand Name: ${brandName || "STUDIO"}
Tagline: ${tagline || "Digital Excellence"}

Return a strictly valid JSON object with:
{
  "headline": "Punchy 2-5 word title",
  "subheadline": "Refined tagline or description",
  "theme": "Aesthetic style title",
  "accentColor": "#HexCode for primary accent",
  "bgColor": "#HexCode for backdrop",
  "textColor": "#HexCode for contrast text",
  "fontFamily": "sans-serif or serif or mono",
  "layoutStyle": "centered-hero or split-editorial or minimalist-badge or modern-card",
  "badgeText": "1-3 word pill label e.g. PRO EDITION, VECTOR ASSET",
  "badgeColor": "#HexCode",
  "quoteOrBullet": "A short callout or testimonial line"
}`;

    const client = getGeminiClient();
    if (!client) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: aiPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini concept error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate design concept",
    });
  }
});

// CH-Hub AI Designer Endpoint: Generates Images, Copy/Scripts, and Midjourney Prompts
app.post("/api/ai-designer/generate", async (req, res) => {
  try {
    const { prompt: userPrompt, mode = "auto", style = "modern luxury" } = req.body;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const cleanPrompt = userPrompt.trim();
    const lowerPrompt = cleanPrompt.toLowerCase();

    // Determine target mode if 'auto'
    let resolvedMode: "image" | "text" | "prompt" = "text";

    if (mode === "image" || mode === "text" || mode === "prompt") {
      resolvedMode = mode;
    } else {
      // Auto-detect mode from prompt intent
      const isPromptIntent =
        lowerPrompt.includes("midjourney") ||
        lowerPrompt.includes("dall-e") ||
        lowerPrompt.includes("dalle") ||
        lowerPrompt.includes("flux") ||
        lowerPrompt.includes("prompt for") ||
        lowerPrompt.includes("generate a prompt") ||
        lowerPrompt.includes("ai prompt");

      const isImageIntent =
        lowerPrompt.includes("flyer") ||
        lowerPrompt.includes("image") ||
        lowerPrompt.includes("poster") ||
        lowerPrompt.includes("logo") ||
        lowerPrompt.includes("design a") ||
        lowerPrompt.includes("picture") ||
        lowerPrompt.includes("banner") ||
        lowerPrompt.includes("graphic") ||
        lowerPrompt.includes("status for") ||
        lowerPrompt.includes("thumbnail") ||
        lowerPrompt.includes("wallpaper");

      if (isPromptIntent) {
        resolvedMode = "prompt";
      } else if (isImageIntent) {
        resolvedMode = "image";
      } else {
        resolvedMode = "text";
      }
    }

    const client = getGeminiClient();

    // 1. IMAGE GENERATION LOGIC
    if (resolvedMode === "image") {
      let generatedImageUrl: string | null = null;
      let companionText: string = "";

      if (client) {
        try {
          // Attempt Image Generation with gemini-3.1-flash-lite-image
          const imgResponse = await client.models.generateContent({
            model: "gemini-3.1-flash-lite-image",
            contents: {
              parts: [{ text: `${cleanPrompt}, professional graphic design, high resolution, ${style}, commercial aesthetic` }]
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1"
              }
            }
          });

          for (const candidate of imgResponse.candidates || []) {
            for (const part of candidate.content?.parts || []) {
              if (part.inlineData?.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              } else if (part.text) {
                companionText += part.text + " ";
              }
            }
          }
        } catch (imgError: any) {
          console.warn("Direct image generation attempt failed, fallback to description:", imgError?.message);
        }
      }

      // If direct image model couldn't produce raw binary or key is mock, generate a rich visual design SVG card
      if (!generatedImageUrl) {
        // Generate rich companion text and SVG artwork with Gemini
        let description = `High-impact visual concept for: "${cleanPrompt}".`;
        let palette = ["#FFC107", "#09090b", "#18181b", "#ffffff"];
        let headline = cleanPrompt.slice(0, 32);

        if (client) {
          try {
            const textResponse = await client.models.generateContent({
              model: "gemini-3.7-flash",
              contents: `The user wants an image/flyer design for: "${cleanPrompt}".
Provide:
1. A punchy headline and design summary.
2. Suggested color palette (Hex codes).
3. Layout breakdown and Canva/Photoshop production instructions.
4. Midjourney prompt string they can also use.
Format with clean bullet points.`,
              config: {
                systemInstruction: "You are the Lead Creative Director of CH-Hub AI Designer. Be inspiring, precise, and practical."
              }
            });
            description = textResponse.text?.trim() || description;
          } catch (err) {
            console.warn("Companion text error:", err);
          }
        }

        return res.json({
          success: true,
          resultType: "image",
          title: `Visual Design Concept: ${cleanPrompt.slice(0, 40)}`,
          promptUsed: cleanPrompt,
          content: description,
          imageUrl: null, // Client will render visual preview canvas & download option
          suggestedPalette: palette,
          headline: headline,
          timestamp: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        resultType: "image",
        title: `Design: ${cleanPrompt.slice(0, 40)}`,
        promptUsed: cleanPrompt,
        imageUrl: generatedImageUrl,
        content: companionText || `Generated design concept for "${cleanPrompt}". Ready for high-resolution download.`,
        timestamp: new Date().toISOString()
      });
    }

    // 2. PROMPT GENERATION LOGIC (Midjourney, DALL-E, Flux)
    if (resolvedMode === "prompt") {
      let promptOutput = "";
      if (client) {
        try {
          const response = await client.models.generateContent({
            model: "gemini-3.7-flash",
            contents: `Generate 3 world-class AI Image Prompts (Midjourney v6.1, DALL-E 3, and Flux Pro) for the following user request: "${cleanPrompt}".

Format your response cleanly:
### 1. Midjourney v6.1 Master Prompt
\`[Complete prompt with lighting, camera angle, aesthetic keywords, --ar 16:9 or 1:1, --v 6.1 --style raw]\`

### 2. DALL-E 3 / ChatGPT Prompt
\`[Detailed descriptive prompt optimized for OpenAI DALL-E]\`

### 3. Flux / Photorealistic Prompt
\`[Hyper-detailed aesthetic prompt with color grading and 8k render keywords]\`

### 💡 Pro Design Tips
• Recommended aspect ratios
• Color palette suggestions
• Negative prompts (what to avoid)`,
            config: {
              systemInstruction: "You are the world's leading Prompt Engineer at CH-Hub AI Studio. Deliver exact, copy-pasteable, flawless prompts."
            }
          });
          promptOutput = response.text?.trim() || "";
        } catch (promptErr: any) {
          console.warn("Gemini prompt error:", promptErr);
        }
      }

      if (!promptOutput) {
        promptOutput = `### 1. Midjourney v6.1 Master Prompt\n\`${cleanPrompt}, cinematic lighting, photorealistic 8k octane render, luxury gold and obsidian tones, hyper-detailed, professional commercial composition --ar 1:1 --v 6.1 --style raw\`\n\n### 2. DALL-E 3 Prompt\n\`A high-end modern visual showing ${cleanPrompt} with clean studio lighting, sophisticated color contrast, and premium aesthetic minimalism.\`\n\n### 💡 Pro Tip\nUse aspect ratio \`--ar 9:16\` for TikTok/WhatsApp status or \`--ar 1:1\` for Instagram feeds.`;
      }

      return res.json({
        success: true,
        resultType: "prompt",
        title: `AI Image Prompt: ${cleanPrompt.slice(0, 40)}`,
        promptUsed: cleanPrompt,
        content: promptOutput,
        timestamp: new Date().toISOString()
      });
    }

    // 3. TEXT / AD COPY / SCRIPT GENERATION LOGIC
    let textOutput = "";
    if (client) {
      try {
        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `Create high-converting copy, marketing scripts, captions, or product descriptions for: "${cleanPrompt}".

Structure the output with:
1. **Hook & Headline Options** (3 variations)
2. **Main Ad Scripts / Body Copy** (Engaging, persuasive, benefits-focused)
3. **Engaging Social Media Captions & Hashtags** (Ready for TikTok, Instagram & WhatsApp)
4. **Call to Action (CTA)** that converts viewers into buyers.`,
          config: {
            systemInstruction: "You are CH-Hub's elite direct-response copywriter and marketing strategist. Produce viral, punchy, high-converting Nigerian and global ad content."
          }
        });
        textOutput = response.text?.trim() || "";
      } catch (err: any) {
        console.warn("Gemini text copy error:", err);
      }
    }

    if (!textOutput) {
      textOutput = `### 🔥 Viral Headlines\n1. "Upgrade Your Digital Game with ${cleanPrompt} Today!"\n2. "The #1 Secret Creators Use for ${cleanPrompt}."\n3. "Instant Access: Get Started in Under 60 Seconds."\n\n### 📱 High-Converting Ad Script\n"Stop wasting hours trying to do this from scratch. With this proven blueprint, you get instant templates, step-by-step guidance, and guaranteed results.\n\nClick the link in bio to get yours now before the 50% discount ends!"\n\n### 🚀 WhatsApp & Instagram Caption\nReady to scale? Tap the link to claim your instant download pack today! #DigitalProducts #AIContent #CreatorEconomy #ArimoStore`;
    }

    return res.json({
      success: true,
      resultType: "text",
      title: `Copy & Script: ${cleanPrompt.slice(0, 40)}`,
      promptUsed: cleanPrompt,
      content: textOutput,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("AI Designer generation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate design output",
    });
  }
});

// Express error-handling middleware to prevent unhandled crashes under high concurrency
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Internal server error caught:", err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

// Vite middleware & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        maxAge: "1d",
        immutable: false,
      })
    );
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Client Store & Design Studio server running on http://localhost:${PORT}`);
  });
}

startServer();
