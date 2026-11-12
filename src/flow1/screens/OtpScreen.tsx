import { useRef, useState } from 'react';
import shield from '../../assets/icon-shield.svg';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { OtpInput } from '../../components/OtpInput';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { COUNTRY_CODE, PHONE_PLACEHOLDER, formatPhone } from '../data';
import './OtpScreen.css';

const CODE_LENGTH = 6;

type OtpScreenProps = {
  /** National number from the contact step. Empty when the screen is opened directly. */
  phone: string;
  onBack: () => void;
  onVerified: () => void;
};

/** Figma "OTP Verification". Demo rule: any 6-digit code passes. Nothing is sent. */
export function OtpScreen({ phone, onBack, onVerified }: OtpScreenProps) {
  const [code, setCode] = useState('');
  const [resent, setResent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const complete = code.length === CODE_LENGTH;

  const resend = () => {
    setCode('');
    setResent(true);
    panelRef.current?.querySelector<HTMLInputElement>('.otp__box')?.focus();
  };

  return (
    <Screen
      progress={<ProgressBar value={20} label="Verify identity progress" />}
      header={<AppHeader eyebrow="Verify identity" title="OTP Verification" onBack={onBack} />}
      footer={
        <Button disabled={!complete} onClick={onVerified}>
          Verify
        </Button>
      }
    >
      <div className="panel-stack">
        <div ref={panelRef} className="panel otp-panel">
          <div className="otp-panel__intro">
            <span className="otp-panel__icon" aria-hidden="true">
              <img src={shield} width={30} height={30} alt="" />
            </span>
            <div>
              <h2 className="otp-panel__title">Enter verification code</h2>
              <p className="otp-panel__sent">
                Sent to{' '}
                <span className="otp-panel__phone">
                  {COUNTRY_CODE} {phone ? formatPhone(phone) : PHONE_PLACEHOLDER}
                </span>
              </p>
            </div>
          </div>

          <div className="otp-panel__code">
            <OtpInput value={code} onChange={setCode} length={CODE_LENGTH} />
            <p className="otp-panel__resend">
              Didn&apos;t get code?{' '}
              <Button variant="link" onClick={resend}>
                Resend
              </Button>
            </p>
            <p className="visually-hidden" role="status">
              {resent ? 'A new code has been sent.' : ''}
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
