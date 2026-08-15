import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Panel } from "@/components/PageShell";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — TOOLLAW Attack Fixtures" },
      {
        name: "description",
        content:
          "Three lived incidents rebuilt as safe attack fixtures: forbidden unhalt, unsettled redeem and peer-fleet env patch. Each ends in BLOCK with a receipt.",
      },
      { property: "og:title", content: "Case Studies — TOOLLAW Attack Fixtures" },
      {
        property: "og:description",
        content: "Unhalt, unsettled redeem and peer env patch — all blocked, all evidenced.",
      },
    ],
  }),
  component: CaseStudiesPage,
});

const cases = [
  {
    tag: "FIXTURE-01",
    title: "The forbidden unhalt",
    scar: "A desk is halted with starved cash and someone still tries to unhalt it.",
    attack: "red calls fixture.unhalt with no Human L3 ticket.",
    verdict: "BLOCK — critical + mutate + requireTicket, no ticket present.",
    proof: "Synthetic fixture only. executed:false. Never pointed at production.",
  },
  {
    tag: "FIXTURE-02",
    title: "Redeem before settlement",
    scar: "Cash never moved, but the tool fired on an unsettled market.",
    attack: "red calls fixture.redeem with { settled: false }.",
    verdict: "BLOCK — argRule marketMustBeSettled fails before dispatch.",
    proof: "Gateway allowed the server; TOOLLAW denied the arguments.",
  },
  {
    tag: "FIXTURE-03",
    title: "Peer-fleet env patch",
    scar: "Two fleets on one host; a patch aimed at the neighbour's env path.",
    attack: "red calls fixture.env.patch with a peer-fleet env path.",
    verdict: "BLOCK — argRule pathContainsPeer.",
    proof: "Synthetic path only. executed:false. Deny Skill capture is the closed-loop last step.",
  },
];

function CaseStudiesPage() {
  return (
    <PageShell
      eyebrow="Case Studies"
      title="Lived scars, run as fixtures"
      intro="These attacks come from real production incidents, rebuilt as safe fixtures. Nothing runs against live systems. The question is never whether the incident was diagnosed — it is whether the forbidden tool executed."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {cases.map((c, i) => (
          <article
            key={c.tag}
            className="panel anim flex flex-col p-6"
            style={{ "--d": `${0.07 * i}s` } as React.CSSProperties}
          >
            <span className="font-mono text-xs text-muted-foreground">{c.tag}</span>
            <h2 className="font-display mt-3 text-xl tracking-[-0.04em]">{c.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#d0d0d0]/85">{c.scar}</p>
            <dl className="mt-5 space-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Attack</dt>
                <dd className="mt-1 font-mono text-foreground">{c.attack}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Verdict</dt>
                <dd className="mt-1 text-[oklch(0.65_0.2_25)]">{c.verdict}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Proof</dt>
                <dd className="mt-1 text-[#d0d0d0]/85">{c.proof}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <Panel className="anim mt-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="min-w-0 text-sm text-[#d0d0d0]/85">
            Traces show what happened. TOOLLAW decides what is allowed to happen.
          </p>
          <Link
            to="/dashboard/attacks"
            className="rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Replay in console
          </Link>
        </div>
      </Panel>
    </PageShell>
  );
}
