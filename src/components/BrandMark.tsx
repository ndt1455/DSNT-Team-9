import './BrandMark.css';

/** Accer logo: gradient tile and word mark. */
export function BrandMark() {
  return (
    <div className="brand-mark">
      <span className="brand-mark__tile" aria-hidden="true" />
      <span className="brand-mark__name">Accer</span>
    </div>
  );
}
