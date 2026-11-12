import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Flow1, { FLOW1_BACK_TARGETS, FLOW1_SCREENS } from './flow1/Flow1';
import type { Flow1ScreenId } from './flow1/Flow1';
import { INITIAL_DATA } from './flow1/data';
import type { Flow1Data } from './flow1/data';
import { VERIFICATION_BACK_TARGETS, VERIFICATION_STEPS, VerificationFlow } from './flow2/VerificationFlow';
import { FinalizeHandoff } from './flow2/VerificationResult';
import { useScreenHistory } from './hooks/useScreenHistory';

/** Every screen of the demo journey in order: Flow 1, Flow 2, then the Finalize & Offers handoff. */
const SCREENS = [...FLOW1_SCREENS, ...VERIFICATION_STEPS, 'finalize'] as const;

type ScreenId = (typeof SCREENS)[number];

const BACK_TARGETS: Partial<Record<ScreenId, ScreenId>> = {
  ...FLOW1_BACK_TARGETS,
  ...VERIFICATION_BACK_TARGETS,
  // Flow 2 starts right after the OTP success screen.
  'scan-id': 'verified',
};

function isFlow1Screen(screen: ScreenId): screen is Flow1ScreenId {
  return (FLOW1_SCREENS as readonly string[]).includes(screen);
}

export default function App() {
  const { screen, direction, navigate, goBack, rewindTo } = useScreenHistory(SCREENS, {
    initial: 'loading',
    backTargets: BACK_TARGETS,
  });
  const [data, setData] = useState<Flow1Data>(INITIAL_DATA);
  const [promoCode, setPromoCode] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedScreen = useRef(screen);

  // Move focus to the new screen's heading so screen readers announce the change.
  useEffect(() => {
    if (focusedScreen.current === screen) return;
    focusedScreen.current = screen;
    const heading = containerRef.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [screen]);

  const updateData = useCallback((patch: Partial<Flow1Data>) => {
    setData((current) => ({ ...current, ...patch }));
  }, []);

  const startVerification = useCallback(() => navigate('scan-id'), [navigate]);

  const restartVerification = useCallback(() => {
    setPromoCode('');
    rewindTo('scan-id');
  }, [rewindTo]);

  const restartDemo = useCallback(() => {
    setData(INITIAL_DATA);
    setPromoCode('');
    rewindTo('products');
  }, [rewindTo]);

  let content: ReactNode;
  if (isFlow1Screen(screen)) {
    content = (
      <Flow1
        screen={screen}
        data={data}
        onChange={updateData}
        onNavigate={navigate}
        onBack={goBack}
        movingForward={direction === 'forward'}
        onComplete={startVerification}
      />
    );
  } else if (screen === 'finalize') {
    content = <FinalizeHandoff onRestart={restartDemo} />;
  } else {
    content = (
      <VerificationFlow
        step={screen}
        promoCode={promoCode}
        onPromoCodeChange={setPromoCode}
        onNavigate={navigate}
        onBack={goBack}
        onRestart={restartVerification}
        onComplete={() => navigate('finalize')}
      />
    );
  }

  return (
    <main className="device">
      <div ref={containerRef} className="flow" key={screen}>
        {content}
      </div>
    </main>
  );
}
