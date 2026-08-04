import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import {
  FieldLabel,
  TextField,
  TextArea,
  PillSelector,
  NativeSelect,
} from '@/components/ui/Field';
import {
  CATEGORIES,
  PRIORITIES,
  RECURRENCES,
  CATEGORY_MAP,
} from '@/lib/constants';
import type { CategoryKey, ExpenseDraft, PriorityKey, RecurrenceKey } from '@/lib/types';

type ExpenseFormSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: ExpenseDraft) => void;
  initial?: ExpenseDraft | null;
  editingName?: string;
};

const EMPTY_DRAFT: ExpenseDraft = {
  name: '',
  amount: 0,
  category: 'moradia',
  priority: 'important',
  dueDay: new Date().getDate(),
  recurrence: 'monthly',
  note: '',
};

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({ value: p.key, label: p.label, emoji: p.emoji }));
const RECURRENCE_OPTIONS = RECURRENCES.map((r) => ({ value: r.key, label: r.label }));

function ExpenseFormSheetInner({
  open,
  onClose,
  onSubmit,
  initial,
}: ExpenseFormSheetProps) {
  const [draft, setDraft] = useState<ExpenseDraft>(EMPTY_DRAFT);
  const [amountText, setAmountText] = useState('');
  const [dueDayText, setDueDayText] = useState(String(EMPTY_DRAFT.dueDay));
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      const base = initial ?? EMPTY_DRAFT;
      setDraft(base);
      setAmountText(base.amount > 0 ? String(base.amount) : '');
      setDueDayText(String(base.dueDay));
      setTouched(false);
    }
  }, [open, initial]);

  const isEditing = Boolean(initial);
  const nameValid = draft.name.trim().length > 0;
  const amountValid = draft.amount > 0;
  const dueDayValid = draft.dueDay >= 1 && draft.dueDay <= 31;
  const formValid = nameValid && amountValid && dueDayValid;

  const handleSubmit = useCallback(() => {
    setTouched(true);
    if (!nameValid || !amountValid || !dueDayValid) return;
    onSubmit({ ...draft, name: draft.name.trim() });
  }, [draft, nameValid, amountValid, dueDayValid, onSubmit]);

  const setName = useCallback(
    (v: string) => setDraft((d) => ({ ...d, name: v })),
    []
  );
  const setAmount = useCallback((raw: string) => {
    setAmountText(raw);
    const normalized = raw.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    setDraft((d) => ({ ...d, amount: isNaN(parsed) ? 0 : parsed }));
  }, []);
  const setDueDay = useCallback((raw: string) => {
    setDueDayText(raw);
    const num = parseInt(raw, 10);
    setDraft((d) => ({ ...d, dueDay: isNaN(num) ? 0 : num }));
  }, []);
  const setCategory = useCallback(
    (v: string) => setDraft((d) => ({ ...d, category: v as CategoryKey })),
    []
  );
  const setPriority = useCallback(
    (v: string) => setDraft((d) => ({ ...d, priority: v as PriorityKey })),
    []
  );
  const setRecurrence = useCallback(
    (v: string) => setDraft((d) => ({ ...d, recurrence: v as RecurrenceKey })),
    []
  );
  const setNote = useCallback(
    (v: string) => setDraft((d) => ({ ...d, note: v })),
    []
  );

  const showError = (valid: boolean) => touched && !valid;

  const CategoryBadge = useMemo(() => {
    const cat = CATEGORY_MAP[draft.category];
    const Icon = cat.icon;
    return (
      <div className="mt-2 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: cat.tint, color: cat.color }}
        >
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <span className="text-[14px] text-ink-tertiary">{cat.label}</span>
      </div>
    );
  }, [draft.category]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Despesa' : 'Nova Despesa'}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" size="lg" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Nome */}
        <div>
          <FieldLabel>Nome da despesa</FieldLabel>
          <TextField
            value={draft.name}
            onChange={setName}
            placeholder="Ex.: Aluguel"
          />
          {showError(nameValid) && <FieldError>Informe um nome.</FieldError>}
        </div>

        {/* Valor */}
        <div>
          <FieldLabel>Valor (R$)</FieldLabel>
          <TextField
            value={amountText}
            onChange={setAmount}
            placeholder="0,00"
            inputMode="decimal"
            prefix="R$"
          />
          {showError(amountValid) && <FieldError>Informe um valor maior que zero.</FieldError>}
        </div>

        {/* Categoria */}
        <div>
          <FieldLabel>Categoria</FieldLabel>
          <NativeSelect
            options={CATEGORY_OPTIONS}
            value={draft.category}
            onChange={setCategory}
          />
          {CategoryBadge}
        </div>

        {/* Prioridade */}
        <div>
          <FieldLabel>Prioridade</FieldLabel>
          <PillSelector
            options={PRIORITY_OPTIONS}
            value={draft.priority}
            onChange={setPriority}
          />
        </div>

        {/* Dia do vencimento */}
        <div>
          <FieldLabel>Dia do vencimento</FieldLabel>
          <TextField
            value={dueDayText}
            onChange={setDueDay}
            placeholder="Ex.: 10"
            inputMode="numeric"
          />
          {showError(dueDayValid) && <FieldError>Informe um dia entre 1 e 31.</FieldError>}
        </div>

        {/* Recorrência */}
        <div>
          <FieldLabel>Recorrência</FieldLabel>
          <NativeSelect
            options={RECURRENCE_OPTIONS}
           
            value={draft.recurrence}
            onChange={setRecurrence}
          />
        </div>

        {/* Observação */}
        <div>
          <FieldLabel>Observação</FieldLabel>
          <TextArea
            value={draft.note ?? ''}
            onChange={setNote}
            placeholder="Detalhes opcionais"
          />
        </div>
      </div>
    </Sheet>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[13px] font-medium text-error">{children}</p>;
}

export const ExpenseFormSheet = memo(ExpenseFormSheetInner);

export default ExpenseFormSheet;
