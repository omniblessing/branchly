import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PoolState, SpecialtyResult } from "../data/types";
import { cn } from "../utils/cn";

function PoolRow({
  result,
  tone,
}: {
  result: SpecialtyResult;
  tone: "strong" | "moderate" | "eliminated";
}) {
  const [open, setOpen] = useState(false);
  const reason = result.conflicts[0]?.text;
  const hasReason = Boolean(reason);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, transition: { duration: 0.22 } }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
          tone === "eliminated" ? "opacity-70" : "hover:bg-surface-100",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            tone === "strong" && "bg-fit-strong",
            tone === "moderate" && "bg-fit-moderate",
            tone === "eliminated" && "bg-fit-low",
          )}
        />
        <Link
          to={`/specialty/${result.specialty.id}`}
          className={cn(
            "min-w-0 flex-1 truncate text-[13px] font-medium transition-colors hover:text-brand-700",
            tone === "strong" ? "text-ink-900" : "text-ink-500 line-through decoration-ink-300/70",
          )}
          style={tone === "eliminated" ? { textDecorationColor: "var(--color-fit-low)" } : undefined}
        >
          {result.specialty.name}
        </Link>
        {hasReason && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`Why is ${result.specialty.name} ${
              tone === "eliminated" ? "eliminated" : "lower compatibility"
            }`}
            className="rounded p-1 text-ink-300 opacity-0 transition-opacity hover:text-ink-600 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && reason && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-2 pb-1.5 pl-6 text-[12px] leading-relaxed text-ink-500"
          >
            {reason}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function SectionHeader({
  label,
  count,
  tone,
  defaultOpen,
  collapsible = true,
}: {
  label: string;
  count: number;
  tone: "strong" | "moderate" | "eliminated";
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? count > 0);
  const showToggle = collapsible && count > 0;

  return (
    <div className="mb-1.5 flex items-center justify-between">
      <span
        className={cn(
          "mono-label",
          tone === "strong" && "text-fit-strong",
          tone === "moderate" && "text-fit-moderate",
          tone === "eliminated" && "text-fit-low",
        )}
      >
        {label}
      </span>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 rounded p-0.5 text-ink-400 transition-colors hover:text-ink-700"
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
        >
          <span className="mono-label">{count}</span>
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      ) : (
        <span className="mono-label text-ink-300">{count}</span>
      )}
    </div>
  );
}

export function BranchPool({ pool, compact = false }: { pool: PoolState; compact?: boolean }) {
  const [showLower, setShowLower] = useState(true);
  const [showEliminated, setShowEliminated] = useState(false);

  const remaining = pool.remaining.length;
  const total = pool.results.length;

  return (
    <div className={cn("flex flex-col", compact ? "pb-4" : "")}>
      <div className="mb-4 flex items-baseline justify-between gap-2 border-b border-surface-200 pb-3">
        <span className="mono-label text-ink-500">Your branch pool</span>
        <span className="text-right">
          <span
            className={cn(
              "text-lg font-semibold tracking-tight tabular-nums",
              remaining === 0 ? "text-fit-low" : "text-brand-700",
            )}
          >
            {remaining}
          </span>
          <span className="ml-1 text-xs text-ink-400">remaining</span>
        </span>
      </div>

      {/* Compatible */}
      <SectionHeader
        label="Compatible"
        count={pool.compatible.length}
        tone="strong"
        defaultOpen
        collapsible={false}
      />
      {pool.compatible.length === 0 ? (
        <p className="px-2 py-2 text-xs leading-relaxed text-ink-400">
          No branches currently sit comfortably above the compatibility threshold —
          one more question will usually separate these specialties.
        </p>
      ) : (
        <ul className="mb-4 space-y-0.5">
          <AnimatePresence initial={false}>
            {pool.compatible.map((r) => (
              <PoolRow key={r.specialty.id} result={r} tone="strong" />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Lower compatibility */}
      <div className="border-t border-surface-100 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowLower((v) => !v)}
            className="flex flex-1 items-center justify-between rounded py-1 text-left"
            aria-expanded={showLower}
          >
            <span className="mono-label text-fit-moderate">Lower compatibility</span>
            <span className="flex items-center gap-1">
              <span className="mono-label text-ink-300">{pool.lower.length}</span>
              {showLower ? (
                <ChevronUp className="h-3.5 w-3.5 text-ink-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              )}
            </span>
          </button>
        </div>
        {showLower &&
          (pool.lower.length === 0 ? (
            <p className="px-2 py-2 text-xs leading-relaxed text-ink-400">
              Nothing has dropped into lower compatibility yet — your preferences are
              still broad.
            </p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              <AnimatePresence initial={false}>
                {pool.lower.map((r) => (
                  <PoolRow key={r.specialty.id} result={r} tone="moderate" />
                ))}
              </AnimatePresence>
            </ul>
          ))}
      </div>

      {/* Eliminated */}
      <div className="mt-3 border-t border-surface-100 pt-3">
        <button
          type="button"
          onClick={() => setShowEliminated((v) => !v)}
          className="flex w-full items-center justify-between rounded py-1 text-left"
          aria-expanded={showEliminated}
        >
          <span className="mono-label text-fit-low">Eliminated / deprioritised</span>
          <span className="flex items-center gap-1">
            <span className="mono-label text-ink-300">{pool.eliminated.length}</span>
            {showEliminated ? (
              <ChevronUp className="h-3.5 w-3.5 text-ink-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            )}
          </span>
        </button>
        {showEliminated &&
          (pool.eliminated.length === 0 ? (
            <p className="px-2 py-2 text-xs leading-relaxed text-ink-400">
              No branches have been permanently eliminated. Your preferences are still
              broad.
            </p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              <AnimatePresence initial={false}>
                {pool.eliminated.map((r) => (
                  <PoolRow key={r.specialty.id} result={r} tone="eliminated" />
                ))}
              </AnimatePresence>
            </ul>
          ))}
      </div>

      <p className="mt-4 border-t border-surface-100 pt-3 text-[11px] leading-relaxed text-ink-300">
        Compatibility reflects your stated preferences, not objective quality. Experience
        varies substantially by institution.
      </p>
      <p className="mt-1 text-[11px] text-ink-300">
        Showing {remaining} of {total} branches in play.
      </p>
    </div>
  );
}
