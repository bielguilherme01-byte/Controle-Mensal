import { memo, useCallback, useMemo } from 'react';
import { CalendarClock, Pencil, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui';
import { useExpenses } from '@/lib/expensesStore';
import { useNavigation } from '@/lib/navigation';
import { computeExpenseStatus, filterExpensesByMonth, type ComputedStatus } from '@/lib/stats';
import { formatBRL } from '@/lib/format';
import { CATEGORY_MAP } from '@/lib/constants';

const GREETING = (() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
})();

const MONTH_LABEL = new Date().toLocaleDateString('pt-BR', {
  month: 'long',
  year: 'numeric',
});

function HomeScreen() {
  const { expenses, budget } = useExpenses();
  const { push } = useNavigation();

  const { spent, counts, nextDue } = useMemo(() => {
    const day = new Date().getDate();
    const now = { year: new Date().getFullYear(), month: new Date().getMonth() };
    const filtered = filterExpensesByMonth(expenses, now.year, now.month);
    let s = 0;
    let paid = 0;
    let pending = 0;
    let overdue = 0;
    const upcoming: { dueDay: number; name: string; category: keyof typeof CATEGORY_MAP; amount: number }[] = [];
    for (const e of filtered) {
      s += e.amount;
      const status = computeExpenseStatus(e);
      if (status === 'paid') {
        paid += 1;
      } else {
        if (status === 'overdue') overdue += 1;
        else pending += 1;
        upcoming.push({ dueDay: e.dueDay, name: e.name, category: e.category, amount: e.amount });
      }
    }
    upcoming.sort((a, b) => a.dueDay - b.dueDay);
    const next = upcoming.find((e) => e.dueDay >= day) ?? upcoming[0] ?? null;
    return { spent: s, counts: { paid, pending, overdue }, nextDue: next };
  }, [expenses]);

  const available = budget - spent;
  const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;

  const openBudgetModal = useCallback(() => push('budget'), [push]);

  const openStatus = useCallback(
    (status: ComputedStatus) => push('status-detail', { statusKey: status }),
    [push]
  );

  return (
    <div className="px-5 pt-6">
      {/* Header — greeting + app name */}
      <header className="animate-fadeIn">
        <p className="text-[15px] font-medium text-ink-tertiary">{GREETING}</p>
        <h1 className="mt-1 text-[34px] font-bold tracking-tight text-ink">Controle Mensal</h1>
      </header>

      {/* Budget card */}
      <Card interactive onClick={openBudgetModal} className="mt-7 p-6 animate-rise">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink-tertiary">Orçamento do mês</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-semibold text-brand-700">
              {MONTH_LABEL}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.05] text-ink-tertiary">
              <Pencil size={14} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <p className="mt-3 text-[40px] font-bold tracking-tight text-ink">
          {formatBRL(budget)}
        </p>
        <p className="mt-1 text-[13px] text-ink-tertiary">Toque para alterar o orçamento</p>

        <div className="mt-6 space-y-3">
          <Row label="Total gasto" value={formatBRL(spent)} valueClass="text-ink" />
          <Row label="Disponível" value={formatBRL(available)} valueClass="text-brand-600" />
        </div>

        <ProgressBar value={progress} />
        <p className="mt-3 text-[13px] text-ink-tertiary">
          {Math.round(progress * 100)}% do orçamento utilizado
        </p>
      </Card>

      {/* Summary card */}
      <Card className="mt-6 p-6 animate-rise">
        <p className="text-[17px] font-semibold tracking-tight text-ink">Resumo</p>
        <div className="mt-5 space-y-1">
          <SummaryRow dotClass="bg-success" label="Pagas" value={counts.paid} onClick={() => openStatus('paid')} />
          <SummaryRow dotClass="bg-warning" label="Pendentes" value={counts.pending} onClick={() => openStatus('pending')} />
          <SummaryRow dotClass="bg-error" label="Atrasadas" value={counts.overdue} onClick={() => openStatus('overdue')} />
        </div>
      </Card>

      {/* Next due date card */}
      <Card className="mt-6 flex items-start gap-4 p-6 animate-rise">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <CalendarClock size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="text-[17px] font-semibold tracking-tight text-ink">Próximo vencimento</p>
          {nextDue ? (
            <div className="mt-1.5">
              <p className="text-[15px] font-semibold text-ink">{nextDue.name}</p>
              <p className="mt-0.5 text-[15px] text-ink-tertiary">
                {CATEGORY_MAP[nextDue.category].label} · Dia {nextDue.dueDay} · {formatBRL(nextDue.amount)}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-[15px] text-ink-tertiary">
              Nenhuma despesa cadastrada.
            </p>
          )}
        </div>
      </Card>

    </div>
  );
}

const Row = memo(function Row({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px] text-ink-secondary">{label}</span>
      <span className={`text-[17px] font-semibold tracking-tight ${valueClass}`}>{value}</span>
    </div>
  );
});

const SummaryRow = memo(function SummaryRow({
  dotClass,
  label,
  value,
  onClick,
}: {
  dotClass: string;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between py-3 text-left btn-press transition-colors hover:bg-black/[0.02] active:bg-black/[0.04] rounded-lg -mx-2 px-2"
    >
      <span className="flex items-center gap-2.5 text-[16px] text-ink-secondary">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[17px] font-bold tracking-tight text-ink">{value}</span>
        <ChevronRight size={18} className="text-ink-quaternary" />
      </span>
    </button>
  );
});

const ProgressBar = memo(function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-[width] duration-1000 ease-out"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  );
});

export default memo(HomeScreen);
