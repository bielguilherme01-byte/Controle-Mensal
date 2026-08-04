import type {
  CategoryKey,
  PriorityKey,
  RecurrenceKey,
} from './types';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Car,
  UtensilsCrossed,
  HeartPulse,
  Dumbbell,
  PlayCircle,
  CreditCard,
  Briefcase,
  Gamepad2,
  MoreHorizontal,
} from 'lucide-react';

export type CategoryDef = {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  tint: string;
  color: string;
};

export const CATEGORIES: CategoryDef[] = [
  { key: 'moradia', label: 'Moradia', icon: Home, tint: '#0A84FF1A', color: '#0A84FF' },
  { key: 'veiculo', label: 'Veículo', icon: Car, tint: '#5856D61A', color: '#5856D6' },
  { key: 'alimentacao', label: 'Alimentação', icon: UtensilsCrossed, tint: '#FF9F0A1A', color: '#FF9F0A' },
  { key: 'saude', label: 'Saúde', icon: HeartPulse, tint: '#FF3B301A', color: '#FF3B30' },
  { key: 'academia', label: 'Academia', icon: Dumbbell, tint: '#34C7591A', color: '#34C759' },
  { key: 'streaming', label: 'Streaming', icon: PlayCircle, tint: '#FF2D551A', color: '#FF2D55' },
  { key: 'assinaturas', label: 'Assinaturas', icon: CreditCard, tint: '#5AC8FA1A', color: '#5AC8FA' },
  { key: 'trabalho', label: 'Trabalho', icon: Briefcase, tint: '#AF52DE1A', color: '#AF52DE' },
  { key: 'lazer', label: 'Lazer', icon: Gamepad2, tint: '#FFD60A1A', color: '#FFD60A' },
  { key: 'outros', label: 'Outros', icon: MoreHorizontal, tint: '#8E8E931A', color: '#8E8E93' },
];

export const CATEGORY_MAP: Record<CategoryKey, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryKey, CategoryDef>;

export type PriorityDef = {
  key: PriorityKey;
  label: string;
  emoji: string;
  color: string;
  dotClass: string;
};

export const PRIORITIES: PriorityDef[] = [
  { key: 'essential', label: 'Essencial', emoji: '🔴', color: '#FF3B30', dotClass: 'bg-error' },
  { key: 'important', label: 'Importante', emoji: '🟡', color: '#FF9F0A', dotClass: 'bg-warning' },
  { key: 'optional', label: 'Opcional', emoji: '🔵', color: '#0A84FF', dotClass: 'bg-brand-600' },
];

export const PRIORITY_MAP: Record<PriorityKey, PriorityDef> = Object.fromEntries(
  PRIORITIES.map((p) => [p.key, p])
) as Record<PriorityKey, PriorityDef>;

export type RecurrenceDef = {
  key: RecurrenceKey;
  label: string;
};

export const RECURRENCES: RecurrenceDef[] = [
  { key: 'none', label: 'Nenhuma' },
  { key: 'monthly', label: 'Mensal' },
  { key: 'bimonthly', label: 'Bimestral' },
  { key: 'quarterly', label: 'Trimestral' },
  { key: 'semiannual', label: 'Semestral' },
  { key: 'annual', label: 'Anual' },
];

export const RECURRENCE_MAP: Record<RecurrenceKey, RecurrenceDef> = Object.fromEntries(
  RECURRENCES.map((r) => [r.key, r])
) as Record<RecurrenceKey, RecurrenceDef>;
