import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../utils/currencyUtils';

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = CURRENCY_CONFIGS[currentCurrency] || CURRENCY_CONFIGS.USD;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id="currency-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:text-white hover:border-amber-500/50 transition-all cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs font-bold'
        }`}
        title="Change store currency"
      >
        <span className="text-sm leading-none">{currentConfig.flag}</span>
        <span className="font-extrabold tracking-tight text-amber-400">
          {currentConfig.code} ({currentConfig.symbol})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-black text-zinc-500 tracking-wider">
            Select Currency
          </div>
          {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((code) => {
            const config = CURRENCY_CONFIGS[code];
            const isSelected = currentCurrency === code;
            return (
              <button
                key={code}
                type="button"
                id={`currency-opt-${code}`}
                onClick={() => {
                  onCurrencyChange(code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{config.flag}</span>
                  <div className="text-left">
                    <span className="block font-black">{config.code} ({config.symbol})</span>
                    <span className="block text-[10px] text-zinc-400 font-medium">{config.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
