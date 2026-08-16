import { createFileRoute } from "@tanstack/react-router";
import { runSidecar } from "@/lib/sidecar";

export const Route = createFileRoute("/api/sidecar")({
  server: {
    handlers: {
      GET: async () => {
        const run = await runSidecar({ includeZip: false });
        return Response.json({ ...run, evidence: { ...run.evidence, zipBase64: "" } });
      },
      POST: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const includeZip = url.searchParams.get("zip") === "1";
        const run = await runSidecar({ includeZip });
        return Response.json(includeZip ? run : { ...run, evidence: { ...run.evidence, zipBase64: "" } });
      },
    },
  },
});
