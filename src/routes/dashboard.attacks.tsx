import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { type Attempt } from "@/lib/toollaw-data";
import { enforce } from "@/lib/enforce";
import { DecisionBadge } from "./dashboard.index";
import unhalt from "../../fixtures/attack-unhalt.json";
import redeem from "../../fixtures/attack-redeem.json";
import peer from "../../fixtures/attack-env-peer.json";
import health from "../../fixtures/allow-health.json";

const pack = [unhalt, redeem, peer, health] as const;

function toAttempt(
  fixture: (typeof pack)[number],
  result: ReturnType<typeof enforce>,
  id: string,
): Attempt {
  return {
    id,
    principal: fixture.principal,
    skill: fixture.skill,
    tool: fixture.tool,
    args: JSON.stringify(fixture.args),
    risk: result.risk,
    mutate: result.mutate,
    decision: result.decision,
    executed: result.executed,
    ticketId: null,
    evidenceSha256: null,
    state: result.decision === "ALLOW" ? "CLOSED" : "BLOCKED",
    at: new Date().toISOString().slice(11, 19),
  };
}

export const Route = createFileRoute("/dashboard/attacks")({
  head: () => ({
    meta: [
      { title: "Red Team — TOOLLAW Console" },
      {
        name: "description",
        content:
          "Fire the attack pack at the fail-closed gate. Forbidden tools stay executed:false; health read is ALLOW.",
      },
      { property: "og:title", content: "Red Team — TOOLLAW Console" },
      { property: "og:description", content: "Attack pack against the fail-closed gate." },
    ],
  }),
  component: AttacksPage,
});

function AttacksPage() {
  const [log, setLog] = useState<Attempt[]>([]);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setLog([]);
    toast("Attack pack armed", { description: "Worker red is firing fixture Skills." });
    pack.forEach((fixture, i) => {
      window.setTimeout(() => {
        const result = enforce({
          principal: fixture.principal,
          tool: fixture.tool,
          args: fixture.args as Record<string, unknown>,
        });
        setLog((prev) => [toAttempt(fixture, result, `${fixture.id}-${prev.length}`), ...prev]);
        if (i === pack.length - 1) {
          setRunning(false);
          toast.success("Pack complete", {
            description: "Mutating fixtures BLOCK. Health read ALLOW.",
          });
        }
      }, 350 * (i + 1));
    });
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Red Team
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Worker <span className="font-mono">red</span> attacks only. It can never self-approve.
            Gate is <span className="font-mono">toollaw.enforce</span>, not a replay of canned rows.
          </p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Play className="size-4" /> {running ? "Running…" : "Run attack pack"}
        </button>
      </header>

      <div className="panel mt-7 p-6">
        <div className="flex items-center gap-2 text-sm text-[oklch(0.65_0.2_25)]">
          <ShieldAlert className="size-4 shrink-0" />
          <span className="min-w-0">Fixtures only. Nothing here touches a live system.</span>
        </div>

        <div className="mt-5 space-y-3">
          {log.length === 0 && (
            <p className="text-sm text-muted-foreground">Run the pack to compile decisions live.</p>
          )}
          {log.map((a) => (
            <div
              key={a.id}
              className="grid gap-3 rounded-xl border border-border bg-black/30 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-foreground">{a.tool}</p>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{a.args}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {a.principal} · {a.skill} · risk {a.risk} · executed {String(a.executed)}
                </p>
              </div>
              <DecisionBadge decision={a.decision} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
