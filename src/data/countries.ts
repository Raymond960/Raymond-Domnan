export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  flag: string;
  phoneCode: string;
  rateToUsd: number; // approximate conversion rate
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', currencyName: 'Nigerian Naira', flag: '🇳🇬', phoneCode: '+234', rateToUsd: 1500 },
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar', flag: '🇺🇸', phoneCode: '+1', rateToUsd: 1 },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', currencyName: 'British Pound', flag: '🇬🇧', phoneCode: '+44', rateToUsd: 0.79 },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$', currencyName: 'Canadian Dollar', flag: '🇨🇦', phoneCode: '+1', rateToUsd: 1.36 },
  { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', currencyName: 'Ghanaian Cedi', flag: '🇬🇭', phoneCode: '+233', rateToUsd: 15.5 },
  { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', currencyName: 'Kenyan Shilling', flag: '🇰🇪', phoneCode: '+254', rateToUsd: 130 },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', currencyName: 'South African Rand', flag: '🇿🇦', phoneCode: '+27', rateToUsd: 18.2 },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'AED', currencyName: 'UAE Dirham', flag: '🇦🇪', phoneCode: '+971', rateToUsd: 3.67 },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇩🇪', phoneCode: '+49', rateToUsd: 0.92 },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇫🇷', phoneCode: '+33', rateToUsd: 0.92 },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇮🇹', phoneCode: '+39', rateToUsd: 0.92 },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇪🇸', phoneCode: '+34', rateToUsd: 0.92 },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇳🇱', phoneCode: '+31', rateToUsd: 0.92 },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', currencyName: 'Australian Dollar', flag: '🇦🇺', phoneCode: '+61', rateToUsd: 1.52 },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', currencyName: 'Indian Rupee', flag: '🇮🇳', phoneCode: '+91', rateToUsd: 83.5 },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', currencyName: 'Brazilian Real', flag: '🇧🇷', phoneCode: '+55', rateToUsd: 5.4 },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', currencyName: 'Japanese Yen', flag: '🇯🇵', phoneCode: '+81', rateToUsd: 155 },
  { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', currencyName: 'Chinese Yuan', flag: '🇨🇳', phoneCode: '+86', rateToUsd: 7.25 },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw', currencyName: 'Rwandan Franc', flag: '🇷🇼', phoneCode: '+250', rateToUsd: 1320 },
  { code: 'UG', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', currencyName: 'Ugandan Shilling', flag: '🇺🇬', phoneCode: '+256', rateToUsd: 3750 },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', currencyName: 'Tanzanian Shilling', flag: '🇹🇿', phoneCode: '+255', rateToUsd: 2600 },
  { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', currencyName: 'Egyptian Pound', flag: '🇪🇬', phoneCode: '+20', rateToUsd: 48 },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'SR', currencyName: 'Saudi Riyal', flag: '🇸🇦', phoneCode: '+966', rateToUsd: 3.75 },
  { code: 'QA', name: 'Qatar', currency: 'QAR', currencySymbol: 'QR', currencyName: 'Qatari Riyal', flag: '🇶🇦', phoneCode: '+974', rateToUsd: 3.64 },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF', currencyName: 'Swiss Franc', flag: '🇨🇭', phoneCode: '+41', rateToUsd: 0.90 },
  { code: 'SE', name: 'Sweden', currency: 'SEK', currencySymbol: 'kr', currencyName: 'Swedish Krona', flag: '🇸🇪', phoneCode: '+46', rateToUsd: 10.5 },
  { code: 'NO', name: 'Norway', currency: 'NOK', currencySymbol: 'kr', currencyName: 'Norwegian Krone', flag: '🇳🇴', phoneCode: '+47', rateToUsd: 10.8 },
  { code: 'IE', name: 'Ireland', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', flag: '🇮🇪', phoneCode: '+353', rateToUsd: 0.92 },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', currencyName: 'Singapore Dollar', flag: '🇸🇬', phoneCode: '+65', rateToUsd: 1.35 },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM', currencyName: 'Malaysian Ringgit', flag: '🇲🇾', phoneCode: '+60', rateToUsd: 4.7 },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', currencySymbol: 'NZ$', currencyName: 'New Zealand Dollar', flag: '🇳🇿', phoneCode: '+64', rateToUsd: 1.65 },
  { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: 'Mex$', currencyName: 'Mexican Peso', flag: '🇲🇽', phoneCode: '+52', rateToUsd: 18.0 },
  { code: 'PH', name: 'Philippines', currency: 'PHP', currencySymbol: '₱', currencyName: 'Philippine Peso', flag: '🇵🇭', phoneCode: '+63', rateToUsd: 58 },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp', currencyName: 'Indonesian Rupiah', flag: '🇮🇩', phoneCode: '+62', rateToUsd: 16200 },
  { code: 'TR', name: 'Turkey', currency: 'TRY', currencySymbol: '₺', currencyName: 'Turkish Lira', flag: '🇹🇷', phoneCode: '+90', rateToUsd: 33 },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', currencySymbol: 'Rs', currencyName: 'Pakistani Rupee', flag: '🇵2', phoneCode: '+92', rateToUsd: 278 },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', currencySymbol: '৳', currencyName: 'Bangladeshi Taka', flag: '🇧🇩', phoneCode: '+880', rateToUsd: 118 },
  { code: 'CM', name: 'Cameroon', currency: 'XAF', currencySymbol: 'FCFA', currencyName: 'Central African CFA', flag: '🇨🇲', phoneCode: '+237', rateToUsd: 600 },
  { code: 'CI', name: 'Ivory Coast', currency: 'XOF', currencySymbol: 'CFA', currencyName: 'West African CFA', flag: '🇨🇮', phoneCode: '+225', rateToUsd: 600 },
  { code: 'SN', name: 'Senegal', currency: 'XOF', currencySymbol: 'CFA', currencyName: 'West African CFA', flag: '🇸🇳', phoneCode: '+221', rateToUsd: 600 },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', currencyName: 'Zambian Kwacha', flag: '🇿🇲', phoneCode: '+260', rateToUsd: 26 },
  { code: 'ZW', name: 'Zimbabwe', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar', flag: '🇿🇼', phoneCode: '+263', rateToUsd: 1 },
  { code: 'SL', name: 'Sierra Leone', currency: 'SLE', currencySymbol: 'Le', currencyName: 'Sierra Leonean Leone', flag: '🇸🇱', phoneCode: '+232', rateToUsd: 22.5 },
  { code: 'LR', name: 'Liberia', currency: 'LRD', currencySymbol: 'L$', currencyName: 'Liberian Dollar', flag: '🇱🇷', phoneCode: '+231', rateToUsd: 195 },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', currencyName: 'Ethiopian Birr', flag: '🇪🇹', phoneCode: '+251', rateToUsd: 57 }
];

export function getCountryByCode(code: string): CountryInfo {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

export function getCountryByName(name: string): CountryInfo {
  return COUNTRIES.find((c) => c.name.toLowerCase() === name.toLowerCase()) || COUNTRIES[0];
}
