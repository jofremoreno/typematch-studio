import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useSavedPairings } from "@/lib/saved-pairings";

const NAV = [
  { to: "/catalogue", label: "Catalogue", hash: undefined as string | undefined },
  { to: "/analyze", label: "Analyze", hash: undefined },
  { to: "/method", label: "Method", hash: undefined },
  { to: "/licensing", label: "Licensing", hash: undefined },
] as const;

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
    <header className="tm-header sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-[1920px] grid-cols-[1fr_auto] items-center px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-[5.75vw]">
        <Link
          to="/"
          className="flex min-w-0 items-baseline gap-2 justify-self-start whitespace-nowrap"
        >
          <span className="font-editorial text-xl tracking-tight">TypeMatch</span>
          <span className="label-eyebrow translate-y-[-1px]">Studio</span>
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
                {active && (
                  <span className="tm-nav-active absolute bottom-0 left-0 right-0 mx-auto h-[2px] rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
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
            <Bookmark size={16} aria-hidden="true" />
            {savedPairings.length > 0 && (
              <span className="tm-nav-saved-count">{Math.min(savedPairings.length, 99)}</span>
            )}
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="tm-mobile-trigger tm-header-icon ui-text"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div
          id="mobile-navigation"
          ref={panelRef}
          className="tm-mobile-menu border-t border-border bg-background md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex w-full max-w-[1920px] flex-col px-5 py-3 sm:px-8 lg:px-[5.75vw]"
          >
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
                    "ui-text border-b border-border py-3 text-sm last:border-b-0 " +
                    (active
                      ? "text-foreground border-l-2 border-l-accent pl-3"
                      : "text-muted-foreground pl-3")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
