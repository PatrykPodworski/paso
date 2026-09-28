import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
export const Dialog = ({
  children,
  onClose,
  label,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const el = ref.current;
    const active = document.activeElement as HTMLElement | null;
    el?.showModal();
    const handle = (e: Event) => {
      e.preventDefault();
      close.current();
    };
    el?.addEventListener("cancel", handle);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.removeEventListener("cancel", handle);
      el?.close();
      document.body.style.overflow = old;
      active?.focus();
    };
  }, []);
  return (
    <dialog ref={ref} aria-label={label} className={`dialog ${className}`}>
      {children}
    </dialog>
  );
};
