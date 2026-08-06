import { useMemo } from 'react';
import type { Expense, CategoryKey } from './types';
import { CATEGORIES } from './constants';

export type CategoryBreakdownItem = {
  key: CategoryKey;
  label: string;
  color: string;
  amount: number;
  percentage: number;
};

export type MonthStats = {
  totalExpenses: number;
  totalSpent: number;
  breakdown: CategoryBreakdownItem[];
  topCategory: CategoryBreakdownItem | null;
  bottomCategory: CategoryBreakdownItem | null;
};

/**
 * Filters expenses for the given year/month.
 *
 * Currently all expenses are treated as current-month obligations (the data
 * model uses `dueDay` + `recurrence`, not explicit timestamps). When expenses
 * gain date fields, implement the actual filtering here — every consumer below
 * already passes year/month through, so no call-site changes will be needed.
 */
export function filterExpensesByMonth(
  expenses: Expense[],
  _year: number,
  _month: number
): Expense[] {
  return expenses;
}

export function computeMonthStats(
  expenses: Expense[],
  year: number,
  month: number
): MonthStats {
  const filtered = filterExpensesByMonth(expenses, year, month);
  const totalSpent = filtered.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = new Map<CategoryKey, number>();
  for (const e of filtered) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  }

  const breakdown: CategoryBreakdownItem[] = CATEGORIES.map((cat) => {
    const amount = byCategory.get(cat.key) ?? 0;
    return {
      key: cat.key,
      label: cat.label,
      color: cat.color,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    };
  })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    totalExpenses: filtered.length,
    totalSpent,
    breakdown,
    topCategory: breakdown.length > 0 ? breakdown[0] : null,
    bottomCategory: breakdown.length > 0 ? breakdown[breakdown.length - 1] : null,
  };
}

export function useMonthStats(
  expenses: Expense[],
  year: number,
  month: number
): MonthStats {
  return useMemo(
    () => computeMonthStats(expenses, year, month),
    [expenses, year, month]
  );
}
