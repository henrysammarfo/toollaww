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
        content:
          "Human L3 tickets for high-risk tool calls. No agent may mint a ticket, and a DENY keeps the call blocked forever.",
      },
      { property: "og:title", content: "Approvals — TOOLLAW Console" },
      { property: "og:description", content: "Human L3 tickets for high-risk tool calls." },
    ],
  }),
  component: ApprovalsPage,
});

type Ticket = {
  id: string;
  tool: string;
  args: string;
  risk: string;
  requestedBy: string;
  status: "OPEN" | "ALLOWED" | "DENIED";
};

const seed: Ticket[] = [
  {
    id: "TKT-3391",
    tool: "policy.write",
    args: '{ "version": "v0.9.3" }',
    risk: "high",
    requestedBy: "pol",
    status: "OPEN",
  },
  {
    id: "TKT-3390",
    tool: "fleet.health",
    args: "{}",
    risk: "low",
    requestedBy: "red",
    status: "ALLOWED",
  },
  {
    id: "TKT-3388",
    tool: "market.unhalt",
    args: '{ "force": true }',
    risk: "critical",
    requestedBy: "red",
    status: "DENIED",
  },
];

function ApprovalsPage() {
  const [tickets, setTickets] = useState(seed);

  const decide = (id: string, status: Ticket["status"]) => {
    setTickets((t) => t.map((x) => (x.id === id ? { ...x, status } : x)));
    toast[status === "ALLOWED" ? "success" : "error"](`${id} ${status.toLowerCase()}`, {
      description: status === "DENIED" ? "The call stays blocked." : "Ticket bound to policy hash.",
    });
  };

  return (
    <div>
      <header className="min-w-0">
        <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
          Human Approvals
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <UserCheck className="size-4 shrink-0" /> L3 human in the Matrix room. No self-approve.
        </p>
      </header>

      <div className="mt-7 space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="panel grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted-foreground">{t.id}</p>
              <p className="mt-1 truncate font-mono text-sm text-foreground">{t.tool}</p>
              <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{t.args}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                requested by {t.requestedBy} · risk {t.risk}
              </p>
            </div>
            {t.status === "OPEN" ? (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => decide(t.id, "ALLOWED")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  <Check className="size-4" /> Allow
                </button>
                <button
                  onClick={() => decide(t.id, "DENIED")}
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
