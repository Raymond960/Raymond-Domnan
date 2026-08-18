import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, MessageCircle, Mail, ExternalLink, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';
import { SecurityAlertItem } from '../types';
import { ADMIN_ALERT_EMAIL, ADMIN_ALERT_WHATSAPP, SECURITY_SENDER_EMAIL, getWhatsAppAlertUrl } from '../utils/securitySystem';

export const SecurityAlertNotification: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<SecurityAlertItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleSecurityAlert = (e: CustomEvent<SecurityAlertItem>) => {
      setCurrentAlert(e.detail);
    };

    window.addEventListener('arimo_security_alert_event' as any, handleSecurityAlert);
    return () => {
      window.removeEventListener('arimo_security_alert_event' as any, handleSecurityAlert);
    };
  }, []);

  if (!currentAlert) return null;

  const handleCopyAlert = () => {
    if (!currentAlert) return;
    navigator.clipboard.writeText(currentAlert.message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const whatsappUrl = getWhatsAppAlertUrl(currentAlert.message);

  return (
    <div className="fixed top-5 right-4 sm:right-6 z-[9999] max-w-md w-full animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950/95 border-2 border-red-500/70 shadow-[0_0_50px_rgba(239,68,68,0.35)] backdrop-blur-xl text-white">
        {/* Header with Pulse icon */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-red-400 uppercase tracking-wider">
                  INSTANT ADMIN ALERT
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-300 font-mono">
                  LIVE PING
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Automated security &amp; bot protection trigger</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentAlert(null)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Message Box */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 my-2 text-xs font-mono text-zinc-200 leading-relaxed break-words">
          {currentAlert.message}
        </div>

        {/* Dispatch Status Proof */}
        <div className="grid grid-cols-2 gap-2 my-3 text-[11px]">
          <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-zinc-300">
            <div className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase mb-0.5">
              <Mail className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Email Alert</span>
            </div>
            <div className="truncate text-[10px] text-zinc-400">
              From: <span className="text-amber-300 font-mono">{SECURITY_SENDER_EMAIL}</span>
            </div>
            <div className="truncate text-[10px] text-zinc-200 font-bold">
              To: <span className="text-white font-mono">{ADMIN_ALERT_EMAIL}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-zinc-300">
            <div className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase mb-0.5">
              <MessageCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>WhatsApp Alert</span>
            </div>
            <div className="truncate text-[10px] text-zinc-400">
              Direct: <span className="text-emerald-300 font-mono">08060581539</span>
            </div>
            <div className="truncate text-[10px] text-zinc-200 font-bold">
              Intl: <span className="text-white font-mono">+{ADMIN_ALERT_WHATSAPP}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Open WhatsApp Ping</span>
          </a>

          <button
            type="button"
            onClick={handleCopyAlert}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
            title="Copy alert text"
          >
            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
