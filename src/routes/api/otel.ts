import { createFileRoute } from "@tanstack/react-router";
import { runSidecar } from "@/lib/sidecar";
import { spansToOtlp } from "@/lib/otel";

export const Route = createFileRoute("/api/otel")({
  server: {
    handlers: {
      GET: async () => {
        const run = await runSidecar({ includeZip: false });
        return Response.json(spansToOtlp(run.attacks.map((a) => a.span)));
      },
      POST: async () => {
        const run = await runSidecar({ includeZip: false });
        return Response.json(spansToOtlp(run.attacks.map((a) => a.span)));
      },
    },
  },
});
