import { memo, type ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
};

export const Card = memo(function Card({ children, className = '', onClick, interactive = false }: CardProps) {
  const base = 'bg-surface-raised rounded-card shadow-card';
  const motion = interactive
    ? 'cursor-pointer transition-shadow duration-300 hover:shadow-cardHover btn-press'
    : '';
  return (
    <div
      onClick={onClick}
      className={`${base} ${motion} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
});

export default Card;
