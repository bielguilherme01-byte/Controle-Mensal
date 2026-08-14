import { useMemo } from 'react';
import type { Expense, CategoryKey, StatusKey } from './types';
import { CATEGORIES } from './constants';

export type ComputedStatus = 'paid' | 'pending' | 'overdue';

/**
 * Computes the display status of an expense relative to today's date.
 *
 * - `paid` when the expense is marked as paid.
 * - `overdue` when unpaid and the due day has passed.
 * - `pending` otherwise.
 *
 * This is the single source of truth for status derivation — the Home summary
 * card and the status detail screens both use it, so counts always match.
 */
export function computeExpenseStatus(expense: Expense): ComputedStatus {
  if (expense.status === 'paid') return 'paid';
  const today = new Date().getDate();
  return expense.dueDay < today ? 'overdue' : 'pending';
}

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
/**
 * Filters expenses for the given year/month. Currently all expenses are treated
 * as current-month obligations. When expenses gain date fields, implement the
 * actual filtering here — every consumer already passes year/month through.
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

/**
 * Counts expenses by computed status (paid / pending / overdue) for the given
 * month. Used by the Home summary card.
 */
export function countByStatus(
  expenses: Expense[],
  year: number,
  month: number
): Record<ComputedStatus, number> {
  const filtered = filterExpensesByMonth(expenses, year, month);
  const counts: Record<ComputedStatus, number> = { paid: 0, pending: 0, overdue: 0 };
  for (const e of filtered) {
    counts[computeExpenseStatus(e)] += 1;
  }
  return counts;
}

export type StatusCounts = Record<ComputedStatus, number>;

// Re-export StatusKey so consumers can import status types from a single place
export type { StatusKey };

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
