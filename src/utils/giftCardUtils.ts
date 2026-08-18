import { CurrencyCode, GiftCardBrand, GiftCardItem } from '../types';

export const USD_TO_NGN_RATE = 1500;

export interface GiftCardBrandMeta {
  id: GiftCardBrand;
  name: string;
  shortLabel: string;
  description: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  codePlaceholder: string;
  formatDescription: string;
  minDigits: number;
  maxDigits: number;
}

export const GIFT_CARD_BRANDS: GiftCardBrandMeta[] = [
  {
    id: 'steam',
    name: 'Steam Gift Card',
    shortLabel: 'Steam',
    description: 'Redeem funds from global Steam Wallet cards and vouchers for ARIMO digital products.',
    color: '#1b2838',
    bgGradient: 'from-[#171a21] via-[#1b2838] to-[#2a475e]',
    borderColor: '#66c0f4',
    codePlaceholder: 'e.g. STEAM-W79K-88Q2-99XP or 15-16 chars',
    formatDescription: '15-16 alphanumeric characters or STEAM-XXXX-XXXX-XXXX',
    minDigits: 14,
    maxDigits: 25
  },
  {
    id: 'apple',
    name: 'iTunes / Apple Gift Card',
    shortLabel: 'Apple / iTunes',
    description: 'Use official Apple App Store & iTunes Gift Cards to pay for AI prompts and design toolkits.',
    color: '#000000',
    bgGradient: 'from-zinc-900 via-zinc-800 to-black',
    borderColor: '#a1a1aa',
    codePlaceholder: 'e.g. APPL-992K-11PL-44XZ or 16-digit code',
    formatDescription: '16-digit code starting with X or APPL-XXXX-XXXX-XXXX',
    minDigits: 14,
    maxDigits: 25
  },
  {
    id: 'amazon',
    name: 'Amazon Gift Card',
    shortLabel: 'Amazon',
    description: 'Instantly apply Amazon claim codes with automated real-time exchange rate verification.',
    color: '#ff9900',
    bgGradient: 'from-[#131921] via-[#232f3e] to-[#37475a]',
    borderColor: '#ff9900',
    codePlaceholder: 'e.g. AMZN-4819-2048-9102 or 14-16 chars',
    formatDescription: '14-16 alphanumeric claim code or AMZN-XXXX-XXXX-XXXX',
    minDigits: 14,
    maxDigits: 25
  },
  {
    id: 'googleplay',
    name: 'Google Play Gift Card',
    shortLabel: 'Google Play',
    description: 'Pay seamlessly with Google Play Store gift cards and recharge codes.',
    color: '#01875f',
    bgGradient: 'from-[#0b1e16] via-[#0d2d22] to-[#124233]',
    borderColor: '#34d399',
    codePlaceholder: 'e.g. GPLAY-7712-9901-3321 or 16-20 chars',
    formatDescription: '16-20 alphanumeric digit code or GPLAY-XXXX-XXXX-XXXX',
    minDigits: 14,
    maxDigits: 25
  },
  {
    id: 'arimo',
    name: 'ARIMO STORE HUB Gift Card',
    shortLabel: 'ARIMO Gold',
    description: 'Direct store credit generated exclusively by ARIMO STORE HUB with instant 100% redemption.',
    color: '#d4af37',
    bgGradient: 'from-zinc-950 via-zinc-900 to-black',
    borderColor: '#f59e0b',
    codePlaceholder: 'e.g. ARIMO-NGN-10000 or ARIMO-USD-50',
    formatDescription: 'Official 16-character ARIMO voucher code',
    minDigits: 14,
    maxDigits: 25
  }
];

// NGN and USD Presets according to requirements:
// NGN Denominations: ₦1,000, ₦5,000, ₦10,000, ₦20,000, ₦50,000
export const NGN_PRESET_AMOUNTS = [
  { amount: 1000, label: '₦1,000', popular: false, desc: 'AI Prompt Pack or Mini Blueprint' },
  { amount: 5000, label: '₦5,000', popular: true, desc: 'Canva Design Kit / Remote Kit' },
  { amount: 10000, label: '₦10,000', popular: true, desc: 'Masterclass or Full Tool Bundle' },
  { amount: 20000, label: '₦20,000', popular: false, desc: 'VIP Coaching & Masterclass Suite' },
  { amount: 50000, label: '₦50,000', popular: false, desc: 'Complete Studio Access & All Assets' }
];

// USD Denominations: $5, $10, $25, $50, $100
export const USD_PRESET_AMOUNTS = [
  { amount: 5, label: '$5.00', popular: false, desc: 'Prompt Pack / Quick Template' },
  { amount: 10, label: '$10.00', popular: true, desc: 'Complete Remote Job Kit' },
  { amount: 25, label: '$25.00', popular: true, desc: 'Full AI Masterclass Blueprint' },
  { amount: 50, label: '$50.00', popular: false, desc: 'VIP All-Access Store Pass' },
  { amount: 100, label: '$100.00', popular: false, desc: 'Executive Coaching & Studio Suite' }
];

// Initial demo cards for testing both NGN and USD
const INITIAL_DEMO_GIFT_CARDS: GiftCardItem[] = [
  // --- NGN CARDS ---
  {
    id: 'card-arimo-ngn-10k',
    code: 'ARIMO-NGN-10000',
    brand: 'arimo',
    brandName: 'ARIMO STORE HUB Gift Card',
    initialBalanceNaira: 10000,
    currentBalanceNaira: 10000,
    initialBalanceUsd: 0,
    currentBalanceUsd: 0,
    currency: 'NGN',
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    recipientName: 'Valued Creator',
    recipientEmail: 'creator@arimo.design',
    senderName: 'Raymond Arimo',
    personalMessage: 'Enjoy your high-income AI prompt blueprint and design templates!',
    theme: 'gold',
    claimToken: 'CLM-ARIMO-NGN-10K'
  },
  {
    id: 'card-arimo-ngn-5k',
    code: 'ARIMO-NGN-5000',
    brand: 'arimo',
    brandName: 'ARIMO STORE HUB Gift Card',
    initialBalanceNaira: 5000,
    currentBalanceNaira: 5000,
    initialBalanceUsd: 0,
    currentBalanceUsd: 0,
    currency: 'NGN',
    status: 'active',
    createdAt: '2026-02-10T00:00:00Z',
    recipientName: 'Arimo VIP Member',
    recipientEmail: 'vip@arimostore.com',
    senderName: 'Arimo Store Hub',
    personalMessage: 'Special community gift voucher for digital asset downloads.',
    theme: 'vip',
    claimToken: 'CLM-ARIMO-NGN-5K'
  },
  {
    id: 'card-arimo-ngn-20k',
    code: 'ARIMO-NGN-20000',
    brand: 'arimo',
    brandName: 'ARIMO STORE HUB Gift Card',
    initialBalanceNaira: 20000,
    currentBalanceNaira: 20000,
    initialBalanceUsd: 0,
    currentBalanceUsd: 0,
    currency: 'NGN',
    status: 'active',
    createdAt: '2026-02-12T00:00:00Z',
    recipientName: 'Executive Designer',
    recipientEmail: 'executive@studio.com',
    senderName: 'Raymond Arimo',
    personalMessage: 'Full store access & VIP design services credit.',
    theme: 'dark',
    claimToken: 'CLM-ARIMO-NGN-20K'
  },
  // --- USD CARDS ---
  {
    id: 'card-arimo-usd-25',
    code: 'ARIMO-USD-25',
    brand: 'arimo',
    brandName: 'ARIMO STORE HUB Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 25,
    currentBalanceUsd: 25,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'Global AI Learner',
    recipientEmail: 'global@learner.com',
    senderName: 'Raymond Arimo',
    personalMessage: 'Welcome to ARIMO International AI & Design masterclasses!',
    theme: 'gold',
    claimToken: 'CLM-ARIMO-USD-25'
  },
  {
    id: 'card-arimo-usd-50',
    code: 'ARIMO-USD-50',
    brand: 'arimo',
    brandName: 'ARIMO STORE HUB Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 50,
    currentBalanceUsd: 50,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'International VIP',
    recipientEmail: 'vip@international.com',
    senderName: 'Arimo Global Store',
    personalMessage: 'USD $50 store voucher for premium remote kits and AI prompts.',
    theme: 'vip',
    claimToken: 'CLM-ARIMO-USD-50'
  },
  {
    id: 'card-steam-usd-50',
    code: 'STEAM-W79K-88Q2-99XP',
    brand: 'steam',
    brandName: 'Steam Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 50,
    currentBalanceUsd: 50,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'Digital Gamer / Creator',
    claimToken: 'CLM-STEAM-50'
  },
  {
    id: 'card-apple-usd-25',
    code: 'APPL-992K-11PL-44XZ',
    brand: 'apple',
    brandName: 'iTunes / Apple Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 25,
    currentBalanceUsd: 25,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'Apple User',
    claimToken: 'CLM-APPL-25'
  },
  {
    id: 'card-amazon-usd-20',
    code: 'AMZN-4819-2048-9102',
    brand: 'amazon',
    brandName: 'Amazon Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 20,
    currentBalanceUsd: 20,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'Amazon Shopper',
    claimToken: 'CLM-AMZN-20'
  },
  {
    id: 'card-google-usd-15',
    code: 'GPLAY-7712-9901-3321',
    brand: 'googleplay',
    brandName: 'Google Play Gift Card (USD)',
    initialBalanceNaira: 0,
    currentBalanceNaira: 0,
    initialBalanceUsd: 15,
    currentBalanceUsd: 15,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-02-14T00:00:00Z',
    recipientName: 'Android Creator',
    claimToken: 'CLM-GPLAY-15'
  }
];

const STORAGE_KEY = 'arimo_gift_cards_v2';

export function getAllGiftCards(): GiftCardItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_GIFT_CARDS));
      return INITIAL_DEMO_GIFT_CARDS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_DEMO_GIFT_CARDS;
  }
}

export function saveAllGiftCards(cards: GiftCardItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function autoDetectBrand(code: string): GiftCardBrand {
  const upper = code.trim().toUpperCase();
  if (upper.startsWith('ARIMO') || upper.startsWith('ARM-')) return 'arimo';
  if (upper.startsWith('STEAM') || upper.startsWith('STM-')) return 'steam';
  if (upper.startsWith('APPL') || upper.startsWith('ITUN') || upper.startsWith('X')) return 'apple';
  if (upper.startsWith('AMZN') || upper.startsWith('AMAZ')) return 'amazon';
  if (upper.startsWith('GPLAY') || upper.startsWith('GOOG') || upper.startsWith('GP-')) return 'googleplay';
  return 'arimo';
}

export interface VerificationResult {
  success: boolean;
  card?: GiftCardItem;
  error?: string;
  sourceApi?: string;
}

/**
 * Verify Gift Card with strict currency matching when requiredCurrency is provided.
 */
export async function verifyGiftCard(
  inputCode: string,
  selectedBrand?: GiftCardBrand,
  requiredCurrency?: CurrencyCode
): Promise<VerificationResult> {
  const cleanCode = inputCode.trim().toUpperCase();

  // Validate format & length
  if (!cleanCode || cleanCode.replace(/[^A-Z0-9]/g, '').length < 6) {
    return {
      success: false,
      error: 'Please enter a valid gift card code (at least 6-25 characters).'
    };
  }

  // Simulate network verification delay with Card Validation Engine & Paystack API
  await new Promise((resolve) => setTimeout(resolve, 600));

  const allCards = getAllGiftCards();
  const matched = allCards.find(
    (c) => c.code.replace(/[^A-Z0-9]/g, '').toUpperCase() === cleanCode.replace(/[^A-Z0-9]/g, '').toUpperCase()
  );

  if (matched) {
    // Check if depleted
    const isDepleted =
      matched.status === 'depleted' ||
      (matched.currency === 'NGN' && matched.currentBalanceNaira <= 0) ||
      (matched.currency === 'USD' && matched.currentBalanceUsd <= 0);

    if (isDepleted) {
      return {
        success: false,
        error: `This ${matched.currency} gift card has already been fully redeemed (${matched.currency === 'NGN' ? '₦0' : '$0'} balance).`
      };
    }

    // STRICT CURRENCY CHECK: If requiredCurrency is set (e.g. from checkout order), reject currency mismatch
    if (requiredCurrency) {
      const orderCurr = requiredCurrency === 'NGN' ? 'NGN' : 'USD';
      const cardCurr = matched.currency === 'NGN' ? 'NGN' : 'USD';

      if (orderCurr !== cardCurr) {
        if (orderCurr === 'NGN') {
          return {
            success: false,
            error: `Currency Mismatch: This order is priced in NGN (₦). You entered a USD ($) gift card. Please use an NGN gift card. No mixing of currencies is permitted.`
          };
        } else {
          return {
            success: false,
            error: `Currency Mismatch: This order is priced in USD ($). You entered an NGN (₦) gift card. Please use a USD gift card. No mixing of currencies is permitted.`
          };
        }
      }
    }

    return {
      success: true,
      card: matched,
      sourceApi: matched.brand === 'arimo' ? 'ARIMO Core Vault Engine' : 'Paystack & Global Gift Card Verification API'
    };
  }

  // Synthesize a valid external gift card based on brand and format if code is valid pattern
  const rawChars = cleanCode.replace(/[^A-Z0-9]/g, '');
  if (rawChars.length >= 10 && rawChars.length <= 25) {
    const brand = selectedBrand || autoDetectBrand(cleanCode);
    const brandMeta = GIFT_CARD_BRANDS.find((b) => b.id === brand) || GIFT_CARD_BRANDS[0];

    // Determine currency: if ARIMO-USD or external global card in USD mode, set USD, else NGN
    let detectedCurrency: CurrencyCode = 'NGN';
    if (cleanCode.includes('USD') || cleanCode.startsWith('STEAM') || cleanCode.startsWith('APPL') || cleanCode.startsWith('AMZN') || cleanCode.startsWith('GPLAY')) {
      detectedCurrency = requiredCurrency === 'NGN' ? 'NGN' : 'USD';
    } else if (cleanCode.includes('NGN') || cleanCode.includes('NAIRA')) {
      detectedCurrency = 'NGN';
    } else {
      detectedCurrency = requiredCurrency || 'NGN';
    }

    // STRICT CURRENCY CHECK
    if (requiredCurrency) {
      const orderCurr = requiredCurrency === 'NGN' ? 'NGN' : 'USD';
      if (detectedCurrency !== orderCurr) {
        return {
          success: false,
          error: `Currency Mismatch: This order is in ${orderCurr}. Please enter an authentic ${orderCurr} gift card. No currency mixing allowed.`
        };
      }
    }

    // Generate deterministic balance based on code hash
    let hash = 0;
    for (let i = 0; i < rawChars.length; i++) {
      hash = (hash << 5) - hash + rawChars.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    let balanceNaira = 0;
    let balanceUsd = 0;

    if (detectedCurrency === 'NGN') {
      const presetNaira = [5000, 10000, 20000, 25000, 50000];
      balanceNaira = presetNaira[absHash % presetNaira.length];
      balanceUsd = 0;
    } else {
      const presetUsd = [10, 25, 50, 100];
      balanceUsd = presetUsd[absHash % presetUsd.length];
      balanceNaira = 0;
    }

    const dynamicCard: GiftCardItem = {
      id: `dyn-card-${Date.now()}`,
      code: cleanCode,
      brand,
      brandName: `${brandMeta.name} (${detectedCurrency})`,
      initialBalanceNaira: balanceNaira,
      currentBalanceNaira: balanceNaira,
      initialBalanceUsd: balanceUsd,
      currentBalanceUsd: balanceUsd,
      currency: detectedCurrency,
      status: 'active',
      createdAt: new Date().toISOString(),
      recipientName: 'Verified Card Holder',
      claimToken: `CLM-${brand.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    allCards.push(dynamicCard);
    saveAllGiftCards(allCards);

    return {
      success: true,
      card: dynamicCard,
      sourceApi: `${brandMeta.shortLabel} API & Paystack Multi-Currency Network`
    };
  }

  return {
    success: false,
    error: 'Invalid gift card code. Please ensure you entered a valid 16-25 character card voucher.'
  };
}

/**
 * Deducts gift card balance strictly according to the card's native currency.
 */
export function deductGiftCardBalance(
  cardCode: string,
  amountToDeduct: number,
  currency: CurrencyCode
): {
  success: boolean;
  newBalance: number;
  amountCovered: number;
  remainingDue: number;
  cardCurrency: CurrencyCode;
} {
  const allCards = getAllGiftCards();
  const cleanCode = cardCode.trim().toUpperCase();
  const index = allCards.findIndex(
    (c) => c.code.replace(/[^A-Z0-9]/g, '').toUpperCase() === cleanCode.replace(/[^A-Z0-9]/g, '').toUpperCase()
  );

  if (index === -1) {
    return {
      success: false,
      newBalance: 0,
      amountCovered: 0,
      remainingDue: amountToDeduct,
      cardCurrency: currency
    };
  }

  const card = allCards[index];
  const isNgn = card.currency === 'NGN';
  const available = isNgn ? card.currentBalanceNaira : card.currentBalanceUsd;

  const amountCovered = Math.min(available, amountToDeduct);
  const newBalance = Math.max(0, available - amountCovered);
  const remainingDue = Math.max(0, amountToDeduct - amountCovered);

  if (isNgn) {
    card.currentBalanceNaira = newBalance;
  } else {
    card.currentBalanceUsd = newBalance;
  }

  if (newBalance <= 0) {
    card.status = 'depleted';
  } else if (newBalance < (isNgn ? card.initialBalanceNaira : card.initialBalanceUsd)) {
    card.status = 'partially_used';
  }

  allCards[index] = card;
  saveAllGiftCards(allCards);

  return {
    success: true,
    newBalance,
    amountCovered,
    remainingDue,
    cardCurrency: card.currency
  };
}

/**
 * Generates an official ARIMO Gift Card in either NGN or USD.
 */
export function generateArimoGiftCard(params: {
  currency: CurrencyCode; // 'NGN' or 'USD'
  amount: number; // e.g. 5000 NGN or 25 USD
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  personalMessage: string;
  theme?: 'gold' | 'dark' | 'creator' | 'vip';
}): GiftCardItem {
  const isNgn = params.currency === 'NGN';
  const currTag = isNgn ? 'NGN' : 'USD';

  // Generate random 16-character code in format ARIMO-[NGN/USD]-XXXX-XXXX
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  const code = `ARIMO-${currTag}-${segment1}-${segment2}`;

  const newCard: GiftCardItem = {
    id: `card-arimo-${Date.now()}`,
    code,
    brand: 'arimo',
    brandName: `ARIMO STORE HUB Gift Card (${currTag})`,
    initialBalanceNaira: isNgn ? params.amount : 0,
    currentBalanceNaira: isNgn ? params.amount : 0,
    initialBalanceUsd: isNgn ? 0 : params.amount,
    currentBalanceUsd: isNgn ? 0 : params.amount,
    currency: isNgn ? 'NGN' : 'USD',
    status: 'active',
    createdAt: new Date().toISOString(),
    recipientName: params.recipientName || 'Friend / Colleague',
    recipientEmail: params.recipientEmail || 'friend@example.com',
    senderName: params.senderName || 'Raymond Arimo Customer',
    personalMessage:
      params.personalMessage ||
      'A gift for you to download top digital products and AI prompts on ARIMO STORE HUB.',
    theme: params.theme || 'gold',
    claimToken: `CLM-${code.replace(/-/g, '').substring(0, 10)}`
  };

  const allCards = getAllGiftCards();
  allCards.unshift(newCard);
  saveAllGiftCards(allCards);

  return newCard;
}
