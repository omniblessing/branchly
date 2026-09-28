import { ATTRIBUTE_META, type AttributeKey } from "../data/attributes";
import { cn } from "../utils/cn";

const TONES = {
  brand: { on: "bg-brand-500", off: "bg-surface-200" },
  accent: { on: "bg-accent-500", off: "bg-surface-200" },
  muted: { on: "bg-brand-300", off: "bg-surface-100" },
  strong: { on: "bg-fit-strong", off: "bg-surface-200" },
  moderate: { on: "bg-fit-moderate", off: "bg-surface-200" },
  low: { on: "bg-fit-low", off: "bg-surface-200" },
} as const;

export type BarTone = keyof typeof TONES;

/** 0–5 segmented bar (never presented as a precise scientific score). */
export function AttributeBar({
  value,
  tone = "brand",
  className,
  segments = 5,
}: {
  value: number;
  tone?: BarTone;
  className?: string;
  segments?: number;
}) {
  const filled = Math.round(Math.min(segments, Math.max(0, value)));
  const palette = TONES[tone];
  return (
    <div className={cn("flex gap-[3px]", className)} aria-hidden>
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-full flex-1 rounded-[2px] transition-colors duration-300",
            i < filled ? palette.on : palette.off,
          )}
          style={{ minWidth: 6 }}
        />
      ))}
    </div>
  );
}

interface RowProps {
  attributeKey: AttributeKey;
  value: number;
  showMeta?: boolean;
}

export function AttributeRow({ attributeKey, value, showMeta = true }: RowProps) {
  const meta = ATTRIBUTE_META[attributeKey];
  return (
    <div className="flex items-center gap-3">
      <span className="w-[38%] shrink-0 truncate text-[13px] text-ink-600" title={meta.label}>
        {meta.label}
      </span>
      <AttributeBar value={value} className="h-2 flex-1" />
      <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-400">
        {value}/5
      </span>
      {showMeta && (
        <span className="sr-only">
          {value} out of 5 for {meta.label}
        </span>
      )}
    </div>
  );
}
