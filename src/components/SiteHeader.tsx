import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/toollaw-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/product", label: "Product" },
  { to: "/architecture", label: "Architecture" },
  { to: "/skills", label: "Skills" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="anim-header relative z-20 mx-auto flex w-full max-w-[860px] items-center justify-between gap-[clamp(14px,2.4vw,24px)] sm:justify-center">
      <Link
        to="/"
        aria-label="TOOLLAW home"
        className="nav-shadow grid size-[clamp(42px,4.4vw,46px)] shrink-0 place-items-center rounded-full bg-white transition-transform hover:scale-[1.04]"
      >
        <img src={logo} alt="" width={52} height={52} className="size-[72%] object-contain" />
      </Link>

      <nav className="nav-shadow hidden h-[clamp(44px,5.2vw,48px)] max-w-[560px] flex-1 items-center justify-between rounded-full bg-white px-2 py-1 sm:flex">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`relative rounded-full px-3 py-2 text-[clamp(12px,1.3vw,14px)] font-medium tracking-[-0.01em] text-[#2e2e2e] transition-opacity hover:opacity-75 ${
              isActive(l.to) ? "nav-active" : "opacity-50"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <Link
        to="/dashboard"
        className="nav-shadow hidden h-[clamp(44px,5.2vw,48px)] shrink-0 items-center rounded-full bg-[#28282a] px-5 text-[clamp(12px,1.3vw,14px)] font-medium text-[#c8c8c8] transition-all hover:-translate-y-px hover:bg-[#323234] hover:text-white sm:inline-flex"
      >
        Console
      </Link>

      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`grid size-12 shrink-0 place-items-center rounded-full transition-colors sm:hidden ${
          open ? "bg-white text-black" : "bg-[#28282a] text-white"
        }`}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-[calc(100%+12px)] left-0 z-40 w-full rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:hidden">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative py-3 text-center text-base font-medium text-[#2e2e2e] ${
                    isActive(l.to) ? "nav-active" : "opacity-55"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                className="mt-3 rounded-full bg-[#28282a] py-3 text-center text-sm font-semibold text-white"
              >
                Open Console
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
