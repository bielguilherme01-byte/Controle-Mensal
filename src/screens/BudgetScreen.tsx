import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useExpenses } from '@/lib/expensesStore';
import { useNavigation } from '@/lib/navigation';
import { maskCurrency, parseCurrencyMask } from '@/lib/format';

function BudgetScreenInner() {
  const { budget, setBudget } = useExpenses();
  const { pop } = useNavigation();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(budget > 0 ? maskCurrency(String(budget * 100)) : '');
  }, [budget]);

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 350);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback((raw: string) => {
    setText(maskCurrency(raw));
  }, []);

  const handleCancel = useCallback(() => pop(), [pop]);

  const handleSave = useCallback(() => {
    setBudget(parseCurrencyMask(text));
    pop();
  }, [setBudget, text, pop]);

  return (
    <div
      className="flex h-full flex-col screen-gradient"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      {/* Nav bar with back button */}
      <div className="flex shrink-0 items-center px-2 py-2">
        <button
          onClick={handleCancel}
          className="flex items-center gap-0.5 rounded-lg px-2 py-1 text-brand-600 btn-press transition-opacity active:opacity-60"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span className="text-[17px] font-medium">Início</span>
        </button>
      </div>

      {/* Large title */}
      <h1 className="shrink-0 px-5 pb-2 text-[34px] font-bold tracking-tight text-ink">
        Orçamento Mensal
      </h1>

      {/* Scrollable content */}
      <div className="scroll-area flex-1 overflow-y-auto px-5 pt-4">
        <Card className="p-5">
          <label className="mb-2 block text-[15px] font-medium text-ink-secondary">
            Valor do orçamento
          </label>
          <div className="flex items-center rounded-xl bg-surface-subtle px-4 transition-colors focus-within:bg-white focus-within:shadow-focus">
            <span className="mr-1 text-[17px] font-medium text-ink-tertiary">R$</span>
            <input
              ref={inputRef}
              inputMode="numeric"
              value={text}
              placeholder="0,00"
              onChange={(e) => handleChange(e.target.value)}
              className="h-12 w-full bg-transparent text-[17px] font-semibold text-ink placeholder:text-ink-quaternary focus:outline-none"
            />
          </div>
        </Card>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-tertiary">
          Esse valor será utilizado para calcular o saldo disponível e a utilização do orçamento.
        </p>
      </div>

      {/* Fixed bottom buttons — always visible, respects safe area */}
      <div
        className="shrink-0 border-t border-black/[0.06] bg-white px-5 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
      >
        <div className="flex gap-3">
          <Button variant="ghost" size="lg" fullWidth onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

export const BudgetScreen = memo(BudgetScreenInner);

export default BudgetScreen;
