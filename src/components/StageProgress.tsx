import { STAGES } from "../data/questions";
import { cn } from "../utils/cn";

/**
 * Stage-based progress: shows the depth of the decision process rather
 * than a single percentage bar.
 */
export function StageProgress({ stage, answered }: { stage: number; answered: number }) {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="mono-label text-brand-600">Specialty discovery</span>
        <span className="mono-label text-ink-400">{answered} answered</span>
      </div>

      {/* Desktop rail */}
      <ol className="hidden gap-0 sm:flex" aria-label="Discovery stages">
        {STAGES.map((s, i) => {
          const done = stage > s.level;
          const current = stage === s.level;
          const isLast = i === STAGES.length - 1;
          return (
            <li key={s.level} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex items-center">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300",
                      done && "bg-accent-500",
                      current && "ring-4 ring-accent-100 bg-accent-600",
                      !done && !current && "border border-surface-300 bg-white",
                    )}
                  />
                  {!isLast && (
                    <span
                      aria-hidden
                      className={cn(
                        "h-px flex-1 transition-colors duration-300",
                        done ? "bg-accent-400" : "bg-surface-300",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "truncate pr-3 text-[10.5px] font-medium tracking-wide uppercase transition-colors",
                    current
                      ? "text-brand-700"
                      : done
                        ? "text-ink-500"
                        : "text-ink-300",
                  )}
                >
                  {s.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile compact */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="flex gap-1.5" aria-hidden>
          {STAGES.map((s) => (
            <span
              key={s.level}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                stage > s.level
                  ? "bg-accent-500"
                  : stage === s.level
                    ? "bg-accent-600"
                    : "bg-surface-300",
              )}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium text-brand-700">
          {STAGES.find((s) => s.level === stage)?.title}
        </span>
      </div>
    </div>
  );
}
