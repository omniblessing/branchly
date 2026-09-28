import { BadgeCheck, BookOpen, MessagesSquare, ShieldQuestion } from "lucide-react";
import { evidenceFor, SOURCE_TYPE_LABEL } from "../data/evidence";
import type { SourceType } from "../data/types";
import { cn } from "../utils/cn";

const SOURCE_ICON: Record<SourceType, React.ReactNode> = {
  official: <BadgeCheck className="h-3.5 w-3.5" />,
  institutional: <BadgeCheck className="h-3.5 w-3.5" />,
  "medical-education": <BookOpen className="h-3.5 w-3.5" />,
  research: <BookOpen className="h-3.5 w-3.5" />,
  "resident-experience": <MessagesSquare className="h-3.5 w-3.5" />,
  reddit: <ShieldQuestion className="h-3.5 w-3.5" />,
};

const SOURCE_STYLE: Record<SourceType, string> = {
  official: "border-fit-strong/30 bg-fit-strong-bg text-fit-strong",
  institutional: "border-fit-strong/30 bg-fit-strong-bg text-fit-strong",
  "medical-education": "border-brand-200 bg-brand-50 text-brand-700",
  research: "border-brand-200 bg-brand-50 text-brand-700",
  "resident-experience": "border-fit-moderate/30 bg-fit-moderate-bg text-fit-moderate",
  reddit: "border-fit-moderate/30 bg-fit-moderate-bg text-fit-moderate",
};

const CONFIDENCE_LABEL = { high: "Higher confidence", moderate: "Moderate", low: "Early signal" };

export function EvidencePanel({ specialtyId }: { specialtyId: string }) {
  const items = evidenceFor(specialtyId);

  return (
    <section className="rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold tracking-tight text-ink-900">How we derived this</h2>
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
        Attribute values are structured estimates (0–5) informed by postgraduate curricula,
        institutional training structures and recurring themes from resident discussions —
        condensed into criteria, never quoted wholesale. Experiences vary substantially by
        institution; community anecdotes are never presented as universal facts.
      </p>

      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 px-4 py-3 text-xs leading-relaxed text-ink-400">
          No evidence entries registered for this branch yet. The attribute model still
          applies; item-level evidence can be attached as the database grows.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="rounded-lg border border-surface-200 bg-surface-50 p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                    SOURCE_STYLE[item.sourceType],
                  )}
                >
                  {SOURCE_ICON[item.sourceType]}
                  {SOURCE_TYPE_LABEL[item.sourceType]}
                </span>
                <span className="mono-label text-ink-300">{item.date}</span>
                <span className="mono-label ml-auto text-ink-400">
                  {CONFIDENCE_LABEL[item.confidence]}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{item.summary}</p>
              <p className="mt-1.5 text-[11.5px] text-ink-400">Source: {item.source}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
