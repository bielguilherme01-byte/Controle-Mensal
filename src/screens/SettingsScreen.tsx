import { ChevronRight, Moon, Bell, Globe, Shield, HelpCircle } from 'lucide-react';
import { ScreenHeader, Card } from '@/components/ui';
import type { LucideIcon } from 'lucide-react';

type Row = {
  icon: LucideIcon;
  label: string;
  value?: string;
  tint: string;
  color: string;
};

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: 'Preferências',
    rows: [
      { icon: Moon, label: 'Aparência', value: 'Claro', tint: '#0A84FF1A', color: '#0A84FF' },
      { icon: Bell, label: 'Notificações', value: 'Desativado', tint: '#FF3B301A', color: '#FF3B30' },
      { icon: Globe, label: 'Idioma', value: 'Português', tint: '#34C7591A', color: '#34C759' },
    ],
  },
  {
    title: 'Sobre',
    rows: [
      { icon: Shield, label: 'Privacidade', tint: '#5856D61A', color: '#5856D6' },
      { icon: HelpCircle, label: 'Ajuda', tint: '#FF9F0A1A', color: '#FF9F0A' },
    ],
  },
];

export function SettingsScreen() {
  return (
    <>
      <ScreenHeader title="Configurações" subtitle="Personalize o app" />
      <div className="space-y-6 px-5">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
              {group.title}
            </h2>
            <Card className="overflow-hidden p-0">
              <ul className="divide-y divide-black/[0.06]">
                {group.rows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <li key={row.label}>
                      <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left btn-press">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: row.tint, color: row.color }}
                        >
                          <Icon size={17} strokeWidth={2.2} />
                        </span>
                        <span className="flex-1 text-[16px] tracking-tight text-ink">
                          {row.label}
                        </span>
                        {row.value && (
                          <span className="text-[15px] text-ink-tertiary">{row.value}</span>
                        )}
                        <ChevronRight size={18} className="text-ink-quaternary" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        ))}

        <p className="pb-2 text-center text-[12px] text-ink-quaternary">
          Controle Mensal · versão 1.0
        </p>
      </div>
    </>
  );
}

export default SettingsScreen;
