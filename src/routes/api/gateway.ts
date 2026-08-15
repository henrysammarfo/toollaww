import { createFileRoute } from "@tanstack/react-router";
import { gatewayDispatch } from "@/lib/gateway";

export const Route = createFileRoute("/api/gateway")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as {
          principal?: string;
          tool?: string;
          args?: Record<string, unknown>;
          ticketId?: string | null;
        };
        const result = await gatewayDispatch({
          principal: body.principal ?? "red",
          tool: body.tool ?? "",
          args: body.args ?? {},
          ticketId: body.ticketId ?? null,
        });
        return Response.json(result);
      },
    },
  },
});
