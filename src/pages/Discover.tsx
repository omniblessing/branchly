import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, RotateCcw } from "lucide-react";
import { useDiscovery } from "../store/useDiscovery";
import { StageProgress } from "../components/StageProgress";
import { QuestionCard } from "../components/QuestionCard";
import { ExplanationPanel } from "../components/ExplanationPanel";
import { BranchPool } from "../components/BranchPool";
import { PoolSheet } from "../components/PoolSheet";
import { MIN_QUESTIONS_TO_FINISH } from "../data/questions";

function CompletionCard({
  answeredCount,
  remaining,
  eliminated,
  onRestart,
}: {
  answeredCount: number;
  remaining: number;
  eliminated: number;
  onRestart: () => void;
}) {
  const enoughSignal = answeredCount >= MIN_QUESTIONS_TO_FINISH;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-surface-200 bg-white p-6 sm:p-8"
    >
      <span className="mono-label rounded bg-accent-50 px-2 py-1 text-accent-700">
        Discovery complete
      </span>
      <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ink-900">
        {enoughSignal
          ? "You've mapped your preferences."
          : "You've covered the questions you wanted to."}
      </h1>
      <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-500">
        {enoughSignal
          ? `${answeredCount} answers in. The pool has narrowed to ${remaining} branches with ${eliminated} deprioritised — enough signal to compare them honestly.`
          : `You answered ${answeredCount} questions. That's still useful, but a few more answers will separate your top branches more clearly.`}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md sm:grid-cols-3">
        {[
          { label: "Questions answered", value: String(answeredCount) },
          { label: "Remaining in pool", value: String(remaining) },
          { label: "Deprioritised", value: String(eliminated) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-surface-200 bg-surface-50 px-4 py-3"
          >
            <dt className="mono-label text-ink-400">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-brand-800">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          to="/results"
          className="group flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          See your specialty profile
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-800"
        >
          <ClipboardList className="h-4 w-4" />
          Change answers / restart
        </button>
      </div>

      {!enoughSignal && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
          <RotateCcw className="h-3.5 w-3.5" />
          You can go back at any time and answer the skipped questions.
        </p>
      )}
    </motion.section>
  );
}

export function Discover() {
  const {
    currentQuestion,
    currentOptionId,
    pool,
    stage,
    answeredCount,
    canGoBack,
    isReviewing,
    answer,
    skip,
    back,
    reset,
  } = useDiscovery();

  const finishing = currentQuestion === null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 lg:pb-14 lg:pt-8">
      <div className="mb-6 rounded-xl border border-surface-200 bg-white px-4 py-3.5 sm:px-5">
        <StageProgress stage={stage} answered={answeredCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {finishing ? (
            <CompletionCard
              answeredCount={answeredCount}
              remaining={pool.remaining.length}
              eliminated={pool.eliminated.length}
              onRestart={reset}
            />
          ) : (
            <>
              <QuestionCard
                question={currentQuestion}
                selectedOptionId={currentOptionId}
                answeredCount={answeredCount}
                canGoBack={canGoBack}
                isReviewing={isReviewing}
                onSelect={(oid) => answer(currentQuestion.id, oid)}
                onSkip={(qid) => skip(qid)}
                onBack={back}
              />
              <div className="mt-4">
                <ExplanationPanel question={currentQuestion} selectedOptionId={currentOptionId} />
              </div>
            </>
          )}

          <p className="mt-5 text-[11.5px] leading-relaxed text-ink-300">
            Answers recompute the branch pool from your full history — changing an earlier
            answer re-derives the pool from scratch, so nothing is lost or corrupted.
          </p>
        </div>

        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 rounded-xl border border-surface-200 bg-white p-5 shadow-[0_1px_2px_rgba(13,24,38,0.04)]">
            <BranchPool pool={pool} />
          </div>
        </aside>
      </div>

      <PoolSheet pool={pool} />
    </div>
  );
}