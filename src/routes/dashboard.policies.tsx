import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { POLICY_HASH } from "@/lib/toollaw-data";

export const Route = createFileRoute("/dashboard/policies")({
  head: () => ({
    meta: [
      { title: "Policies — TOOLLAW Console" },
      {
        name: "description",
        content:
          "Edit the policy YAML, compile it into a hashed allowlist artifact and review principal, tool and argument rules.",
      },
      { property: "og:title", content: "Policies — TOOLLAW Console" },
      { property: "og:description", content: "Compile policy YAML into a hashed allowlist artifact." },
    ],
  }),
  component: PoliciesPage,
});

const initialYaml = `version: v0.9.3
default: BLOCK
principals:
  - id: red
    maySkills: [toollaw.redteam, toollaw.health]
    mayTools: [fleet.health]
  - id: aud
    maySkills: [toollaw.evidence]
tools:
  - name: market.unhalt
    mutate: true
    risk: critical
    allowPrincipals: []
    argRules: [requireTicket]
  - name: position.redeem
    mutate: true
    risk: high
    argRules: [marketMustBeSettled, requireTicket]
  - name: fleet.env.patch
    mutate: true
    risk: critical
    argRules: [pathContainsPeer]
  - name: fleet.health
    mutate: false
    risk: low
    allowPrincipals: [red, aud]`;

function PoliciesPage() {
  const [yaml, setYaml] = useState(initialYaml);
  const [hash, setHash] = useState(POLICY_HASH);

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Policy Compiler
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Principal × tool × args × risk. Default BLOCK.
          </p>
        </div>
        <button
          onClick={() => {
            const next = `sha256:${Math.random().toString(16).slice(2, 18)}`;
            setHash(next);
            toast.success("Artifact compiled", { description: next });
          }}
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Compile
        </button>
      </header>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-6">
          <h2 className="font-display text-lg tracking-[-0.04em]">policy.yaml</h2>
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
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
              <dt className="text-muted-foreground">Rules</dt>
              <dd className="mt-1 text-foreground">4 tools · 2 principals · 3 arg rules</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Default</dt>
              <dd className="mt-1 text-[oklch(0.65_0.2_25)]">BLOCK</dd>
            </div>
          </dl>
          <p className="mt-6 rounded-xl border border-border bg-black/30 p-4 text-xs leading-relaxed text-muted-foreground">
            Workers load the artifact by hash. An unknown tool, a missing ticket or a failed
            argument rule terminates the call before dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}
