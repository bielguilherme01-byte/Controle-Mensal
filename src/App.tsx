import { useState, type ReactElement } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Screen } from '@/components/layout/Screen';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TABS, type TabKey } from '@/components/navigation/tabs';
import { ExpensesProvider } from '@/lib/expensesStore';
import HomeScreen from '@/screens/HomeScreen';
import { ExpensesScreen } from '@/screens/ExpensesScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { RemindersScreen } from '@/screens/RemindersScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

/**
 * Stable element references — created once at module load, never re-created.
 * When App re-renders on tab change, React sees the same element references and
 * skips re-rendering these subtrees. All screens stay mounted; inactive ones are
 * hidden via CSS. This preserves every screen's local state and the shared
 * expenses context across tab switches with zero unnecessary re-renders.
 */
const SCREENS: Record<TabKey, ReactElement> = {
  home: <HomeScreen />,
  expenses: <ExpensesScreen />,
  stats: <StatsScreen />,
  reminders: <RemindersScreen />,
  settings: <SettingsScreen />,
};

function App() {
  const [tab, setTab] = useState<TabKey>('home');

  return (
    <ExpensesProvider>
      <AppShell>
        <Screen>
          {TABS.map(({ key }) => (
            <div key={key} className={key === tab ? '' : 'hidden'}>
              {SCREENS[key]}
            </div>
          ))}
        </Screen>
        <BottomNav active={tab} onChange={setTab} />
      </AppShell>
    </ExpensesProvider>
  );
}

export default App;
