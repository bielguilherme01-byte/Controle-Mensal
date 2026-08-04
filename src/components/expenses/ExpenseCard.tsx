import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Trash2, CheckCircle2, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CATEGORY_MAP, PRIORITY_MAP, RECURRENCE_MAP } from '@/lib/constants';
import { formatBRL } from '@/lib/format';
import type { Expense } from '@/lib/types';

type ExpenseCardProps = {
  expense: Expense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
};

function ExpenseCardInner({ expense, onEdit, onDelete, onMarkPaid }: ExpenseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cat = CATEGORY_MAP[expense.category];
  const prio = PRIORITY_MAP[expense.priority];
  const rec = RECURRENCE_MAP[expense.recurrence];
  const Icon = cat.icon;
  const isPaid = expense.status === 'paid';

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleEdit = useCallback(() => {
    setMenuOpen(false);
    onEdit(expense.id);
  }, [onEdit, expense.id]);

  const handleDelete = useCallback(() => {
    setMenuOpen(false);
    onDelete(expense.id);
  }, [onDelete, expense.id]);

  const handleMarkPaid = useCallback(() => {
    setMenuOpen(false);
    onMarkPaid(expense.id);
  }, [onMarkPaid, expense.id]);

  return (
    <Card className={`relative p-4 animate-fadeIn ${isPaid ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3.5">
        {/* Category icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: cat.tint, color: cat.color }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[16px] font-semibold tracking-tight text-ink">
              {expense.name}
            </p>
            <div ref={menuRef} className="relative shrink-0">
              <button
                aria-label="Opções"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-black/[0.05] btn-press"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-9 z-10 w-52 overflow-hidden rounded-xl bg-white py-1 shadow-cardHover animate-scaleIn">
                  <MenuItem icon={Pencil} label="Editar" onClick={handleEdit} />
                  <MenuItem
                    icon={CheckCircle2}
                    label="Marcar como paga"
                    disabled={isPaid}
                    onClick={handleMarkPaid}
                  />
                  <div className="my-1 h-px bg-black/[0.06]" />
                  <MenuItem
                    icon={Trash2}
                    label="Excluir"
                    danger
                    onClick={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>

          <p className="mt-0.5 text-[14px] text-ink-tertiary">{cat.label}</p>

          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary">
                <span className={`h-2 w-2 rounded-full ${prio.dotClass}`} />
                {prio.label}
              </span>
              <span className="text-[13px] text-ink-tertiary">
                Venc. dia {expense.dueDay}
                {expense.recurrence !== 'none' ? ` · ${rec.label}` : ''}
              </span>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-ink">
              {formatBRL(expense.amount)}
            </span>
          </div>

          {/* Status badge */}
          <div className="mt-3">
            {isPaid ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[12px] font-semibold text-success">
                <Check size={13} strokeWidth={3} /> Paga
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-1 text-[12px] font-semibold text-warning">
                Pendente
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export const ExpenseCard = memo(ExpenseCardInner);

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] btn-press transition-colors',
        disabled
          ? 'cursor-not-allowed text-ink-quaternary'
          : danger
            ? 'text-error hover:bg-error/[0.06]'
            : 'text-ink hover:bg-black/[0.04]',
      ].join(' ')}
    >
      <Icon size={17} strokeWidth={2.2} />
      {label}
    </button>
  );
}

export default ExpenseCard;
