import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Briefcase,
  Lightbulb,
  ArrowRight,
  MessageCircle,
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Gift,
  Zap,
  ShieldCheck,
  Globe,
  Search,
  Filter,
  Layers,
  Heart,
  ShieldAlert,
  HelpCircle,
  Crown
} from 'lucide-react';
import {
  NavTab,
  ProductItem,
  CartItem,
  ClientPurchase,
  ServiceBooking,
  LeadMagnetSubscriber,
  ProductFilterCategory,
  CurrencyCode
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_PURCHASES,
  INITIAL_SERVICE_BOOKINGS,
  WHATSAPP_COMMUNITY_URL,
  WHATSAPP_DIRECT_NUMBER
} from './data/mockData';
import { detectUserCurrency, formatCurrency } from './utils/currencyUtils';
import { LanguageCode, TRANSLATIONS } from './data/translations';

// Components
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StickyWhatsApp } from './components/StickyWhatsApp';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { PaymentModal } from './components/PaymentModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ClientVaultModal } from './components/ClientVaultModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiTipOfTheDay } from './components/AiTipOfTheDay';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { SplashScreen } from './components/SplashScreen';
import { BlogSection } from './components/BlogSection';
import { FaqSection } from './components/FaqSection';
import { VipOfferBanner } from './components/VipOfferBanner';
import { AuthModal, UserProfile } from './components/AuthModal';
import { FindUsSection } from './components/FindUsSection';
import { CreatorTipsBanner } from './components/CreatorTipsBanner';
import { GiftCardStorePage } from './components/GiftCardStorePage';
import { BuyGiftCardModal } from './components/BuyGiftCardModal';
import { SecurityAlertNotification } from './components/SecurityAlertNotification';
import { ArimzAiModal } from './components/ArimzAiModal';
import { AiDesignerModal } from './components/AiDesignerModal';
import { BrandLogo } from './components/BrandLogo';
import { GiftCardItem } from './types';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isBuyGiftCardOpen, setIsBuyGiftCardOpen] = useState(false);

  // Language State with persistence
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('arimo_language');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return 'en';
  });

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('arimo_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');

  // Currency State with auto-detection fallback
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('arimo_currency');
      if (saved && (saved === 'NGN' || saved === 'USD' || saved === 'GBP' || saved === 'CAD')) {
        return saved as CurrencyCode;
      }
    } catch {
      // ignore
    }
    return detectUserCurrency();
  });

  // Products state (admin editable)
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('arimo_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('arimo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Client Purchases with localStorage persistence
  const [purchases, setPurchases] = useState<ClientPurchase[]>(() => {
    try {
      const saved = localStorage.getItem('arimo_purchases');
      return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  // Service Bookings with localStorage persistence
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(() => {
    try {
      const saved = localStorage.getItem('arimo_service_bookings');
      return saved ? JSON.parse(saved) : INITIAL_SERVICE_BOOKINGS;
    } catch {
      return INITIAL_SERVICE_BOOKINGS;
    }
  });

  // Lead Magnet Subscribers (Email & WhatsApp leads)
  const [subscribers, setSubscribers] = useState<LeadMagnetSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('arimo_subscribers');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sub-01',
              name: 'Emeka Okafor',
              email: 'emeka.dev@gmail.com',
              phone: '+2348031234567',
              country: 'Nigeria',
              subscribedAt: '2026-02-10T10:00:00Z',
              downloaded: true
            },
            {
              id: 'sub-02',
              name: 'Sarah Jenkins',
              email: 'sarah.j@techstart.io',
              phone: '+14155552671',
              country: 'United States',
              subscribedAt: '2026-02-12T14:30:00Z',
              downloaded: true
            }
          ];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAiDesignerOpen, setIsAiDesignerOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<ProductItem | null>(null);

  // Direct checkout items
  const [directCheckoutItems, setDirectCheckoutItems] = useState<CartItem[]>([]);

  // Shop Filters
  const [shopCategory, setShopCategory] = useState<ProductFilterCategory>('all');
  const [shopSearchQuery, setShopSearchQuery] = useState('');

  // Persist Language
  const handleLanguageChange = (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    try {
      localStorage.setItem('arimo_language', newLang);
    } catch {
      // ignore
    }
  };

  // Persist Currency
  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('arimo_currency', newCurrency);
    } catch {
      // ignore
    }
  };

  // User Authentication Handlers
  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem('arimo_user_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }
    // If currency matched profile, update currency
    if (profile.currency === 'NGN' || profile.currency === 'USD' || profile.currency === 'GBP' || profile.currency === 'CAD') {
      handleCurrencyChange(profile.currency as CurrencyCode);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('arimo_user_profile');
    } catch {
      // ignore
    }
  };

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('arimo_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('arimo_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist purchases
  useEffect(() => {
    try {
      localStorage.setItem('arimo_purchases', JSON.stringify(purchases));
    } catch {
      // ignore
    }
  }, [purchases]);

  // Persist bookings
  useEffect(() => {
    try {
      localStorage.setItem('arimo_service_bookings', JSON.stringify(serviceBookings));
    } catch {
      // ignore
    }
  }, [serviceBookings]);

  // Persist subscribers
  useEffect(() => {
    try {
      localStorage.setItem('arimo_subscribers', JSON.stringify(subscribers));
    } catch {
      // ignore
    }
  }, [subscribers]);

  // Handle /admin and /dashboard secure routes & noindex meta tag enforcement
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || path === '/dashboard') {
        setIsAdminOpen(true);
        // Enforce noindex dynamically on admin view
        let robots = document.querySelector('meta[name="robots"]');
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Auto show lead magnet once after 7 seconds for new visitors
  useEffect(() => {
    const hasSeenLeadMagnet = sessionStorage.getItem('arimo_lead_magnet_shown');
    if (!hasSeenLeadMagnet) {
      const timer = setTimeout(() => {
        setIsLeadMagnetOpen(true);
        sessionStorage.setItem('arimo_lead_magnet_shown', 'true');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalNaira = cart.reduce((acc, item) => {
    const price = item.tierPriceNaira || item.product.priceNaira;
    return acc + price * item.quantity;
  }, 0);
  const cartTotalUsd = cart.reduce((acc, item) => {
    const price = item.tierPriceUsd || item.product.priceUsd;
    return acc + price * item.quantity;
  }, 0);

  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedLicense: 'commercial',
          tierPriceNaira: product.priceNaira,
          tierPriceUsd: product.priceUsd
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleDirectBuy = (product: ProductItem) => {
    setDirectCheckoutItems([
      {
        product,
        quantity: 1,
        selectedLicense: 'commercial',
        tierPriceNaira: product.priceNaira,
        tierPriceUsd: product.priceUsd
      }
    ]);
    setIsPaymentModalOpen(true);
  };

  const handleCartProceedCheckout = () => {
    if (cart.length === 0) return;
    setDirectCheckoutItems(cart);
    setIsPaymentModalOpen(true);
  };

  const handleBookServiceCheckout = (serviceName: string, priceNaira: number) => {
    const virtualProduct: ProductItem = {
      id: `prod-serv-${Date.now()}`,
      title: `${serviceName} (Booking Deposit)`,
      category: 'design_service',
      subcategory: 'Custom Service',
      priceNaira,
      priceUsd: Math.round(priceNaira / 1500),
      rating: 5.0,
      reviewCount: 1,
      shortDescription: `Official deposit for ${serviceName}`,
      fullDescription: `Official deposit payment for ${serviceName}`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      isDigital: true,
      includedItems: ['Client Service Booking', 'Direct WhatsApp Consultation'],
      downloadFileName: `${serviceName.replace(/\s+/g, '_')}_Receipt.pdf`
    };

    setDirectCheckoutItems([
      {
        product: virtualProduct,
        quantity: 1,
        selectedLicense: 'commercial',
        tierPriceNaira: priceNaira,
        tierPriceUsd: Math.round(priceNaira / 1500)
      }
    ]);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (newPurchase: ClientPurchase) => {
    setPurchases((prev) => [newPurchase, ...prev]);
    // Clear cart if items came from cart
    setCart([]);
  };

  const handleNewBookingCreated = (booking: ServiceBooking) => {
    setServiceBookings((prev) => [booking, ...prev]);
  };

  const handleRestoreBackup = (restoredData: {
    products?: ProductItem[];
    purchases?: ClientPurchase[];
    serviceBookings?: ServiceBooking[];
    subscribers?: LeadMagnetSubscriber[];
  }) => {
    if (restoredData.products) setProducts(restoredData.products);
    if (restoredData.purchases) setPurchases(restoredData.purchases);
    if (restoredData.serviceBookings) setServiceBookings(restoredData.serviceBookings);
    if (restoredData.subscribers) setSubscribers(restoredData.subscribers);
  };

  const handleAddSubscriber = (
    name: string,
    email: string,
    phone: string,
    promo_code: string = 'ARIMO50',
    discount: number = 50,
    status: string = 'VIP Waitlist'
  ) => {
    const newSub: LeadMagnetSubscriber = {
      id: `sub-${Date.now()}`,
      name,
      email,
      phone,
      country: currency === 'NGN' ? 'Nigeria' : 'Global',
      promo_code,
      discount,
      status,
      subscribedAt: new Date().toISOString(),
      downloaded: true
    };
    setSubscribers((prev) => [newSub, ...prev.filter((s) => s.email.toLowerCase() !== email.toLowerCase())]);
  };

  // Product Admin Operations
  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateBookingStatus = (bookingId: string, status: ServiceBooking['status']) => {
    setServiceBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Filtered Shop Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(shopSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (shopCategory === 'all') return true;
    if (shopCategory === 'prompts') return p.category === 'file' && p.subcategory.includes('Prompts');
    if (shopCategory === 'templates') return p.category === 'template';
    if (shopCategory === 'kits') return p.category === 'kit';
    if (shopCategory === 'coaching') return p.category === 'coaching';
    if (shopCategory === 'services') return p.category === 'design_service';

    return true;
  });

  return (
    <div
      id="app-root-container"
      className="w-full min-h-screen bg-black text-white selection:bg-amber-500 selection:text-zinc-950 font-sans antialiased flex flex-col m-0 p-0"
      style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}
    >
      {/* 2-Second Brand Splash Screen with Fade-in to Homepage */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} duration={2000} />
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'register');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        cartCount={cartCount}
        cartTotalNaira={cartTotalNaira}
        cartTotalUsd={cartTotalUsd}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        vaultDownloadsCount={purchases.reduce((acc, p) => acc + p.downloads.length, 0)}
      />

      {/* Main Page Content */}
      <main
        id="main-content-container"
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 flex-1 pb-[70px] lg:pb-12"
      >
        {/* TOP IN-APP AD & CREATOR TIPS POP-UP (Once per day, non-intrusive) */}
        <CreatorTipsBanner
          onExploreProducts={() => {
            setCurrentTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenVipOffer={() => {
            const el = document.getElementById('vip-offer-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* =========================================================================
            TAB 1: HOME PAGE
        ========================================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-12 sm:space-y-16 md:space-y-20">
            {/* HERO SECTION */}
            <section id="home-hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-amber-500/40 p-6 sm:p-10 md:p-14 shadow-[0_0_80px_rgba(212,175,55,0.18)]">
              {/* Background ambient gold glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                {/* Hero Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/50 text-amber-400 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-400" />
                  <span>NIGERIA &amp; WORLDWIDE AI &amp; DIGITAL SERVICES PLATFORM</span>
                </div>

                {/* Big bold Gold text on Black background with soft glow */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-white uppercase">
                  TEACHING AI DESIGN &amp;{' '}
                  <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">
                    DIGITAL SERVICES
                  </span>{' '}
                  <br className="hidden sm:inline" />
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-100 block mt-1 sm:mt-2">
                    FOR NIGERIA AND WORLDWIDE
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                  {t.heroSubtitle}
                </p>

                {/* BIG CALL TO ACTION BUTTONS */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {/* BIG BUTTON: 1-Click Buy Flagship 1 Product */}
                  <button
                    id="hero-buy-prompts-btn"
                    onClick={() => products[0] && handleDirectBuy(products[0])}
                    className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-zinc-950" />
                    <span>⚡ {t.buyNow} ({currency === 'NGN' ? '₦7,500' : '$5'})</span>
                  </button>

                  {/* BIG BUTTON: Join Our WhatsApp Channel */}
                  <a
                    id="hero-join-whatsapp-btn"
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-7 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
                    </svg>
                    <span>Join Our WhatsApp Channel</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 text-[10px] sm:text-xs font-bold">
                      Official
                    </span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <div className="text-sm sm:text-base font-black text-amber-400">2,400+</div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">Global Community</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <div className="text-sm sm:text-base font-black text-emerald-400">₦ &amp; $ Payouts</div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">Remote Job Prep</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <div className="text-sm sm:text-base font-black text-white">Multi-Gateway</div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">Paystack • Stripe • USSD</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <div className="text-sm sm:text-base font-black text-amber-400">4.98 / 5.0</div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">Client Rating</div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIMITED TIME VIP OFFER SECTION (Explicitly required with title, price & CTA) */}
            <VipOfferBanner
              currency={currency}
              onJoinedWaitlist={(email, promoCode, discount, status) => {
                handleAddSubscriber('VIP Member', email, '+234', promoCode, discount, status);
              }}
              onClaimCoupon={(code) => {
                setIsCartOpen(true);
              }}
            />

            {/* AI TIP OF THE DAY */}
            <AiTipOfTheDay
              onExploreProducts={() => setCurrentTab('shop')}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />

            {/* FEATURED DIGITAL PRODUCTS */}
            <section id="featured-products-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Instant Digital Assets
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {t.popularProducts} ({currency})
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Pay securely with Card, Bank Transfer, Apple Pay, Google Pay or USSD and download immediately.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <span>{t.viewAll} ({products.length} Products)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.slice(0, 6).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    currency={currency}
                    onViewDetails={(p) => setSelectedDetailProduct(p)}
                    onAddToCart={handleAddToCart}
                    onDirectBuy={handleDirectBuy}
                  />
                ))}
              </div>
            </section>

            {/* PORTFOLIO BEFORE/AFTER SHOWCASE */}
            <PortfolioShowcase />

            {/* SERVICES PREVIEW */}
            <ServicesSection
              onBookServicePaystack={handleBookServiceCheckout}
              onNewBookingCreated={handleNewBookingCreated}
            />

            {/* TESTIMONIALS */}
            <TestimonialsSection />

            {/* ABOUT PREVIEW */}
            <AboutSection />

            {/* FIND US - OFFICIAL SOCIAL CHANNELS SECTION */}
            <FindUsSection className="mt-8 sm:mt-12" />
          </div>
        )}

        {/* =========================================================================
            TAB 2: SHOP / STORE
        ========================================================================= */}
        {currentTab === 'shop' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Instant Digital Store
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                AI &amp; Design Digital Vault ({currency})
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Choose your pack below. Pay with Card, Bank Transfer, Apple Pay or USSD for instant access.
              </p>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                {[
                  { id: 'all' as ProductFilterCategory, label: 'All Assets' },
                  { id: 'prompts' as ProductFilterCategory, label: `Prompts (${formatCurrency(1, currency, 1000)})` },
                  { id: 'templates' as ProductFilterCategory, label: `Canva (${formatCurrency(2, currency, 3000)})` },
                  { id: 'kits' as ProductFilterCategory, label: `Job Kits (${formatCurrency(3.5, currency, 5000)})` },
                  { id: 'coaching' as ProductFilterCategory, label: `Coaching (${formatCurrency(7, currency, 10000)})` },
                  { id: 'services' as ProductFilterCategory, label: `Services (${formatCurrency(10, currency, 15000)}+)` }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setShopCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      shopCategory === cat.id
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search prompts, Canva, kits..."
                  value={shopSearchQuery}
                  onChange={(e) => setShopSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  currency={currency}
                  onViewDetails={(p) => setSelectedDetailProduct(p)}
                  onAddToCart={handleAddToCart}
                  onDirectBuy={handleDirectBuy}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
                <p className="text-sm font-bold text-zinc-400">No products match your search.</p>
                <button
                  onClick={() => {
                    setShopCategory('all');
                    setShopSearchQuery('');
                  }}
                  className="mt-3 text-xs text-amber-400 underline font-bold cursor-pointer"
                >
                  Clear Filters &amp; View All
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: BLOG / AI TIPS FOR NIGERIANS
        ========================================================================= */}
        {(currentTab === 'blog' || currentTab === 'tips') && (
          <div className="space-y-8">
            <BlogSection
              onSelectProduct={(prodId) => {
                const found = products.find((p) => p.id === prodId);
                if (found) {
                  setSelectedDetailProduct(found);
                } else {
                  setCurrentTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onOpenWaitlist={() => setIsLeadMagnetOpen(true)}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 4: FAQ PAGE
        ========================================================================= */}
        {currentTab === 'faq' && (
          <div className="space-y-8">
            <FaqSection
              onNavigateShop={() => {
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 4.5: OFFICIAL ARIMO & GLOBAL GIFT CARDS
        ========================================================================= */}
        {currentTab === 'giftcards' && (
          <GiftCardStorePage
            currency={currency}
            onOpenBuyModal={() => setIsBuyGiftCardOpen(true)}
            onNavigateShop={() => {
              setCurrentTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* =========================================================================
            TAB 5: SERVICES
        ========================================================================= */}
        {currentTab === 'services' && (
          <ServicesSection
            onBookServicePaystack={handleBookServiceCheckout}
            onNewBookingCreated={handleNewBookingCreated}
          />
        )}

        {/* =========================================================================
            TAB 6: PORTFOLIO
        ========================================================================= */}
        {currentTab === 'portfolio' && (
          <div className="space-y-8">
            <PortfolioShowcase />
            <TestimonialsSection />
          </div>
        )}

        {/* =========================================================================
            TAB 7: ABOUT ME
        ========================================================================= */}
        {currentTab === 'about' && (
          <div className="space-y-8">
            <AboutSection />
            <TestimonialsSection />
          </div>
        )}

        {/* =========================================================================
            TAB 8: VAULT (My Purchases & Orders)
        ========================================================================= */}
        {currentTab === 'vault' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">My Digital Downloads &amp; Bookings</h2>
                <p className="text-xs text-zinc-400 mt-1">Access all your licensed AI packs, Canva template links, and live service bookings.</p>
              </div>

              <div className="flex items-center gap-2">
                {currentUser && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    ✓ Verified: {currentUser.email}
                  </span>
                )}
                <button
                  onClick={() => setIsVaultOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs uppercase cursor-pointer"
                >
                  Open Full Vault
                </button>
              </div>
            </div>

            {/* Quick Render of Vault inside tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchases.flatMap((p) => p.downloads).map((dl, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{dl.fileName}</h4>
                    <span className="text-xs text-amber-400 font-mono">{dl.format} • {dl.fileSize}</span>
                  </div>
                  <button
                    onClick={() => setIsVaultOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-bold cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 sm:mt-20 border-t border-zinc-900 bg-zinc-950/80 py-10 px-4 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex items-center justify-center">
          <BrandLogo size={32} showText={true} showSubtitle={false} rounded="rounded-xl" />
        </div>

        {/* Official Social Media Find Us Bar */}
        <div className="py-2 flex flex-col items-center justify-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Find Us</span>
          <FindUsSection isCompact={true} />
        </div>

        <p className="max-w-md mx-auto">
          Empowering creators across Nigeria, USA, UK, Canada and worldwide with AI skills, instant digital product downloads, and remote job blueprints.
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-amber-400 text-xs font-bold pt-2 flex-wrap">
          <button onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">
            {t.home}
          </button>
          <span>•</span>
          <button onClick={() => { setCurrentTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">
            {t.shop} (10 Products)
          </button>
          <span>•</span>
          <button onClick={() => { setCurrentTab('giftcards'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer text-amber-300">
            🎁 Gift Cards (Steam, Apple, ARIMO)
          </button>
          <span>•</span>
          <button onClick={() => { setCurrentTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">
            {t.blog}
          </button>
          <span>•</span>
          <button onClick={() => { setCurrentTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">
            {t.faq}
          </button>
          <span>•</span>
          <button onClick={() => setIsLeadMagnetOpen(true)} className="hover:underline cursor-pointer text-amber-300">
            Join VIP Waitlist (50% Off)
          </button>
          <span>•</span>
          <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
            Join Our WhatsApp Channel
          </a>
          <span>•</span>
          <button onClick={() => setIsVaultOpen(true)} className="hover:underline cursor-pointer">
            {t.vault}
          </button>
          <span>•</span>
          <button onClick={() => setIsAdminOpen(true)} className="hover:underline cursor-pointer text-zinc-400 hover:text-amber-400">
            Creator Admin
          </button>
        </div>
        <p className="text-[11px] text-zinc-600">
          © {new Date().getFullYear()} ARIMO STORE HUB. All rights reserved. Secured by Paystack, Flutterwave, Stripe &amp; Verified Gift Card Network.
        </p>
      </footer>

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        vaultCount={purchases.reduce((acc, p) => acc + p.downloads.length, 0)}
        currentLanguage={currentLanguage}
      />

      {/* Floating Sticky WhatsApp Quick Access Button */}
      <StickyWhatsApp />

      {/* Floating CH-Hub AI Designer Quick Trigger */}
      <FloatingAiAssistant onOpen={() => setIsAiDesignerOpen(true)} />

      {/* MODALS */}
      {/* 0. 2-Step Registration & Profile Setup Modal with reCAPTCHA v2 and OTP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* 1. Buy ARIMO Gift Card Modal (₦1,000, ₦5,000, ₦10,000+) */}
      <BuyGiftCardModal
        isOpen={isBuyGiftCardOpen}
        onClose={() => setIsBuyGiftCardOpen(false)}
        currency={currency}
        onRedeemNow={(card) => {
          setCurrentTab('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Lead Magnet / 50% Off Waitlist Pop-up */}
      <LeadMagnetModal
        isOpen={isLeadMagnetOpen}
        onClose={() => setIsLeadMagnetOpen(false)}
        onSubscriberCaptured={handleAddSubscriber}
        onApplyDiscountCode={(code) => {
          setIsCartOpen(true);
        }}
      />

      {/* 3. Product Detail Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        currency={currency}
        isOpen={!!selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
      />

      {/* 4. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleCartProceedCheckout}
      />

      {/* 5. Unified Multi-Gateway Payment Modal (Paystack, Gift Cards, Flutterwave, Stripe) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={directCheckoutItems}
        currency={currency}
        totalAmount={directCheckoutItems.reduce((acc, item) => {
          const priceUsd = item.tierPriceUsd || item.product.priceUsd;
          const priceNaira = item.tierPriceNaira || item.product.priceNaira;
          return acc + (currency === 'NGN' ? priceNaira : priceUsd) * item.quantity;
        }, 0)}
        totalNaira={directCheckoutItems.reduce((acc, item) => {
          const price = item.tierPriceNaira || item.product.priceNaira;
          return acc + price * item.quantity;
        }, 0)}
        totalUsd={directCheckoutItems.reduce((acc, item) => {
          const price = item.tierPriceUsd || item.product.priceUsd;
          return acc + price * item.quantity;
        }, 0)}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenBuyGiftCard={() => {
          setIsPaymentModalOpen(false);
          setIsBuyGiftCardOpen(true);
        }}
      />

      {/* 6. Client Digital Vault & Orders Modal */}
      <ClientVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        purchases={purchases}
        serviceBookings={serviceBookings}
        onOpenBuyGiftCard={() => setIsBuyGiftCardOpen(true)}
      />

      {/* 7. Raymond Arimo Creator Admin Portal */}
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          purchases={purchases}
          serviceBookings={serviceBookings}
          subscribers={subscribers}
          currency={currency}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onRestoreBackup={handleRestoreBackup}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin') || window.location.hash === '#admin' || window.location.pathname === '/dashboard') {
              window.history.pushState({}, '', '/');
            }
          }}
        />
      )}

      {/* 8. ARIMZ AI Assistant Modal */}
      <ArimzAiModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onNavigateToTab={(tab) => {
          setCurrentTab(tab);
          setIsAiAssistantOpen(false);
        }}
      />

      {/* 8b. CH-Hub AI Designer Modal */}
      <AiDesignerModal
        isOpen={isAiDesignerOpen}
        onClose={() => setIsAiDesignerOpen(false)}
      />

      {/* 9. Live Anti-Bot & Threat Security Alert Notifications (Instant WhatsApp & Email Alert System) */}
      <SecurityAlertNotification />
    </div>
  );
}
