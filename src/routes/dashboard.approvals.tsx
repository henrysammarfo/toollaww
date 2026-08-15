import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, UserCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals — TOOLLAW Console" },
      {
        name: "description",
        content: "Human L3 tickets via MCP toollaw.approve. Mutate fixtures stay blocked.",
      },
    ],
  }),
  component: ApprovalsPage,
});

type Ticket = {
  id: string;
  tool: string;
  requestedBy: string;
  status: "OPEN" | "ALLOWED" | "DENIED";
  note: string;
};

const seed: Ticket[] = [
  {
    id: "OPEN-health",
    tool: "toollaw.health",
    requestedBy: "hum",
    status: "OPEN",
    note: "Read path — Human may stamp ALLOW. This is the film beat.",
  },
  {
    id: "OPEN-unhalt",
    tool: "fixture.unhalt",
    requestedBy: "hum",
    status: "OPEN",
    note: "v0 demo: even Human cannot authorize this fixture.",
  },
];

function ApprovalsPage() {
  const [tickets, setTickets] = useState(seed);

  const decide = async (row: Ticket, allow: boolean) => {
    if (!allow) {
      setTickets((t) => t.map((x) => (x.id === row.id ? { ...x, status: "DENIED" } : x)));
      toast.error(`${row.tool} DENIED`, { description: "The call stays blocked." });
      return;
    }
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "toollaw.approve",
            arguments: { principal: "hum", tool: row.tool },
          },
        }),
      });
      const rpc = (await res.json()) as {
        error?: { message: string };
        result?: { structuredContent?: { ok: boolean; ticketId: string; reason?: string } };
      };
      if (rpc.error) throw new Error(rpc.error.message);
      const body = rpc.result?.structuredContent;
      if (!body?.ok) {
        setTickets((t) => t.map((x) => (x.id === row.id ? { ...x, status: "DENIED" } : x)));
        toast.error("Ticket refused", { description: body?.reason ?? "blocked" });
        return;
      }
      setTickets((t) => t.map((x) => (x.id === row.id ? { ...x, status: "ALLOWED" } : x)));
      toast.success("Ticket issued", { description: body.ticketId });
    } catch (err) {
      toast.error("MCP call failed", {
        description: err instanceof Error ? err.message : "unknown",
      });
    }
  };

  return (
    <div>
      <header className="min-w-0">
        <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
          Human Approvals
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <UserCheck className="size-4 shrink-0" /> L3 only. MCP <span className="font-mono">toollaw.approve</span>.
        </p>
      </header>

      <div className="mt-7 space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="panel grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-sm text-foreground">{t.tool}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t.note}</p>
            </div>
            {t.status === "OPEN" ? (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => void decide(t, true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  <Check className="size-4" /> Allow
                </button>
                <button
                  onClick={() => void decide(t, false)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-white/50"
                >
                  <X className="size-4" /> Deny
                </button>
              </div>
            ) : (
              <span
                className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] ${
                  t.status === "ALLOWED"
                    ? "border-[oklch(0.78_0.16_155)]/50 text-[oklch(0.78_0.16_155)]"
                    : "border-[oklch(0.65_0.2_25)]/50 text-[oklch(0.65_0.2_25)]"
                }`}
              >
                {t.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
