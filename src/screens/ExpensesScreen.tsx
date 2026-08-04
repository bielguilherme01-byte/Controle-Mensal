import { useCallback, useMemo, useState } from 'react';
import { Plus, ReceiptText } from 'lucide-react';
import { ScreenHeader, EmptyState, Card } from '@/components/ui';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFormSheet } from './ExpenseFormSheet';
import { useExpenses } from '@/lib/expensesStore';
import type { ExpenseDraft } from '@/lib/types';

const EMPTY_ICON = <ReceiptText size={28} strokeWidth={1.8} />;
const EMPTY_TITLE = 'Nenhuma despesa cadastrada.';
const EMPTY_DESC = 'Toque no botão + para adicionar sua primeira despesa.';

export function ExpensesScreen() {
  const { expenses, addExpense, updateExpense, deleteExpense, markPaid } = useExpenses();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingExpense = editingId ? expenses.find((e) => e.id === editingId) : null;

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

  const openNew = useCallback(() => {
    setEditingId(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    setEditingId(id);
    setSheetOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (draft: ExpenseDraft) => {
      setEditingId((currentId) => {
        if (currentId) {
          updateExpense(currentId, draft);
        } else {
          addExpense(draft);
        }
        return null;
      });
      setSheetOpen(false);
    },
    [addExpense, updateExpense]
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

  return (
    <>
      <ScreenHeader title="Despesas" subtitle="Todos os seus lançamentos" />

      <div className="px-5">
        {expenses.length === 0 ? (
          <Card className="p-0">
            <EmptyState icon={EMPTY_ICON} title={EMPTY_TITLE} description={EMPTY_DESC} />
          </Card>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMarkPaid={handleMarkPaid}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating action button */}
      <button
        onClick={openNew}
        aria-label="Adicionar despesa"
        className="absolute bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-cardHover transition-transform btn-press hover:bg-brand-700"
      >
        <Plus size={26} strokeWidth={2.6} />
      </button>

      <ExpenseFormSheet
        open={sheetOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={initialDraft}
      />
    </>
  );
}

export default ExpensesScreen;
