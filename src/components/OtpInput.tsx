import { useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import './OtpInput.css';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label?: string;
};

/** Figma "OTP": one box per digit with Default, Active (focus) and Selected (filled) states. */
export function OtpInput({ value, onChange, length = 6, label = 'Verification code' }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const focusBox = (index: number) => {
    const target = inputs.current[Math.min(Math.max(index, 0), length - 1)];
    target?.focus();
    target?.select();
  };

  /** Writes `text` digits starting at `index` and moves focus after the last one. */
  const fill = (index: number, text: string) => {
    const incoming = text.replace(/\D/g, '');
    if (!incoming) return;
    const next = digits.slice();
    let cursor = index;
    for (const digit of incoming) {
      if (cursor >= length) break;
      next[cursor] = digit;
      cursor += 1;
    }
    onChange(next.join('').slice(0, length));
    focusBox(cursor);
  };

  const clear = (index: number) => {
    const next = digits.slice();
    next[index] = '';
    // Keep the code contiguous so `value.length` equals the number of digits typed.
    onChange(next.join(''));
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        clear(index);
      } else if (index > 0) {
        clear(index - 1);
        focusBox(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fill(index, event.clipboardData.getData('text'));
  };

  return (
    <div className="otp" role="group" aria-label={label}>
      {digits.map((digit, index) => (
        <input
          // The boxes are a fixed set, so the index is a stable key.
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          className="otp__box"
          data-filled={digit ? true : undefined}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
          value={digit}
          onChange={(event) => {
            const typed = event.target.value;
            // The box may already hold a digit, so take what was typed last.
            fill(Math.min(index, value.length), typed.length > 1 && digit ? typed.replace(digit, '') : typed);
          }}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}
