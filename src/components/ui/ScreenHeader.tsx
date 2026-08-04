import { memo, type ReactNode } from 'react';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export const ScreenHeader = memo(function ScreenHeader({ title, subtitle, action }: ScreenHeaderProps) {
  return (
    <header className="px-5 pt-3 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-tight text-ink leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[15px] text-ink-tertiary leading-snug">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
});

export default ScreenHeader;
