import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check, Globe } from 'lucide-react';
import { LANGUAGES, LanguageCode, LanguageOption } from '../data/translations';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  variant?: 'navbar' | 'compact' | 'footer';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${
          variant === 'navbar'
            ? 'bg-zinc-900/90 border-amber-500/30 hover:border-amber-400 text-zinc-100 hover:text-white shadow-sm'
            : variant === 'compact'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white text-xs'
            : 'bg-zinc-900 border-zinc-700 text-xs text-zinc-300'
        }`}
        title="Translate Language"
      >
        <Languages className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-xs font-bold flex items-center gap-1">
          <span>{activeLang.flag}</span>
          <span className="hidden sm:inline">{activeLang.name}</span>
          <span className="sm:hidden">{activeLang.code.toUpperCase()}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-zinc-950 border border-amber-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-3 py-2 border-b border-zinc-800/80 mb-2">
            <div className="flex items-center justify-between text-xs font-black text-white">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Globe className="w-4 h-4" />
                <span>SELECT LANGUAGE</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">14 Languages</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Includes Hausa, Igbo, Yoruba &amp; Global translations
            </p>

            {/* Featured Languages Quick Bar */}
            <div className="flex items-center gap-1.5 pt-2 pb-1 overflow-x-auto">
              {[
                { code: 'en', label: 'English', flag: '🌐' },
                { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
                { code: 'fr', label: 'French', flag: '🇫🇷' },
                { code: 'ar', label: 'Arabic', flag: '🇦🇪' }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(item.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
                    currentLanguage === item.code
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 14 languages..."
              className="mt-2 w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Language Options List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-400'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">
                          ({lang.nativeName})
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-500">{lang.region}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
