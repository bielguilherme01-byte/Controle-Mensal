import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

const variants: Record<string, string> = {
  primary:
    'bg-brand-600 text-white shadow-card hover:bg-brand-700 active:bg-brand-700',
  secondary:
    'bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-100',
  ghost:
    'bg-transparent text-ink-secondary hover:bg-black/[0.04] active:bg-black/[0.06]',
};

const sizes: Record<string, string> = {
  md: 'h-11 px-5 text-[15px] rounded-xl',
  lg: 'h-14 px-7 text-[17px] rounded-2xl',
};

export const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'tracking-tight btn-press transition-colors duration-200',
        'focus:outline-none focus-visible:shadow-focus',
        'disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
});

export default Button;
