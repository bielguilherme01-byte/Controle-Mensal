import { memo } from 'react';
import { TABS, type TabKey } from './tabs';

type BottomNavProps = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export const BottomNav = memo(function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="absolute inset-x-0 bottom-0 z-20 border-t border-black/[0.06] bg-white/85 backdrop-blur-xl"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="mx-auto flex max-w-app items-stretch justify-between px-2 pt-2 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === active;
          return (
            <li key={tab.key} className="flex-1">
              <button
                onClick={() => onChange(tab.key)}
                aria-current={isActive ? 'page' : undefined}
                className="group flex w-full flex-col items-center gap-1 py-1.5 btn-press"
              >
                <span
                  className={[
                    'flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-brand-600 text-white scale-100'
                      : 'text-ink-tertiary group-hover:text-ink-secondary',
                  ].join(' ')}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={isActive ? 'animate-pop' : ''}
                  />
                </span>
                <span
                  className={[
                    'text-[11px] font-medium tracking-tight transition-colors duration-200',
                    isActive ? 'text-brand-700' : 'text-ink-tertiary',
                  ].join(' ')}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export default BottomNav;
