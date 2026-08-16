import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { DecisionBadge } from "./dashboard.index";
import type { CrewRun } from "@/lib/crew";

export const Route = createFileRoute("/dashboard/loop")({
  head: () => ({
    meta: [{ title: "Crew loop — TOOLLAW" }],
  }),
  component: LoopPage,
});

function LoopPage() {
  const [run, setRun] = useState<CrewRun | null>(null);
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/crew", { method: "POST" });
      const body = (await res.json()) as CrewRun;
      setRun(body);
      toast.success(`Crew ${body.state}`, {
        description: `${body.auditor.blocked} BLOCK · ${body.auditor.allowed} ALLOW · ${body.captures.length} deny Skills`,
      });
    } catch (err) {
      toast.error("Crew failed", { description: err instanceof Error ? err.message : "unknown" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Crew loop
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            mgr → pol → red → aud → hum. In-process crew. Sidecar film is /dashboard/sidecar.
          </p>
        </div>
        <button
          onClick={() => void go()}
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
        >
          <Play className="size-4" /> {busy ? "Running…" : "Run closed loop"}
        </button>
      </header>

      {run && (
        <div className="mt-7 space-y-4">
          <div className="panel p-5 font-mono text-xs">
            <p>runId {run.runId}</p>
            <p className="mt-1">state {run.state}</p>
            <p className="mt-1 break-all">policyHash {run.policyHash}</p>
            <p className="mt-1">
              auditor blocked={run.auditor.blocked} allowed={run.auditor.allowed}{" "}
              unexecuted={String(run.auditor.allBlocksUnexecuted)}
            </p>
          </div>
          {run.attacks.map((a) => (
            <div
              key={a.receipt.id}
              className="panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm">{a.receipt.tool}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  trace {a.span.traceId.slice(0, 16)} · {a.captured?.name ?? "no capture"}
                </p>
              </div>
              <DecisionBadge decision={a.receipt.decision} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
