import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useSavedPairings } from "@/lib/saved-pairings";

const NAV = [
  { to: "/method", label: "Method", hash: undefined as string | undefined },
  { to: "/licensing", label: "Licensing", hash: undefined as string | undefined },
] as const;

const STUDIO_FONTS = [
  "Inter",
  "Redaction",
  "Orbitron",
  "Knewave",
  "Le Murmure",
  "Steps Mono",
  "Basteleur",
  "Compagnon",
  "PicNic",
  "Avara",
] as const;

function AnimatedStudioMark() {
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let interval = 0;
    let cancelled = false;

    const startCycle = () => {
      if (cancelled) return;
      interval = window.setInterval(() => {
        setFontIndex((current) => (current + 1) % STUDIO_FONTS.length);
      }, 500);
    };

    void Promise.all(
      STUDIO_FONTS.map((family) => document.fonts.load(`400 11px "${family}"`)),
    ).finally(startCycle);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const family = STUDIO_FONTS[fontIndex];

  return (
    <span className="label-eyebrow tm-logo-studio translate-y-[-1px]" aria-label="Studio">
      <span
        key={`${family}-${fontIndex}`}
        className="tm-logo-studio-glyph"
        style={{ fontFamily: `"${family}", "Inter", sans-serif` }}
        aria-hidden="true"
      >
        Studio
      </span>
    </span>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locationHash = useRouterState({ select: (s) => s.location.hash });
  const hash = locationHash.replace(/^#/, "");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { items: savedPairings } = useSavedPairings();
  const savedActive = pathname === "/" && hash === "saved";

  const isActive = (item: (typeof NAV)[number]) => {
    if (pathname !== item.to) return false;
    if (item.hash) return hash === item.hash;
    return true;
  };

  // Close on route change
  useEffect(() => setOpen(false), [pathname]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="tm-header sticky top-0 z-40">
      <div className="mx-auto w-full max-w-[1920px] px-5 pt-3 sm:px-8 lg:px-[5.75vw]">
        <div className="tm-header-row flex items-stretch gap-2">
          <div className="tm-header-shell grid min-h-16 min-w-0 flex-1 grid-cols-[1fr_auto] items-center px-4 sm:px-5 md:grid-cols-[1fr_auto_1fr]">
            <Link
              to="/"
              className="flex min-w-0 items-baseline gap-2 justify-self-start whitespace-nowrap"
            >
              <span className="font-editorial text-xl tracking-tight">TypeMatch</span>
              <AnimatedStudioMark />
            </Link>

            {/* Desktop nav */}
            <nav
              aria-label="Primary navigation"
              className="tm-primary-nav hidden h-full items-center justify-self-center md:flex"
            >
              {NAV.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    aria-current={active ? "page" : undefined}
                    className={
                      "tm-nav-link ui-text relative flex h-full items-center px-0.5 text-[13px] tracking-[0.01em] transition-colors " +
                      (active ? "text-foreground" : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Navbar actions: Saved is the final desktop item. */}
            <div className="tm-header-actions flex items-center justify-self-end">
              <Link
                to="/"
                hash="saved"
                aria-label={`Saved pairings${savedPairings.length ? ` (${savedPairings.length})` : ""}`}
                aria-current={savedActive ? "page" : undefined}
                title="Saved pairings"
                className="tm-nav-saved tm-header-icon"
                data-active={savedActive || undefined}
              >
                {savedPairings.length > 0 ? (
                  <BookmarkCheck size={19} strokeWidth={1.7} aria-hidden="true" />
                ) : (
                  <Bookmark size={19} strokeWidth={1.7} aria-hidden="true" />
                )}
                {savedPairings.length > 0 && (
                  <span className="tm-nav-saved-count">{Math.min(savedPairings.length, 99)}</span>
                )}
              </Link>
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((v) => !v)}
                className="tm-mobile-trigger tm-header-icon ui-text"
              >
                {open ? <X size={19} strokeWidth={1.7} /> : <Menu size={19} strokeWidth={1.7} />}
              </button>
            </div>
          </div>

          <div className="tm-theme-shell flex min-h-16 w-16 shrink-0 items-center justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {open && (
          <div id="mobile-navigation" ref={panelRef} className="tm-mobile-menu md:hidden">
            <nav aria-label="Mobile navigation" className="flex w-full flex-col px-3 py-2">
              {NAV.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={
                      "ui-text rounded-lg px-3 py-3 text-sm " +
                      (active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
