import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Gavel, Fingerprint } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { SiteHeader } from "@/components/SiteHeader";
import { stats } from "@/lib/toollaw-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOOLLAW — Tool-Level Law For Agent Fleets" },
      {
        name: "description",
        content:
          "TOOLLAW compiles who may call which tool, with which arguments, into a fail-closed Skill. Red team attacks, gateway blocks, receipts prove it.",
      },
      { property: "og:title", content: "TOOLLAW — Tool-Level Law For Agent Fleets" },
      {
        property: "og:description",
        content:
          "A governable tool-control plane on AgentTeams: compile, attack, block, verify, capture.",
      },
    ],
  }),
  component: Index,
});

function useCountUp(target: number, decimals: number, delay: number, duration: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, delay, duration]);
  return value.toFixed(decimals);
}

function Stat({
  glyph,
  target,
  suffix,
  decimals,
  label,
  i,
}: (typeof stats)[number] & { i: number }) {
  const value = useCountUp(target, decimals, 480 + i * 90, 1500 + i * 80);
  return (
    <div
      className="anim flex flex-col items-center gap-1 text-center"
      style={{ "--d": `${0.5 + i * 0.08}s` } as React.CSSProperties}
    >
      <span className="font-display text-[clamp(22px,3vw,33px)] leading-none text-foreground">
        {glyph}
      </span>
      <span className="tabular text-[clamp(18px,2.2vw,26px)] font-semibold tracking-[-0.025em] text-foreground">
        {value}
        {suffix}
      </span>
      <span className="text-[clamp(11px,1.2vw,12.5px)] text-muted-foreground">{label}</span>
    </div>
  );
}

const trust = [
  { Icon: ShieldCheck, lift: "-2px" },
  { Icon: Gavel, lift: "-4px" },
  { Icon: Fingerprint, lift: "-2px" },
];

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative h-[100dvh] overflow-hidden">
      <BackgroundVideo dim={0.28} />
      <div className="relative z-10 flex h-[100dvh] flex-col px-[clamp(14px,3vw,32px)] py-[clamp(16px,2.4vh,28px)]">
        <SiteHeader />

        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className="anim mb-[clamp(16px,2.5vh,26px)] inline-flex items-center"
            style={{ "--d": "0.05s", "--trust-size": "clamp(34px,4.5vw,42px)" } as React.CSSProperties}
          >
            {trust.map(({ Icon, lift }, i) => (
              <span
                key={i}
                className="grid size-[var(--trust-size)] shrink-0 place-items-center rounded-full border border-white/40 bg-[#28282a] p-[5px] transition-transform duration-300 hover:[transform:translateY(var(--lift))]"
                style={
                  {
                    marginLeft: i === 0 ? 0 : "calc(var(--trust-size) * -0.42)",
                    zIndex: i === 2 ? 4 : i + 1,
                    "--lift": lift,
                  } as React.CSSProperties
                }
              >
                <span className="grid size-full place-items-center rounded-full bg-white">
                  <Icon className="size-[calc(var(--trust-size)*0.34)] text-[#111]" strokeWidth={2.4} />
                </span>
              </span>
            ))}
            <span
              className="flex h-[var(--trust-size)] items-center rounded-full border border-white/40 bg-[#28282a] pr-4 text-[clamp(12px,1.4vw,13.5px)] font-medium text-[#c4c2c3]"
              style={{
                marginLeft: "calc(var(--trust-size) * -0.42)",
                paddingLeft: "calc(var(--trust-size) * 0.58)",
              }}
            >
              Fail-closed by default. Evidence on every call.
            </span>
          </div>

          <h1 className="font-display max-w-[900px] overflow-hidden text-[clamp(28px,6.2vw,80px)] leading-[1.12] tracking-[-0.05em] whitespace-nowrap text-foreground">
            <span className="headline-line" style={{ "--d": "0.12s" } as React.CSSProperties}>
              Tool-Level Law
            </span>
            <span className="headline-line" style={{ "--d": "0.3s" } as React.CSSProperties}>
              For Agent Fleets
            </span>
          </h1>

          <p
            className="anim mt-5 max-w-[min(520px,92%)] text-[clamp(15.5px,1.7vw,18.5px)] leading-[1.55] text-[#d0d0d0]/80"
            style={{ "--d": "0.28s" } as React.CSSProperties}
          >
            Compile who may call which tool, with which arguments, into a fail-closed Skill — then
            make a red team lose, with receipts.
          </p>

          <div
            className="anim-pulse mt-[clamp(18px,3vh,30px)] flex flex-wrap items-center justify-center gap-3"
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            <Link
              to="/dashboard"
              className="cta-glow rounded-full bg-white px-[clamp(22px,3vw,28px)] py-[clamp(11px,1.6vh,13px)] text-[clamp(13.5px,1.5vw,14.5px)] font-semibold text-black transition-all hover:-translate-y-0.5 hover:scale-[1.02] hover:cta-glow-strong"
            >
              Open Console
            </Link>
            <Link
              to="/product"
              className="rounded-full border border-white/25 px-[clamp(20px,3vw,26px)] py-[clamp(11px,1.6vh,13px)] text-[clamp(13.5px,1.5vw,14.5px)] font-medium text-[#c8c8c8] transition-colors hover:border-white/50 hover:text-white"
            >
              See the loop
            </Link>
          </div>
        </main>

        <div className="mx-auto grid w-full max-w-[920px] shrink-0 grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
