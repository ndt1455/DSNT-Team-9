import type { ReactNode } from 'react';
import bgDefault from '../assets/bg-gradient.svg';
import bgStatus from '../assets/bg-gradient-status.svg';
import { StatusBar } from './StatusBar';
import './Screen.css';

const BACKGROUNDS = {
  default: bgDefault,
  status: bgStatus,
} as const;

type ScreenProps = {
  children?: ReactNode;
  /** Fixed header under the status bar, e.g. `AppHeader`. */
  header?: ReactNode;
  /** Fixed bottom area, e.g. the primary button. */
  footer?: ReactNode;
  /** Progress bar pinned to the top edge. */
  progress?: ReactNode;
  background?: keyof typeof BACKGROUNDS | 'none';
  statusBarTone?: 'dark' | 'light';
  className?: string;
  bodyClassName?: string;
};

/** Shared 375 × 812 screen layout: background, status bar, header, scrollable body, bottom. */
export function Screen({
  children,
  header,
  footer,
  progress,
  background = 'default',
  statusBarTone = 'dark',
  className,
  bodyClassName,
}: ScreenProps) {
  return (
    <div className={['screen', className].filter(Boolean).join(' ')}>
      {background !== 'none' && (
        <div
          className="screen__background"
          style={{ backgroundImage: `url(${BACKGROUNDS[background]})` }}
          aria-hidden="true"
        />
      )}
      <StatusBar tone={statusBarTone} />
      {progress}
      {header}
      <div className={['screen__body', bodyClassName].filter(Boolean).join(' ')}>{children}</div>
      {footer ? <div className="screen__footer">{footer}</div> : null}
    </div>
  );
}
