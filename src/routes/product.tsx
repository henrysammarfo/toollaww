import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban, FileLock2, Radar, ScrollText, Stamp, UserCheck } from "lucide-react";
import { PageShell, Panel } from "@/components/PageShell";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — TOOLLAW Tool-Control Plane" },
      {
        name: "description",
        content:
          "Policy, compile, enforce, attack, audit, human. The six layers TOOLLAW ships on top of AgentTeams and MCP-shaped gateways.",
      },
      { property: "og:title", content: "Product — TOOLLAW Tool-Control Plane" },
      {
        property: "og:description",
        content: "Six layers: policy, compile, enforce, attack, audit, human approval.",
      },
    ],
  }),
  component: ProductPage,
});

const layers = [
  {
    Icon: ScrollText,
    title: "Policy",
    ships: "YAML allowlist: principal × tool × args × risk.",
    not: "Chat “please don't do that”.",
  },
  {
    Icon: FileLock2,
    title: "Compile",
    ships: "Skill toollaw.compile → hashed artifact Workers load.",
    not: "Hand-edited prompt rules.",
  },
  {
    Icon: Ban,
    title: "Enforce",
    ships: "toollaw.enforce + MCP-shaped gateway hook, default BLOCK.",
    not: "Post-hoc log review.",
  },
  {
    Icon: Radar,
    title: "Attack",
    ships: "Worker red with an attack pack that must fail closed.",
    not: "A helper that tries to be careful.",
  },
  {
    Icon: Stamp,
    title: "Audit",
    ships: "Worker aud matches attempt → policy hash → sha256 receipt.",
    not: "A pretty dashboard.",
  },
  {
    Icon: UserCheck,
    title: "Human",
    ships: "Matrix human, L3 on high risk, no self-approve.",
    not: "An optional rubber stamp.",
  },
];

function ProductPage() {
  return (
    <PageShell
      eyebrow="Product"
      title="The layer between an agent and its tools"
      intro="Server-level ACL answers whether an agent may talk to a server. It never answers whether this agent may call this tool with these arguments. TOOLLAW compiles that answer and enforces it before execution."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {layers.map(({ Icon, title, ships, not }, i) => (
          <div
            key={title}
            className="panel anim p-6"
            style={{ "--d": `${0.06 * i}s` } as React.CSSProperties}
          >
            <Icon className="size-6 text-foreground" strokeWidth={1.6} />
            <h2 className="font-display mt-4 text-xl tracking-[-0.04em]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#d0d0d0]/85">{ships}</p>
            <p className="mt-3 text-xs text-muted-foreground">Not: {not}</p>
          </div>
        ))}
      </div>

      <Panel title="Closed loop, one line" className="anim mt-6">
        <p className="font-display text-lg leading-relaxed tracking-[-0.03em] text-foreground">
          compile → attack → BLOCK or ticket → verify non-execution → evidence → capture deny Skill
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/architecture"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Architecture
          </Link>
          <Link
            to="/skills"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm text-[#c8c8c8] transition-colors hover:border-white/50 hover:text-white"
          >
            Skill catalogue
          </Link>
        </div>
      </Panel>
    </PageShell>
  );
}
