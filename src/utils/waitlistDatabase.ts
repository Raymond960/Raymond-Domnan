import { LeadMagnetSubscriber } from '../types';

export interface WaitlistSubmissionResult {
  email: string;
  promo_code: string;
  discount: number;
  status: 'VIP Waitlist' | 'Regular Waitlist';
  entry: LeadMagnetSubscriber;
}

/**
 * Inserts a new waitlist submission into the database following the exact business logic:
 *
 * if promo_code.upper() == "ARIMO50":
 *     discount = 50  # 50% off
 *     status = "VIP Waitlist"
 * else:
 *     discount = 0
 *     status = "Regular Waitlist"
 *
 * DB.insert(email=email, promo_code=promo_code, discount=discount, status=status)
 */
export function insertWaitlistToDatabase(
  email: string,
  promo_code: string = 'ARIMO50',
  extra: {
    name?: string;
    phone?: string;
    country?: string;
  } = {}
): WaitlistSubmissionResult {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPromoCode = (promo_code || '').trim().toUpperCase();

  let discount = 0;
  let status: 'VIP Waitlist' | 'Regular Waitlist' = 'Regular Waitlist';

  if (normalizedPromoCode === 'ARIMO50') {
    discount = 50; // 50% off
    status = 'VIP Waitlist';
  } else {
    discount = 0;
    status = 'Regular Waitlist';
  }

  const newEntry: LeadMagnetSubscriber = {
    id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: extra.name?.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    phone: extra.phone?.trim() || '+234',
    country: extra.country || 'Nigeria',
    promo_code: normalizedPromoCode,
    discount,
    status,
    subscribedAt: new Date().toISOString(),
    downloaded: true
  };

  // DB.insert -> Persist into local storage database
  try {
    const existing: LeadMagnetSubscriber[] = JSON.parse(localStorage.getItem('arimo_subscribers') || '[]');
    // Filter out duplicates and prepend newest
    const updated = [newEntry, ...existing.filter((item) => item.email.toLowerCase() !== normalizedEmail)];
    localStorage.setItem('arimo_subscribers', JSON.stringify(updated));

    if (discount === 50) {
      localStorage.setItem('arimo_waitlist_joined', 'true');
      localStorage.setItem('arimo_active_coupon', 'ARIMO50');
    }
  } catch (err) {
    console.error('Failed to insert into client-side database:', err);
  }

  // DB.insert -> Also send to server API endpoint
  try {
    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        promo_code: normalizedPromoCode,
        name: newEntry.name,
        phone: newEntry.phone,
        country: newEntry.country
      })
    }).catch(() => {
      // Ignore network errors in preview mode
    });
  } catch {
    // Ignore
  }

  return {
    email: normalizedEmail,
    promo_code: normalizedPromoCode,
    discount,
    status,
    entry: newEntry
  };
}
