import { createFileRoute } from "@tanstack/react-router";
import { policyHash } from "@/lib/kernel";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          ok: true,
          product: "TOOLLAW",
          mcp: "/api/mcp",
          policyHash: await policyHash(),
          fixtures: ["attack-unhalt", "attack-redeem", "attack-env-peer", "allow-health"],
        });
      },
    },
  },
});
