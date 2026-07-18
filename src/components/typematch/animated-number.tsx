import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let animationFrame = 0;
    let observer: IntersectionObserver | null = null;

    const animate = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
      };
      animationFrame = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer?.disconnect();
        animate();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, value]);

  return (
    <span ref={ref} aria-label={String(value)}>
      {new Intl.NumberFormat().format(display)}
    </span>
  );
}
