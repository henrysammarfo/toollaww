import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Ban, CheckCircle2, Clock } from "lucide-react";
import { attempts, loopSteps, POLICY_HASH } from "@/lib/toollaw-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Console Overview — TOOLLAW" },
      {
        name: "description",
        content:
          "Live fail-closed gate overview: blocked attempts, pending human tickets, allowed reads and the active policy hash.",
      },
      { property: "og:title", content: "Console Overview — TOOLLAW" },
      { property: "og:description", content: "Blocked, pending and allowed tool calls at a glance." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const blocked = attempts.filter((a) => a.decision === "BLOCK").length;
  const pending = attempts.filter((a) => a.decision === "REQUIRE_APPROVAL").length;
  const allowed = attempts.filter((a) => a.decision === "ALLOW").length;

  const cards = [
    { label: "Blocked", value: blocked, Icon: Ban, tone: "text-[oklch(0.65_0.2_25)]" },
    { label: "Awaiting human L3", value: pending, Icon: Clock, tone: "text-[oklch(0.82_0.15_85)]" },
    { label: "Allowed reads", value: allowed, Icon: CheckCircle2, tone: "text-[oklch(0.78_0.16_155)]" },
  ];

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Gate Overview
          </h1>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{POLICY_HASH}</p>
        </div>
        <Link
          to="/dashboard/attacks"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Run attack pack <ArrowUpRight className="size-4" />
        </Link>
      </header>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, Icon, tone }) => (
          <div key={label} className="panel p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className={`size-4 shrink-0 ${tone}`} />
            </div>
            <p className="tabular font-display mt-4 text-4xl tracking-[-0.05em]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="panel p-6">
          <h2 className="font-display text-xl tracking-[-0.04em]">Recent decisions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                <tr>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Principal</th>
                  <th className="pb-3">Tool</th>
                  <th className="pb-3">Decision</th>
                  <th className="pb-3">Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{a.at}</td>
                    <td className="py-3 font-mono text-xs text-foreground">{a.principal}</td>
                    <td className="py-3 font-mono text-xs text-foreground">{a.tool}</td>
                    <td className="py-3">
                      <DecisionBadge decision={a.decision} />
                    </td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {String(a.executed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="font-display text-xl tracking-[-0.04em]">Loop status</h2>
          <ol className="mt-4 space-y-3">
            {loopSteps.map((s, i) => (
              <li key={s.n} className="flex min-w-0 items-center gap-3">
                <span className="font-display grid size-7 shrink-0 place-items-center rounded-full border border-border text-[11px]">
                  {s.n}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{s.title}</span>
                <span className="shrink-0 text-xs text-[oklch(0.78_0.16_155)]">
                  {i < 7 ? "done" : "armed"}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, string> = {
    BLOCK: "border-[oklch(0.65_0.2_25)]/50 text-[oklch(0.65_0.2_25)]",
    ALLOW: "border-[oklch(0.78_0.16_155)]/50 text-[oklch(0.78_0.16_155)]",
    REQUIRE_APPROVAL: "border-[oklch(0.82_0.15_85)]/50 text-[oklch(0.82_0.15_85)]",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px] ${map[decision] ?? "border-border text-muted-foreground"}`}
    >
      {decision}
    </span>
  );
}
