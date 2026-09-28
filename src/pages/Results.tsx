import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Info } from "lucide-react";
import { useDiscovery } from "../store/useDiscovery";
import { buildUserProfile, PROFILE_DISPLAY, rankResults, compatibilityWord } from "../engine/profile";
import { SpecialtyCard } from "../components/SpecialtyCard";
import { AttributeBar } from "../components/AttributeBar";
import { getCompareSelection, toggleCompare } from "../utils/compareSelection";
import { DisclaimerNotice } from "../components/legal/DisclaimerNotice";
import { usePageTitle } from "../hooks/usePageTitle";

const PROFILE_LABELS: Record<string, string> = {
  duty_predictability: "Predictable schedule",
  emergency_burden: "Emergency tolerance",
  patient_interaction: "Patient interaction",
  diagnostic_reasoning: "Diagnostic reasoning",
  procedural_intensity: "Procedural interest",
  longitudinal_patient_relationship: "Long-term patient relationships",
  lifestyle_predictability: "Protected personal time",
  cognitive_work: "Cognitive complexity",
};

function preferenceWord(value: number): string {
  if (value >= 3.6) return "Strong preference";
  if (value >= 2.5) return "Moderate preference";
  if (value >= 1.5) return "Mildly indicated";
  return "Not a stated priority";
}

function ProfileBar({ attributeKey, value }: { attributeKey: string; value: number }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-ink-800">
          {PROFILE_LABELS[attributeKey] ?? attributeKey}
        </span>
        <span className="mono-label text-ink-400">{preferenceWord(value)}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <AttributeBar value={value} tone="accent" className="h-2.5 flex-1" />
        <span className="w-7 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-300">
          {value / 5}/5
        </span>
      </div>
    </div>
  );
}

export function Results() {
  usePageTitle("Your results | Branchly");
  const { pool, answeredCount, reset } = useDiscovery();
  const [compare, setCompare] = useState<string[]>(() => getCompareSelection());
  const [showDetail, setShowDetail] = useState(false);

  const answers = useDiscovery().state.answers;
  const profileValues = useMemo(() => buildUserProfile(answers), [answers]);
  const ranked = useMemo(() => rankResults(pool.results), [pool]);
  const rankedIds = useMemo(() => new Set(ranked.slice(0, 6).map((r) => r.specialty.id)), [ranked]);
  const lowerAndOut = useMemo(
    () =>
      [...pool.lower, ...pool.eliminated]
        .filter((r) => !rankedIds.has(r.specialty.id))
        .sort((a, b) => b.score - a.score),
    [pool, rankedIds],
  );

  const onToggleCompare = (id: string) => {
    const next = toggleCompare(id);
    setCompare(next);
  };

  if (answeredCount === 0) {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-4 py-20 text-center">
        <FlaskConical className="h-10 w-10 text-brand-300" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
          No profile yet
        </h1>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-ink-500">
          Your specialty profile is built from the answers you provide during discovery.
          Answer a few questions and the pool starts narrowing immediately.
        </p>
        <Link
          to="/discover"
          className="mt-6 flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Start Branch Discovery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10">
      <DisclaimerNotice className="mb-8 max-w-3xl" />
      <header className="max-w-3xl">
        <span className="mono-label text-accent-700">Based on your answers</span>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Your specialty profile
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
          Built from {answeredCount} answers and your branch pool of {pool.remaining.length}.
          These are reflections of your stated preferences — not an objective ranking.
        </p>
      </header>

      {/* Preference profile */}
      <section className="mt-8">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-ink-900">
            Your preferred working style
          </h2>
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            className="flex items-center gap-1 text-[11.5px] font-medium text-ink-400 hover:text-ink-700"
            aria-expanded={showDetail}
          >
            <Info className="h-3.5 w-3.5" />
            How this is derived
          </button>
        </div>

        {PROFILE_DISPLAY.some((k) => k in profileValues) ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PROFILE_DISPLAY.filter((k) => k in profileValues).map((key) => (
              <ProfileBar key={key} attributeKey={key} value={profileValues[key]} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-surface-300 bg-white p-4 text-[13px] text-ink-400">
            Answer questions marked under Working life and Clinical orientation to see a
            preference profile here.
          </p>
        )}

        {showDetail && (
          <p className="mt-3 max-w-2xl rounded-lg bg-surface-100 p-4 text-[12.5px] leading-relaxed text-ink-500">
            Each profile bar aggregates the direction and strength of every relevant answer
            (“more of this” vs “less of this”), pulled toward neutral by “I'm unsure”
            responses. It reflects your stated preferences — it is not a measurement of you.
          </p>
        )}
      </section>

      {/* Strongest matches */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink-900">
              Your strongest matches
            </h2>
            <p className="mt-1 text-[13.5px] text-ink-500">
              High compatibility with your stated preferences at this point.
            </p>
          </div>
          <span className="mono-label text-ink-300">{ranked.length} in pool</span>
        </div>

        <motion.div
          layout
          className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {ranked.slice(0, 6).map((result, i) => (
            <motion.div
              key={result.specialty.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <SpecialtyCard
                result={result}
                rank={i + 1}
                selectedForCompare={compare.includes(result.specialty.id)}
                onToggleCompare={onToggleCompare}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Everything else */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Lower compatibility &amp; deprioritised
        </h2>
        <p className="mt-1 max-w-2xl text-[13.5px] text-ink-500">
          These branches still exist in the decision space — compatibility can change as you
          update answers, and institutional reality varies widely.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lowerAndOut.map((result) => (
            <div
              key={result.specialty.id}
              className="rounded-xl border border-surface-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="mono-label text-ink-300">{result.specialty.degree}</span>
                  <h3 className="truncate text-[15.5px] font-semibold text-ink-800">
                    {result.specialty.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-ink-400">
                    {compatibilityWord(result.score)}
                  </p>
                </div>
              </div>
              {result.conflicts[0] && (
                <p className="mt-3 border-t border-surface-100 pt-2.5 text-[12.5px] leading-relaxed text-ink-500">
                  {result.conflicts[0].text}
                </p>
              )}
              <div className="mt-3.5 flex items-center justify-between">
                <Link
                  to={`/specialty/${result.specialty.id}`}
                  className="text-[13px] font-semibold text-brand-700 hover:text-brand-900"
                >
                  View why
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleCompare(result.specialty.id)}
                  className={`rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors ${
                    compare.includes(result.specialty.id)
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-surface-200 text-ink-500 hover:border-brand-300"
                  }`}
                >
                  {compare.includes(result.specialty.id) ? "In compare" : "Compare"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-surface-200 pt-6">
        <p className="text-[13px] text-ink-500">

          Explore a thought experiment via the Sources page, then decide for yourself: this tool narrows; only you choose.
          Want to reconsider? Changing an earlier answer recomputes everything.
        </p>
        <Link
          to="/discover"
          className="rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Back to discovery
        </Link>
        <Link
          to="/compare"
          className={`rounded-md border border-surface-300 px-4 py-2 text-sm font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-800 ${
            compare.length < 2 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Compare selected ({compare.length})
        </Link>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-surface-300 px-4 py-2 text-sm font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-800"
        >
          Restart
        </button>
      </div>
    </div>
  );
}