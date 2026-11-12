import { useEffect, useId } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { NavigateOptions } from '../hooks/useScreenHistory';
import idPerson from './assets/id-person.svg';
import promoIcon from './assets/promo.svg';
import selfieIcon from './assets/selfie.svg';
import tipCheck from './assets/tip-check.svg';
import { CapturePreview, captureTitles } from './CapturePreview';
import type { CaptureSubject } from './CapturePreview';
import { FlowAction, VerificationLayout } from './VerificationLayout';
import { VerificationResult } from './VerificationResult';

/** Flow 2 steps in prototype order. Each id is also the URL hash, e.g. `#promo`. */
export const VERIFICATION_STEPS = [
  'scan-id',
  'promo',
  'front-scan',
  'front-review',
  'back-scan',
  'back-review',
  'selfie-intro',
  'selfie-scan',
  'selfie-review',
  'documents-verified',
] as const;

export type VerificationStep = (typeof VERIFICATION_STEPS)[number];

/** How long a simulated scan runs before the review step. */
const SCAN_DURATION_MS = 1400;

type CaptureStep = {
  subject: CaptureSubject;
  next: VerificationStep;
  retake?: VerificationStep;
};

const captures: Partial<Record<VerificationStep, CaptureStep>> = {
  'front-scan': { subject: 'front', next: 'front-review' },
  'front-review': { subject: 'front', next: 'back-scan', retake: 'front-scan' },
  'back-scan': { subject: 'back', next: 'back-review' },
  'back-review': { subject: 'back', next: 'selfie-intro', retake: 'back-scan' },
  'selfie-scan': { subject: 'selfie', next: 'selfie-review' },
  'selfie-review': { subject: 'selfie', next: 'documents-verified', retake: 'selfie-scan' },
};

/**
 * Where each Flow 2 header back button goes. Scan steps swap themselves for their review step
 * in history, so going back skips them. `scan-id` goes back to Flow 1 and is set by the app.
 */
export const VERIFICATION_BACK_TARGETS: Partial<Record<VerificationStep, VerificationStep>> = {
  promo: 'scan-id',
  'front-scan': 'promo',
  'front-review': 'promo',
  'back-scan': 'front-review',
  'back-review': 'front-review',
  'selfie-intro': 'back-review',
  'selfie-scan': 'selfie-intro',
  'selfie-review': 'selfie-intro',
};

const idTips = ['Ensure good lighting', 'Avoid shadows and glare', 'Keep all edges visible'];
const selfieTips = [
  'Look directly at the camera',
  'Remove glasses and face coverings',
  'Ensure good lighting',
  'Keep a neutral expression',
];

function IdIllustrations() {
  return (
    <div className="id-illustrations" aria-hidden="true">
      {(['front', 'back'] as const).map((side) => (
        <div key={side} className={`id-illustration id-illustration--${side}`}>
          <div className="id-illustration__labels">
            <strong>ES ID</strong>
            <span>{side}</span>
          </div>
          <div className="id-illustration__details">
            {side === 'front' && (
              <span className="id-illustration__portrait"><img src={idPerson} alt="" /></span>
            )}
            <span className="id-illustration__lines"><span /><span /></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function InstructionCard({ title, illustration, description, tips }: {
  title: string;
  illustration: ReactNode;
  description: string;
  tips: string[];
}) {
  return (
    <section className="flow-card">
      <h2>{title}</h2>
      {illustration}
      <p className="flow-card__description">{description}</p>
      <ul className="flow-tips">
        {tips.map((tip) => <li key={tip}><img src={tipCheck} alt="" />{tip}</li>)}
      </ul>
    </section>
  );
}

type VerificationFlowProps = {
  step: VerificationStep;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onNavigate: (step: VerificationStep, options?: NavigateOptions) => void;
  onBack: () => void;
  /** Header menu "Restart verification": back to Scan EID with the promo code cleared. */
  onRestart: () => void;
  /** Continue on the documents-verified summary. */
  onComplete: () => void;
};

export function VerificationFlow({
  step,
  promoCode,
  onPromoCodeChange,
  onNavigate,
  onBack,
  onRestart,
  onComplete,
}: VerificationFlowProps) {
  const promoFormId = useId();
  const capture = captures[step];

  useEffect(() => {
    if (!capture || capture.retake) return;

    const timer = window.setTimeout(() => onNavigate(capture.next, { replace: true }), SCAN_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [capture, onNavigate]);

  function applyPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoCode.trim();
    if (!code) return;

    onPromoCodeChange(code);
    onNavigate('front-scan');
  }

  function skipPromo() {
    onPromoCodeChange('');
    onNavigate('front-scan');
  }

  const header = { onBack, onRestart };

  if (step === 'documents-verified') {
    return <VerificationResult onContinue={onComplete} />;
  }

  if (capture) {
    const { subject, next, retake } = capture;
    const isSelfie = subject === 'selfie';

    return (
      <VerificationLayout
        title={captureTitles[subject]}
        appearance="dark"
        progress={isSelfie ? 'selfie' : 'id'}
        header={{ ...header, onRetake: retake ? () => onNavigate(retake, { replace: true }) : undefined }}
        contentClassName="flow-content--capture"
        actions={retake && (
          <FlowAction variant="inverse" onClick={() => onNavigate(next)}>
            {isSelfie ? 'Verify' : 'Continue'}
          </FlowAction>
        )}
      >
        <CapturePreview subject={subject} captured={Boolean(retake)} />
      </VerificationLayout>
    );
  }

  if (step === 'promo') {
    return (
      <VerificationLayout
        title="Promo Code"
        progress="id"
        header={header}
        contentClassName="flow-content--card"
        actions={(
          <>
            <FlowAction type="submit" form={promoFormId} disabled={!promoCode.trim()}>Apply</FlowAction>
            <FlowAction variant="link" onClick={skipPromo}>Skip for now</FlowAction>
          </>
        )}
      >
        <form className="flow-card" id={promoFormId} onSubmit={applyPromo}>
          <div className="flow-illustration"><img src={promoIcon} alt="" /></div>
          <div>
            <h2>Have a Promo Code?</h2>
            <p className="flow-card__promo-description">Enter your promo code to unlock exclusive benefits</p>
          </div>
          <label className="flow-visually-hidden" htmlFor={`${promoFormId}-code`}>Promo code</label>
          <input
            className="flow-promo-input"
            id={`${promoFormId}-code`}
            name="promoCode"
            value={promoCode}
            onChange={(event) => onPromoCodeChange(event.target.value)}
            placeholder="Enter promo code"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </VerificationLayout>
    );
  }

  const selfie = step === 'selfie-intro';

  return (
    <VerificationLayout
      title={selfie ? 'Take a Selfie' : 'Scan EID'}
      progress={selfie ? 'selfie' : 'id'}
      header={header}
      contentClassName="flow-content--card"
      actions={<FlowAction onClick={() => onNavigate(selfie ? 'selfie-scan' : 'promo')}>Verify</FlowAction>}
    >
      <InstructionCard
        title={selfie ? 'Selfie Verification' : 'Scan your ID'}
        illustration={selfie
          ? <div className="flow-illustration"><img src={selfieIcon} alt="" /></div>
          : <IdIllustrations />}
        description={selfie
          ? "We need to verify that you're the person on the ID."
          : "We'll need photos of both the front and back of your Es ID."}
        tips={selfie ? selfieTips : idTips}
      />
    </VerificationLayout>
  );
}
