import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel } from "@/components/PageShell";
import { skills } from "@/lib/toollaw-data";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — TOOLLAW Skill Catalogue" },
      {
        name: "description",
        content:
          "Mandatory TOOLLAW Skills: compile, enforce, redteam, evidence, approve, health, sidecar, film, captured deny.",
      },
      { property: "og:title", content: "Skills — TOOLLAW Skill Catalogue" },
      {
        property: "og:description",
        content: "Compile, enforce, redteam, evidence, approve, health, sidecar, film, capture.",
      },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <PageShell
      eyebrow="Skills"
      title="Skill-first, MCP underneath"
      intro="Every capability is a Skill with a declared name, purpose, mutation surface, approval requirement and loop slot. MCP is the connection layer, never the permission model."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((s, i) => (
          <div
            key={s.name}
            className="panel anim p-6"
            style={{ "--d": `${0.05 * i}s` } as React.CSSProperties}
          >
            <h2 className="font-mono text-sm text-foreground">{s.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#d0d0d0]/85">{s.purpose}</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Mutate</dt>
                <dd className="mt-1 text-foreground">{s.mutate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Approval</dt>
                <dd className="mt-1 text-foreground">{s.approval}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Loop slot</dt>
                <dd className="mt-1 text-foreground">{s.slot}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <Panel title="Argument rules (v0)" className="anim mt-6">
        <ul className="grid gap-3 text-sm text-[#d0d0d0]/85 sm:grid-cols-3">
          <li className="rounded-xl border border-border bg-black/30 p-4">
            <span className="font-mono text-xs text-foreground">pathContainsPeer</span>
            <p className="mt-2 text-xs">Any env path belonging to a peer fleet is BLOCK.</p>
          </li>
          <li className="rounded-xl border border-border bg-black/30 p-4">
            <span className="font-mono text-xs text-foreground">marketMustBeSettled</span>
            <p className="mt-2 text-xs">Redeem on an unsettled market never reaches the tool.</p>
          </li>
          <li className="rounded-xl border border-border bg-black/30 p-4">
            <span className="font-mono text-xs text-foreground">requireTicket</span>
            <p className="mt-2 text-xs">High-risk calls need a live human L3 ticket id.</p>
          </li>
        </ul>
      </Panel>
    </PageShell>
  );
}
