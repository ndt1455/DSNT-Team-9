import './Toggle.css';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelledBy: string;
  describedBy?: string;
};

/** Figma "Toggle" (On / Off), exposed as a switch. */
export function Toggle({ checked, onChange, labelledBy, describedBy }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      className="toggle"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  );
}
