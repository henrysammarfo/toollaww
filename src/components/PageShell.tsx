import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BackgroundVideo } from "./BackgroundVideo";
import { SiteHeader } from "./SiteHeader";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <BackgroundVideo dim={0.78} />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-[clamp(14px,3vw,32px)] py-[clamp(16px,2.4vh,28px)]">
        <SiteHeader />

        <main className="flex-1 pt-[clamp(40px,8vh,88px)] pb-16">
          <p className="anim text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="anim font-display mt-4 text-[clamp(30px,5.4vw,60px)] leading-[1.1] tracking-[-0.05em] text-foreground">
            {title}
          </h1>
          <p
            className="anim mt-5 max-w-[640px] text-[15px] leading-relaxed text-[#d0d0d0]/80"
            style={{ "--d": "0.1s" } as React.CSSProperties}
          >
            {intro}
          </p>

          <div className="mt-[clamp(32px,5vh,56px)]">{children}</div>
        </main>

        <footer className="border-t border-border pt-6 pb-2">
          <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="min-w-0">
              TOOLLAW — governable tool-control plane. Accra Technical University · GOAI 2026
              Track 1 Agent Infra.
            </p>
            <nav className="flex flex-wrap gap-4">
              <Link to="/product" className="hover:text-foreground">
                Product
              </Link>
              <Link to="/architecture" className="hover:text-foreground">
                Architecture
              </Link>
              <Link to="/skills" className="hover:text-foreground">
                Skills
              </Link>
              <Link to="/dashboard" className="hover:text-foreground">
                Console
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel p-6 ${className}`}>
      {title ? (
        <h2 className="font-display mb-4 text-[clamp(18px,2.2vw,24px)] tracking-[-0.04em]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
