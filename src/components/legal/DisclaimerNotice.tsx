import { ShieldCheck } from "lucide-react";
import { cn } from "../../utils/cn";

export function DisclaimerNotice({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-700" />
      <div>
        <p className="text-[13px] font-semibold text-brand-900">
          Decision support, not a directive
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
          Branchly provides informational decision support and does not determine which
          specialty a user should choose. Results reflect your stated preferences through a
          structured model — they are a starting point for further research, not a directive.
        </p>
      </div>
    </aside>
  );
}
