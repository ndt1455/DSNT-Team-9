export type CategoryId = 'all' | 'conventional' | 'domestic';
export type ProductId = 'credit-card' | 'personal-finance' | 'home-finance' | 'auto-finance';

/** Everything the user enters in Flow 1. Demo data only, kept in memory. */
export type Flow1Data = {
  category: CategoryId;
  product: ProductId | null;
  /** UAE mobile number without the country code, digits only. */
  phone: string;
  email: string;
  bureauConsent: boolean;
  termsAccepted: boolean;
  marketingOptIn: boolean;
  personalInfoAccess: boolean;
};

export const INITIAL_DATA: Flow1Data = {
  category: 'domestic',
  product: null,
  phone: '',
  email: '',
  bureauConsent: false,
  termsAccepted: false,
  marketingOptIn: false,
  personalInfoAccess: false,
};

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'conventional', label: 'Conventional' },
  { id: 'domestic', label: 'Domestic' },
];

export const PRODUCTS: { id: ProductId; eyebrow: string; name: string }[] = [
  { id: 'credit-card', eyebrow: 'Premium rewards', name: 'Credit Card' },
  { id: 'personal-finance', eyebrow: 'Flexible plans', name: 'Personal Finance' },
  { id: 'home-finance', eyebrow: 'Flexible plans', name: 'Home Finance' },
  { id: 'auto-finance', eyebrow: 'Flexible plans', name: 'Auto Finance' },
];

/** The three journey steps shown on the intro and status screens. */
export const JOURNEY_STEPS = [
  {
    id: 'setup',
    title: 'Set up profile',
    items: ['Input Mobile Number & Email', 'Bureau Consent & T&C', 'Marketing and PIA Consent'],
  },
  {
    id: 'identity',
    title: 'Verify identity',
    items: ['OTP Verification', 'Scan EID', 'Take Selfie'],
  },
  {
    id: 'offers',
    title: 'Finalize & Offers',
    items: ['Additional Information', 'Offer Listing', 'Bank request info'],
  },
] as const;

export const COUNTRY_CODE = '+971';
export const PHONE_PLACEHOLDER = '5X XXX XXXX';
const PHONE_LENGTH = 9;

/** Keeps up to 9 national digits from user input and drops a leading trunk 0. */
export function normalizePhone(input: string) {
  return input.replace(/\D/g, '').replace(/^0/, '').slice(0, PHONE_LENGTH);
}

/** `501234567` → `50 123 4567`, matching the `5X XXX XXXX` placeholder. */
export function formatPhone(digits: string) {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, PHONE_LENGTH)].filter(Boolean).join(' ');
}

export function isValidPhone(digits: string) {
  return /^5\d{8}$/.test(digits);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
