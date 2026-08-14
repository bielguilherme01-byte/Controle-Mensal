import { createContext, useContext } from 'react';
import type { CategoryKey } from './types';
import type { ComputedStatus } from './stats';

export type ScreenKey = 'budget' | 'category-detail' | 'status-detail';

export type NavParams = {
  categoryKey?: CategoryKey;
  statusKey?: ComputedStatus;
};

export type NavigationContextValue = {
  push: (screen: ScreenKey, params?: NavParams) => void;
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
