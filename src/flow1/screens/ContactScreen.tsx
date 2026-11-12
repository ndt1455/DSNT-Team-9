import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import chevronDown from '../../assets/icon-chevron-down.svg';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import {
  COUNTRY_CODE,
  PHONE_PLACEHOLDER,
  formatPhone,
  isValidEmail,
  isValidPhone,
  normalizePhone,
} from '../data';

const FORM_ID = 'contact-form';

type ContactScreenProps = {
  phone: string;
  email: string;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

type Errors = { phone?: string; email?: string };

function validate(phone: string, email: string): Errors {
  return {
    phone: isValidPhone(phone) ? undefined : `Enter a UAE mobile number in the format ${PHONE_PLACEHOLDER}.`,
    email: isValidEmail(email) ? undefined : 'Enter an email address like you@example.com.',
  };
}

/** Figma "ContactScreen": mobile number and email. Fields are checked when the user taps Continue. */
export function ContactScreen({ phone, email, onPhoneChange, onEmailChange, onBack, onContinue }: ContactScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const errors: Errors = submitted ? validate(phone, email) : {};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate(phone, email);
    if (result.phone) {
      setSubmitted(true);
      phoneRef.current?.focus();
    } else if (result.email) {
      setSubmitted(true);
      emailRef.current?.focus();
    } else {
      onContinue();
    }
  };

  return (
    <Screen
      progress={<ProgressBar value={20} label="Set up profile progress" />}
      header={<AppHeader eyebrow="Set up profile" title="Contact Details" onBack={onBack} />}
      footer={
        <Button type="submit" form={FORM_ID}>
          Continue
        </Button>
      }
    >
      <form id={FORM_ID} className="panel-stack" noValidate onSubmit={handleSubmit}>
        <div className="panel panel--form">
          <InputField
            ref={phoneRef}
            id="contact-phone"
            label={
              <>
                Mobile Number<span className="visually-hidden"> (country code {COUNTRY_CODE})</span>
              </>
            }
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={PHONE_PLACEHOLDER}
            value={formatPhone(phone)}
            onChange={(event) => onPhoneChange(normalizePhone(event.target.value))}
            error={errors.phone}
            prefix={
              <span className="field__prefix" aria-hidden="true">
                {COUNTRY_CODE}
                <img src={chevronDown} width={16} height={16} alt="" />
              </span>
            }
          />
          <InputField
            ref={emailRef}
            id="contact-email"
            label="Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            error={errors.email}
          />
        </div>
      </form>
    </Screen>
  );
}
