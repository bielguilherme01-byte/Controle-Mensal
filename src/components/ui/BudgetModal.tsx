import { memo, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { maskCurrency, parseCurrencyMask, formatBRL } from '@/lib/format';

type BudgetModalProps = {
  open: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (value: number) => void;
};

function BudgetModalInner({ open, currentBudget, onClose, onSave }: BudgetModalProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setText(currentBudget > 0 ? maskCurrency(String(currentBudget * 100)) : '');
    }
  }, [open, currentBudget]);

  const handleChange = useCallback((raw: string) => {
    setText(maskCurrency(raw));
  }, []);

  const handleSave = useCallback(() => {
    onSave(parseCurrencyMask(text));
  }, [onSave, text]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fadeIn"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Alterar orçamento mensal"
        className="relative w-full max-w-app mx-auto rounded-t-[1.75rem] bg-white shadow-2xl animate-rise sm:rounded-[1.75rem] sm:mx-4"
      >
        <div className="flex flex-col">
          {/* Grabber + header */}
          <div className="shrink-0 px-5 pt-3 pb-2 text-center">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" />
            <h2 className="text-[20px] font-bold tracking-tight text-ink">Alterar orçamento mensal</h2>
          </div>

          {/* Body */}
          <div className="px-5 pb-2">
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
              Valor do orçamento
            </label>
            <div className="flex items-center rounded-xl bg-surface-subtle px-4 transition-colors focus-within:bg-white focus-within:shadow-focus">
              <span className="mr-1 text-[16px] font-medium text-ink-tertiary">R$</span>
              <input
                inputMode="numeric"
                value={text}
                placeholder="R$ 0,00"
                onChange={(e) => handleChange(e.target.value)}
                className="h-12 w-full bg-transparent text-[16px] font-semibold text-ink placeholder:text-ink-quaternary focus:outline-none"
              />
            </div>
            <p className="mt-2 text-[13px] text-ink-tertiary">
              Atual: {formatBRL(currentBudget)}
            </p>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-black/[0.06] bg-white px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" fullWidth onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const BudgetModal = memo(BudgetModalInner);

export default BudgetModal;
