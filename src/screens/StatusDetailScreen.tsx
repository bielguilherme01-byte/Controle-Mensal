import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronLeft, Check, Clock, AlertCircle, Receipt } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFormSheet } from './ExpenseFormSheet';
import { useExpenses } from '@/lib/expensesStore';
import { useNavigation } from '@/lib/navigation';
import {
  computeExpenseStatus,
  filterExpensesByMonth,
  type ComputedStatus,
} from '@/lib/stats';
import { formatBRL } from '@/lib/format';
import type { Expense, ExpenseDraft } from '@/lib/types';

type StatusDetailScreenProps = {
  statusKey: ComputedStatus;
};

const STATUS_META: Record<
  ComputedStatus,
  {
    title: string;
    color: string;
    bg: string;
    dotClass: string;
    Icon: typeof Check;
    emptyTitle: string;
    emptyDescription: string;
    backLabel: string;
  }
> = {
  paid: {
    title: 'Despesas pagas',
    color: '#34C759',
    bg: 'rgba(52,199,89,0.12)',
    dotClass: 'bg-success',
    Icon: Check,
    emptyTitle: 'Nenhuma despesa paga neste mês.',
    emptyDescription: '',
    backLabel: 'Início',
  },
  pending: {
    title: 'Despesas pendentes',
    color: '#FF9F0A',
    bg: 'rgba(255,159,10,0.12)',
    dotClass: 'bg-warning',
    Icon: Clock,
    emptyTitle: 'Nenhuma despesa pendente neste mês.',
    emptyDescription: '',
    backLabel: 'Início',
  },
  overdue: {
    title: 'Despesas atrasadas',
    color: '#FF3B30',
    bg: 'rgba(255,59,48,0.12)',
    dotClass: 'bg-error',
    Icon: AlertCircle,
    emptyTitle: 'Nenhuma despesa atrasada.',
    emptyDescription: 'Tudo em dia por aqui.',
    backLabel: 'Início',
  },
};

function StatusDetailScreenInner({ statusKey }: StatusDetailScreenProps) {
  const { expenses, updateExpense, deleteExpense, markPaid } = useExpenses();
  const { pop } = useNavigation();
  const meta = STATUS_META[statusKey];
  const StatusIcon = meta.Icon;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  }, []);

  const filteredExpenses = useMemo(() => {
    const filtered = filterExpensesByMonth(expenses, now.year, now.month);
    return filtered
      .filter((e) => computeExpenseStatus(e) === statusKey)
      .sort((a, b) => a.dueDay - b.dueDay);
  }, [expenses, now.year, now.month, statusKey]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const editingExpense = editingId
    ? expenses.find((e) => e.id === editingId) ?? null
    : null;

  const initialDraft = useMemo<ExpenseDraft | null>(() => {
    if (!editingExpense) return null;
    return {
      name: editingExpense.name,
      amount: editingExpense.amount,
      category: editingExpense.category,
      priority: editingExpense.priority,
      dueDay: editingExpense.dueDay,
      recurrence: editingExpense.recurrence,
      note: editingExpense.note,
    };
  }, [editingExpense]);

  const openEdit = useCallback((id: string) => {
    setEditingId(id);
    setSheetOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (draft: ExpenseDraft) => {
      setEditingId((currentId) => {
        if (currentId) updateExpense(currentId, draft);
        return null;
      });
      setSheetOpen(false);
    },
    [updateExpense]
  );

  const handleClose = useCallback(() => {
    setSheetOpen(false);
    setEditingId(null);
  }, []);

  const handleDelete = useCallback(
    (id: string) => deleteExpense(id),
    [deleteExpense]
  );

  const handleMarkPaid = useCallback(
    (id: string) => markPaid(id),
    [markPaid]
  );

  const hasData = filteredExpenses.length > 0;

  return (
    <div
      className="flex h-full flex-col screen-gradient"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      {/* Nav bar */}
      <div className="flex shrink-0 items-center px-2 py-2">
        <button
          onClick={pop}
          className="flex items-center gap-0.5 rounded-lg px-2 py-1 text-brand-600 btn-press transition-opacity active:opacity-60"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span className="text-[17px] font-medium">{meta.backLabel}</span>
        </button>
      </div>

      {/* Large title with status indicator */}
      <div className="shrink-0 px-5 pb-2">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: meta.bg, color: meta.color }}
          >
            <StatusIcon size={24} strokeWidth={2.4} />
          </span>
          <h1 className="text-[30px] font-bold tracking-tight text-ink">{meta.title}</h1>
        </div>
      </div>

      {/* Summary card */}
      <div className="shrink-0 px-5 pt-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-ink-tertiary">
                Quantidade
              </p>
              <p className="mt-1 text-[28px] font-bold tracking-tight text-ink">
                {filteredExpenses.length}{' '}
                <span className="text-[18px] font-medium text-ink-tertiary">
                  {filteredExpenses.length === 1 ? 'despesa' : 'despesas'}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium uppercase tracking-wider text-ink-tertiary">
                Valor total
              </p>
              <p
                className="mt-1 text-[28px] font-bold tracking-tight"
                style={{ color: meta.color }}
              >
                {formatBRL(totalAmount)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Expense list */}
      <div className="scroll-area flex-1 overflow-y-auto px-5 pt-5">
        {hasData ? (
          <div className="space-y-3 pb-4">
            {filteredExpenses.map((expense: Expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMarkPaid={handleMarkPaid}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Receipt size={28} strokeWidth={1.8} />}
            title={meta.emptyTitle}
            description={meta.emptyDescription}
          />
        )}
      </div>

      <ExpenseFormSheet
        open={sheetOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={initialDraft}
      />
    </div>
  );
}

export const StatusDetailScreen = memo(StatusDetailScreenInner);
export default StatusDetailScreen;
