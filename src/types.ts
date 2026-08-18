export type NavTab = 'home' | 'shop' | 'blog' | 'faq' | 'services' | 'portfolio' | 'tips' | 'about' | 'vault' | 'giftcards' | 'admin';

export type ProductFilterCategory = 'all' | 'prompts' | 'templates' | 'kits' | 'coaching' | 'services';

export type LicenseType = 'standard' | 'commercial' | 'extended';

export type CurrencyCode = 'USD' | 'NGN' | 'GBP' | 'CAD';

export type PaymentGateway = 'paystack' | 'flutterwave' | 'stripe' | 'giftcard';

export type GiftCardBrand = 'arimo' | 'steam' | 'apple' | 'amazon' | 'googleplay';

export interface GiftCardItem {
  id: string;
  code: string;
  brand: GiftCardBrand;
  brandName: string;
  initialBalanceNaira: number;
  currentBalanceNaira: number;
  initialBalanceUsd: number;
  currentBalanceUsd: number;
  currency: CurrencyCode;
  status: 'active' | 'partially_used' | 'redeemed' | 'depleted';
  createdAt: string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  personalMessage?: string;
  theme?: 'gold' | 'dark' | 'creator' | 'vip';
  claimToken?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: 'file' | 'template' | 'coaching' | 'design_service' | 'kit';
  subcategory: string;
  priceUsd: number;
  originalPriceUsd?: number;
  priceNaira: number;
  originalPriceNaira?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  galleryImages: string[];
  isDigital: boolean;
  fileFormats?: string[];
  fileSizeBytes?: string;
  version?: string;
  includedItems: string[];
  specifications?: { label: string; value: string }[];
  downloadFileName?: string;
  featured?: boolean;
  badge?: string;
  targetAudience?: string;
  instantBenefit?: string;
  downloadContent?: string;
  serviceTiers?: {
    name: string;
    priceUsd: number;
    priceNaira: number;
    turnaround: string;
    revisions: string;
    features: string[];
  }[];
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedLicense: LicenseType;
  selectedTier?: string;
  tierPriceUsd?: number;
  tierPriceNaira?: number;
  customInstructions?: string;
}

export interface ServiceBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCountry?: string;
  serviceTitle: string;
  tier: string;
  budgetUsd: number;
  budgetNaira: number;
  currency: CurrencyCode;
  paymentGateway?: PaymentGateway;
  projectBrief: string;
  deadlineDate: string;
  status: 'brief_received' | 'in_progress' | 'proof_ready' | 'revision_requested' | 'completed';
  createdAt: string;
  proofPreviewUrl?: string;
  revisionsLeft: number;
  clientFeedback?: string;
  deliverables?: { name: string; format: string; size: string; downloadKey: string }[];
}

export interface ClientPurchase {
  orderId: string;
  purchaseDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  items: CartItem[];
  currency: CurrencyCode;
  subtotal: number;
  discount: number;
  total: number;
  subtotalNaira: number;
  totalNaira: number;
  totalUsd: number;
  paymentGateway: PaymentGateway;
  paymentMethod: string;
  paymentReference: string;
  status: 'paid' | 'pending';
  licenseKeys: {
    productId: string;
    productTitle: string;
    key: string;
    licenseType: LicenseType;
  }[];
  downloads: {
    productId: string;
    fileName: string;
    format: string;
    fileSize: string;
    version: string;
    downloadToken?: string;
    downloadExpiresAt?: number;
  }[];
}

export interface AiTipItem {
  id: string;
  title: string;
  category: 'ChatGPT' | 'Midjourney' | 'Canva' | 'Data Jobs' | 'Monetization' | 'Global Earning';
  summary: string;
  fullTip: string;
  actionablePrompt?: string;
  estimatedEarnings?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dateAdded: string;
  likes: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'AI Transformation' | 'Brand Identity' | 'Social Media' | 'UI/UX Design' | 'E-commerce AI';
  client: string;
  clientLocation: string;
  clientFlag?: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  toolsUsed: string[];
  aiPromptSnippet?: string;
  outcomeStats: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  countryCode: 'NG' | 'US' | 'GB' | 'CA' | 'GH' | 'AE';
  avatar: string;
  rating: number;
  productOrService: string;
  comment: string;
  earningsProof?: string;
}

export interface LeadMagnetSubscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  promo_code?: string;
  discount?: number;
  status?: 'VIP Waitlist' | 'Regular Waitlist' | string;
  subscribedAt: string;
  downloaded: boolean;
}

export interface UserProfile {
  email: string;
  fullName: string;
  phone?: string;
  country: string;
  countryCode: string;
  currency: CurrencyCode;
  currencySymbol: string;
  isVerified: boolean;
  twoFactorEnabled?: boolean;
  joinedWaitlist?: boolean;
  waitlistDiscountCode?: string;
  discountPercent?: number;
  createdAt: string;
}

export type SecurityActionType =
  | 'admin_login_success'
  | 'admin_login_failed'
  | 'admin_login_lockout'
  | 'admin_new_device'
  | 'admin_unauthorized_access'
  | 'user_login_success'
  | 'user_login_failed'
  | 'rate_limit_exceeded'
  | 'bot_honeypot_triggered'
  | 'vpn_proxy_blocked'
  | 'giftcard_failed_attempts'
  | 'large_payment_detected'
  | 'suspicious_activity_blocked'
  | 'ip_blocked_manually'
  | 'ip_unblocked_manually'
  | 'whatsapp_channel_joined';

export interface SecurityLogItem {
  id: string;
  timestamp: string;
  formattedTime: string;
  action: SecurityActionType;
  description: string;
  ip: string;
  location: string;
  countryCode?: string;
  device: string;
  browser: string;
  status: 'BLOCKED' | 'ALLOWED' | 'ALERT_TRIGGERED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details?: Record<string, any>;
}

export interface SecurityAlertItem {
  id: string;
  timestamp: string;
  formattedTime: string;
  type: SecurityActionType;
  message: string;
  ip: string;
  location: string;
  actionTaken: 'Blocked' | 'Flagged' | 'Locked Out' | 'Monitored';
  isEmailSent: boolean;
  isWhatsAppSent: boolean;
  senderEmail?: string;
  recipientEmail: string;
  recipientWhatsApp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface BlockedIPItem {
  ip: string;
  reason: string;
  blockedAt: string;
  blockedBy: 'SYSTEM_BOT_SHIELD' | 'RATE_LIMITER' | 'ADMIN_MANUAL' | 'HONEYPOT';
  country?: string;
}

