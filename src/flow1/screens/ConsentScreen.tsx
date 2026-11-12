import { AppHeader } from '../../components/AppHeader';
import { Checkbox } from '../../components/Checkbox';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { SwipeSlider } from '../../components/SwipeSlider';

type ConsentScreenProps = {
  bureauConsent: boolean;
  termsAccepted: boolean;
  onBureauConsentChange: (checked: boolean) => void;
  onTermsAcceptedChange: (checked: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
};

/** Figma "Bureau Consent & T&C". The slider stays disabled until both boxes are ticked. */
export function ConsentScreen({
  bureauConsent,
  termsAccepted,
  onBureauConsentChange,
  onTermsAcceptedChange,
  onBack,
  onConfirm,
}: ConsentScreenProps) {
  return (
    <Screen
      progress={<ProgressBar value={50} label="Set up profile progress" />}
      header={<AppHeader eyebrow="Set up profile" title="Bureau Consent & T&C" onBack={onBack} />}
      footer={
        <SwipeSlider label="Swipe to confirm" disabled={!bureauConsent || !termsAccepted} onConfirm={onConfirm} />
      }
    >
      <div className="panel-stack">
        <section className="panel" aria-labelledby="bureau-consent-title">
          <h2 id="bureau-consent-title" className="panel__title">
            Bureau Consent
          </h2>
          <div className="panel__note">
            <p>I authorize Appro to access my credit information from AECB for evaluating my application.</p>
          </div>
          <Checkbox label="I have read the Bureau Consent" checked={bureauConsent} onChange={onBureauConsentChange} />
        </section>

        <section className="panel" aria-labelledby="terms-title">
          <h2 id="terms-title" className="panel__title">
            Terms &amp; Conditions
          </h2>
          <div className="panel__note">
            <p>By proceeding, you agree to Appro&apos;s Terms &amp; Conditions governing the use of our products.</p>
          </div>
          <Checkbox label="I accept the Terms & Conditions" checked={termsAccepted} onChange={onTermsAcceptedChange} />
        </section>
      </div>
    </Screen>
  );
}
