import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-600">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalP({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-3 text-[13.5px] leading-relaxed text-ink-600", className)}>
      {children}
    </p>
  );
}
