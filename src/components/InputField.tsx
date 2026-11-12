import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import './InputField.css';

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'prefix'> & {
  id: string;
  label: ReactNode;
  value: string;
  ref?: Ref<HTMLInputElement>;
  /** Shows the Invalid state and the message under the field. */
  error?: string;
  /** Content before the input, e.g. the country code. */
  prefix?: ReactNode;
};

/** Figma "Input Field" with Default, Active (focus), Filled and Invalid states. */
export function InputField({ id, label, value, ref, error, prefix, ...inputProps }: InputFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="field" data-invalid={error ? true : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {/* Clicks on the padding or prefix also focus the input, like a native text box. */}
      <div
        className={['field__control', prefix ? 'field__control--with-prefix' : ''].join(' ').trim()}
        data-filled={value ? true : undefined}
        onClick={(event) => event.currentTarget.querySelector('input')?.focus()}
      >
        {prefix}
        <input
          ref={ref}
          id={id}
          className="field__input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
      </div>
      {error ? (
        <p id={errorId} className="field__helper">
          {error}
        </p>
      ) : null}
    </div>
  );
}
