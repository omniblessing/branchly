import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Filter,
  GitCompareArrows,
  ListTree,
  ScanSearch,
  Split,
  Target,
} from "lucide-react";
import { INITIAL_BRANCH_COUNT } from "../data/specialties";
import { QUESTIONS, STAGES } from "../data/questions";

const MOCK_POOL_STRONG = ["Dermatology", "Psychiatry", "Radiodiagnosis", "Ophthalmology", "Pathology"];
const MOCK_POOL_MODERATE = ["General Medicine", "Ophthalmology", "ENT"];
const MOCK_POOL_OUT = ["General Surgery", "Orthopaedics", "Anaesthesiology"];

function HeroMockup() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[0_24px_60px_-24px_rgba(11,31,58,0.25)]"
      >
        {/* Mini app chrome */}
        <div className="flex items-center justify-between border-b border-surface-200 bg-surface-50 px-4 py-2.5">
          <span className="mono-label text-ink-400">Discovery · Working life</span>
          <span className="mono-label rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
            12 remaining
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[1.4fr_1fr] sm:p-5">
          {/* Question side */}
          <div>
            <span className="mono-label rounded bg-accent-50 px-1.5 py-0.5 text-accent-700">
              Working life
            </span>
            <p className="mt-2.5 text-[14.5px] font-semibold leading-snug text-ink-900">
              How do you feel about being called in for emergencies at unpredictable hours?
            </p>
            <div className="mt-3 space-y-1.5">
              {["I enjoy them — that's where I learn fastest", "I can tolerate them"].map(
                (label, i) => (
                  <div
                    key={label}
                    className={
                      i === 0
                        ? "flex items-center gap-2.5 rounded-md border border-brand-500 bg-brand-50/60 px-3 py-2 text-[12.5px] font-medium text-brand-900"
                        : "flex items-center gap-2.5 rounded-md border border-surface-200 px-3 py-2 text-[12.5px] text-ink-600"
                    }
                  >
                    <span
                      className={
                        i === 0
                          ? "h-2.5 w-2.5 rounded-full border-2 border-brand-600 bg-brand-600"
                          : "h-2.5 w-2.5 rounded-full border border-surface-300"
                      }
                    />
                    {label}
                  </div>
                ),
              )}
              <div className="flex items-center gap-2.5 rounded-md border border-dashed border-surface-300 px-3 py-2 text-[12.5px] text-ink-400">
                <span className="h-2.5 w-2.5 rounded-full border border-surface-300" />I'd rather
                avoid them
              </div>
            </div>

            <div className="mt-3.5 border-t border-surface-100 pt-3">
              <span className="mono-label text-ink-400">Your answer affects</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["Emergency burden ↑", "Night duty ↑", "Acute care ↑"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded border border-fit-strong/30 bg-fit-strong-bg px-1.5 py-0.5 text-[10.5px] font-medium text-fit-strong"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pool side */}
          <div className="rounded-lg border border-surface-200 bg-surface-50 p-3">
            <div className="mb-2 flex items-baseline justify-between border-b border-surface-200 pb-2">
              <span className="mono-label text-ink-500">Your branch pool</span>
              <span className="text-sm font-semibold text-brand-700">
                12<span className="ml-1 text-[10px] font-normal text-ink-400">remaining</span>
              </span>
            </div>
            <ul className="space-y-1">
              {MOCK_POOL_STRONG.map((name, i) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-2 rounded px-1.5 py-1 text-[12px] font-medium text-ink-800"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-fit-strong" />
                  {name}
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 border-t border-surface-200 pt-2">
              <span className="mono-label text-fit-moderate">Lower compatibility</span>
              <ul className="mt-1 space-y-1">
                {MOCK_POOL_MODERATE.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 px-1.5 py-0.5 text-[12px] text-ink-500"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-fit-moderate" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 border-t border-surface-200 pt-2">
              <span className="mono-label text-fit-low">Eliminated</span>
              <ul className="mt-1 space-y-1">
                {MOCK_POOL_OUT.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 px-1.5 py-0.5 text-[12px] text-ink-400 line-through"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-fit-low" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating explanation chip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute -bottom-5 left-4 hidden rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 shadow-lg sm:block"
      >
        <p className="text-[12px] leading-snug text-ink-600">
          <span className="font-semibold text-ink-900">General Surgery</span> moved out — you
          indicated avoiding unpredictable emergency work.
        </p>
      </motion.div>
    </div>
  );
}

const steps = [
  {
    icon: Target,
    title: "Answer meaningful questions",
    body: "Six stages, from working-life priorities to specialty-specific differentiators. Every question maps to concrete specialty attributes — never random personality prompts.",
  },
  {
    icon: ListTree,
    title: "Watch the pool narrow",
    body: "The live branch pool updates with every answer. Compatible branches stay in play; contradictory ones move out with a generated, attribute-level explanation.",
  },
  {
    icon: ScanSearch,
    title: "Understand the trade-offs",
    body: "Your final profile shows why each branch fits, where it may disappoint, and what to investigate in real departments before you commit.",
  },
];

const principles = [
  {
    icon: Split,
    title: "Hard filters",
    body: "A strong contradiction — “I absolutely do not want operative work” — removes or deprioritises surgical-heavy branches outright.",
  },
  {
    icon: Filter,
    title: "Soft compatibility",
    body: "Preferences normally adjust compatibility instead of deleting branches, because specialty experience varies enormously between institutions.",
  },
  {
    icon: GitCompareArrows,
    title: "Explainable, deterministic",
    body: "No black box. Answer → attributes → branch movement, recomputed from your full answer history every time you change your mind.",
  },
];

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-200 bg-white">
        <div aria-hidden className="texture-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50/80 to-transparent"
        />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-20">
          <div>
            <span className="mono-label inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              For Indian MBBS graduates
            </span>

            <h1 className="text-balance mt-6 text-[34px] font-semibold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-[54px]">
              Find the PG branch that fits the doctor you want to become.
            </h1>

            <p className="mt-5 max-w-xl text-balance text-[16.5px] leading-relaxed text-ink-500">
              Not a personality quiz. A structured specialty decision engine built around
              the realities of postgraduate medical training.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/discover"
                className="group flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-800 hover:shadow-[0_8px_24px_-8px_rgba(11,31,58,0.5)]"
              >
                Start Branch Discovery
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/specialties"
                className="rounded-lg border border-surface-300 bg-white px-5 py-3 text-[14.5px] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-800"
              >
                Explore All Specialties
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-surface-200 pt-6">
              {[
                { value: `${INITIAL_BRANCH_COUNT}`, label: "PG branches modelled" },
                { value: `${QUESTIONS.length}`, label: "high-information questions" },
                { value: `${STAGES.length}`, label: "decision stages" },
                { value: "100%", label: "deterministic & client-side" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xl font-semibold tabular-nums tracking-tight text-brand-800">
                    {stat.value}
                  </dt>
                  <dd className="mt-0.5 text-[11.5px] text-ink-400">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroMockup />
        </div>

        {/* ECG divider */}
        <svg
          aria-hidden
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-10 w-full text-brand-300/60"
        >
          <path
            d="M0 30h180l14-18 12 36 16-48 14 30h210l12-14 10 28 14-36 12 22h260l14-16 12 32 16-42 12 26h250l12-12 10 24 12-30 10 18h278"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </section>

      {/* How it works */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <span className="mono-label text-accent-700">How it works</span>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Choosing your PG branch shouldn't be a guessing game.
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-500">
              {INITIAL_BRANCH_COUNT} specialties. Hundreds of trade-offs. One structured way
              to explore them.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(13,24,38,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-white">
                    <step.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[11px] text-ink-300">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-surface-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-20">
          <div>
            <span className="mono-label text-accent-700">Decision engine</span>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Built to narrow the pool — not to label you.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-500">
              Answer meaningful questions. Watch the specialty pool narrow. Understand why
              each branch survives or disappears. The engine stays transparent: every
              movement traces back to an answer, an attribute and a specialty value.
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-400">
              Based on the preferences you provide, branches gain or lose compatibility.
              The app never claims an objective “best specialty” — the decision remains
              yours.
            </p>
            <Link
              to="/discover"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-brand-700 hover:text-brand-900"
            >
              Start discovery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-surface-200 bg-surface-50 p-5"
              >
                <p.icon className="h-5 w-5 text-accent-600" strokeWidth={1.8} />
                <h3 className="mt-3 text-[14.5px] font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-brand-900">
        <div aria-hidden className="texture-dots absolute inset-0 opacity-20" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Your specialty pool is waiting.
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-brand-200">
              {INITIAL_BRANCH_COUNT} branches in play. Start with what matters most about
              how you want to work.
            </p>
          </div>
          <Link
            to="/discover"
            className="group flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-[14.5px] font-semibold text-brand-900 transition-all hover:bg-accent-50"
          >
            Start Discovery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
