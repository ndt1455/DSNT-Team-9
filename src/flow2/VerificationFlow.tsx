import { useEffect, useId, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import idPerson from './assets/id-person.svg';
import promoIcon from './assets/promo.svg';
import selfieIcon from './assets/selfie.svg';
import tipCheck from './assets/tip-check.svg';
import { CapturePreview, captureTitles } from './CapturePreview';
import type { CaptureSubject } from './CapturePreview';
import { FlowAction, VerificationLayout } from './VerificationLayout';
import { VerificationResult } from './VerificationResult';

type Step =
  | 'scan-id'
  | 'promo'
  | 'front-scan'
  | 'front-review'
  | 'back-scan'
  | 'back-review'
  | 'selfie-intro'
  | 'selfie-scan'
  | 'selfie-review'
  | 'verified';

type CaptureStep = {
  subject: CaptureSubject;
  next: Step;
  retake?: Step;
};

const captures: Partial<Record<Step, CaptureStep>> = {
  'front-scan': { subject: 'front', next: 'front-review' },
  'front-review': { subject: 'front', next: 'back-scan', retake: 'front-scan' },
  'back-scan': { subject: 'back', next: 'back-review' },
  'back-review': { subject: 'back', next: 'selfie-intro', retake: 'back-scan' },
  'selfie-scan': { subject: 'selfie', next: 'selfie-review' },
  'selfie-review': { subject: 'selfie', next: 'verified', retake: 'selfie-scan' },
};

const previousStep: Partial<Record<Step, Step>> = {
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
  onBack: () => void;
  onComplete: (promoCode: string | null) => void;
};

export function VerificationFlow({ onBack, onComplete }: VerificationFlowProps) {
  const [step, setStep] = useState<Step>('scan-id');
  const [promoCode, setPromoCode] = useState('');
  const promoFormId = useId();
  const capture = captures[step];

  useEffect(() => {
    if (!capture || capture.retake) return;

    const timer = window.setTimeout(() => {
      setStep((current) => current === step ? capture.next : current);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [capture, step]);

  function goBack() {
    const previous = previousStep[step];
    if (previous) setStep(previous);
    else onBack();
  }

  function restart() {
    setPromoCode('');
    setStep('scan-id');
  }

  function applyPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoCode.trim();
    if (!code) return;

    setPromoCode(code);
    setStep('front-scan');
  }

  function skipPromo() {
    setPromoCode('');
    setStep('front-scan');
  }

  const header = { onBack: goBack, onRestart: restart };

  if (step === 'verified') {
    return <VerificationResult onContinue={() => onComplete(promoCode || null)} />;
  }

  if (capture) {
    const { subject, next, retake } = capture;
    const isSelfie = subject === 'selfie';

    return (
      <VerificationLayout
        key={step}
        title={captureTitles[subject]}
        appearance="dark"
        progress={isSelfie ? 'selfie' : 'id'}
        header={{ ...header, onRetake: retake ? () => setStep(retake) : undefined }}
        contentClassName="flow-content--capture"
        actions={retake && (
          <FlowAction variant="inverse" onClick={() => setStep(next)}>
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
        key={step}
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
            onChange={(event) => setPromoCode(event.target.value)}
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
      key={step}
      title={selfie ? 'Take a Selfie' : 'Scan EID'}
      progress={selfie ? 'selfie' : 'id'}
      header={header}
      contentClassName="flow-content--card"
      actions={<FlowAction onClick={() => setStep(selfie ? 'selfie-scan' : 'promo')}>Verify</FlowAction>}
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
