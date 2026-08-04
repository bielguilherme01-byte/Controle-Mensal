import { memo, useCallback, useEffect, useRef, useState } from 'react';
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
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setText(currentBudget > 0 ? maskCurrency(String(currentBudget * 100)) : '');
    }
  }, [open, currentBudget]);

  useEffect(() => {
    if (open && !closing) {
      const t = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 320);
      return () => clearTimeout(t);
    }
  }, [open, closing]);

  const dismiss = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      onClose();
      setClosing(false);
      closeTimer.current = null;
    }, 200);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleChange = useCallback((raw: string) => {
    setText(maskCurrency(raw));
  }, []);

  const handleSave = useCallback(() => {
    onSave(parseCurrencyMask(text));
    dismiss();
  }, [onSave, text, dismiss]);

  if (!open) return null;

  const animClass = closing
    ? 'translate-y-full opacity-0 transition-all duration-200 ease-in'
    : 'animate-rise';

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <button
        aria-label="Fechar"
        onClick={dismiss}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${
          closing ? 'opacity-0 transition-opacity duration-200' : 'animate-fadeIn'
        }`}
      />

      {/* Dialog — bottom sheet on mobile, centered card on larger screens */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Alterar orçamento mensal"
        className={`relative w-full max-w-app mx-auto rounded-t-[1.75rem] bg-white shadow-2xl ${animClass} sm:rounded-[1.75rem] sm:mx-4`}
        style={{
          maxHeight: '100dvh',
          paddingBottom: 'var(--safe-bottom)',
        }}
      >
        {/* Grabber + header — fixed at top */}
        <div className="shrink-0 px-5 pt-3 pb-2 text-center">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" />
          <h2 className="text-[20px] font-bold tracking-tight text-ink">Alterar orçamento mensal</h2>
        </div>

        {/* Body — scrolls if content overflows */}
        <div className="scroll-area px-5 pb-4" style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
            Valor do orçamento
          </label>
          <div className="flex items-center rounded-xl bg-surface-subtle px-4 transition-colors focus-within:bg-white focus-within:shadow-focus">
            <span className="mr-1 text-[16px] font-medium text-ink-tertiary">R$</span>
            <input
              ref={inputRef}
              inputMode="numeric"
              value={text}
              placeholder="0,00"
              onChange={(e) => handleChange(e.target.value)}
              className="h-12 w-full bg-transparent text-[16px] font-semibold text-ink placeholder:text-ink-quaternary focus:outline-none"
            />
          </div>
          <p className="mt-2 text-[13px] text-ink-tertiary">
            Atual: {formatBRL(currentBudget)}
          </p>
        </div>

        {/* Sticky footer — always visible, respects safe area */}
        <div
          className="shrink-0 border-t border-black/[0.06] bg-white px-5 pt-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
        >
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" fullWidth onClick={dismiss}>
              Cancelar
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const BudgetModal = memo(BudgetModalInner);

export default BudgetModal;
