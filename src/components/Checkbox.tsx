import check from '../assets/icon-check.svg';
import './Checkbox.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Figma "Checkbox" (Default / Active). */
export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        className="visually-hidden"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="checkbox__box" aria-hidden="true">
        <img src={check} width={12} height={12} alt="" />
      </span>
      <span>{label}</span>
    </label>
  );
}
