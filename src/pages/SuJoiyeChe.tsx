import { useState, type FormEvent } from "react";
import { Activity, ArrowRight, BarChart3, ShieldCheck } from "lucide-react";

const API_BASE = "https://su-joiye-che.thorfin662.workers.dev";

const BRANCHES = [
  "General Medicine",
  "Radiodiagnosis",
  "Dermatology",
  "Paediatrics",
  "General Surgery",
  "Orthopaedics",
  "Psychiatry",
  "Anaesthesiology",
  "Obstetrics & Gynaecology",
  "Ophthalmology",
  "ENT",
  "Pathology",
  "Respiratory Medicine",
  "Emergency Medicine",
  "Radiation Oncology",
  "Other",
];

type CompetitionStats = {
  totalCandidates: number;
  sameBranchCandidates: number;
  betterRankSameBranch: number;
  source: string;
  disclaimer: string;
};

export function SuJoiyeChe() {
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState<CompetitionStats | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedRank = Number(rank.replace(/,/g, "").trim());
    if (!Number.isSafeInteger(parsedRank) || parsedRank < 1) {
      setStats(null);
      setNotice("Enter a valid whole-number rank greater than zero.");
      return;
    }

    setLoading(true);
    setStats(null);
    setNotice("");

    try {
      const params = new URLSearchParams({
        rank: String(parsedRank),
        branch,
      });
      const response = await fetch(`${API_BASE}/api/competition?${params}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Competition data is temporarily unavailable.");
      }

      setStats({
        totalCandidates: data.totalCandidates,
        sameBranchCandidates: data.sameBranchCandidates,
        betterRankSameBranch: data.betterRankSameBranch,
        source: data.source,
        disclaimer: data.disclaimer,
      });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? `${error.message} Check that the Worker allows your live Branchly website origin.`
          : "Competition data is temporarily unavailable. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearResults() {
    setNotice("");
    setStats(null);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75">
              <Activity className="h-3.5 w-3.5" />
              PG counselling companion
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Your rank is one thing.
              <span className="mt-1 block text-accent-300">Your competition is another.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Explore submitted branch preferences and understand the competition around your
              rank. Built to support your decision—not promise an allotment.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-accent-300" />
              Privacy-conscious by design
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-accent-300" />
              Real data only—no fabricated counts
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:py-12">
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm sm:p-7">
          <span className="mono-label text-accent-700">01 / Check your standing</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">
            Where do you stand?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Enter your counselling rank and the branch you are considering to compare against
            submitted preferences.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="candidate-rank" className="mb-2 block text-sm font-medium text-ink-700">
                Your rank
              </label>
              <input
                id="candidate-rank"
                name="rank"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                required
                value={rank}
                onChange={(event) => {
                  setRank(event.target.value);
                  clearResults();
                }}
                placeholder="e.g. 12500"
                className="w-full rounded-lg border border-surface-300 bg-white px-3.5 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label htmlFor="preferred-branch" className="mb-2 block text-sm font-medium text-ink-700">
                Branch you are considering
              </label>
              <select
                id="preferred-branch"
                name="branch"
                value={branch}
                onChange={(event) => {
                  setBranch(event.target.value);
                  clearResults();
                }}
                className="w-full rounded-lg border border-surface-300 bg-white px-3.5 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {BRANCHES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Checking submitted data…" : "Check my standing"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {notice && (
            <div role="status" aria-live="polite" className="mt-4 rounded-lg border border-fit-low/20 bg-fit-low-bg p-3.5 text-sm leading-relaxed text-ink-700">
              {notice}
            </div>
          )}

          {stats && (
            <div role="status" aria-live="polite" className="mt-5 space-y-3">
              <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
                <p className="text-sm font-medium text-ink-600">Submitted candidates with a better rank who selected {branch}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-ink-950">{stats.betterRankSameBranch.toLocaleString("en-IN")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-surface-200 bg-white p-3">
                  <p className="text-xs leading-relaxed text-ink-500">Submitted candidates for this branch</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-ink-900">{stats.sameBranchCandidates.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-lg border border-surface-200 bg-white p-3">
                  <p className="text-xs leading-relaxed text-ink-500">Ranked submissions in dataset</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-ink-900">{stats.totalCandidates.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-ink-500">{stats.disclaimer} Counts reflect the current submitted dataset, not all candidates or official allotments.</p>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-surface-200 bg-white p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Competition insights</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Compare your rank against candidates who submitted the same branch preference.
              These preferences are not confirmed admissions.
            </p>
            <div className="mt-4 rounded-lg border border-surface-200 bg-surface-50 p-3 text-sm text-ink-600">
              <span className="font-semibold text-ink-800">Source: submitted preferences</span>
              <p className="mt-1">The comparison uses aggregate counts only. No individual candidate records are returned to this page.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 text-ink-900">
              <ShieldCheck className="h-5 w-5 text-brand-700" />
              <h2 className="font-semibold">Privacy first</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Public results contain aggregate counts only. Candidate names, phone numbers,
              marks, and timestamps are not sent to this public page.
            </p>
          </div>

          <p className="px-1 text-xs leading-relaxed text-ink-400">
            Counselling outcomes depend on eligibility, category, quota, seat matrix, choices,
            round rules and official allotment results. This tool is informational, not an
            admission guarantee.
          </p>
        </aside>
      </section>
    </div>
  );
}
