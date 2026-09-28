import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import type { PoolState } from "../data/types";
import { BranchPool } from "./BranchPool";
import { cn } from "../utils/cn";

/** Mobile: a bottom summary bar that expands into a scrollable sheet. */
export function PoolSheet({ pool }: { pool: PoolState }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-surface-200 bg-white/95 px-4 py-3 backdrop-blur-md"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            <span
              className="h-1.5 w-1.5 rounded-full bg-fit-strong"
              title="Compatible"
            />
            <span className="h-1.5 w-1.5 rounded-full bg-fit-moderate" title="Lower compatibility" />
            <span className="h-1.5 w-1.5 rounded-full bg-fit-low" title="Eliminated" />
          </span>
          <span className="text-[13px] font-semibold text-ink-900">Your branch pool</span>
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-brand-700">
          {pool.remaining.length} remaining
          <ChevronUp className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-brand-950/40 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl"
              role="dialog"
              aria-label="Your branch pool"
            >
              <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-surface-300"
                />
                <span className="mono-label text-ink-500">Branch pool</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md p-1.5 text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-700",
                  )}
                  aria-label="Close branch pool"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="scroll-slim max-h-[calc(78vh-52px)] overflow-y-auto px-4 pt-4">
                <BranchPool pool={pool} compact />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
