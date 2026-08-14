import { memo, useMemo } from 'react';
import { ChevronLeft, Check, Clock, AlertCircle, StickyNote } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';
import { useExpenses } from '@/lib/expensesStore';
import { useNavigation } from '@/lib/navigation';
import { useMonthStats, filterExpensesByMonth, computeExpenseStatus } from '@/lib/stats';
import { CATEGORY_MAP, RECURRENCE_MAP } from '@/lib/constants';
import { formatBRL } from '@/lib/format';
import type { CategoryKey, Expense } from '@/lib/types';

type CategoryDetailScreenProps = {
  categoryKey: CategoryKey;
};

const STATUS_CONFIG = {
  paid: { label: 'Paga', color: '#34C759', bg: 'rgba(52,199,89,0.15)', Icon: Check },
  pending: { label: 'Pendente', color: '#FF9F0A', bg: 'rgba(255,159,10,0.15)', Icon: Clock },
  overdue: { label: 'Atrasada', color: '#FF3B30', bg: 'rgba(255,59,48,0.15)', Icon: AlertCircle },
} as const;

function ExpenseRow({ expense }: { expense: Expense }) {
  const status = computeExpenseStatus(expense);
  const statusCfg = STATUS_CONFIG[status];
  const StatusIcon = statusCfg.Icon;
  const rec = RECURRENCE_MAP[expense.recurrence];

  return (
    <Card className="p-4 animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold tracking-tight text-ink">
            {expense.name}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-[13px] text-ink-tertiary">
              Venc. dia {expense.dueDay}
              {expense.recurrence !== 'none' ? ` · ${rec.label}` : ''}
            </span>
          </div>
          {expense.note && (
            <div className="mt-2 flex items-start gap-1.5 text-[13px] text-ink-tertiary">
              <StickyNote size={14} className="mt-0.5 shrink-0" />
              <span className="leading-snug">{expense.note}</span>
            </div>
          )}
        </div>
        <span className="shrink-0 text-[17px] font-bold tracking-tight text-ink">
          {formatBRL(expense.amount)}
        </span>
      </div>
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
        >
          <StatusIcon size={13} strokeWidth={2.5} />
          {statusCfg.label}
        </span>
      </div>
    </Card>
  );
}

function CategoryDetailScreenInner({ categoryKey }: CategoryDetailScreenProps) {
  const { expenses } = useExpenses();
  const { pop } = useNavigation();
  const cat = CATEGORY_MAP[categoryKey];
  const Icon = cat.icon;

  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  }, []);

  const stats = useMonthStats(expenses, now.year, now.month);
  const breakdownItem = stats.breakdown.find((b) => b.key === categoryKey);
  const categoryAmount = breakdownItem?.amount ?? 0;
  const categoryPercentage = breakdownItem?.percentage ?? 0;

  const categoryExpenses = useMemo(() => {
    const filtered = filterExpensesByMonth(expenses, now.year, now.month);
    return filtered
      .filter((e) => e.category === categoryKey)
      .sort((a, b) => a.dueDay - b.dueDay);
  }, [expenses, now.year, now.month, categoryKey]);

  const hasData = categoryExpenses.length > 0;

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
          <span className="text-[17px] font-medium">Estatísticas</span>
        </button>
      </div>

      {/* Large title with category icon */}
      <div className="shrink-0 px-5 pb-2">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: cat.tint, color: cat.color }}
          >
            <Icon size={24} strokeWidth={2.2} />
          </span>
          <h1 className="text-[34px] font-bold tracking-tight text-ink">{cat.label}</h1>
        </div>
      </div>

      {/* Summary card */}
      <div className="shrink-0 px-5 pt-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-ink-tertiary">
                Total gasto
              </p>
              <p className="mt-1 text-[28px] font-bold tracking-tight text-ink">
                {formatBRL(categoryAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium uppercase tracking-wider text-ink-tertiary">
                Do total
              </p>
              <p
                className="mt-1 text-[28px] font-bold tracking-tight"
                style={{ color: cat.color }}
              >
                {Math.round(categoryPercentage)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Expense list */}
      <div className="scroll-area flex-1 overflow-y-auto px-5 pt-5">
        {hasData ? (
          <div className="space-y-3 pb-4">
            {categoryExpenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Icon size={28} strokeWidth={1.8} />}
            title="Nenhuma despesa cadastrada nesta categoria."
            description=""
          />
        )}
      </div>

      {/* Fixed footer with category total */}
      {hasData && (
        <div
          className="shrink-0 border-t border-black/[0.06] bg-white px-5 py-4"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-ink-secondary">Total da categoria</span>
            <span className="text-[20px] font-bold tracking-tight text-ink">
              {formatBRL(categoryAmount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export const CategoryDetailScreen = memo(CategoryDetailScreenInner);
export default CategoryDetailScreen;
