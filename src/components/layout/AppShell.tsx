import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

/**
 * Centers the app in a phone-sized column on large screens, fills the screen
 * on mobile. Background mimics an iOS home screen behind the app window.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-surface-subtle">
      <div className="relative flex w-full max-w-app flex-col overflow-hidden bg-white shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default AppShell;
