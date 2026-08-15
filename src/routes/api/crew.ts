import { createFileRoute } from "@tanstack/react-router";
import { runCrew } from "@/lib/crew";

export const Route = createFileRoute("/api/crew")({
  server: {
    handlers: {
      GET: async () => Response.json(await runCrew()),
      POST: async () => Response.json(await runCrew()),
    },
  },
});
