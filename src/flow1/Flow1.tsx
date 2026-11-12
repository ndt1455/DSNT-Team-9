import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_DATA } from './data';
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
const SCREEN_IDS = [
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

type ScreenId = (typeof SCREEN_IDS)[number];

/** Where the header back button goes when there is no in-app history, e.g. after opening `#otp` directly. */
const BACK_TARGETS: Partial<Record<ScreenId, ScreenId>> = {
  contact: 'steps',
  consent: 'contact',
  marketing: 'consent',
  otp: 'status',
};

type HistoryState = { screen: ScreenId; depth: number };

function isScreenId(value: unknown): value is ScreenId {
  return typeof value === 'string' && (SCREEN_IDS as readonly string[]).includes(value);
}

function screenFromHash(): ScreenId | null {
  const id = window.location.hash.slice(1);
  return isScreenId(id) ? id : null;
}

function currentHistoryState(): HistoryState | null {
  const state: unknown = window.history.state;
  if (state && typeof state === 'object' && 'screen' in state && 'depth' in state && isScreenId(state.screen)) {
    return state as HistoryState;
  }
  return null;
}

export default function Flow1() {
  const [screen, setScreen] = useState<ScreenId>(() => screenFromHash() ?? 'loading');
  const [data, setData] = useState<Flow1Data>(INITIAL_DATA);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialScreen = useRef(screen);
  const hasNavigated = useRef(false);

  // Mirror screens into browser history so the browser back button and `#screen` links work.
  useEffect(() => {
    if (!currentHistoryState()) {
      window.history.replaceState({ screen: initialScreen.current, depth: 0 }, '', `#${initialScreen.current}`);
    }

    const handlePopState = () => {
      const next = currentHistoryState()?.screen ?? screenFromHash() ?? 'products';
      hasNavigated.current = true;
      setScreen(next);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Move focus to the new screen's heading so screen readers announce the change.
  useEffect(() => {
    if (!hasNavigated.current) return;
    const heading = containerRef.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [screen]);

  const navigate = useCallback((next: ScreenId, options: { replace?: boolean } = {}) => {
    const depth = currentHistoryState()?.depth ?? 0;
    const state: HistoryState = { screen: next, depth: options.replace ? depth : depth + 1 };
    if (options.replace) {
      window.history.replaceState(state, '', `#${next}`);
    } else {
      window.history.pushState(state, '', `#${next}`);
    }
    hasNavigated.current = true;
    setScreen(next);
  }, []);

  const goBack = useCallback(() => {
    const target = BACK_TARGETS[screen];
    if (!target) return;
    if ((currentHistoryState()?.depth ?? 0) > 0) {
      window.history.back();
    } else {
      navigate(target, { replace: true });
    }
  }, [navigate, screen]);

  const update = useCallback((patch: Partial<Flow1Data>) => {
    setData((current) => ({ ...current, ...patch }));
  }, []);

  const finishLoading = useCallback(() => navigate('products', { replace: true }), [navigate]);

  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen onDone={finishLoading} />;
      case 'products':
        return (
          <ProductSelectScreen
            category={data.category}
            product={data.product}
            onCategoryChange={(category) => update({ category })}
            onProductChange={(product) => update({ product })}
            onContinue={() => navigate('steps')}
          />
        );
      case 'steps':
        return <StepsIntroScreen onStart={() => navigate('contact')} />;
      case 'contact':
        return (
          <ContactScreen
            phone={data.phone}
            email={data.email}
            onPhoneChange={(phone) => update({ phone })}
            onEmailChange={(email) => update({ email })}
            onBack={goBack}
            onContinue={() => navigate('consent')}
          />
        );
      case 'consent':
        return (
          <ConsentScreen
            bureauConsent={data.bureauConsent}
            termsAccepted={data.termsAccepted}
            onBureauConsentChange={(bureauConsent) => update({ bureauConsent })}
            onTermsAcceptedChange={(termsAccepted) => update({ termsAccepted })}
            onBack={goBack}
            onConfirm={() => navigate('marketing')}
          />
        );
      case 'marketing':
        return (
          <MarketingScreen
            marketingOptIn={data.marketingOptIn}
            personalInfoAccess={data.personalInfoAccess}
            onMarketingOptInChange={(marketingOptIn) => update({ marketingOptIn })}
            onPersonalInfoAccessChange={(personalInfoAccess) => update({ personalInfoAccess })}
            onBack={goBack}
            onConfirm={() => navigate('status')}
          />
        );
      case 'status':
        return <StepStatusScreen onContinue={() => navigate('otp')} />;
      case 'otp':
        return <OtpScreen phone={data.phone} onBack={goBack} onVerified={() => navigate('verified')} />;
      case 'verified':
        return <VerifiedScreen />;
    }
  };

  return (
    <div ref={containerRef} className="flow" key={screen}>
      {renderScreen()}
    </div>
  );
}
