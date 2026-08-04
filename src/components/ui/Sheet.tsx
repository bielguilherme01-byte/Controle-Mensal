import { memo, useEffect, useRef, type ReactNode } from 'react';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const Sheet = memo(function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fadeIn"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92%] w-full max-w-app mx-auto overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl animate-rise"
      >
        <div className="flex flex-col max-h-[92%]">
          {/* Grabber + header */}
          <div className="shrink-0 px-5 pt-3 pb-2 text-center">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" />
            <h2 className="text-[20px] font-bold tracking-tight text-ink">{title}</h2>
          </div>

          {/* Body */}
          <div className="scroll-area flex-1 overflow-y-auto px-5 pb-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="shrink-0 border-t border-black/[0.06] bg-white px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Sheet;
