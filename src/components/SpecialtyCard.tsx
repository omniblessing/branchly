import { Link } from "react-router-dom";
import { ArrowRight, GitCompareArrows } from "lucide-react";
import type { SpecialtyResult } from "../data/types";
import { compatibilityWord } from "../engine/profile";
import { AttributeBar, type BarTone } from "./AttributeBar";
import { ATTRIBUTE_ORDER, type AttributeKey } from "../data/attributes";
import { cn } from "../utils/cn";

const CARD_ATTRIBUTES: Array<{ key: AttributeKey; label: string }> = [
  { key: "diagnostic_reasoning", label: "Diagnostic reasoning" },
  { key: "duty_predictability", label: "Predictability" },
  { key: "patient_interaction", label: "Patient interaction" },
  { key: "procedural_intensity", label: "Procedures" },
];

const ATTR_INDEX: Record<string, number> = Object.fromEntries(
  ATTRIBUTE_ORDER.map((k, i) => [k, i]),
);

export function CompatibilityBadge({ band }: { band: SpecialtyResult["band"] }) {
  const tone =
    band === "strong"
      ? "bg-fit-strong-bg text-fit-strong border-fit-strong/25"
      : band === "moderate"
        ? "bg-fit-moderate-bg text-fit-moderate border-fit-moderate/25"
        : "bg-fit-low-bg text-fit-low border-fit-low/25";
  const label =
    band === "strong" ? "Strong fit" : band === "moderate" ? "Moderate fit" : "Low fit";
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", tone)}>
      {label}
    </span>
  );
}

interface Props {
  result: SpecialtyResult;
  rank?: number;
  selectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}

export function SpecialtyCard({ result, rank, selectedForCompare, onToggleCompare }: Props) {
  const { specialty } = result;
  const tone: BarTone =
    result.band === "strong" ? "strong" : result.band === "moderate" ? "moderate" : "low";

  return (
    <article className="group relative flex flex-col rounded-xl border border-surface-200 bg-white p-5 transition-all duration-200 hover:border-brand-300 hover:shadow-[0_4px_16px_rgba(13,24,38,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="font-mono text-[11px] font-medium text-ink-300">
                {String(rank).padStart(2, "0")}
              </span>
            )}
            <span className="mono-label text-ink-300">{specialty.degree}</span>
          </div>
          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-ink-900">
            {specialty.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
            {specialty.tagline}
          </p>
        </div>
        <CompatibilityBadge band={result.band} />
      </div>

      <p className="mt-3 text-xs font-medium text-ink-400">
        {compatibilityWord(result.score)} with your stated preferences
      </p>

      <div className="mt-3.5 space-y-2 rounded-lg bg-surface-50 p-3.5">
        {CARD_ATTRIBUTES.map((attr) => {
          const value = specialty.a[ATTR_INDEX[attr.key]];
          return (
            <div key={attr.key} className="flex items-center gap-3">
              <span className="w-[46%] shrink-0 truncate text-[12px] text-ink-500">
                {attr.label}
              </span>
              <AttributeBar value={value} tone={tone} className="h-1.5 flex-1" />
              <span className="w-6 text-right font-mono text-[10.5px] tabular-nums text-ink-400">
                {value}/5
              </span>
            </div>
          );
        })}
      </div>

      {result.fits[0] && (
        <p className="mt-3.5 flex gap-2 text-[13px] leading-relaxed text-ink-600">
          <span className="mt-0.5 text-fit-strong" aria-hidden>
            ✓
          </span>
          {result.fits[0].text}
        </p>
      )}
      {result.conflicts[0] && (
        <p className="mt-2 flex gap-2 text-[13px] leading-relaxed text-ink-500">
          <span className="mt-0.5 text-fit-moderate" aria-hidden>
            ⚠
          </span>
          {result.conflicts[0].text}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <Link
          to={`/specialty/${specialty.id}`}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 transition-colors hover:text-brand-900"
        >
          View specialty
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(specialty.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              selectedForCompare
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-surface-200 text-ink-500 hover:border-brand-300 hover:text-brand-700",
            )}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            {selectedForCompare ? "In compare" : "Compare"}
          </button>
        )}
      </div>
    </article>
  );
}
