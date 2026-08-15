import { createFileRoute } from "@tanstack/react-router";
import { handleMcp, tools, type JsonRpcReq } from "@/lib/mcp-protocol";
import { policyHash } from "@/lib/kernel";

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      GET: async () => {
        const hash = await policyHash();
        return Response.json({
          product: "TOOLLAW",
          transport: "json-rpc",
          endpoint: "/api/mcp",
          methods: ["initialize", "tools/list", "tools/call"],
          policyHash: hash,
          tools: tools.map((t) => t.name),
        });
      },
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as JsonRpcReq;
        const res = await handleMcp(body);
        return Response.json(res);
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET,POST,OPTIONS",
            "access-control-allow-headers": "content-type",
          },
        }),
    },
  },
});
