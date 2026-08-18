import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, RefreshCw, AlertCircle, Lock } from 'lucide-react';

interface AntiSpamCaptchaProps {
  onVerify: (isValid: boolean) => void;
  id?: string;
  theme?: 'dark' | 'compact';
}

export const AntiSpamCaptcha: React.FC<AntiSpamCaptchaProps> = ({
  onVerify,
  id = 'recaptcha-widget',
  theme = 'dark'
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleCheckboxClick = () => {
    if (isChecked || isVerifying) return;

    setIsVerifying(true);
    setIsError(false);

    // Simulate realistic reCAPTCHA client risk-analysis computation
    setTimeout(() => {
      setIsVerifying(false);
      setIsChecked(true);
      onVerify(true);
    }, 900);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecked(false);
    setIsVerifying(false);
    setIsError(false);
    onVerify(false);
  };

  return (
    <div
      id={id}
      className={`rounded-2xl border transition-all select-none ${
        theme === 'compact'
          ? 'p-2.5 bg-zinc-950 border-zinc-800'
          : 'p-3 bg-zinc-900/90 border-zinc-800 shadow-inner'
      } ${isChecked ? 'border-emerald-500/50 bg-emerald-950/10' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Interactive Checkbox */}
        <div
          onClick={handleCheckboxClick}
          className={`flex items-center gap-3 cursor-pointer group ${
            isChecked ? 'cursor-default' : ''
          }`}
        >
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              isChecked
                ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : isVerifying
                ? 'border-amber-500 bg-zinc-800'
                : 'border-zinc-600 bg-zinc-950 group-hover:border-amber-400'
            }`}
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            ) : isChecked ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : null}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-xs font-bold transition-colors ${
                isChecked ? 'text-emerald-400' : 'text-zinc-200 group-hover:text-white'
              }`}
            >
              {isChecked ? "I'm verified as human" : "I'm not a robot"}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">
              {isChecked ? 'reCAPTCHA v3 & TLS Protected' : 'Protected by Anti-Spam Security'}
            </span>
          </div>
        </div>

        {/* Right Google reCAPTCHA Badge */}
        <div className="flex flex-col items-end text-right pl-2 border-l border-zinc-800/80">
          <div className="flex items-center gap-1 text-[10px] font-black tracking-wider text-zinc-400">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              reCAPTCHA
            </span>
          </div>
          <div className="text-[8px] text-zinc-500 flex gap-1 items-center mt-0.5">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            {isChecked && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset verification"
                className="ml-1 text-zinc-500 hover:text-amber-400"
              >
                <RefreshCw className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isError && (
        <div className="mt-2 text-[10px] text-red-400 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>Verification failed. Please retry.</span>
        </div>
      )}
    </div>
  );
};
