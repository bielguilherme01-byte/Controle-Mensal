import { BarChart3 } from 'lucide-react';
import { ScreenHeader, EmptyState, Card } from '@/components/ui';

export function StatsScreen() {
  return (
    <>
      <ScreenHeader title="Estatísticas" subtitle="Acompanhe seus gastos" />
      <div className="px-5">
        <Card className="p-0">
          <EmptyState
            icon={<BarChart3 size={28} strokeWidth={1.8} />}
            title="Sem dados para exibir"
            description="Assim que você registrar despesas, suas estatísticas aparecerão aqui."
          />
        </Card>
      </div>
    </>
  );
}

export default StatsScreen;
