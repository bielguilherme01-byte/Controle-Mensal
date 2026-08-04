import { createContext, useContext } from 'react';

export type ScreenKey = 'budget';

export type NavigationContextValue = {
  push: (screen: ScreenKey) => void;
  pop: () => void;
};

export const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation deve ser usado dentro de NavigationContext.Provider');
  }
  return ctx;
}
