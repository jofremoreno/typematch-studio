import { Link } from "@tanstack/react-router";
import { GitCompare } from "lucide-react";
import { useCompareQueue } from "@/lib/compare-queue";

/**
 * Persistent Compare chip. Always visible in catalogue toolbars.
 * Links to the unified analysis workspace. Count updates live from the shared queue.
 */
export function CompareChip({ className = "" }: { className?: string }) {
  const { count } = useCompareQueue();
  const active = count > 0;
  return (
    <Link
      to="/analyze"
      className={
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors " +
        (active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground") +
        " " +
        className
      }
    >
      <GitCompare size={12} />
      Analyze
      <span
        className={
          "ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-md px-1.5 text-[11px] font-mono-ui tabular-nums " +
          (active ? "bg-background/20 text-background" : "bg-secondary text-foreground")
        }
      >
        {count}
      </span>
    </Link>
  );
}
