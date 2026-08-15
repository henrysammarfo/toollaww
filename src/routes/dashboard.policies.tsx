import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import policy from "../../fixtures/policy.v0.json" with { type: "json" };

const initial = JSON.stringify(policy, null, 2);

export const Route = createFileRoute("/dashboard/policies")({
  head: () => ({
    meta: [
      { title: "Policies — TOOLLAW Console" },
      {
        name: "description",
        content: "Compile policy JSON into a hashed allowlist via MCP toollaw.compile.",
      },
    ],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  const [source, setSource] = useState(initial);
  const [hash, setHash] = useState("run compile");
  const [busy, setBusy] = useState(false);

  const compile = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: "toollaw.compile", arguments: { source } },
        }),
      });
      const rpc = (await res.json()) as {
        error?: { message: string };
        result?: { structuredContent?: { policyHash: string; bytes: number } };
      };
      if (rpc.error) throw new Error(rpc.error.message);
      const next = rpc.result?.structuredContent?.policyHash ?? "";
      setHash(next);
      toast.success("Artifact compiled", { description: next.slice(0, 24) + "…" });
    } catch (err) {
      toast.error("Compile failed", {
        description: err instanceof Error ? err.message : "unknown",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Policy Compiler
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Principal × tool × args × risk. Default BLOCK. MCP <span className="font-mono">toollaw.compile</span>.
          </p>
        </div>
        <button
          onClick={() => void compile()}
          disabled={busy}
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Compiling…" : "Compile"}
        </button>
      </header>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-6">
          <h2 className="font-display text-lg tracking-[-0.04em]">policy.v0.json</h2>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={22}
            className="mt-4 w-full rounded-xl border border-border bg-black/50 p-4 font-mono text-xs leading-relaxed text-[#d0d0d0] outline-none focus:border-white/40"
          />
        </section>

        <section className="panel p-6">
          <h2 className="font-display text-lg tracking-[-0.04em]">Compiled artifact</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">policyHash</dt>
              <dd className="mt-1 font-mono text-xs break-all text-foreground">{hash}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Default</dt>
              <dd className="mt-1 text-[oklch(0.65_0.2_25)]">BLOCK</dd>
            </div>
          </dl>
          <p className="mt-6 rounded-xl border border-border bg-black/30 p-4 text-xs leading-relaxed text-muted-foreground">
            Hash is sha256 of the source you compile. Runtime enforce still loads the shipped
            fixture policy until AgentTeams sidecar (3 Sep).
          </p>
        </section>
      </div>
    </div>
  );
}
