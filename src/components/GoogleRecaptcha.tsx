import React, { useState } from 'react';

interface GoogleRecaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified?: boolean;
  theme?: 'light' | 'dark';
}

export const GoogleRecaptcha: React.FC<GoogleRecaptchaProps> = ({
  onVerify,
  isVerified = false,
  theme = 'light'
}) => {
  const [checked, setChecked] = useState(isVerified);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (checked || loading) return;
    setLoading(true);

    // Realistic Google risk-analysis verification delay
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
      onVerify(true);
    }, 900);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full max-w-[320px] mx-auto rounded-md border p-3 flex items-center justify-between transition-all select-none shadow-sm ${
        isDark
          ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
          : 'bg-[#f9f9f9] border-[#d3d3d3] text-[#222222]'
      }`}
    >
      {/* Left Checkbox Section */}
      <div
        onClick={handleClick}
        className="flex items-center gap-3 cursor-pointer py-1"
        role="button"
        tabIndex={0}
        aria-label="Google reCAPTCHA checkbox"
      >
        <div
          className={`w-7 h-7 rounded-[3px] border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-transparent border-transparent'
              : loading
              ? 'border-[#4285F4] bg-white'
              : isDark
              ? 'border-zinc-500 bg-zinc-950 hover:border-amber-400'
              : 'border-[#c1c1c1] bg-white hover:border-[#999]'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#4285F4] border-t-transparent animate-spin" />
          ) : checked ? (
            <svg
              className="w-7 h-7 text-[#0F9D58] animate-in zoom-in-75 duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </div>

        <span
          className={`text-[13px] font-medium tracking-tight ${
            checked
              ? 'text-emerald-700 font-semibold'
              : isDark
              ? 'text-zinc-200'
              : 'text-[#282828]'
          }`}
        >
          {checked ? "I'm verified as human" : "I'm not a robot"}
        </span>
      </div>

      {/* Right Google reCAPTCHA Badge */}
      <div className="flex flex-col items-center justify-center pl-2 border-l border-zinc-200/50">
        <svg className="w-8 h-8" viewBox="0 0 32 32">
          {/* Authentic Google reCAPTCHA 3-part circular arrow logo */}
          <path
            d="M16 2.5C21.5 2.5 26.2 5.8 28.3 10.6L24.1 12.4C22.6 8.8 19.5 6.5 16 6.5C11.3 6.5 7.4 9.9 6.4 14.4H10.5L4.5 20.4L-1.5 14.4H2.4C3.4 7.7 9.1 2.5 16 2.5Z"
            fill="#1A73E8"
            transform="scale(0.8) translate(3, 3)"
          />
          <path
            d="M29.6 17.6C28.6 24.3 22.9 29.5 16 29.5C10.5 29.5 5.8 26.2 3.7 21.4L7.9 19.6C9.4 23.2 12.5 25.5 16 25.5C20.7 25.5 24.6 22.1 25.6 17.6H21.5L27.5 11.6L33.5 17.6H29.6Z"
            fill="#4285F4"
            transform="scale(0.8) translate(3, 3)"
          />
          <path
            d="M16 9.5C19.6 9.5 22.5 12.4 22.5 16C22.5 19.6 19.6 22.5 16 22.5C12.4 22.5 9.5 19.6 9.5 16C9.5 12.4 12.4 9.5 16 9.5Z"
            fill="#34A853"
            transform="scale(0.8) translate(3, 3)"
          />
        </svg>
        <span className="text-[9px] font-bold text-[#555555] tracking-tighter leading-tight mt-0.5">
          reCAPTCHA
        </span>
        <div className="flex items-center gap-1 text-[7.5px] text-[#777777] font-normal leading-tight">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span>-</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
};
