import { LegalLayout } from "../components/legal/LegalLayout";
import { LegalP } from "../components/legal/LegalList";
import { EvidencePanel } from "../components/EvidencePanel";
import { EVIDENCE, SOURCE_TYPE_LABEL } from "../data/evidence";
import { cn } from "../utils/cn";

const SOURCE_ORDER = [
  "official",
  "institutional",
  "medical-education",
  "research",
  "resident-experience",
  "reddit",
] as const;

export function Sources() {
  const grouped = SOURCE_ORDER.map(
    (sourceType) =>
      [sourceType, EVIDENCE.filter((e) => e.sourceType === sourceType)] as const,
  ).filter(([, items]) => items.length > 0);

  return (
    <LegalLayout
      eyebrow="Sources & Evidence"
      title="Sources & Evidence | Branchly"
      seoTitle="Sources & Evidence | Branchly"
      lastUpdated="3 February 2026"
      intro="Where the attribute values behind your results come from, how they are labelled, and what their limits are. We attribute real entries and honestly mark scaffolded or community-sourced material — we never pass off a placeholder as a verified fact."
    >
      <section className="rounded-lg border border-surface-200 bg-white p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">
          How evidence is collected and presented
        </h2>
        <LegalP>
          Attribute values are informed by official curricula, institutional training
          structures, medical-education material, and recurring themes from resident and
          community discussions. Each entry carries a source type, a date, a confidence level,
          and a plain-language summary. Community anecdotes are structural placeholders
          illustrating the model — they are themes, not verbatim quotes, and never universal
          facts.
        </LegalP>
      </section>

      {grouped.map(([sourceType, items]) => (
        <section
          key={sourceType}
          className="mt-perms rounded-lg border border-surface-200 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">
              {SOURCE_TYPE_LABEL[sourceType] ?? sourceType}
            </h2>
            <span
              className={cn(
                "mono-label rounded-full px-2 py-0.5",
                sourceType === "reddit" || sourceType === "resident-experience"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-brand-50 text-brand-700",
              )}
            >
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <ul className="mt-4 grid gap-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="rounded-lg border border-surface-100 bg-surface-50 p-3.5"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
                  <span className="mono-label text-ink-500">{item.date}</span>
                  <span className="text-ink-400">{item.source}</span>
                  <span className="ml-auto rounded bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-500">
                    {item.confidence}
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-lg border border-surface-200 bg-white p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">
          Per-specialty evidence
        </h2>
        <LegalP>
          On every specialty detail page, the evidence panel shows the entries relevant to
          that branch. The full, honest picture lives here and there — nothing is removed for
          polish.
        </LegalP>
      </section>
      <div className="mt-4">
        <EvidencePanel specialtyId="general-surgery" />
      </div>
    </LegalLayout>
  );
}
