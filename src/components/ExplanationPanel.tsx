import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { ATTRIBUTE_META, type AttributeKey } from "../data/attributes";
import type { Effect, Question } from "../data/types";
import { UNSURE_OPTION_ID } from "../data/questions";
import { cn } from "../utils/cn";

interface Props {
  question: Question;
  selectedOptionId: string | null;
}

/**
 * Shows which specialty attributes the current answer touches —
 * the middle layer between "user answer" and "branch movement".
 */
export function ExplanationPanel({ question, selectedOptionId }: Props) {
  const option =
    selectedOptionId && selectedOptionId !== UNSURE_OPTION_ID
      ? question.options.find((o) => o.id === selectedOptionId)
      : undefined;

  const neutralEffect = { dir: 0 as const, strength: 0 };
  const entries: Array<[string, Effect | typeof neutralEffect]> = option
    ? (Object.entries(option.effects).filter(([, eff]) => eff.strength > 0) as Array<
        [string, Effect]
      >)
    : ([
        ...new Set(question.options.flatMap((o) => Object.keys(o.effects))),
      ].map((key) => [key, neutralEffect] as const));

  if (entries.length === 0) return null;

  return (
    <section className="rounded-xl border border-surface-200 bg-white/70 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="mono-label text-ink-400">
          {option ? "Your answer affects" : "This question weighs"}
        </span>
        {option && (
          <span className="truncate text-xs font-medium text-ink-700">“{option.label}”</span>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {entries.map(([key, effect]) => {
          const meta = ATTRIBUTE_META[key as AttributeKey];
          if (!meta) return null;
          const Icon = effect.dir === 1 ? ArrowUp : effect.dir === -1 ? ArrowDown : Minus;
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium",
                effect.dir === 1
                  ? "border-fit-strong/30 bg-fit-strong-bg text-fit-strong"
                  : effect.dir === -1
                    ? "border-fit-low/30 bg-fit-low-bg text-fit-low"
                    : "border-surface-200 bg-surface-100 text-ink-500",
              )}
              title={
                effect.dir === 1
                  ? "You are looking for more of this"
                  : effect.dir === -1
                    ? "You are looking for less of this"
                    : "Neutral / unsure — low weight"
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
