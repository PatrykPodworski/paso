import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const BASE =
  "border border-[#e0e6d5] rounded-2xl p-0 text-green-dark bg-paper shadow-[0_25px_100px_#13261735] max-h-[92dvh] overscroll-contain max-tablet:max-h-[94dvh] max-tablet:rounded-xl backdrop:bg-[#20362cb0] backdrop:backdrop-blur-xs";

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
