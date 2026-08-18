import { CurrencyCode, PaymentGateway } from '../types';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromUsd: number; // 1 USD = rateFromUsd Currency units
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromUsd: 1,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    rateFromUsd: 1500, // Standard $1 = ₦1,500
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateFromUsd: 0.79,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    rateFromUsd: 1.38,
  },
};

/**
 * Detect user's optimal initial currency based on time zone and locale
 */
export function detectUserCurrency(): CurrencyCode {
  try {
    const saved = localStorage.getItem('arimo_selected_currency');
    if (saved && (saved === 'USD' || saved === 'NGN' || saved === 'GBP' || saved === 'CAD')) {
      return saved as CurrencyCode;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const languages = navigator.languages || [navigator.language || ''];
    const langStr = languages.join(' ').toLowerCase();

    if (
      timeZone.includes('Lagos') ||
      timeZone.includes('Africa') ||
      langStr.includes('en-ng') ||
      langStr.includes('yoruba') ||
      langStr.includes('igbo') ||
      langStr.includes('hausa')
    ) {
      return 'NGN';
    }

    if (timeZone.includes('London') || langStr.includes('en-gb')) {
      return 'GBP';
    }

    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver') || langStr.includes('en-ca')) {
      return 'CAD';
    }

    return 'USD';
  } catch {
    return 'USD';
  }
}

/**
 * Formats a given amount in the selected currency
 */
export function formatCurrency(
  amountUsd: number,
  currency: CurrencyCode,
  overrideNaira?: number
): string {
  if (currency === 'NGN') {
    const nVal = overrideNaira !== undefined ? overrideNaira : Math.round(amountUsd * 1500);
    return `₦${nVal.toLocaleString('en-NG')}`;
  }

  const config = CURRENCY_CONFIGS[currency];
  const converted = amountUsd * (config ? config.rateFromUsd : 1);
  const formatted = converted % 1 === 0 ? converted.toLocaleString() : converted.toFixed(2);
  return `${config?.symbol || '$'}${formatted}`;
}

/**
 * Calculates raw converted numeric value for checkout computation
 */
export function convertUsdToCurrency(amountUsd: number, currency: CurrencyCode, overrideNaira?: number): number {
  if (currency === 'NGN') {
    return overrideNaira !== undefined ? overrideNaira : Math.round(amountUsd * 1500);
  }
  const config = CURRENCY_CONFIGS[currency];
  const rate = config ? config.rateFromUsd : 1;
  return Number((amountUsd * rate).toFixed(2));
}

/**
 * Returns allowed payment gateways for a given currency
 */
export function getAvailableGateways(currency: CurrencyCode): { id: PaymentGateway; name: string; subtitle: string; icon: string }[] {
  if (currency === 'NGN') {
    return [
      {
        id: 'paystack',
        name: 'Paystack Nigeria',
        subtitle: 'Card (Verve/Mastercard/Visa), Bank Transfer, USSD, OPay',
        icon: '💳',
      },
      {
        id: 'giftcard',
        name: 'Gift Cards',
        subtitle: 'Steam, Apple, Amazon, Google Play, ARIMO Card',
        icon: '🎁',
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave Africa',
        subtitle: 'Bank Account, Mobile Money, Barter, QR, USSD',
        icon: '🦋',
      },
      {
        id: 'stripe',
        name: 'Stripe International Card',
        subtitle: 'Global Cards, Apple Pay, Google Pay in USD equivalent',
        icon: '🌐',
      },
    ];
  }

  return [
    {
      id: 'stripe',
      name: 'Stripe Global Checkout',
      subtitle: 'Debit/Credit Card, Apple Pay, Google Pay, Link',
      icon: '🌐',
    },
    {
      id: 'giftcard',
      name: 'Gift Cards',
      subtitle: 'Steam, Apple, Amazon, Google Play, ARIMO Card',
      icon: '🎁',
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave International',
      subtitle: 'Accepts cards from 150+ countries worldwide',
      icon: '🦋',
    },
    {
      id: 'paystack',
      name: 'Paystack International',
      subtitle: 'Paystack Card checkout with auto-conversion',
      icon: '💳',
    },
  ];
}
