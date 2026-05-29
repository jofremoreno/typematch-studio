import { Link, useRouterState } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { to: "/", label: "Analyze" },
  { to: "/library", label: "Library" },
  { to: "/compare", label: "Compare" },
  { to: "/licensing", label: "Licensing" },
  { to: "/method", label: "Method" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-editorial text-xl tracking-tight">TypeMatch</span>
          <span className="label-eyebrow translate-y-[-1px]">Studio</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "text-sm transition-colors " +
                  (active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {item.label}
                {active && <span className="ml-1 inline-block h-1 w-1 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}