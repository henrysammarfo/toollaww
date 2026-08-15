import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Stamp } from "lucide-react";
import { toast } from "sonner";
import { loadReceipts } from "@/lib/receipts";

export const Route = createFileRoute("/dashboard/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — TOOLLAW Console" },
      {
        name: "description",
        content: "sha256 receipts from live MCP enforce/redteam calls.",
      },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const [nonce, setNonce] = useState(0);
  const receipts = useMemo(() => loadReceipts(), [nonce]);

  const exportBundle = () => {
    const blob = new Blob([JSON.stringify(receipts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toollaw-evidence.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bundle exported", { description: `${receipts.length} receipts` });
    setNonce((n) => n + 1);
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Evidence
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Stamp className="size-4 shrink-0" /> attempt + policyHash + decision → sha256
          </p>
        </div>
        <button
          onClick={exportBundle}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          <Download className="size-4" /> Export bundle
        </button>
      </header>

      <div className="mt-7 space-y-4">
        {receipts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Run the red-team pack first. Receipts are sealed on the server and stored in this browser.
          </p>
        )}
        {receipts.map((r) => (
          <article key={`${r.id}-${r.evidenceSha256}`} className="panel p-5">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-foreground">{r.tool}</p>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                  {JSON.stringify(r.args)}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{r.ts}</span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 font-mono text-[11px] leading-relaxed text-[#d0d0d0]">
              {JSON.stringify(
                {
                  id: r.id,
                  policyHash: r.policyHash,
                  principal: r.principal,
                  decision: r.decision,
                  executed: r.executed,
                  reasons: r.reasons,
                  evidenceSha256: r.evidenceSha256,
                },
                null,
                2,
              )}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
