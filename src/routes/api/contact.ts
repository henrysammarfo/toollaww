import { createFileRoute } from "@tanstack/react-router";
import { proposeFixture } from "@/lib/crew";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as {
          tool?: string;
          args?: Record<string, unknown>;
          note?: string;
        };
        const proposal = await proposeFixture({
          tool: body.tool ?? "fixture.custom",
          args: body.args ?? {},
          note: body.note ?? "",
        });
        return Response.json({
          ...proposal,
          mailbox: false,
          auth: false,
          hint: "No email. Attach this hash as a fixture in the next policy compile.",
        });
      },
    },
  },
});
