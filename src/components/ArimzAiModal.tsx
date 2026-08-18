import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, Zap, ArrowRight, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ArimzAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'home' | 'shop' | 'giftcards' | 'blog' | 'faq' | 'vault') => void;
}

const QUICK_PROMPTS = [
  'What digital templates are available in the store?',
  'How do I access my downloads in the Vault?',
  'How do custom design bookings work?',
  'Which payment methods are supported?'
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
      text: "Hello! I'm your ARIMZ AI Assistant. How can I help you explore our templates, downloads, or custom design services today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

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
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          user: m.sender === 'user' ? m.text : undefined,
          ai: m.sender === 'ai' ? m.text : undefined
        }))
        .reduce((acc: Array<{ user: string; ai: string }>, cur) => {
          if (cur.user) {
            acc.push({ user: cur.user, ai: '' });
          } else if (cur.ai && acc.length > 0) {
            acc[acc.length - 1].ai = cur.ai;
          }
          return acc;
        }, [])
        .filter((h) => h.user && h.ai);

      const response = await fetch('/api/gemini/arimz-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, chat_history: chatHistory })
      });

      const data = await response.json();
      const aiReply = data.reply || "I'm here to help you navigate ARIMZ app features and creative templates.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching ARIMZ AI reply:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'ARIMZ Store Hub offers verified Canva templates, AI prompt packs, and custom design bookings. Let me know if you need assistance with any feature!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="arimz-chat" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div id="chat-box" className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[88vh] overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-zinc-900 shrink-0">
              <img
                src="/arimz-avatar.jpg"
                alt="ARIMZ AI Assistant"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border border-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">ARIMZ AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400">Official AI Helper for ARIMZ Store & Creative Bookings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800/60 overflow-x-auto flex gap-2 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-700/60 whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div id="messages" className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 min-h-[280px] max-h-[440px]">
          {/* Official AI Character Welcome Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-amber-400/60 shadow-lg bg-zinc-950 shrink-0">
              <img
                src="/arimz-character.jpg"
                alt="ARIMZ Official AI Character"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase mb-1">
                <Sparkles className="w-3 h-3" /> Official ARIMZ AI
              </div>
              <h4 className="text-sm font-bold text-white">Ready to help you build and scale!</h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Ask me about verified Canva/vector templates, Client Vault re-downloads, pricing in Naira and USD, or custom design bookings.
              </p>
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/80 shadow-sm shrink-0 mt-0.5 bg-zinc-900">
                    <img
                      src="/arimz-avatar.jpg"
                      alt="ARIMZ AI"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-medium rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isUser ? 'text-zinc-900/70 font-semibold' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/80 shadow-sm shrink-0 bg-zinc-900 animate-pulse">
                <img
                  src="/arimz-avatar.jpg"
                  alt="ARIMZ AI Thinking"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                <span>ARIMZ AI is typing...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center gap-2"
        >
          <input
            id="user-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white placeholder:text-zinc-500 text-xs sm:text-sm outline-none transition-all"
            disabled={isLoading}
          />

          <button
            id="send-msg-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold transition-all shadow-md cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
