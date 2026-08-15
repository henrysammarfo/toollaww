import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { type Attempt } from "@/lib/toollaw-data";
import { DecisionBadge } from "./dashboard.index";
import { prependReceipts } from "@/lib/receipts";
import type { Receipt } from "@/lib/kernel";

function receiptToAttempt(r: Receipt): Attempt {
  return {
    id: r.id,
    principal: r.principal,
    skill: r.skill,
    tool: r.tool,
    args: JSON.stringify(r.args),
    risk: r.risk,
    mutate: r.mutate,
    decision: r.decision,
    executed: r.executed,
    ticketId: r.ticketId,
    evidenceSha256: r.evidenceSha256,
    state: r.decision === "ALLOW" ? "CLOSED" : "BLOCKED",
    at: r.ts.slice(11, 19),
  };
}

export const Route = createFileRoute("/dashboard/attacks")({
  head: () => ({
    meta: [
      { title: "Red Team — TOOLLAW Console" },
      {
        name: "description",
        content: "Fire the attack pack through the live /api/mcp gate.",
      },
      { property: "og:title", content: "Red Team — TOOLLAW Console" },
    ],
  }),
  component: AttacksPage,
});

function AttacksPage() {
  const [log, setLog] = useState<Attempt[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setLog([]);
    toast("Attack pack armed", { description: "POST /api/mcp tools/call toollaw.redteam" });
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: "toollaw.redteam", arguments: {} },
        }),
      });
      const rpc = (await res.json()) as {
        error?: { message: string };
        result?: { structuredContent?: Receipt[] };
      };
      if (rpc.error) throw new Error(rpc.error.message);
      const pack = rpc.result?.structuredContent ?? [];
      prependReceipts(pack);
      setLog(pack.map(receiptToAttempt).reverse());
      toast.success("Pack complete", {
        description: "Mutating fixtures BLOCK. Health read ALLOW. Receipts hashed.",
      });
    } catch (err) {
      toast.error("MCP call failed", {
        description: err instanceof Error ? err.message : "unknown",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Red Team
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live MCP: <span className="font-mono">toollaw.redteam</span>. Red cannot self-approve.
          </p>
        </div>
        <button
          onClick={() => void run()}
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
            <p className="text-sm text-muted-foreground">Run the pack against /api/mcp.</p>
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
                  {a.principal} · executed {String(a.executed)} · {a.evidenceSha256?.slice(0, 16)}…
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
