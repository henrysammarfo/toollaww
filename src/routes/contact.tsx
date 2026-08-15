import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Github } from "lucide-react";
import { toast } from "sonner";
import { PageShell, Panel } from "@/components/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TOOLLAW Team" },
      {
        name: "description",
        content:
          "Talk to the TOOLLAW team at Accra Technical University about pilots, red-team fixtures and the GOAI 2026 Agent Infra track.",
      },
      { property: "og:title", content: "Contact — TOOLLAW Team" },
      {
        property: "og:description",
        content: "Pilots, red-team fixtures and integration questions.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [hash, setHash] = useState<string | null>(null);

  return (
    <PageShell
      eyebrow="Contact"
      title="Bring us your worst tool call"
      intro="No email. No accounts. POST hashes the call into a fixture proposal you can compile into policy."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Propose a fixture" className="anim">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const raw = String(new FormData(form).get("payload") ?? "");
              void (async () => {
                let parsed: { tool?: string; args?: Record<string, unknown> } = {};
                try {
                  parsed = JSON.parse(raw) as typeof parsed;
                } catch {
                  toast.error("JSON required");
                  return;
                }
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    tool: parsed.tool ?? "fixture.custom",
                    args: parsed.args ?? {},
                    note: "contact-form",
                  }),
                });
                const body = (await res.json()) as { sha256?: string };
                setHash(body.sha256 ?? null);
                toast.success("Fixture hashed", { description: body.sha256?.slice(0, 24) });
              })();
            }}
          >
            <label className="block text-sm">
              <span className="text-muted-foreground">The tool call that scares you</span>
              <textarea
                required
                name="payload"
                rows={5}
                className="mt-2 w-full rounded-xl border border-border bg-black/40 px-4 py-3 font-mono text-xs text-foreground outline-none focus:border-white/40"
                placeholder={'{ "tool": "fixture.unhalt", "args": { "halted": true } }'}
              />
            </label>
            <button
              type="submit"
              className="cta-glow rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Hash fixture
            </button>
            {hash && <p className="break-all font-mono text-xs text-muted-foreground">{hash}</p>}
          </form>
        </Panel>

        <Panel title="Direct" className="anim">
          <ul className="space-y-5 text-sm">
            <li className="flex min-w-0 items-start gap-3">
              <Github className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <a
                className="min-w-0 break-words text-[#d0d0d0]/85 underline-offset-4 hover:underline"
                href="https://github.com/henrysammarfo/toollaww"
                target="_blank"
                rel="noreferrer"
              >
                github.com/henrysammarfo/toollaww
              </a>
            </li>
            <li className="flex min-w-0 items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 text-[#d0d0d0]/85">
                Accra Technical University, Accra, Ghana
              </span>
            </li>
            <li className="flex min-w-0 items-start gap-3">
              <Github className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 text-[#d0d0d0]/85">Apache-2.0 · skills, contracts, fixtures</span>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            GOAI 2026 Track 1 Agent Infra. Semi-final demo 3 Sep, finals 22–23 Sep, Hangzhou.
          </p>
        </Panel>
      </div>
    </PageShell>
  );
}
