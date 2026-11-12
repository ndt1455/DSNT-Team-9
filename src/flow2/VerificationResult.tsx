import { useEffect } from 'react';
import otpCheck from './assets/otp-check.svg';
import stepCheck from './assets/step-check.svg';
import stepCurrent from './assets/step-current.svg';
import stepIdentity from './assets/step-identity.svg';
import stepOffers from './assets/step-offers.svg';
import stepProfile from './assets/step-profile.svg';
import { FlowAction, VerificationLayout } from './VerificationLayout';

const progress = [
  {
    title: 'Set up profile',
    marker: stepProfile,
    completed: true,
    tasks: ['Input Mobile Number & Email', 'Bureau Consent & T&C', 'Marketing and PIA Consent'],
  },
  {
    title: 'Verify identity',
    marker: stepIdentity,
    completed: true,
    tasks: ['OTP Verification', 'Scan ID', 'Take Selfie'],
  },
  {
    title: 'Finalize & Offers',
    marker: stepCurrent,
    completed: false,
    tasks: ['Additional Information', 'Offer Listing', 'Bank request info'],
  },
];

function AccerBrand() {
  return <p className="flow-brand"><span aria-hidden="true" />Accer</p>;
}

export function OtpSuccess({ autoAdvance, onContinue }: {
  autoAdvance: boolean;
  onContinue: () => void;
}) {
  useEffect(() => {
    if (!autoAdvance) return;

    const timer = window.setTimeout(onContinue, 2000);
    return () => window.clearTimeout(timer);
  }, [autoAdvance, onContinue]);

  return (
    <VerificationLayout
      title="Verified Successfully"
      progress="otp"
      contentClassName="flow-content--otp"
      actions={!autoAdvance && <FlowAction onClick={onContinue}>Continue</FlowAction>}
    >
      <span className="flow-otp-check"><img src={otpCheck} alt="" /></span>
      <div>
        <h1>Verified Successfully</h1>
        <p>Phone number verified! Now, let's scan your ID. Please have it ready.</p>
      </div>
    </VerificationLayout>
  );
}

export function VerificationResult({ onContinue }: { onContinue: () => void }) {
  const title = 'Great! Your documents have been successfully verified.';

  return (
    <VerificationLayout
      title={title}
      appearance="summary"
      contentClassName="flow-content--summary"
      actions={<FlowAction onClick={onContinue}>Continue</FlowAction>}
    >
      <div className="flow-summary-header">
        <AccerBrand />
        <h1>{title}</h1>
      </div>
      <ol className="flow-steps" aria-label="Application progress">
        {progress.map(({ title, marker, completed, tasks }) => (
          <li key={title} className="flow-step" aria-current={completed ? undefined : 'step'}>
            <div className="flow-step__heading">
              <span className="flow-step__marker">
                <img src={marker} alt="" />
                <img src={completed ? stepCheck : stepOffers} alt={completed ? 'Completed' : ''} />
              </span>
              <h2>{title}</h2>
            </div>
            <ul className="flow-step__tasks">
              {tasks.map((task) => <li key={task}>{task}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </VerificationLayout>
  );
}

export function FinalizeHandoff({ onRestart }: { onRestart: () => void }) {
  return (
    <VerificationLayout
      title="Finalize & Offers"
      appearance="summary"
      contentClassName="flow-content--summary"
      actions={<FlowAction onClick={onRestart}>Restart demo</FlowAction>}
    >
      <div className="flow-summary-header">
        <AccerBrand />
        <h1>Finalize &amp; Offers</h1>
        <p>Your identity has been verified.</p>
      </div>
    </VerificationLayout>
  );
}
