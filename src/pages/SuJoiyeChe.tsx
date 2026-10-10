import { useMemo, useState, type FormEvent } from "react";
import { Activity, ArrowRight, BarChart3, Check, ShieldCheck } from "lucide-react";

const API_BASE = "https://su-joiye-che.thorfin662.workers.dev";
const BRANCHES = [
  "General Medicine", "Radiodiagnosis", "Dermatology", "Paediatrics",
  "General Surgery", "Orthopaedics", "Psychiatry", "Anaesthesiology",
  "Obstetrics & Gynaecology", "Ophthalmology", "ENT", "Pathology",
  "Respiratory Medicine", "Emergency Medicine", "Radiation Oncology", "Other",
];

type RankEntry = { rank: number; branch: string };
type BranchResult = {
  branch: string;
  total: number;
  ahead: number;
  sameRank: number;
  behind: number;
  entries: RankEntry[];
};

export function SuJoiyeChe() {
  const [rank, setRank] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["General Medicine"]);
  const [results, setResults] = useState<BranchResult[]>([]);
  const [totalRanked, setTotalRanked] = useState(0);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeBranch, setActiveBranch] = useState("General Medicine");

  const alternatives = useMemo(
    () => results.slice().sort((a, b) => a.ahead - b.ahead || a.total - b.total),
    [results],
  );

  function toggleBranch(branch: string) {
    setSelectedBranches(current => {
      if (current.includes(branch)) {
        const next = current.filter(item => item !== branch);
        return next;
      }
      return [...current, branch];
    });
    setResults([]);
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedRank = Number(rank.replace(/,/g, "").trim());
    if (!Number.isSafeInteger(parsedRank) || parsedRank < 1) {
      setNotice("Enter a valid whole-number rank greater than zero.");
      return;
    }
    if (selectedBranches.length === 0) {
      setNotice("Select at least one preferred branch.");
      return;
    }

    setLoading(true);
    setNotice("");
    setResults([]);
    try {
      const params = new URLSearchParams({
        rank: String(parsedRank),
        branches: selectedBranches.join("|"),
      });
      const response = await fetch(`${API_BASE}/api/rank-list?${params}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Rank-list data is temporarily unavailable.");
      }
      const cleanResults = (data.branches || []).map((item: BranchResult) => ({
        branch: String(item.branch),
        total: Number(item.total) || 0,
        ahead: Number(item.ahead) || 0,
        sameRank: Number(item.sameRank) || 0,
        behind: Number(item.behind) || 0,
        entries: Array.isArray(item.entries) ? item.entries
          .map((entry: RankEntry) => ({ rank: Number(entry.rank), branch: String(entry.branch) }))
          .filter((entry: RankEntry) => Number.isSafeInteger(entry.rank) && entry.rank > 0)
          .sort((a: RankEntry, b: RankEntry) => a.rank - b.rank) : [],
      }));
      setResults(cleanResults);
      setTotalRanked(Number(data.totalRanked) || 0);
      if (cleanResults.length) setActiveBranch(cleanResults[0].branch);
      if (!cleanResults.length) setNotice("No matching submitted preferences were found for these branches.");
    } catch (error) {
      setNotice(error instanceof Error
        ? `${error.message} The Worker must have the /api/rank-list endpoint and allow your Branchly website origin.`
        : "Rank-list data is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentRank = Number(rank.replace(/,/g, "").trim());
  const current = results.find(item => item.branch === activeBranch);

  return (
    <div className="min-h-screen bg-surface-50">
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75">
              <Activity className="h-3.5 w-3.5" /> PG counselling companion
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Your rank is one thing.
              <span className="mt-1 block text-accent-300">Your competition is another.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Choose the branches you want. See submitted rank positions and compare alternatives
              with fewer higher-ranked competitors—not a promise of admission.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="h-4 w-4 text-accent-300" /> Anonymous rank data</span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"><BarChart3 className="h-4 w-4 text-accent-300" /> Based on submitted preferences</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-12">
        <div className="h-fit rounded-2xl border border-surface-200 bg-white p-5 shadow-sm sm:p-7">
          <span className="mono-label text-accent-700">01 / Your preferences</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">Build your shortlist</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">Enter your rank and select every branch you want to compare.</p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="candidate-rank" className="mb-2 block text-sm font-medium text-ink-700">Your NEET PG rank</label>
              <input id="candidate-rank" name="rank" type="number" min="1" step="1" inputMode="numeric" required value={rank}
                onChange={event => { setRank(event.target.value); setResults([]); setNotice(""); }}
                placeholder="e.g. 12500"
                className="w-full rounded-lg border border-surface-300 bg-white px-3.5 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-ink-700">Branches you are considering</label>
                <span className="text-xs text-ink-400">{selectedBranches.length} selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BRANCHES.map(branch => {
                  const checked = selectedBranches.includes(branch);
                  return <button key={branch} type="button" aria-pressed={checked} onClick={() => toggleBranch(branch)}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${checked ? "border-accent-500 bg-accent-50 font-medium text-ink-900" : "border-surface-200 bg-white text-ink-600 hover:border-surface-300"}`}>
                    <span>{branch}</span>{checked && <Check className="h-4 w-4 shrink-0 text-accent-700" />}
                  </button>;
                })}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
              {loading ? "Analysing submitted ranks…" : "Analyse my options"}{!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          {notice && <div role="status" aria-live="polite" className="mt-4 rounded-lg border border-fit-low/20 bg-fit-low-bg p-3.5 text-sm leading-relaxed text-ink-700">{notice}</div>}
          <div className="mt-5 rounded-lg border border-surface-200 bg-surface-50 p-3 text-xs leading-relaxed text-ink-500">
            Only anonymous rank and branch preference should be returned to this page. Names, phone numbers, marks, timestamps and candidate IDs must remain private.
          </div>
        </div>

        <div className="space-y-5">
          {results.length > 0 ? <>
            <div className="rounded-2xl border border-surface-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="mono-label text-accent-700">02 / Competition snapshot</span>
                  <h2 className="mt-2 text-xl font-semibold text-ink-900">Your branch comparison</h2>
                </div>
                <div className="rounded-lg bg-surface-50 px-3 py-2 text-right">
                  <p className="text-xs text-ink-500">Valid ranked submissions</p>
                  <p className="text-lg font-semibold tabular-nums text-ink-900">{totalRanked.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {alternatives.map(item => <button type="button" key={item.branch} onClick={() => setActiveBranch(item.branch)}
                  className={`w-full rounded-xl border p-3 text-left transition ${activeBranch === item.branch ? "border-accent-500 bg-accent-50" : "border-surface-200 hover:bg-surface-50"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-ink-900">{item.branch}</span>
                    <span className="text-xs text-ink-500">{item.ahead.toLocaleString("en-IN")} better-ranked competitors</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <span className="text-ink-500">Total <strong className="text-ink-800">{item.total.toLocaleString("en-IN")}</strong></span>
                    <span className="text-ink-500">Same rank <strong className="text-ink-800">{item.sameRank.toLocaleString("en-IN")}</strong></span>
                    <span className="text-ink-500">Behind <strong className="text-ink-800">{item.behind.toLocaleString("en-IN")}</strong></span>
                  </div>
                </button>)}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">Alternatives are sorted by fewer submitted candidates with better numerical ranks. This is a preference comparison, not an admission probability.</p>
            </div>

            {current && <div className="rounded-2xl border border-surface-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="mono-label text-accent-700">03 / Rank list</span>
                  <h2 className="mt-2 text-xl font-semibold text-ink-900">{current.branch}</h2>
                  <p className="mt-1 text-sm text-ink-500">Submitted ranks ordered from best to worst</p>
                </div>
                <span className="rounded-lg bg-surface-50 px-3 py-2 text-sm text-ink-600">{current.total.toLocaleString("en-IN")} submissions</span>
              </div>
              <div className="mt-4 space-y-1.5">
                {current.entries.map((entry, index) => {
                  const isUser = entry.rank === currentRank;
                  return <div key={`${entry.rank}-${index}`} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${isUser ? "border-accent-500 bg-accent-50 ring-1 ring-accent-300" : "border-surface-100 bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-10 text-xs tabular-nums text-ink-400">#{index + 1}</span>
                      <span className={`text-sm tabular-nums ${isUser ? "font-bold text-accent-700" : "text-ink-800"}`}>{entry.rank.toLocaleString("en-IN")}</span>
                    </div>
                    {isUser ? <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-semibold text-accent-700">YOUR RANK</span> : <span className="text-xs text-ink-400">{entry.rank < currentRank ? "Ahead" : entry.rank > currentRank ? "Behind" : "Same rank"}</span>}
                  </div>;
                })}
                {!current.entries.some(entry => entry.rank === currentRank) && <div className="rounded-xl border border-dashed border-accent-500 bg-accent-50 p-4">
                  <p className="font-semibold text-accent-700">Your rank: {currentRank.toLocaleString("en-IN")}</p>
                  <p className="mt-1 text-sm text-ink-600">No submission with your exact rank appears in this branch's list. Your position relative to these entries is between the nearest better and worse ranks.</p>
                </div>}
              </div>
            </div>}
          </> : <div className="rounded-2xl border border-surface-200 bg-white p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><BarChart3 className="h-6 w-6" /></div>
            <h2 className="mt-4 text-xl font-semibold text-ink-900">Your rank intelligence, in one place</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-500">After you submit your rank and preferred branches, this panel will show anonymous rank lists, your highlighted position, and alternative branches ordered by the number of better-ranked submissions.</p>
            <div className="mt-6 space-y-3">
              {["Rank-ordered list for each branch", "Your position highlighted", "Alternative branches ranked by fewer competitors ahead"].map(item => <div key={item} className="flex items-center gap-2 text-sm text-ink-600"><Check className="h-4 w-4 text-accent-700" />{item}</div>)}
            </div>
          </div>}
          <p className="px-1 text-xs leading-relaxed text-ink-400">Dataset reflects voluntary submitted preferences, not every NEET PG candidate or official allotments. Outcomes also depend on eligibility, category, quota, seats, choices and counselling rules.</p>
        </div>
      </section>
    </div>
  );
}
