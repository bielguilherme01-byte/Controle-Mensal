import { memo, useCallback, useMemo } from 'react';
import { PieChart, ChevronRight } from 'lucide-react';
import { ScreenHeader, EmptyState, Card } from '@/components/ui';
import { DonutChart } from '@/components/stats/DonutChart';
import { useExpenses } from '@/lib/expensesStore';
import { useNavigation } from '@/lib/navigation';
import { useMonthStats } from '@/lib/stats';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatBRL } from '@/lib/format';
import type { CategoryBreakdownItem } from '@/lib/stats';

const MONTH_LABEL = new Date().toLocaleDateString('pt-BR', {
  month: 'long',
  year: 'numeric',
});

function BreakdownRow({
  item,
  onSelect,
}: {
  item: CategoryBreakdownItem;
  onSelect: (key: CategoryBreakdownItem['key']) => void;
}) {
  const Icon = CATEGORY_MAP[item.key].icon;
  return (
    <button
      onClick={() => onSelect(item.key)}
      className="flex w-full items-center gap-3 py-3 text-left btn-press"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `${item.color}1A`,
          color: item.color,
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[16px] font-medium text-ink">{item.label}</span>
          <span className="shrink-0 text-[15px] font-semibold text-ink">
            {formatBRL(item.amount)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-[13px] font-semibold text-ink-tertiary">
            {Math.round(item.percentage)}%
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="shrink-0 text-ink-quaternary" />
    </button>
  );
}

function StatsScreenInner() {
  const { expenses } = useExpenses();
  const { push } = useNavigation();

  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  }, []);

  const handleSelectCategory = useCallback(
    (key: CategoryBreakdownItem['key']) => {
      push('category-detail', { categoryKey: key });
    },
    [push]
  );

  const stats = useMonthStats(expenses, now.year, now.month);
  const hasData = stats.totalExpenses > 0;

  if (!hasData) {
    return (
      <>
        <ScreenHeader title="Estatísticas" subtitle="Acompanhe seus gastos" />
        <div className="px-5">
          <Card className="p-0">
            <EmptyState
              icon={<PieChart size={28} strokeWidth={1.8} />}
              title="Nenhuma despesa cadastrada neste mês."
              description="Cadastre sua primeira despesa para visualizar as estatísticas."
            />
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="Estatísticas"
        subtitle="Acompanhe seus gastos"
        action={
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-semibold text-brand-700">
            {MONTH_LABEL}
          </span>
        }
      />

      {/* Donut chart */}
      <div className="px-5">
        <Card className="flex flex-col items-center p-6 animate-rise">
          <DonutChart
            segments={stats.breakdown}
            total={stats.totalSpent}
            formatAmount={formatBRL}
          />
          <p className="mt-4 text-[14px] text-ink-tertiary">
            Toque em uma fatia para detalhar
          </p>
        </Card>
      </div>

      {/* Breakdown list */}
      <div className="mt-6 px-5">
        <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
          Divisão das despesas
        </h2>
        <Card className="px-5 py-2 animate-rise">
          <ul className="divide-y divide-black/[0.06]">
            {stats.breakdown.map((item) => (
              <li key={item.key}>
                <BreakdownRow item={item} onSelect={handleSelectCategory} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Month summary */}
      <div className="mt-6 px-5">
        <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
          Resumo do mês
        </h2>
        <Card className="p-5 animate-rise">
          <SummaryLine label="Total de despesas" value={String(stats.totalExpenses)} />
          <SummaryLine label="Valor total gasto" value={formatBRL(stats.totalSpent)} />
          {stats.topCategory && (
            <SummaryLine
              label="Categoria com maior gasto"
              value={stats.topCategory.label}
            />
          )}
          {stats.bottomCategory && (
            <SummaryLine
              label="Categoria com menor gasto"
              value={stats.bottomCategory.label}
            />
          )}
        </Card>
      </div>
    </>
  );
}

const SummaryLine = memo(function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <span className="text-[15px] text-ink-secondary">{label}</span>
      <span className="ml-3 max-w-[60%] text-right text-[16px] font-semibold tracking-tight text-ink">
        {value}
      </span>
    </div>
  );
});

export const StatsScreen = memo(StatsScreenInner);
export default StatsScreen;
