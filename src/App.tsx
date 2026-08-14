import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Screen } from '@/components/layout/Screen';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TABS, type TabKey } from '@/components/navigation/tabs';
import { ExpensesProvider } from '@/lib/expensesStore';
import { NavigationContext, type ScreenKey, type NavParams } from '@/lib/navigation';
import type { CategoryKey } from '@/lib/types';
import HomeScreen from '@/screens/HomeScreen';
import { ExpensesScreen } from '@/screens/ExpensesScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { RemindersScreen } from '@/screens/RemindersScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { BudgetScreen } from '@/screens/BudgetScreen';
import { CategoryDetailScreen } from '@/screens/CategoryDetailScreen';
import { StatusDetailScreen } from '@/screens/StatusDetailScreen';

const SCREENS: Record<TabKey, ReactElement> = {
  home: <HomeScreen />,
  expenses: <ExpensesScreen />,
  stats: <StatsScreen />,
  reminders: <RemindersScreen />,
  settings: <SettingsScreen />,
};

function App() {
  const [tab, setTab] = useState<TabKey>('home');
  const [pushedScreen, setPushedScreen] = useState<ScreenKey | null>(null);
  const [navParams, setNavParams] = useState<NavParams>({});
  const [exiting, setExiting] = useState(false);
  const [settled, setSettled] = useState(false);

  const push = useCallback((screen: ScreenKey, params: NavParams = {}) => {
    setExiting(false);
    setNavParams(params);
    setPushedScreen(screen);
  }, []);

  const pop = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (pushedScreen && !exiting) {
      setSettled(false);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSettled(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    setSettled(false);
  }, [pushedScreen, exiting]);

  const handleTransitionEnd = useCallback(() => {
    if (exiting) {
      setPushedScreen(null);
      setExiting(false);
      setNavParams({});
    }
  }, [exiting]);

  const navValue = useMemo(() => ({ push, pop }), [push, pop]);

  const pushedContent = useMemo(() => {
    if (!pushedScreen) return null;
    if (pushedScreen === 'budget') return <BudgetScreen />;
    if (pushedScreen === 'category-detail' && navParams.categoryKey) {
      return <CategoryDetailScreen categoryKey={navParams.categoryKey} />;
    }
    if (pushedScreen === 'status-detail' && navParams.statusKey) {
      return <StatusDetailScreen statusKey={navParams.statusKey} />;
    }
    return null;
  }, [pushedScreen, navParams]);

  return (
    <ExpensesProvider>
      <NavigationContext.Provider value={navValue}>
        <AppShell>
          <Screen>
            {TABS.map(({ key }) => (
              <div key={key} className={key === tab ? '' : 'hidden'}>
                {SCREENS[key]}
              </div>
            ))}
          </Screen>
          <BottomNav active={tab} onChange={setTab} />

          {pushedScreen && pushedContent && (
            <div
              onTransitionEnd={handleTransitionEnd}
              className="absolute inset-0 z-[70] overflow-hidden bg-white shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.18)]"
              style={{
                transform: exiting || !settled ? 'translateX(100%)' : 'translateX(0)',
                transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {pushedContent}
            </div>
          )}
        </AppShell>
      </NavigationContext.Provider>
    </ExpensesProvider>
  );
}

export default App;
