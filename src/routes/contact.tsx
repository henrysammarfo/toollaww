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
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      eyebrow="Contact"
      title="Bring us your worst tool call"
      intro="Send the call you never want an agent to make. We will turn it into a fixture, compile the rule and show you the receipt that proves it did not execute."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Send a message" className="anim">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.message("Form not wired yet", {
                description: "Open a GitHub issue on henrysammarfo/toollaww — this page does not send email.",
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-muted-foreground">Name</span>
                <input
                  required
                  className="mt-2 w-full rounded-xl border border-border bg-black/40 px-4 py-3 text-sm text-foreground outline-none focus:border-white/40"
                  placeholder="Henry Marfo"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Email</span>
                <input
                  required
                  type="email"
                  className="mt-2 w-full rounded-xl border border-border bg-black/40 px-4 py-3 text-sm text-foreground outline-none focus:border-white/40"
                  placeholder="you@fleet.io"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="text-muted-foreground">The tool call that scares you</span>
              <textarea
                required
                rows={5}
                className="mt-2 w-full rounded-xl border border-border bg-black/40 px-4 py-3 font-mono text-xs text-foreground outline-none focus:border-white/40"
                placeholder={'{ "tool": "fixture.unhalt", "args": { "halted": true } }'}
              />
            </label>
            <button
              type="submit"
              className="cta-glow rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {sent ? "Not wired — use GitHub" : "Send message"}
            </button>
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
