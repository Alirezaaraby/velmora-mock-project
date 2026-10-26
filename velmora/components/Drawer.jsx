import React, { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  note,
  actions,
  footer,
  label,
  panelClassName = '',
  children,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const restoreTo = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector(FOCUSABLE);
    if (first instanceof HTMLElement) first.focus();
    else panel?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (restoreTo instanceof HTMLElement) restoreTo.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={label || title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40 animate-fade-in"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`drawer-glass relative flex h-full w-full flex-col outline-none ${panelClassName || 'animate-slide-in'}`}
      >
        <div className="border-b border-stone px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              {subtitle && <p className="eyebrow text-ink/60">{subtitle}</p>}
              <h2 className="mt-1 font-heading text-2xl font-light tracking-wide md:text-3xl">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center text-ink/70 transition-colors hover:text-ink"
              >
                <span aria-hidden="true" className="text-2xl leading-none">×</span>
              </button>
            </div>
          </div>
          {note && <p className="mt-3 text-xs text-ink/70">{note}</p>}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-stone bg-ivory px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}