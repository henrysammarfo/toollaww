import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel } from "@/components/PageShell";
import { loopSteps, roles } from "@/lib/toollaw-data";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — TOOLLAW Roles, Objects And Loop" },
      {
        name: "description",
        content:
          "Five roles, one typed ToolLaw object, a fail-closed state machine and the eight-step AgentTeams loop TOOLLAW maps end to end.",
      },
      { property: "og:title", content: "Architecture — TOOLLAW" },
      {
        property: "og:description",
        content: "Roles, the ToolLaw object, the state machine and the eight loop slots.",
      },
    ],
  }),
  component: ArchitecturePage,
});

const objectModel = `ToolLaw
  id             string
  policyHash     string
  principal      mgr | pol | red | aud | hum
  skill          string
  tool           string
  args           object
  risk           low | high | critical
  mutate         boolean
  decision       ALLOW | BLOCK | REQUIRE_APPROVAL
  ticketId       string | null
  executed       boolean        # must be false on BLOCK
  evidenceSha256 string | null`;

const states = [
  "OPEN",
  "COMPILING",
  "ATTACKING",
  "BLOCKED / AWAITING_APPROVAL",
  "VERIFYING",
  "CLOSED",
];

function ArchitecturePage() {
  return (
    <PageShell
      eyebrow="Architecture"
      title="Five roles, one object, zero trust"
      intro="TOOLLAW runs as an AgentTeams crew. A manager tracks state, a compiler produces the artifact, a red team attacks it, an auditor proves non-execution and a human holds the only key to high-risk calls."
    >
      <Panel title="Roles" className="anim">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Seat</th>
                <th className="pb-3">May</th>
                <th className="pb-3">Must not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {roles.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 font-mono text-xs text-foreground">{r.id}</td>
                  <td className="py-3 text-foreground">{r.name}</td>
                  <td className="py-3 text-muted-foreground">{r.seat}</td>
                  <td className="py-3 text-[#d0d0d0]/85">{r.may}</td>
                  <td className="py-3 text-[oklch(0.65_0.2_25)]">{r.mustNot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Object model" className="anim">
          <pre className="overflow-x-auto rounded-xl bg-black/50 p-4 font-mono text-xs leading-relaxed text-[#d0d0d0]">
            {objectModel}
          </pre>
        </Panel>
        <Panel title="State machine" className="anim">
          <ol className="space-y-3">
            {states.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="font-display grid size-8 shrink-0 place-items-center rounded-full border border-border text-xs">
                  {i + 1}
                </span>
                <span className="min-w-0 text-sm text-foreground">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            Exception: unknown tool or compiler error moves straight to BLOCKED.
          </p>
        </Panel>
      </div>

      <Panel title="The eight loop slots" className="anim mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loopSteps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-black/30 p-4">
              <span className="font-display text-sm text-muted-foreground">{s.n}</span>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#d0d0d0]/80">{s.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </PageShell>
  );
}
