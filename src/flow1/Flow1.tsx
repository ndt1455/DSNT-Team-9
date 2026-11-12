import { useCallback } from 'react';
import type { NavigateOptions } from '../hooks/useScreenHistory';
import type { Flow1Data } from './data';
import { ConsentScreen } from './screens/ConsentScreen';
import { ContactScreen } from './screens/ContactScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { MarketingScreen } from './screens/MarketingScreen';
import { OtpScreen } from './screens/OtpScreen';
import { ProductSelectScreen } from './screens/ProductSelectScreen';
import { StepStatusScreen } from './screens/StepStatusScreen';
import { StepsIntroScreen } from './screens/StepsIntroScreen';
import { VerifiedScreen } from './screens/VerifiedScreen';

/** Flow 1 screens in prototype order. Each id is also the URL hash, e.g. `#otp`. */
export const FLOW1_SCREENS = [
  'loading',
  'products',
  'steps',
  'contact',
  'consent',
  'marketing',
  'status',
  'otp',
  'verified',
] as const;

export type Flow1ScreenId = (typeof FLOW1_SCREENS)[number];

/** Where each Flow 1 header back button goes. */
export const FLOW1_BACK_TARGETS: Partial<Record<Flow1ScreenId, Flow1ScreenId>> = {
  contact: 'steps',
  consent: 'contact',
  marketing: 'consent',
  otp: 'status',
};

type Flow1Props = {
  screen: Flow1ScreenId;
  data: Flow1Data;
  onChange: (patch: Partial<Flow1Data>) => void;
  onNavigate: (next: Flow1ScreenId, options?: NavigateOptions) => void;
  onBack: () => void;
  /** False when the user came back to this screen, e.g. from Flow 2. */
  movingForward: boolean;
  /** Leaves the verified screen for Flow 2. */
  onComplete: () => void;
};

export default function Flow1({ screen, data, onChange, onNavigate, onBack, movingForward, onComplete }: Flow1Props) {
  const finishLoading = useCallback(() => onNavigate('products', { replace: true }), [onNavigate]);

  switch (screen) {
    case 'loading':
      return <LoadingScreen onDone={finishLoading} />;
    case 'products':
      return (
        <ProductSelectScreen
          category={data.category}
          product={data.product}
          onCategoryChange={(category) => onChange({ category })}
          onProductChange={(product) => onChange({ product })}
          onContinue={() => onNavigate('steps')}
        />
      );
    case 'steps':
      return <StepsIntroScreen onStart={() => onNavigate('contact')} />;
    case 'contact':
      return (
        <ContactScreen
          phone={data.phone}
          email={data.email}
          onPhoneChange={(phone) => onChange({ phone })}
          onEmailChange={(email) => onChange({ email })}
          onBack={onBack}
          onContinue={() => onNavigate('consent')}
        />
      );
    case 'consent':
      return (
        <ConsentScreen
          bureauConsent={data.bureauConsent}
          termsAccepted={data.termsAccepted}
          onBureauConsentChange={(bureauConsent) => onChange({ bureauConsent })}
          onTermsAcceptedChange={(termsAccepted) => onChange({ termsAccepted })}
          onBack={onBack}
          onConfirm={() => onNavigate('marketing')}
        />
      );
    case 'marketing':
      return (
        <MarketingScreen
          marketingOptIn={data.marketingOptIn}
          personalInfoAccess={data.personalInfoAccess}
          onMarketingOptInChange={(marketingOptIn) => onChange({ marketingOptIn })}
          onPersonalInfoAccessChange={(personalInfoAccess) => onChange({ personalInfoAccess })}
          onBack={onBack}
          onConfirm={() => onNavigate('status')}
        />
      );
    case 'status':
      return <StepStatusScreen onContinue={() => onNavigate('otp')} />;
    case 'otp':
      return <OtpScreen phone={data.phone} onBack={onBack} onVerified={() => onNavigate('verified')} />;
    case 'verified':
      return <VerifiedScreen autoAdvance={movingForward} onContinue={onComplete} />;
  }
}
