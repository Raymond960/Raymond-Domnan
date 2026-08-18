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

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "arimo-store-hub",
    },
  },
});

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
  return `ARIMZ Store Hub offers verified Canva templates, vector illustration kits, AI prompt packs, and custom design bookings. Prices start from ₦7,500 ($5). Instant downloads are available in the Client Vault. Payments via Paystack, Flutterwave, and Stripe. Support available on WhatsApp.`;
}

const ARIMZ_SYSTEM = `You are ARIMZ AI Assistant.
You help users with the ARIMZ app. 
Be friendly, helpful, and Nigerian-friendly.
Keep answers short: 2-3 sentences. 
If you don't know ARIMZ features, say "Let me connect you to a human".`;

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

    const arimzKnowledge = getArimzKnowledge();

    if (!process.env.GEMINI_API_KEY) {
      // Smart contextual fallback when API key is being provisioned
      const lower = userMsg.toLowerCase();
      let fallback = "Welcome to ARIMZ Store Hub! You can explore verified Canva and Vector templates, AI prompt bundles, and data annotation guides with instant digital downloads.";
      if (lower.includes("price") || lower.includes("cost") || lower.includes("naira") || lower.includes("dollar")) {
        fallback = "Our digital products start from ₦7,500 ($5) with support for Paystack, Flutterwave, and global Stripe payments. Instant license keys and vector files unlock immediately after checkout!";
      } else if (lower.includes("custom") || lower.includes("hire") || lower.includes("design") || lower.includes("booking")) {
        fallback = "You can book custom branding, 3D typography, and bespoke vector illustration services directly via our Custom Booking tab. We deliver within 48 to 72 hours!";
      } else if (lower.includes("vault") || lower.includes("download") || lower.includes("file")) {
        fallback = "All your purchased assets and free bonus prompt kits are permanently stored in your Client Vault for instant re-download. You can access it anytime from the top navigation bar.";
      } else if (lower.includes("human") || lower.includes("support") || lower.includes("talk") || lower.includes("whatsapp")) {
        fallback = "Let me connect you to a human. You can chat with our team directly via the WhatsApp button at the bottom right or reach out to support@arimz.com!";
      }
      return res.json({ success: true, reply: fallback });
    }

    const prompt = `Use this info about ARIMZ:\n${arimzKnowledge}\n\n${historyContext ? historyContext + "\n\n" : ""}User: ${userMsg}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: ARIMZ_SYSTEM,
      },
    });

    const reply = response.text?.trim() || "Let me connect you to a human";
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error("ARIMZ AI Assistant error:", error);
    return res.json({
      success: true,
      reply: "Let me connect you to a human"
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

    const response = await ai.models.generateContent({
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

    const response = await ai.models.generateContent({
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
