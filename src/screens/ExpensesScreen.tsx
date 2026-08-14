import { useCallback, useMemo, useState } from 'react';
import { Plus, ReceiptText } from 'lucide-react';
import { ScreenHeader, EmptyState, Card } from '@/components/ui';
import { ExpenseListItem } from '@/components/expenses/ExpenseListItem';
import { ExpenseDetailSheet } from '@/components/expenses/ExpenseDetailSheet';
import { ExpenseFormSheet } from './ExpenseFormSheet';
import { useExpenses } from '@/lib/expensesStore';
import type { ExpenseDraft } from '@/lib/types';

const EMPTY_ICON = <ReceiptText size={28} strokeWidth={1.8} />;
const EMPTY_TITLE = 'Nenhuma despesa cadastrada.';
const EMPTY_DESC = 'Toque no botão + para adicionar sua primeira despesa.';

export function ExpensesScreen() {
  const { expenses, addExpense, updateExpense, deleteExpense, togglePaid } = useExpenses();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const detailExpense = detailId
    ? expenses.find((e) => e.id === detailId) ?? null
    : null;

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

  const openDetail = useCallback((id: string) => setDetailId(id), []);

  const closeDetail = useCallback(() => setDetailId(null), []);

  const openNew = useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const handleEditFromDetail = useCallback((id: string) => {
    setEditingId(id);
    setFormOpen(true);
  }, []);

  const handleDeleteFromDetail = useCallback(
    (id: string) => {
      deleteExpense(id);
      setDetailId(null);
    },
    [deleteExpense]
  );

  const handleTogglePaid = useCallback(
    (id: string) => togglePaid(id),
    [togglePaid]
  );

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
      setFormOpen(false);
    },
    [addExpense, updateExpense]
  );

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
  }, []);

  return (
    <>
      <ScreenHeader title="Despesas" subtitle="Todos os seus lançamentos" />

      <div className="px-5">
        {expenses.length === 0 ? (
          <Card className="p-0">
            <EmptyState icon={EMPTY_ICON} title={EMPTY_TITLE} description={EMPTY_DESC} />
          </Card>
        ) : (
          <div className="space-y-1.5">
            {expenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                expense={expense}
                onClick={openDetail}
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

      <ExpenseDetailSheet
        open={detailId !== null}
        expense={detailExpense}
        onClose={closeDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        onTogglePaid={handleTogglePaid}
      />

      <ExpenseFormSheet
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initial={initialDraft}
      />
    </>
  );
}

export default ExpensesScreen;
