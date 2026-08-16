import { createFileRoute } from "@tanstack/react-router";
import { filmSidecar } from "@/lib/sidecar";

export const Route = createFileRoute("/api/film")({
  server: {
    handlers: {
      GET: async () => {
        const run = await filmSidecar({ includeZip: false });
        return Response.json({
          film: ["BLOCK unhalt", "ALLOW health", "BLOCK peer env", "BLOCK redeem", "evidence zip"],
          state: run.state,
          auditor: run.auditor,
          room: run.room,
          tools: run.attacks.map((a) => ({
            tool: a.receipt.tool,
            decision: a.receipt.decision,
            executed: a.receipt.executed,
          })),
          evidence: { ...run.evidence, zipBase64: "" },
        });
      },
      POST: async () => {
        const run = await filmSidecar({ includeZip: true });
        const bytes = Uint8Array.from(atob(run.evidence.zipBase64), (c) => c.charCodeAt(0));
        return new Response(bytes, {
          headers: {
            "content-type": "application/zip",
            "content-disposition": `attachment; filename="${run.runId}.zip"`,
            "x-toollaw-evidence-sha256": run.evidence.sha256,
            "x-toollaw-state": run.state,
          },
        });
      },
    },
  },
});
