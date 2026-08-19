import React, { useState } from 'react';
import {
  ShoppingBag,
  FolderHeart,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Gift,
  Zap,
  Users,
  ShieldAlert,
  Globe,
  User,
  LogOut,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { CurrencyCode, NavTab } from '../types';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { AiAssistantLogo } from './AiAssistantLogo';
import { BrandLogo } from './BrandLogo';
import { LanguageCode, TRANSLATIONS } from '../data/translations';
import { formatCurrency } from '../utils/currencyUtils';
import { UserProfile } from './AuthModal';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'register' | 'login') => void;
  onLogout: () => void;
  cartCount: number;
  cartTotalNaira: number;
  cartTotalUsd: number;
  onOpenCart: () => void;
  onOpenVault: () => void;
  onOpenLeadMagnet: () => void;
  onOpenAdmin: () => void;
  onOpenAiAssistant?: () => void;
  vaultDownloadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currency,
  onCurrencyChange,
  currentLanguage,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  cartCount,
  cartTotalNaira,
  cartTotalUsd,
  onOpenCart,
  onOpenVault,
  onOpenLeadMagnet,
  onOpenAdmin,
  onOpenAiAssistant,
  vaultDownloadsCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: t.home },
    { id: 'shop', label: `${t.shop} (${currency === 'NGN' ? '₦7,500+' : '$5+'})` },
    { id: 'giftcards', label: '🎁 Gift Cards' },
    { id: 'blog', label: t.blog },
    { id: 'faq', label: t.faq },
    { id: 'vault', label: t.vault }
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 transition-all shadow-md">
      {/* Top Global Creator Broadcast Ribbon */}
      <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-zinc-950 px-3 py-1.5 text-center font-black tracking-wide flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-xs">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950"></span>
        </span>
        <span className="announcement-text uppercase">
          🔥 ARIMO STORE HUB • JOIN VIP WAITLIST FOR 50% OFF (CODE: ARIMO50)
        </span>
        <button
          onClick={onOpenLeadMagnet}
          className="announcement-text underline decoration-zinc-950 hover:opacity-80 font-black cursor-pointer ml-1 inline-block"
        >
          [Claim 50% Off &amp; Free Prompts]
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] md:min-h-[4.75rem] py-2 gap-2 sm:gap-4">
          {/* Brand Logo & Top-Left AI + Language Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Brand Logo */}
            <div
              onClick={() => onSelectTab('home')}
              className="flex items-center cursor-pointer group select-none shrink-0"
            >
              <BrandLogo
                size={42}
                showText={true}
                showSubtitle={true}
                rounded="rounded-2xl"
              />
            </div>

            {/* AI ICON BUTTON */}
            <button
              id="top-left-ai-btn"
              className="ai-glow-btn"
              onClick={onOpenAiAssistant}
              title="Open CH-Hub AI Designer"
              aria-label="Open AI Assistant"
            >
              <Sparkles size={22} className="text-zinc-950 fill-zinc-950" />
            </button>

            {/* Premium Glassmorphic Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              variant="navbar"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/80">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Global Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Currency Selector */}
            <CurrencySelector currentCurrency={currency} onCurrencyChange={onCurrencyChange} />

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative group">
                <button
                  onClick={() => onSelectTab('vault')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-amber-500/30 text-xs font-bold cursor-pointer transition-all"
                  title="My Account"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px] flex items-center justify-center">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-amber-300 truncate max-w-[80px]">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </button>
              </div>
            ) : (
              <button
                id="header-auth-btn"
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
                title="Create Account or Sign In"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.signIn}</span>
              </button>
            )}

            {/* My Vault Trigger */}
            <button
              id="header-vault-btn"
              onClick={onOpenVault}
              className="relative p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
              title="My Digital Vault & Orders"
            >
              <FolderHeart className="w-4 h-4 text-amber-400" />
              {vaultDownloadsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {vaultDownloadsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-black text-amber-400">
                {formatCurrency(cartTotalUsd, currency, cartTotalNaira)}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
              title="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-zinc-800/80 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all ${
                    currentTab === item.id
                      ? 'bg-amber-500 text-zinc-950 font-black'
                      : 'bg-zinc-900/80 text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {currentUser ? (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{currentUser.fullName}</div>
                    <div className="text-[10px] text-zinc-400">{currentUser.email} • {currentUser.country}</div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Create Account / Sign In (2 Steps)</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenAiAssistant?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center justify-center gap-2.5 shadow-sm"
              >
                <AiAssistantLogo size={24} showPulse={true} pulseSize="sm" />
                <span>Ask ARIMZ AI Assistant</span>
              </button>

              <button
                onClick={() => {
                  onOpenLeadMagnet();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Join VIP Waitlist (50% OFF)</span>
              </button>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Creator Admin Portal</span>
              </button>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
                </svg>
                <span>Join Our WhatsApp Channel</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
