import { memo, useCallback, useState } from 'react';
import type { CategoryBreakdownItem } from '@/lib/stats';

type DonutChartProps = {
  segments: CategoryBreakdownItem[];
  total: number;
  formatAmount: (n: number) => string;
};

const SIZE = 200;
const CENTER = 100;
const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE = 26;
const STROKE_ACTIVE = 33;
const GAP = 2;

type Arc = CategoryBreakdownItem & {
  arcLength: number;
  visibleLength: number;
  offset: number;
};

function DonutChartInner({ segments, total, formatAmount }: DonutChartProps) {
  const [selected, setSelected] = useState<CategoryBreakdownItem['key'] | null>(null);

  const handleToggle = useCallback((key: CategoryBreakdownItem['key']) => {
    setSelected((prev) => (prev === key ? null : key));
  }, []);

  let cumulative = 0;
  const arcs: Arc[] = segments.map((seg) => {
    const arcLength = (seg.percentage / 100) * CIRCUMFERENCE;
    const visibleLength =
      segments.length > 1 ? Math.max(arcLength - GAP, 0) : arcLength;
    const offset = -cumulative;
    cumulative += arcLength;
    return { ...seg, arcLength, visibleLength, offset };
  });

  const renderOrder = [...arcs].sort((a, b) => {
    if (a.key === selected) return 1;
    if (b.key === selected) return -1;
    return 0;
  });

  const selectedSeg =
    selected != null ? segments.find((s) => s.key === selected) ?? null : null;

  return (
    <div className="relative h-[200px] w-[200px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {renderOrder.map((arc) => {
          const isSelected = arc.key === selected;
          const hasSelection = selected !== null;
          return (
            <circle
              key={arc.key}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={isSelected ? STROKE_ACTIVE : STROKE}
              strokeDasharray={`${arc.visibleLength} ${CIRCUMFERENCE - arc.visibleLength}`}
              strokeDashoffset={arc.offset}
              pointerEvents="stroke"
              style={{
                transition:
                  'stroke-width 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
                opacity: hasSelection && !isSelected ? 0.35 : 1,
                cursor: 'pointer',
              }}
              onClick={() => handleToggle(arc.key)}
            />
          );
        })}
      </svg>

      <div
        key={selected ?? 'total'}
        className="animate-fadeIn absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ pointerEvents: 'none' }}
      >
        {selectedSeg ? (
          <>
            <span className="text-[13px] font-medium text-ink-tertiary">
              {selectedSeg.label}
            </span>
            <span className="mt-0.5 text-[22px] font-bold tracking-tight text-ink">
              {formatAmount(selectedSeg.amount)}
            </span>
            <span className="mt-0.5 text-[13px] font-semibold text-ink-tertiary">
              {Math.round(selectedSeg.percentage)}%
            </span>
          </>
        ) : (
          <>
            <span className="text-[13px] font-medium text-ink-tertiary">Total</span>
            <span className="mt-0.5 text-[22px] font-bold tracking-tight text-ink">
              {formatAmount(total)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export const DonutChart = memo(DonutChartInner);
export default DonutChart;
