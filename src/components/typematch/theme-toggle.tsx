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
    } catch {
      // localStorage can be unavailable in privacy-restricted browser contexts.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="tm-theme-toggle tm-header-icon"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
