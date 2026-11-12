import verifyTick from '../../assets/verify-tick.svg';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import './VerifiedScreen.css';

/** Figma "OTP Verification" success state. Last screen of Flow 1; Flow 2 continues from here. */
export function VerifiedScreen() {
  return (
    <Screen progress={<ProgressBar value={20} label="Verify identity progress" />}>
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
