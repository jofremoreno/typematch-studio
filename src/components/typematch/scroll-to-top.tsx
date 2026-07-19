import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const SHOW_AFTER = 420;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > SHOW_AFTER);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="tm-scroll-top"
      data-visible={visible || undefined}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <span>
        Back
        <br />
        to top
      </span>
      <ChevronUp size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
