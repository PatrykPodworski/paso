import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const BASE =
  "m-auto border border-border rounded-2xl p-0 text-popover-foreground bg-popover shadow-2xl overscroll-contain max-md:rounded-xl backdrop:bg-black/80 backdrop:backdrop-blur-xs";

type Props = {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
};

export const Dialog = ({ children, onClose, label, className = "" }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    // Native restore on close() does not fire: React removes the node first.
    const active = document.activeElement as HTMLElement | null;

    el?.showModal();

    return () => {
      el?.close();
      active?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={`${BASE} ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {children}
    </dialog>
  );
};
