import { memo, type ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
};

export const EmptyState = memo(function EmptyState({ icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        'px-8 py-14 animate-fadeIn',
        className,
      ].join(' ')}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <div className="scale-[1.4]">{icon}</div>
      </div>
      <h2 className="mt-6 text-[19px] font-semibold text-ink tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-ink-tertiary">
        {description}
      </p>
    </div>
  );
});

export default EmptyState;
