import type { ReactNode } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { cn } from "../../utils/cn";

export function LegalLayout({
  eyebrow,
  title,
  seoTitle,
  lastUpdated,
  intro,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  seoTitle: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  usePageTitle(seoTitle);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:py-14">
      <article className={cn("mx-auto max-w-3xl", className)}>
        <span className="mono-label text-brand-700">{eyebrow}</span>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-[12.5px] text-ink-400">
          Last updated: {lastUpdated} <span className="text-ink-300">·</span> version 1.0.0
        </p>
        {intro && (
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">{intro}</p>
        )}
        <div className="mt-7 space-y-3 border-l-2 border-brand-100 pl-4 sm:pl-6">
          {children}
        </div>
      </article>
    </div>
  );
}
