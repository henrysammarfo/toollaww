import { createFileRoute } from "@tanstack/react-router";
import { Download, Stamp } from "lucide-react";
import { toast } from "sonner";
import { attempts, POLICY_HASH } from "@/lib/toollaw-data";

export const Route = createFileRoute("/dashboard/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — TOOLLAW Console" },
      {
        name: "description",
        content:
          "Every decision seals into a receipt: attempt JSON, policy hash, decision, timestamp and sha256, exportable as a judge-ready bundle.",
      },
      { property: "og:title", content: "Evidence — TOOLLAW Console" },
      { property: "og:description", content: "sha256 receipts for every gate decision." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const receipts = attempts.filter((a) => a.evidenceSha256);

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
          onClick={() => toast.success("Bundle exported", { description: "toollaw-evidence.zip" })}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          <Download className="size-4" /> Export bundle
        </button>
      </header>

      <div className="mt-7 space-y-4">
        {receipts.map((r) => (
          <article key={r.id} className="panel p-5">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-foreground">{r.tool}</p>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{r.args}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{r.at}</span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 font-mono text-[11px] leading-relaxed text-[#d0d0d0]">
{`{
  "id": "${r.id}",
  "policyHash": "${POLICY_HASH}",
  "principal": "${r.principal}",
  "decision": "${r.decision}",
  "executed": ${r.executed},
  "ticketId": ${r.ticketId ? `"${r.ticketId}"` : "null"},
  "evidenceSha256": "${r.evidenceSha256}"
}`}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
