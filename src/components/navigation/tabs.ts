import {
  Home,
  LayoutList,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type TabKey = 'home' | 'expenses' | 'stats' | 'reminders' | 'settings';

export type TabDef = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
};

export const TABS: TabDef[] = [
  { key: 'home', label: 'Início', icon: Home },
  { key: 'expenses', label: 'Despesas', icon: LayoutList },
  { key: 'stats', label: 'Estatísticas', icon: BarChart3 },
  { key: 'reminders', label: 'Lembretes', icon: Bell },
  { key: 'settings', label: 'Configurações', icon: Settings },
];
