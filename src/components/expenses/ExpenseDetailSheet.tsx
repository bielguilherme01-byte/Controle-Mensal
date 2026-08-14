import { memo, useCallback, useState } from 'react';
import {
  X,
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
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="shrink-0 text-[15px] text-ink-tertiary">{label}</span>
      <span className="min-w-0 max-w-[62%] text-right text-[15px] font-medium text-ink">
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
      {/* Header card */}
      <div className="mb-5 flex flex-col items-center rounded-2xl bg-surface-subtle p-5">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: cat.tint, color: cat.color }}
        >
          <Icon size={32} strokeWidth={2.2} />
        </span>
        <p className="mt-3 text-center text-[19px] font-bold tracking-tight text-ink">
          {expense.name}
        </p>
        <p className="mt-0.5 text-[14px] text-ink-tertiary">{cat.label}</p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
          >
            {statusMeta.label}
          </span>
        </div>
        <p className="mt-4 text-[28px] font-bold tracking-tight text-ink">
          {formatBRL(expense.amount)}
        </p>
      </div>

      {/* Detail fields */}
      <div className="rounded-2xl bg-surface-subtle px-4">
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
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-surface-subtle p-4">
          <StickyNote size={16} className="mt-0.5 shrink-0 text-ink-tertiary" />
          <div>
            <p className="text-[13px] font-medium text-ink-tertiary">Observação</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink">{expense.note}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 space-y-2.5">
        <Button variant="secondary" size="lg" fullWidth onClick={handleEdit}>
          <span className="inline-flex items-center gap-2">
            <Pencil size={18} strokeWidth={2.4} />
            Editar
          </span>
        </Button>

        {!isPaid ? (
          <Button variant="primary" size="lg" fullWidth onClick={handleTogglePaid}>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={18} strokeWidth={2.4} />
              Marcar como paga
            </span>
          </Button>
        ) : (
          <Button variant="secondary" size="lg" fullWidth onClick={handleTogglePaid}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw size={18} strokeWidth={2.4} />
              Marcar como pendente
            </span>
          </Button>
        )}

        {!confirmDelete ? (
          <button
            onClick={handleDeleteClick}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[17px] font-semibold text-error transition-colors btn-press hover:bg-error/[0.06] active:bg-error/[0.08]"
          >
            <Trash2 size={18} strokeWidth={2.4} />
            Excluir despesa
          </button>
        ) : (
          <div className="rounded-2xl bg-error/[0.08] p-4">
            <div className="mb-3 flex items-start gap-2">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
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

      {/* Close button */}
      <button
        onClick={handleClose}
        className="mx-auto mt-4 flex items-center gap-1.5 text-[15px] font-medium text-ink-tertiary transition-colors hover:text-ink"
      >
        <X size={16} />
        Fechar
      </button>
    </Sheet>
  );
}

export const ExpenseDetailSheet = memo(ExpenseDetailSheetInner);
export default ExpenseDetailSheet;
