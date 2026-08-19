// Official Paystack LIVE Configuration & Integration

/**
 * Paystack LIVE Public Key
 * Configured from environment or fallback default.
 */
export const PAYSTACK_PUBLIC_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY) ||
  'pk_live_200a479bc9239f8f51f5d1c2543550d7ced237ce';

export interface PaystackTransactionOptions {
  email: string;
  amountNaira: number; // in Naira (converted automatically to Kobo for Paystack)
  customerName?: string;
  phone?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: { reference: string; trans?: string; status?: string; message?: string; [key: string]: any }) => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: any;
        callback: (response: any) => void;
        onClose?: () => void;
        [key: string]: any;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

/**
 * Dynamically ensures the official Paystack inline.js script is loaded
 */
export const ensurePaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      resolve(true);
      return;
    }

    const existing = document.querySelector('script[src*="paystack.co"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      // In case it already loaded
      setTimeout(() => resolve(!!window.PaystackPop), 1000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Launches the official Paystack LIVE Checkout Popup
 */
export const openPaystackLiveCheckout = async (options: PaystackTransactionOptions): Promise<boolean> => {
  await ensurePaystackScript();

  if (typeof window === 'undefined' || !window.PaystackPop) {
    console.warn('Paystack inline SDK not loaded.');
    return false;
  }

  const koboAmount = Math.round(options.amountNaira * 100);
  const txRef = options.reference || `pstk_live_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: options.email,
    amount: koboAmount,
    currency: 'NGN',
    ref: txRef,
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: options.customerName || 'Arimo Store Customer'
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: options.phone || ''
        }
      ],
      ...options.metadata
    },
    callback: (response: any) => {
      options.onSuccess(response);
    },
    onClose: () => {
      if (options.onCancel) {
        options.onCancel();
      }
    }
  });

  handler.openIframe();
  return true;
};
