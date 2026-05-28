import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tm-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-foreground transition-colors hover:border-foreground"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}