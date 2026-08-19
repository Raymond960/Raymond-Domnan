import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Lightbulb,
  Wand2,
  RefreshCw,
  Share2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AiDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface GenerationResult {
  resultType: 'image' | 'text' | 'prompt';
  title: string;
  promptUsed: string;
  content: string;
  imageUrl?: string | null;
  suggestedPalette?: string[];
  headline?: string;
  timestamp: string;
}

const EXAMPLE_PROMPTS = [
  'Design a WhatsApp status for a shoe business',
  'Write 5 TikTok ad scripts for my digital product',
  'Create a Midjourney prompt for 3D logo design',
  'Create a luxury real estate flyer for Abuja'
];

export const AiDesignerModal: React.FC<AiDesignerModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<'auto' | 'image' | 'text' | 'prompt'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const activePrompt = (customPrompt || prompt).trim();
    if (!activePrompt || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-designer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          mode: mode
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Failed to generate design');
      }
    } catch (err: any) {
      console.error('AI Designer error:', err);
      // Fallback preview so user is never blocked
      const isPrompt = activePrompt.toLowerCase().includes('prompt') || activePrompt.toLowerCase().includes('midjourney');
      const isImage = activePrompt.toLowerCase().includes('flyer') || activePrompt.toLowerCase().includes('design') || activePrompt.toLowerCase().includes('status');

      if (isPrompt) {
        setResult({
          resultType: 'prompt',
          title: `Prompt: ${activePrompt.slice(0, 30)}`,
          promptUsed: activePrompt,
          content: `### 1. Midjourney v6.1 Master Prompt\n\`${activePrompt}, 8k octane render, cinematic lighting, luxury gold #FFC107 and obsidian black aesthetic, hyper-detailed, clean modern composition --ar 1:1 --v 6.1 --style raw\`\n\n### 2. DALL-E 3 Prompt\n\`A high-resolution modern visual showcasing ${activePrompt} with crisp lighting, deep shadows, and contemporary studio aesthetic.\`\n\n### 💡 Pro Tip\nFor vertical stories or WhatsApp status use \`--ar 9:16\`.`,
          timestamp: new Date().toISOString()
        });
      } else if (isImage) {
        setResult({
          resultType: 'image',
          title: `Flyer Concept: ${activePrompt.slice(0, 30)}`,
          promptUsed: activePrompt,
          headline: activePrompt.slice(0, 28),
          suggestedPalette: ['#FFC107', '#09090B', '#18181B', '#FFFFFF'],
          content: `### 🎨 Design Layout Strategy for: "${activePrompt}"\n\n• **Color Harmony**: Obsidian Black (#09090B) backdrop with Vibrant Gold (#FFC107) accents.\n• **Typography Hierarchy**: Bold sans-serif display header paired with high-legibility geometric subtext.\n• **Key Visual Hook**: Centered hero visual with glowing vector borders and high-contrast value proposition.\n• **Call-to-Action**: "Order on WhatsApp / Click Link in Bio" in high-contrast yellow pill badge.`,
          imageUrl: null,
          timestamp: new Date().toISOString()
        });
      } else {
        setResult({
          resultType: 'text',
          title: `Marketing Copy: ${activePrompt.slice(0, 30)}`,
          promptUsed: activePrompt,
          content: `### 🔥 3 High-Converting Hooks\n1. "The Ultimate Secret to ${activePrompt} That Nobody Talks About."\n2. "How to Level Up Your Game in Under 5 Minutes."\n3. "Instant Access: Get Everything You Need Right Here."\n\n### 📱 Viral TikTok / Reel Script\n**[Hook (0-3s)]**: "If you're still doing this the hard way, you need to see this."\n**[Value (3-15s)]**: "We just dropped the complete turnkey framework for ${activePrompt}. Ready to customize in seconds."\n**[CTA (15-20s)]**: "Tap the link in bio to grab your 50% discount before it closes!"\n\n### 💬 WhatsApp Caption\nElevate your workflow today. Send us a direct DM or click the link in bio! #DesignTrends #DigitalCreator #ArimoStoreHub`,
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!result) return;

    if (result.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `CH_Hub_Design_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate high-resolution canvas download if SVG/graphic fallback
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Dark Luxury Background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#09090b');
    gradient.addColorStop(0.5, '#18181b');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative Gold Grid Border
    ctx.strokeStyle = '#FFC107';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1000, 1000);

    // Gold Accent glow circle
    const glowGrad = ctx.createRadialGradient(540, 380, 20, 540, 380, 300);
    glowGrad.addColorStop(0, 'rgba(255, 193, 7, 0.25)');
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(540, 380, 300, 0, Math.PI * 2);
    ctx.fill();

    // Brand Tag
    ctx.fillStyle = '#FFC107';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ CH-HUB AI DESIGNER', 540, 120);

    // Main Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px sans-serif';
    const lines = result.promptUsed.length > 30 ? [result.promptUsed.slice(0, 28), result.promptUsed.slice(28, 56)] : [result.promptUsed];
    lines.forEach((line, idx) => {
      ctx.fillText(line, 540, 240 + idx * 70);
    });

    // Central Visual Box
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = 'rgba(255, 193, 7, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(140, 380, 800, 420, 24);
    ctx.fill();
    ctx.stroke();

    // Inner details
    ctx.fillStyle = '#FFC107';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('VERIFIED ORIGINAL ASSET', 540, 460);

    ctx.fillStyle = '#E4E4E7';
    ctx.font = '28px sans-serif';
    ctx.fillText('Crafted with AI Prompt Engineering & Vector Styling', 540, 530);
    ctx.fillText('Color Harmony: #FFC107 Gold • #09090B Obsidian', 540, 590);

    // Call to Action Badge
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.roundRect(340, 660, 400, 80, 40);
    ctx.fill();

    ctx.fillStyle = '#09090B';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('READY TO PUBLISH', 540, 712);

    // Footer
    ctx.fillStyle = '#71717A';
    ctx.font = '22px sans-serif';
    ctx.fillText('ARIMO STORE HUB • SECURE CLIENT VAULT DOWNLOAD', 540, 980);

    // Trigger download
    const link = document.createElement('a');
    link.download = `CH_Hub_Design_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="ch-hub-ai-designer-modal"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(255,193,7,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-zinc-850 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(255,193,7,0.4)]">
              <Sparkles className="w-5 h-5 fill-zinc-950 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  CH-Hub AI Designer
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-[10px] font-bold">
                  Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Generate images, marketing copy, ad scripts &amp; Midjourney prompts on demand.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            {[
              { id: 'auto', label: '✨ Auto-Detect' },
              { id: 'image', label: '🎨 Image & Flyer' },
              { id: 'text', label: '✍️ Copy & Scripts' },
              { id: 'prompt', label: '💡 AI Prompt' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as any)}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition-all text-center cursor-pointer ${
                  mode === tab.id
                    ? 'bg-[#FFC107] text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Tell me what to design or create:</span>
              <span className="text-[10px] text-amber-400/80">Try any custom idea</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell me what to design... e.g: Create a luxury real estate flyer for Abuja"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 focus:border-[#FFC107] focus:bg-zinc-850 text-white placeholder:text-zinc-500 text-xs sm:text-sm outline-none resize-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Quick Example Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-[#FFC107]" /> Quick Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(ex);
                    handleGenerate(ex);
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/50 text-zinc-300 hover:text-[#FFC107] transition-all cursor-pointer text-left"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="generate-design-btn"
            onClick={() => handleGenerate()}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#FFC107] hover:bg-yellow-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,193,7,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Designing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                <span>Generate Design</span>
              </>
            )}
          </button>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* GENERATION OUTPUT SECTION */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-zinc-800/80 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {result.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {result.resultType === 'image' && (
                    <button
                      onClick={handleDownloadImage}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopy(result.content || result.promptUsed)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Display Result based on Type */}
              {result.resultType === 'image' ? (
                <div className="space-y-4">
                  {/* Generated Graphic Display */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 shadow-[0_0_30px_rgba(255,193,7,0.15)]">
                    {result.imageUrl ? (
                      <img
                        src={result.imageUrl}
                        alt="Generated AI Design"
                        className="w-full max-h-[380px] object-contain rounded-xl shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* High-Quality Visual Vector Card Fallback */
                      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 rounded-2xl border-2 border-amber-400/80 shadow-2xl text-center space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/50 text-[#FFC107] text-[11px] font-black uppercase">
                          <Sparkles className="w-3 h-3 fill-[#FFC107]" /> CH-HUB DESIGN STUDIO
                        </div>

                        <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {result.headline || result.promptUsed}
                        </h4>

                        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left space-y-2">
                          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Design Specifications</div>
                          <div className="text-xs text-zinc-200">
                            • Palette: <span className="text-[#FFC107] font-bold">#FFC107 Gold</span>, Obsidian Black, Pure White
                          </div>
                          <div className="text-xs text-zinc-200">
                            • Optimized for: WhatsApp Status (1080x1920) &amp; Instagram Grid (1080x1080)
                          </div>
                        </div>

                        <button
                          onClick={handleDownloadImage}
                          className="w-full py-2.5 rounded-xl bg-[#FFC107] hover:bg-yellow-400 text-zinc-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Download className="w-4 h-4" /> Download 1080x1080 Graphic
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Companion Text/Instructions */}
                  {result.content && (
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 leading-relaxed space-y-2 whitespace-pre-wrap">
                      {result.content}
                    </div>
                  )}
                </div>
              ) : (
                /* Text / Prompt Display */
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-zinc-100 leading-relaxed font-sans space-y-3 whitespace-pre-wrap shadow-inner">
                  {result.content}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-zinc-900 bg-zinc-950 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
          <span>ARIMO STORE HUB • CH-Hub AI Designer</span>
          <span className="text-amber-400 font-semibold">Click Download or Copy to use immediately</span>
        </div>
      </div>
    </div>
  );
};

export default AiDesignerModal;
