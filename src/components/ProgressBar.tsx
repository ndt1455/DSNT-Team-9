import fill20 from '../assets/progress-fill-20.png';
import fill50 from '../assets/progress-fill-50.png';
import './ProgressBar.css';

/** Figma "Progress bar" variants used in Flow 1, with the fill width each variant draws on a 375 px frame. */
const VARIANTS = {
  20: { width: 95 / 375, image: fill20 },
  50: { width: 188 / 375, image: fill50 },
} as const;

type ProgressBarProps = {
  value: keyof typeof VARIANTS;
  label: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const variant = VARIANTS[value];

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div
        className="progress-bar__fill"
        style={{ inlineSize: `${variant.width * 100}%`, backgroundImage: `url(${variant.image})` }}
      />
    </div>
  );
}
