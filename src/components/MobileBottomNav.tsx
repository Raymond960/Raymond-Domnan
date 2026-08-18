import React from 'react';
import { Home, ShoppingBag, BookOpen, HelpCircle, FolderHeart } from 'lucide-react';
import { NavTab } from '../types';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  vaultCount: number;
  currentLanguage?: LanguageCode;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  vaultCount,
  currentLanguage = 'en'
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const tabs = [
    { id: 'home' as NavTab, label: t.home, icon: Home },
    { id: 'shop' as NavTab, label: t.shop, icon: ShoppingBag },
    { id: 'blog' as NavTab, label: t.blog, icon: BookOpen },
    { id: 'faq' as NavTab, label: t.faq, icon: HelpCircle },
    { id: 'vault' as NavTab, label: t.vault, icon: FolderHeart, badge: vaultCount > 0 ? vaultCount : undefined }
  ];

  return (
    <div
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 w-full z-[100] bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-amber-400' : 'stroke-[1.75px]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-zinc-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-zinc-950">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-amber-400' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
