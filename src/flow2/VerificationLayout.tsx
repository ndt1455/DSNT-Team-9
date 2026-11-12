import { useEffect, useId, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import backDark from './assets/back-dark.svg';
import backLight from './assets/back-light.svg';
import batteryDark from './assets/battery-dark.svg';
import batteryLight from './assets/battery-light.svg';
import cellularDark from './assets/cellular-dark.svg';
import cellularLight from './assets/cellular-light.svg';
import moreDark from './assets/more-dark.svg';
import moreLight from './assets/more-light.svg';
import wifiDark from './assets/wifi-dark.svg';
import wifiLight from './assets/wifi-light.svg';
import './verification.css';

type HeaderActions = {
  onBack: () => void;
  onRestart: () => void;
  onRetake?: () => void;
};

type LayoutProps = {
  title: string;
  appearance?: 'light' | 'dark' | 'summary';
  progress?: 'otp' | 'id' | 'selfie';
  header?: HeaderActions;
  contentClassName?: string;
  actions?: ReactNode;
  children: ReactNode;
};

function StatusBar({ dark }: { dark: boolean }) {
  return (
    <div className="flow-status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="flow-status-bar__icons">
        <img src={dark ? cellularLight : cellularDark} alt="" />
        <img src={dark ? wifiLight : wifiDark} alt="" />
        <img src={dark ? batteryLight : batteryDark} alt="" />
      </span>
    </div>
  );
}

function VerificationHeader({ title, dark, onBack, onRestart, onRetake }: HeaderActions & {
  title: string;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const trigger = useRef<HTMLButtonElement>(null);

  function closeOptions() {
    setOpen(false);
    trigger.current?.focus();
  }

  function handleEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (open && event.key === 'Escape') {
      event.stopPropagation();
      closeOptions();
    }
  }

  function selectOption(action: () => void) {
    closeOptions();
    action();
  }

  return (
    <header className="flow-header">
      <button type="button" className="flow-icon-button" onClick={onBack} aria-label="Back">
        <img src={dark ? backLight : backDark} alt="" />
      </button>
      <div className="flow-header__labels">
        <p>Verify identity</p>
        <h1>{title}</h1>
      </div>
      <div
        className="flow-options"
        onKeyDown={handleEscape}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <button
          ref={trigger}
          type="button"
          className="flow-icon-button"
          aria-label="More options"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((visible) => !visible)}
        >
          <img src={dark ? moreLight : moreDark} alt="" />
        </button>
        <div className="flow-options__panel" id={menuId} hidden={!open}>
          {onRetake && <button type="button" onClick={() => selectOption(onRetake)}>Retake photo</button>}
          <button type="button" onClick={() => selectOption(onRestart)}>Restart verification</button>
        </div>
      </div>
    </header>
  );
}

export function VerificationLayout({
  title,
  appearance = 'light',
  progress,
  header,
  contentClassName = '',
  actions,
  children,
}: LayoutProps) {
  const screen = useRef<HTMLElement>(null);
  const dark = appearance === 'dark';

  useEffect(() => {
    screen.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <main
      className={['flow-shell', 'flow-shell--' + appearance].join(' ')}
      ref={screen}
      tabIndex={-1}
      aria-label={title}
    >
      {progress && <div className={'flow-progress flow-progress--' + progress} aria-hidden="true" />}
      <StatusBar dark={dark} />
      {header && <VerificationHeader title={title} dark={dark} {...header} />}
      <div className={'flow-content ' + contentClassName}>{children}</div>
      {actions && <footer className="flow-actions">{actions}</footer>}
    </main>
  );
}

type ActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: 'primary' | 'inverse' | 'link';
};

export function FlowAction({ variant = 'primary', type = 'button', ...props }: ActionProps) {
  return <button className={'flow-action flow-action--' + variant} type={type} {...props} />;
}
