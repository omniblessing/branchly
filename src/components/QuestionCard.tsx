import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CircleHelp, SkipForward } from "lucide-react";
import type { Question } from "../data/types";
import { UNSURE_OPTION_ID } from "../data/questions";
import { cn } from "../utils/cn";

interface Props {
  question: Question;
  selectedOptionId: string | null;
  answeredCount: number;
  canGoBack: boolean;
  isReviewing: boolean;
  onSelect: (optionId: string) => void;
  onSkip: (questionId: string) => void;
  onBack: () => void;
}

export function QuestionCard({
  question,
  selectedOptionId,
  answeredCount,
  canGoBack,
  isReviewing,
  onSelect,
  onSkip,
  onBack,
}: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[0_1px_2px_rgba(13,24,38,0.04)]"
      aria-live="polite"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="p-5 sm:p-7"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <span className="mono-label rounded bg-accent-50 px-2 py-1 text-accent-700">
              {question.category}
            </span>
            {isReviewing && (
              <span className="mono-label text-ink-300">Reviewing your answer</span>
            )}
          </div>

          <h1 className="text-balance text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-[26px]">
            {question.prompt}
          </h1>
          {question.context && (
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-500">
              {question.context}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2.5" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option) => {
              const selected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    "group flex w-full items-center gap-3.5 rounded-lg border px-4 py-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-brand-500 bg-brand-50/70 shadow-[inset_0_0_0_1px_var(--color-brand-500)]"
                      : "border-surface-200 bg-white hover:border-brand-300 hover:bg-surface-50",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected
                        ? "border-brand-600 bg-brand-600"
                        : "border-surface-300 group-hover:border-brand-400",
                    )}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span
                    className={cn(
                      "text-[15px] leading-snug transition-colors",
                      selected ? "font-medium text-brand-900" : "text-ink-700",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-surface-100 pt-4">
            <button
              type="button"
              onClick={() => onSelect(UNSURE_OPTION_ID)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-[13px] font-medium transition-colors",
                selectedOptionId === UNSURE_OPTION_ID
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-surface-300 text-ink-500 hover:border-brand-300 hover:text-brand-700",
              )}
            >
              <CircleHelp className="h-3.5 w-3.5" />
              I'm unsure
            </button>

            <button
              type="button"
              onClick={() => onSkip(question.id)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-700"
            >
              <SkipForward className="h-3.5 w-3.5" />
              Skip
            </button>

            <div className="ml-auto flex items-center gap-4">
              <span className="mono-label text-ink-300">{answeredCount} answered</span>
              <button
                type="button"
                onClick={onBack}
                disabled={!canGoBack}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-ink-500 transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            </div>
          </div>

          {isReviewing && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => onSelect(selectedOptionId ?? question.options[0].id)}
                className="rounded-md bg-brand-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Confirm & continue
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
