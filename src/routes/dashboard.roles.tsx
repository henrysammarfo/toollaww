import { createFileRoute } from "@tanstack/react-router";
import { Bot, Crown, Radar, ShieldCheck, User } from "lucide-react";
import { roles } from "@/lib/toollaw-data";

export const Route = createFileRoute("/dashboard/roles")({
  head: () => ({
    meta: [
      { title: "Crew — TOOLLAW Console" },
      {
        name: "description",
        content:
          "The AgentTeams crew running TOOLLAW: manager, policy compiler, red team, gateway auditor and the human who holds L3.",
      },
      { property: "og:title", content: "Crew — TOOLLAW Console" },
      { property: "og:description", content: "Manager, compiler, red team, auditor, human." },
    ],
  }),
  component: RolesPage,
});

const icons: Record<string, typeof Bot> = {
  mgr: Crown,
  pol: Bot,
  red: Radar,
  aud: ShieldCheck,
  hum: User,
};

function RolesPage() {
  return (
    <div>
      <header className="min-w-0">
        <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
          Crew
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three distinct Worker roles plus a Manager and a first-class Human.
        </p>
      </header>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => {
          const Icon = icons[r.id] ?? Bot;
          return (
            <div key={r.id} className="panel p-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{r.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{r.id}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Seat: {r.seat}</p>
              <p className="mt-3 text-sm text-[#d0d0d0]/85">May: {r.may}</p>
              <p className="mt-2 text-sm text-[oklch(0.65_0.2_25)]">Must not: {r.mustNot}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
