import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { LANGUAGES, LanguageCode } from '../data/translations';

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
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      {/* 3. EN Pill Button */}
      <button
        id="language-selector-pill-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer select-none"
        style={{
          background: '#FFC107',
          color: '#000000',
          padding: '6px 14px',
          borderRadius: '20px',
          fontWeight: 700,
          boxShadow: isOpen ? '0 0 15px rgba(255,193,7,0.8)' : '0 2px 10px rgba(255,193,7,0.4)',
          border: 'none',
          fontSize: '13px'
        }}
        title="Select Language"
        aria-label="Select Language"
      >
        <span className="text-sm leading-none transition-transform duration-300 group-hover:scale-125">
          🌍
        </span>
        <span className="font-bold tracking-wide uppercase text-black">
          {activeLang.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-black stroke-[3] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 2. Glassmorphism Language Dropdown */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="fixed left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:absolute sm:left-0 sm:right-auto sm:top-full animate-slide-down transition-all duration-300"
          style={{
            width: '320px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
            zIndex: 99999,
            overflow: 'hidden'
          }}
        >
          {/* Header & Search */}
          <div className="p-3 border-b border-zinc-800 space-y-2 bg-black/40">
            <div className="flex items-center justify-between text-xs font-bold text-white px-1">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span>🌍</span>
                <span className="font-bold text-xs uppercase tracking-wider">Select Language</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                14 Languages
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 14 Languages..."
                className="w-full pl-8.5 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-amber-500/30 focus:border-amber-400 text-xs text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Language Options List */}
          <div
            className="max-h-[260px] overflow-y-auto p-2 space-y-1 custom-scrollbar"
            style={{ overscrollBehavior: 'contain' }}
          >
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'text-amber-300 font-bold border border-amber-400/50 shadow-sm'
                        : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white border border-transparent'
                    }`}
                    style={
                      isSelected
                        ? { background: 'rgba(255, 193, 7, 0.2)' }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg leading-none shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span className={isSelected ? 'text-amber-300 font-bold' : ''}>
                            {lang.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-normal truncate">
                            • {lang.nativeName}
                          </span>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-medium truncate">
                          {lang.region}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#FFC107] text-black flex items-center justify-center shrink-0 ml-2 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-black" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-zinc-500">
                No languages found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
