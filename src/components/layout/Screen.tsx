import type { ReactNode } from 'react';

type ScreenProps = {
  children: ReactNode;
};

/**
 * Scrollable content area that sits between the status bar space and the
 * bottom navigation. Owns vertical scrolling and bottom padding so content
 * never hides behind the nav bar.
 */
export function Screen({ children }: ScreenProps) {
  return (
    <main
      className="scroll-area flex-1 overflow-y-auto overscroll-contain"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="flex min-h-full flex-col pb-28">{children}</div>
    </main>
  );
}

export default Screen;
