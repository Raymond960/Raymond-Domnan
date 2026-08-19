import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowLeft, RotateCcw, Copy, Check, MessageSquare, ExternalLink, Bot, User, PhoneCall, ShieldCheck } from 'lucide-react';
import { AiAssistantLogo } from './AiAssistantLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ArimzAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'home' | 'shop' | 'giftcards' | 'blog' | 'faq' | 'vault' | 'services') => void;
}

const QUICK_PROMPTS = [
  'How do custom design bookings work?',
  'What digital templates and prompt packs are available?',
  'How do I access my downloads in the Vault?',
  'Which payment methods are supported in Naira & USD?',
  'How can I earn with Data Annotation AI jobs?',
  'How do I buy and redeem Gift Cards?'
];

export const ArimzAiModal: React.FC<ArimzAiModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your official **ARIMZ AI Assistant**.\n\nI can help you explore premium Canva templates, AI prompt packs, Data Annotation training guides, or walk you through our **step-by-step custom design bookings**.\n\nHow can I help you today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input on open for desktop
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isOpen]);

  // Handle escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleBackToHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackToHome = () => {
    if (onNavigateToTab) {
      onNavigateToTab('home');
    }
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Chat cleared! How can I assist you with ARIMZ products, templates, or custom design services today?",
        timestamp: 'Just now'
      }
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => !m.id.startsWith('welcome'))
        .slice(-8)
        .map((m) => ({
          sender: m.sender,
          text: m.text
        }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s safety timeout

      const response = await fetch('/api/gemini/arimz-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, chat_history: chatHistory }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.reply || "I'm here to assist you with ARIMZ templates, downloads, and custom services!";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching ARIMZ AI reply:', err);
      
      // Smart instant client-side resolution if backend route is unreachable
      let clientFallback = "I'm here to help! At **ARIMZ Store Hub**, you can purchase verified Canva templates, AI prompt packs, Data Annotation training guides, or book bespoke custom design milestones.";
      const lower = textToSend.toLowerCase();
      if (lower.includes("custom") || lower.includes("booking") || lower.includes("hire") || lower.includes("design")) {
        clientFallback = `Here is how our **Custom Design Bookings** work step-by-step:

1. **Step 1 — Choose Your Service**: Select your project type under **Custom Services** (Logo & Brand Identity, 3D Vector Typography, Social Media Suite, or UI/UX).
2. **Step 2 — Submit Your Brief**: Fill out the interactive booking form or generate a brief with our **AI Design Brief Generator** detailing your colors, style, and deadline.
3. **Step 3 — 50% Milestone Deposit**: Secure your milestone with Paystack, Flutterwave, Stripe, or Crypto.
4. **Step 4 — Initial Concepts**: Receive your custom design directions in **48 to 72 hours** with unlimited revisions.
5. **Step 5 — Instant Vault Delivery**: Master vector files (AI, SVG, PNG, PDF, Figma) are uploaded directly to your **Client Vault**!`;
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("naira") || lower.includes("dollar")) {
        clientFallback = "Our digital products start from **₦7,500 ($5)** with instant digital delivery to your permanent Client Vault. Custom design milestones start from **₦75,000 ($50)**.";
      } else if (lower.includes("vault") || lower.includes("download")) {
        clientFallback = "Your **Client Vault** stores all purchased items and bonus packs permanently. You can re-download your high-res vector files anytime with commercial licenses included.";
      }

      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: clientFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format basic markdown (bold, bullet points, numbers)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      // Bold rendering
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} className="font-bold text-amber-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={lineIdx} className="block leading-relaxed min-h-[1.25rem]">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div
      id="arimz-chat-fullscreen"
      className="fixed inset-0 z-50 w-full h-full min-h-[100dvh] flex flex-col bg-black text-white antialiased overflow-hidden"
    >
      {/* 1. TOP NAVIGATION & BRANDING HEADER (100% WIDTH) */}
      <header className="w-full bg-zinc-950 border-b border-zinc-800/90 px-4 sm:px-6 md:px-10 py-3.5 flex items-center justify-between shrink-0 shadow-lg z-20">
        {/* Back to Home Button */}
        <button
          id="ai-back-to-home-btn"
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-700/80 transition-all cursor-pointer group shadow-sm shrink-0"
          title="Return to ARIMZ Store Home"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">Back to Home</span>
        </button>

        {/* Center: Official ARIMZ AI Assistant Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <AiAssistantLogo size={40} showPulse={true} />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                ARIMZ AI Assistant
                <ShieldCheck className="w-4 h-4 text-amber-400 inline" />
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-md">
              Official AI Helper for Store Assets, Vault &amp; Custom Design Bookings
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleClearChat}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <a
            href="https://chat.whatsapp.com/CEW43VPwEbJ3gvNOun9s9b"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Chat with Human on WhatsApp"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 2. QUICK PROMPTS CHIPS BAR */}
      <div className="w-full bg-zinc-950/90 border-b border-zinc-900 px-4 sm:px-6 md:px-10 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 shrink-0 mr-1">
          <Sparkles className="w-3 h-3" /> Quick Topics:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 border border-zinc-800 whitespace-nowrap transition-all cursor-pointer shrink-0 disabled:opacity-50 active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* 3. FULL PAGE CHAT MESSAGE STREAM (100% HEIGHT FLEX-1) */}
      <main
        className="flex-1 w-full overflow-y-auto px-4 sm:px-6 md:px-12 lg:px-24 py-6 space-y-6 max-w-5xl mx-auto"
        style={{ paddingBottom: '160px' }}
      >
        {/* Welcome Character Hero Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-zinc-950 shrink-0">
            <img
              src="/arimz-character.jpg"
              alt="ARIMZ Official AI Character"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase">
              <Sparkles className="w-3 h-3" /> 24/7 Intelligent Support
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Ask anything about ARIMZ Store, Templates &amp; Custom Design Bookings
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
              Ask about verified Canva templates, ChatGPT/Midjourney prompts, instant Client Vault downloads, or request step-by-step guidance on booking custom design projects.
            </p>
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'} group`}
            >
              {/* AI Avatar */}
              {!isUser && (
                <AiAssistantLogo size={40} className="mt-0.5" />
              )}

              {/* Message Bubble */}
              <div
                className={`relative max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 font-medium rounded-tr-sm shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-900/95 border border-zinc-800 text-zinc-100 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="space-y-1 text-inherit">
                  {renderFormattedText(msg.text)}
                </div>

                <div className="flex items-center justify-between gap-4 mt-2.5 pt-2 border-t border-white/10 text-[10px]">
                  <span className={isUser ? 'text-zinc-950/70 font-semibold' : 'text-zinc-500'}>
                    {msg.timestamp}
                  </span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-zinc-850 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-md">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator with Bouncing Gold Dots */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start items-center animate-fadeIn">
            <AiAssistantLogo size={40} className="animate-pulse" />
            <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl rounded-tl-sm px-5 py-3.5 text-xs text-zinc-300 flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <span className="font-semibold text-amber-400">ARIMZ AI is typing...</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 4. CHAT INPUT BAR LIFTED ABOVE BOTTOM NAVIGATION */}
      <footer
        id="arimz-ai-chat-input-bar"
        className="fixed transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        style={{
          position: 'fixed',
          bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
          left: '16px',
          right: '16px',
          height: '52px',
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 193, 7, 0.4)',
          borderRadius: '25px',
          padding: '0 8px 0 16px',
          zIndex: 9997,
          maxWidth: '820px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="w-full flex items-center gap-2"
        >
          {/* Input field inside */}
          <input
            ref={inputRef}
            id="arimz-ai-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask ARIMZ AI anything..."
            className="flex-1 bg-transparent text-white placeholder:text-zinc-400 text-xs sm:text-sm border-none outline-none ring-0 focus:ring-0 focus:outline-none"
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              outline: 'none',
              width: '100%',
              boxShadow: 'none'
            }}
            disabled={isLoading}
          />

          {/* Yellow circle send button with paper plane icon */}
          <button
            id="arimz-ai-send-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              minHeight: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFC107',
              color: '#000000',
              border: 'none',
              boxShadow: '0 2px 10px rgba(255, 193, 7, 0.4)'
            }}
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-black stroke-[2.5]" style={{ color: '#000000' }} />
          </button>
        </form>
      </footer>
    </div>
  );
};
