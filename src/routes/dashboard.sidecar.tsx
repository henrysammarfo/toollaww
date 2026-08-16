import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Box, Play } from "lucide-react";
import { toast } from "sonner";
import { DecisionBadge } from "./dashboard.index";

type SidecarView = {
  state: string;
  namespace: string;
  home: string;
  runId: string;
  officialAgentTeamsImages: boolean;
  room: { room_id: string; events: number };
  auditor: { blocked: number; allowed: number; allBlocksUnexecuted: boolean };
  attacks: Array<{
    receipt: { id: string; tool: string; decision: "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL"; executed: boolean };
  }>;
  evidence: { sha256: string; zipBytes: number; files: string[] };
  crds: { workers: Array<{ metadata: { name: string } }>; team: { metadata: { name: string } } };
};

export const Route = createFileRoute("/dashboard/sidecar")({
  head: () => ({
    meta: [{ title: "Sidecar — TOOLLAW" }],
  }),
  component: SidecarPage,
});

function SidecarPage() {
  const [run, setRun] = useState<SidecarView | null>(null);
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/sidecar", { method: "POST" });
      const body = (await res.json()) as SidecarView;
      setRun(body);
      toast.success(`Sidecar ${body.state}`, {
        description: `${body.namespace} · ${body.auditor.blocked} BLOCK · ${body.auditor.allowed} ALLOW`,
      });
    } catch (err) {
      toast.error("Sidecar failed", { description: err instanceof Error ? err.message : "unknown" });
    } finally {
      setBusy(false);
    }
  };

  const zip = async () => {
    const res = await fetch("/api/film", { method: "POST" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toollaw-sidecar-evidence.zip";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Evidence zip downloaded");
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            AgentTeams sidecar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Namespace toollaw-sidecar. Never /opt/scout or /opt/lockin. CRs + Matrix room + Higress-shaped gate.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => void zip()}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm"
          >
            <Box className="size-4" /> Evidence zip
          </button>
          <button
            onClick={() => void go()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            <Play className="size-4" /> {busy ? "Running…" : "Run sidecar film"}
          </button>
        </div>
      </header>

      {run && (
        <div className="mt-7 space-y-4">
          <div className="panel p-5 font-mono text-xs">
            <p>runId {run.runId}</p>
            <p className="mt-1">namespace {run.namespace}</p>
            <p className="mt-1">home {run.home}</p>
            <p className="mt-1">state {run.state}</p>
            <p className="mt-1">
              official AgentTeams images {String(run.officialAgentTeamsImages)} (YAML ready; Hangzhou registry is
              the attach target)
            </p>
            <p className="mt-1">
              room {run.room.room_id} · {run.room.events} events
            </p>
            <p className="mt-1 break-all">evidence {run.evidence.sha256}</p>
          </div>
          {run.attacks.map((a) => (
            <div
              key={a.receipt.id}
              className="panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm">{a.receipt.tool}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  executed={String(a.receipt.executed)}
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
