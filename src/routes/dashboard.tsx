import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  FileLock2,
  Radar,
  Repeat,
  ScrollText,
  ShieldCheck,
  Stamp,
  UserCheck,
  Users,
} from "lucide-react";
import logo from "@/assets/toollaw-logo.png";
import { POLICY_HASH } from "@/lib/toollaw-data";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", Icon: Activity, exact: true },
  { to: "/dashboard/loop", label: "Loop", Icon: Repeat },
  { to: "/dashboard/policies", label: "Policies", Icon: FileLock2 },
  { to: "/dashboard/attacks", label: "Red Team", Icon: Radar },
  { to: "/dashboard/approvals", label: "Approvals", Icon: UserCheck },
  { to: "/dashboard/captures", label: "Capture", Icon: ScrollText },
  { to: "/dashboard/evidence", label: "Evidence", Icon: Stamp },
  { to: "/dashboard/roles", label: "Crew", Icon: Users },
] as const;

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-border bg-sidebar p-5 lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
              <img src={logo} alt="" width={40} height={40} className="size-[72%] object-contain" />
            </span>
            <span className="font-display min-w-0 truncate text-lg tracking-[-0.05em]">
              TOOLLAW
            </span>
          </Link>

          <nav className="mt-7 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map(({ to, label, Icon }) => {
              const isOn = to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isOn
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 truncate">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 hidden rounded-xl border border-border p-4 lg:block">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0" /> Policy hash
            </p>
            <p className="mt-2 font-mono text-[11px] break-all text-foreground">{POLICY_HASH}</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
