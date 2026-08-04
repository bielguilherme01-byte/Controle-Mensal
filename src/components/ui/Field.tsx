import { memo, type ReactNode } from 'react';

export const FieldLabel = memo(function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">
      {children}
    </label>
  );
});

export const TextField = memo(function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal';
  prefix?: string;
}) {
  return (
    <div className="flex items-center rounded-xl bg-surface-subtle px-4 transition-colors focus-within:bg-white focus-within:shadow-focus">
      {prefix && <span className="mr-1 text-[16px] font-medium text-ink-tertiary">{prefix}</span>}
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full bg-transparent text-[16px] text-ink placeholder:text-ink-quaternary focus:outline-none"
      />
    </div>
  );
});

export const TextArea = memo(function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-xl bg-surface-subtle px-4 py-3 text-[16px] text-ink placeholder:text-ink-quaternary transition-colors focus:bg-white focus:shadow-focus focus:outline-none"
    />
  );
});

export type SelectOption = {
  value: string;
  label: string;
  emoji?: string;
};

export const PillSelector = memo(function PillSelector({
  options,
  value,
  onChange,
}: {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium tracking-tight btn-press transition-colors',
              active
                ? 'bg-brand-600 text-white'
                : 'bg-surface-subtle text-ink-secondary hover:bg-black/[0.06]',
            ].join(' ')}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});

export const NativeSelect = memo(function NativeSelect({
  options,
  value,
  onChange,
}: {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl bg-surface-subtle px-4 pr-10 text-[16px] text-ink focus:shadow-focus focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.emoji ? `${opt.emoji} ${opt.label}` : opt.label}
          </option>
        ))}
      </select>
      <Chevron />
    </div>
  );
});

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
