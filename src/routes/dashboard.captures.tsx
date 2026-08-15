import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { DenySkill } from "@/lib/capture";
import type { CrewRun } from "@/lib/crew";

export const Route = createFileRoute("/dashboard/captures")({
  head: () => ({
    meta: [{ title: "Captured deny Skills — TOOLLAW" }],
  }),
  component: CapturesPage,
});

function CapturesPage() {
  const [skills, setSkills] = useState<DenySkill[]>([]);

  const load = async () => {
    try {
      const res = await fetch("/api/crew", { method: "POST" });
      const body = (await res.json()) as CrewRun;
      setSkills(body.captures);
      toast.success(`${body.captures.length} deny Skills captured`);
    } catch (err) {
      toast.error("Capture failed", { description: err instanceof Error ? err.message : "unknown" });
    }
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[clamp(24px,3.4vw,36px)] tracking-[-0.05em]">
            Capture
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Failed attacks become deny Skills. Loop slot: capture.
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
        >
          Capture from crew run
        </button>
      </header>
      <div className="mt-7 space-y-4">
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">Run capture to compile deny Skills from BLOCKs.</p>
        )}
        {skills.map((s) => (
          <article key={s.name} className="panel p-5">
            <p className="font-mono text-sm">{s.name}</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-[#d0d0d0]">
              {s.markdown}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
