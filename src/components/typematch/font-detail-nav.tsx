import { useEffect, useState } from "react";
import type { FontRecord } from "@/data/fonts";

const SECTIONS = [
  ["specimen", "Specimen"],
  ["compare", "Compare"],
  ["pairings", "Pairings"],
  ["preview", "In context"],
  ["diagnosis", "Diagnosis"],
  ["usage", "Usage"],
  ["license", "License"],
] as const;

export function FontDetailNav({ font }: { font: FontRecord }) {
  const [activeSection, setActiveSection] = useState<(typeof SECTIONS)[number][0]>("specimen");

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 300);
      let nextSection: (typeof SECTIONS)[number][0] = "specimen";

      for (const [id] of SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) nextSection = id;
      }

      setActiveSection(nextSection);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div className="tm-font-detail-nav">
      <nav aria-label={`${font.name} page sections`} className="tm-font-detail-nav-links">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="tm-font-detail-nav-link"
            aria-current={activeSection === id ? "location" : undefined}
            onClick={() => setActiveSection(id)}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
