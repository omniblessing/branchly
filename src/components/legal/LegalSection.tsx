import type { ReactNode } from "react";

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-surface-200 bg-white p-5 sm:p-6">
      <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">{heading}</h2>
      {children}
    </section>
  );
}
