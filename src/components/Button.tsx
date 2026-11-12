import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'link';
};

/**
 * `solid`: Figma Button Size=Large, Type=Secondary (full-width black pill).
 * `link`: Figma Button Size=Small, Type=Text.
 */
export function Button({ variant = 'solid', type = 'button', className, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={[variant === 'solid' ? 'button' : 'link-button', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
