import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Expense, ExpenseDraft } from './types';
import { createId } from './format';

type ExpensesContextValue = {
  expenses: Expense[];
  budget: number;
  addExpense: (draft: ExpenseDraft) => void;
  updateExpense: (id: string, draft: ExpenseDraft) => void;
  deleteExpense: (id: string) => void;
  markPaid: (id: string) => void;
  togglePaid: (id: string) => void;
  setBudget: (value: number) => void;
};

const EXPENSES_KEY = 'controle-mensal:expenses';
const BUDGET_KEY = 'controle-mensal:budget';

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Expense[];
  } catch {
    return [];
  }
}

function loadBudget(): number {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (raw == null) return 0;
    const num = Number(raw);
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [budget, setBudgetState] = useState<number>(() => loadBudget());

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch {
      // ignore quota / serialization errors
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_KEY, String(budget));
    } catch {
      // ignore quota / serialization errors
    }
  }, [budget]);

  const addExpense = useCallback((draft: ExpenseDraft) => {
    setExpenses((prev) => [
      {
        id: createId(),
        status: 'pending',
        createdAt: Date.now(),
        ...draft,
      },
      ...prev,
    ]);
  }, []);

  const updateExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...draft } : e))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const markPaid = useCallback((id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'paid' } : e))
    );
  }, []);

  const togglePaid = useCallback((id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === 'paid' ? 'pending' : 'paid' }
          : e
      )
    );
  }, []);

  const setBudget = useCallback((value: number) => {
    setBudgetState(value);
  }, []);

  const value = useMemo(
    () => ({ expenses, budget, addExpense, updateExpense, deleteExpense, markPaid, togglePaid, setBudget }),
    [expenses, budget, addExpense, updateExpense, deleteExpense, markPaid, togglePaid, setBudget]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses(): ExpensesContextValue {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error('useExpenses deve ser usado dentro de ExpensesProvider');
  }
  return ctx;
}
