import { useEffect } from 'react';
import verifyTick from '../../assets/verify-tick.svg';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import './VerifiedScreen.css';

/** The prototype shows this state for 2 s before the Flow 2 Scan EID screen. */
const AUTO_ADVANCE_MS = 2000;

type VerifiedScreenProps = {
  /** Move on to Flow 2 by itself. Off when the user came back here, so the screen shows Continue instead. */
  autoAdvance: boolean;
  onContinue: () => void;
};

/** Figma "OTP Verification" success state. Last screen of Flow 1; Flow 2 continues from here. */
export function VerifiedScreen({ autoAdvance, onContinue }: VerifiedScreenProps) {
  useEffect(() => {
    if (!autoAdvance) return;
    const timer = window.setTimeout(onContinue, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [autoAdvance, onContinue]);

  return (
    <Screen
      progress={<ProgressBar value={20} label="Verify identity progress" />}
      footer={autoAdvance ? null : <Button onClick={onContinue}>Continue</Button>}
    >
      <div className="verified">
        <span className="verified__tick" aria-hidden="true">
          <img src={verifyTick} width={184} height={184} alt="" />
        </span>
        <div className="verified__text">
          <h1 className="verified__title">Verified Successfully</h1>
          <p className="verified__message">Phone number verified! Now, let&apos;s scan your ID. Please have it ready.</p>
        </div>
      </div>
    </Screen>
  );
}
