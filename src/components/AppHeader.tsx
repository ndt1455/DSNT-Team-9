import arrowLeft from '../assets/icon-arrow-left.svg';
import more from '../assets/icon-more.svg';
import './AppHeader.css';

type AppHeaderProps = {
  /** Small line above the title, e.g. the current step. */
  eyebrow: string;
  title: string;
  onBack: () => void;
};

/** Figma "Header": back button, two-line title and the overflow icon. */
export function AppHeader({ eyebrow, title, onBack }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button type="button" className="icon-button" onClick={onBack} aria-label="Back">
        <img src={arrowLeft} width={24} height={24} alt="" />
      </button>
      <div className="app-header__titles">
        <p className="app-header__eyebrow">{eyebrow}</p>
        <h1 className="app-header__title">{title}</h1>
      </div>
      {/* The overflow menu has no design yet, so it stays decorative. */}
      <span className="icon-button icon-button--static" aria-hidden="true">
        <img src={more} width={24} height={24} alt="" />
      </span>
    </header>
  );
}
