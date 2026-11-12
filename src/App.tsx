import { useCallback, useState } from 'react';
import { VerificationFlow } from './flow2/VerificationFlow';
import { FinalizeHandoff, OtpSuccess } from './flow2/VerificationResult';

type DemoScreen = 'otp-success' | 'otp-success-return' | 'verification' | 'finalize';

export default function App() {
  const [screen, setScreen] = useState<DemoScreen>('otp-success');
  const startVerification = useCallback(() => setScreen('verification'), []);

  if (screen === 'verification') {
    return (
      <VerificationFlow
        onBack={() => setScreen('otp-success-return')}
        onComplete={() => setScreen('finalize')}
      />
    );
  }

  if (screen === 'finalize') {
    return <FinalizeHandoff onRestart={() => setScreen('otp-success')} />;
  }

  return <OtpSuccess autoAdvance={screen === 'otp-success'} onContinue={startVerification} />;
}
