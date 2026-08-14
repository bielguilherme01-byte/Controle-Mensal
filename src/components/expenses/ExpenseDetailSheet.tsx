import { memo, useCallback, useState } from 'react';
import {
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
  StickyNote,
  AlertTriangle,
} from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { CATEGORY_MAP, PRIORITY_MAP, RECURRENCE_MAP } from '@/lib/constants';
import { computeExpenseStatus } from '@/lib/stats';
import { formatBRL } from '@/lib/format';
import type { Expense } from '@/lib/types';

type ExpenseDetailSheetProps = {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
};

const STATUS_META: Record<
  ReturnType<typeof computeExpenseStatus>,
  { label: string; color: string; bg: string }
> = {
  paid: { label: 'Paga', color: '#34C759', bg: 'rgba(52,199,89,0.12)' },
  pending: { label: 'Pendente', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)' },
  overdue: { label: 'Atrasada', color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <span className="shrink-0 text-[14px] text-ink-tertiary">{label}</span>
      <span className="min-w-0 max-w-[62%] truncate text-right text-[15px] font-medium text-ink">
        {children}
      </span>
    </div>
  );
}

function ExpenseDetailSheetInner({
  open,
  expense,
  onClose,
  onEdit,
  onDelete,
  onTogglePaid,
}: ExpenseDetailSheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClose = useCallback(() => {
    setConfirmDelete(false);
    onClose();
  }, [onClose]);

  const handleEdit = useCallback(() => {
    if (!expense) return;
    handleClose();
    onEdit(expense.id);
  }, [expense, handleClose, onEdit]);

  const handleTogglePaid = useCallback(() => {
    if (!expense) return;
    onTogglePaid(expense.id);
  }, [expense, onTogglePaid]);

  const handleDeleteClick = useCallback(() => {
    setConfirmDelete(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!expense) return;
    setConfirmDelete(false);
    handleClose();
    onDelete(expense.id);
  }, [expense, handleClose, onDelete]);

  if (!expense) return null;

  const cat = CATEGORY_MAP[expense.category];
  const prio = PRIORITY_MAP[expense.priority];
  const rec = RECURRENCE_MAP[expense.recurrence];
  const status = computeExpenseStatus(expense);
  const statusMeta = STATUS_META[status];
  const Icon = cat.icon;
  const isPaid = status === 'paid';

  return (
    <Sheet open={open} onClose={handleClose} title="Detalhes da despesa">
      {/* Header card — always visible without scrolling */}
      <div className="mb-3 flex items-center gap-3.5 rounded-2xl bg-surface-subtle p-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: cat.tint, color: cat.color }}
        >
          <Icon size={28} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-bold tracking-tight text-ink">
            {expense.name}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-tertiary">{cat.label}</p>
          <span
            className="mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
          >
            {statusMeta.label}
          </span>
        </div>
        <p className="shrink-0 text-right text-[22px] font-bold tracking-tight text-ink">
          {formatBRL(expense.amount)}
        </p>
      </div>

      {/* Detail fields */}
      <div className="rounded-2xl bg-surface-subtle px-4 py-1">
        <DetailRow label="Nome">{expense.name}</DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Categoria">{cat.label}</DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Valor">{formatBRL(expense.amount)}</DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Prioridade">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${prio.dotClass}`} />
            {prio.label}
          </span>
        </DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Vencimento">Dia {expense.dueDay}</DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Recorrência">{rec.label}</DetailRow>
        <div className="h-px bg-black/[0.06]" />
        <DetailRow label="Status">{statusMeta.label}</DetailRow>
      </div>

      {/* Note */}
      {expense.note && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-surface-subtle p-3.5">
          <StickyNote size={15} className="mt-0.5 shrink-0 text-ink-tertiary" />
          <div>
            <p className="text-[12px] font-medium text-ink-tertiary">Observação</p>
            <p className="mt-0.5 text-[14px] leading-relaxed text-ink">{expense.note}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 space-y-2.5">
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" fullWidth onClick={handleEdit}>
            <span className="inline-flex items-center gap-2">
              <Pencil size={17} strokeWidth={2.4} />
              Editar
            </span>
          </Button>

          {!isPaid ? (
            <Button variant="primary" size="lg" fullWidth onClick={handleTogglePaid}>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} strokeWidth={2.4} />
                Marcar como paga
              </span>
            </Button>
          ) : (
            <Button variant="secondary" size="lg" fullWidth onClick={handleTogglePaid}>
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={17} strokeWidth={2.4} />
                Marcar como pendente
              </span>
            </Button>
          )}
        </div>

        {!confirmDelete ? (
          <button
            onClick={handleDeleteClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[16px] font-semibold text-error transition-colors btn-press hover:bg-error/[0.06] active:bg-error/[0.08]"
          >
            <Trash2 size={17} strokeWidth={2.4} />
            Excluir despesa
          </button>
        ) : (
          <div className="rounded-xl bg-error/[0.08] p-3.5">
            <div className="mb-2.5 flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-error" />
              <p className="text-[14px] font-medium leading-snug text-error">
                Tem certeza? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </Button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl bg-error py-3 text-[15px] font-semibold text-white transition-colors btn-press hover:bg-error/90"
              >
                Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

export const ExpenseDetailSheet = memo(ExpenseDetailSheetInner);
export default ExpenseDetailSheet;
