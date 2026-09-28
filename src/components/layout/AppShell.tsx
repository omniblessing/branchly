import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { GitCompareArrows, LayoutGrid, Stethoscope } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../../utils/cn";
import { useDiscovery } from "../../store/useDiscovery";
import { INITIAL_BRANCH_COUNT } from "../../data/specialties";

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-ink-500 hover:bg-surface-100 hover:text-ink-900",
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

export function AppShell() {
  const { answeredCount, pool } = useDiscovery();
  const location = useLocation();
  const inDiscovery = location.pathname.startsWith("/discover");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Branchly home" className="shrink-0">
            <Logo variant="default" className="h-8" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/specialties" icon={<LayoutGrid className="h-4 w-4" />}>
              Specialties
            </NavItem>
            <NavItem to="/compare" icon={<GitCompareArrows className="h-4 w-4" />}>
              Compare
            </NavItem>
          </nav>

          <div className="flex items-center gap-3">
            {inDiscovery ? (
              <div className="flex items-center gap-3">
                <span className="mono-label hidden text-ink-400 sm:block">
                  {answeredCount} answered
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {pool.remaining.length} remaining
                </span>
              </div>
            ) : (
              <span className="mono-label hidden text-ink-400 sm:block">
                {INITIAL_BRANCH_COUNT} branches
              </span>
            )}
            <Link
              to="/discover"
              className={cn(
                "rounded-md bg-brand-900 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800",
                inDiscovery && "pointer-events-none opacity-0",
              )}
            >
              Start discovery
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

          <footer className="border-t border-surface-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-ink-400 max-w-xl">
              Branchly is a decision-support tool, not an objective ranking of specialties.
              Experience varies substantially by institution, state and practice setting.
              The final decision is yours �?� Explore. Compare. Decide for yourself.
            </p>
            <p className="mono-label text-ink-300">Deterministic �?� Explainable �?� Client-side</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
            <p className="mono-label text-ink-400">&copy; 2026 Branchly</p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link to="/sources" className="text-[11.5px] font-medium text-ink-500 hover:text-brand-800">Sources</Link>
              <span className="text-ink-300" aria-hidden="true">/</span>
              <Link to="/privacy" className="text-[11.5px] font-medium text-ink-500 hover:text-brand-800">Privacy</Link>
              <span className="text-ink-300" aria-hidden="true">/</span>
              <Link to="/terms" className="text-[11.5px] font-medium text-ink-500 hover:text-brand-800">Terms</Link>
              <span className="text-ink-300" aria-hidden="true">/</span>
              <Link to="/disclaimer" className="text-[11.5px] font-medium text-ink-500 hover:text-brand-800">Disclaimer</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
