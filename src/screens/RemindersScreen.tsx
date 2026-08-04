import { Bell } from 'lucide-react';
import { ScreenHeader, EmptyState, Card } from '@/components/ui';

export function RemindersScreen() {
  return (
    <>
      <ScreenHeader title="Lembretes" subtitle="Não esqueça nenhum vencimento" />
      <div className="px-5">
        <Card className="p-0">
          <EmptyState
            icon={<Bell size={28} strokeWidth={1.8} />}
            title="Nenhum lembrete"
            description="Crie lembretes para datas de vencimento e pagamentos importantes."
          />
        </Card>
      </div>
    </>
  );
}

export default RemindersScreen;
