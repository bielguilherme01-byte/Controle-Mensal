import { memo } from 'react';
import { ChevronRight, Check, Clock, AlertCircle } from 'lucide-react';
import { CATEGORY_MAP, PRIORITY_MAP } from '@/lib/constants';
import { computeExpenseStatus } from '@/lib/stats';
import { formatBRL } from '@/lib/format';
import type { Expense } from '@/lib/types';

type ExpenseListItemProps = {
  expense: Expense;
  onClick: (id: string) => void;
};

const STATUS_BADGE: Record<
  ReturnType<typeof computeExpenseStatus>,
  { label: string; color: string; bg: string; Icon: typeof Check }
> = {
  paid: { label: 'Paga', color: '#34C759', bg: 'rgba(52,199,89,0.12)', Icon: Check },
  pending: { label: 'Pendente', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)', Icon: Clock },
  overdue: { label: 'Atrasada', color: '#FF3B30', bg: 'rgba(255,59,48,0.12)', Icon: AlertCircle },
};

function ExpenseListItemInner({ expense, onClick }: ExpenseListItemProps) {
  const cat = CATEGORY_MAP[expense.category];
  const prio = PRIORITY_MAP[expense.priority];
  const status = computeExpenseStatus(expense);
  const statusCfg = STATUS_BADGE[status];
  const StatusIcon = statusCfg.Icon;
  const Icon = cat.icon;

  return (
    <button
      onClick={() => onClick(expense.id)}
      className={`flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card transition-colors btn-press hover:bg-black/[0.02] active:bg-black/[0.04] animate-fadeIn ${
        status === 'paid' ? 'opacity-60' : ''
      }`}
    >
      {/* Category icon */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: cat.tint, color: cat.color }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </span>

      {/* Name + category */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight tracking-tight text-ink">
          {expense.name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-ink-tertiary">{cat.label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-secondary">
            <span className={`h-2 w-2 rounded-full ${prio.dotClass}`} />
            {prio.label}
          </span>
          <span className="text-[11px] text-ink-quaternary">·</span>
          <span className="text-[11px] text-ink-tertiary">Venc. dia {expense.dueDay}</span>
        </div>
      </div>

      {/* Right: status + value + chevron */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
        >
          <StatusIcon size={10} strokeWidth={3} />
          {statusCfg.label}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold tracking-tight text-ink">
            {formatBRL(expense.amount)}
          </span>
          <ChevronRight size={16} className="shrink-0 text-ink-quaternary" />
        </div>
      </div>
    </button>
  );
}

export const ExpenseListItem = memo(ExpenseListItemInner);
export default ExpenseListItem;
