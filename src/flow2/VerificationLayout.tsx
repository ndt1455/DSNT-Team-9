import { useId, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import backDark from './assets/back-dark.svg';
import backLight from './assets/back-light.svg';
import moreDark from './assets/more-dark.svg';
import moreLight from './assets/more-light.svg';
import './verification.css';

type HeaderActions = {
  onBack: () => void;
  onRestart: () => void;
  onRetake?: () => void;
};

/** Fill of the shared progress bar: Scan EID steps sit at 50 %, selfie steps at 80 %. */
const PROGRESS = { id: 50, selfie: 80 } as const;

type LayoutProps = {
  title: string;
  appearance?: 'light' | 'dark' | 'summary';
  progress?: keyof typeof PROGRESS;
  header?: HeaderActions;
  contentClassName?: string;
  actions?: ReactNode;
  children: ReactNode;
};

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

/** Flow 2 screen: the shared `Screen` frame with the Verify identity header and Flow 2 backgrounds. */
export function VerificationLayout({
  title,
  appearance = 'light',
  progress,
  header,
  contentClassName,
  actions,
  children,
}: LayoutProps) {
  const dark = appearance === 'dark';

  return (
    <Screen
      className={`flow-shell flow-shell--${appearance}`}
      background="none"
      statusBarTone={dark ? 'light' : 'dark'}
      progress={progress && <ProgressBar value={PROGRESS[progress]} label="Verify identity progress" />}
      header={header && <VerificationHeader title={title} dark={dark} {...header} />}
      bodyClassName={['flow-content', contentClassName].filter(Boolean).join(' ')}
      footer={actions && <div className="flow-actions">{actions}</div>}
    >
      {children}
    </Screen>
  );
}

type ActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: 'primary' | 'inverse' | 'link';
};

export function FlowAction({ variant = 'primary', type = 'button', ...props }: ActionProps) {
  return <button className={'flow-action flow-action--' + variant} type={type} {...props} />;
}
