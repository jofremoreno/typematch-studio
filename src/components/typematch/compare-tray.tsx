import { Link } from "@tanstack/react-router";
import { ArrowRight, GitCompare, Trash2, X } from "lucide-react";
import { useCompareQueue } from "@/lib/compare-queue";

export function CompareTray() {
  const { items, count, remove, clear } = useCompareQueue();

  if (count < 2) return null;

  const first = items[0];
  const second = items[1];

  return (
    <aside className="tm-compare-tray" aria-label="Selected typefaces for comparison">
      <div className="tm-compare-tray-inner">
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <GitCompare size={16} aria-hidden />
          <span className="label-eyebrow text-foreground">Compare</span>
          <span className="font-mono-ui text-[11px] text-muted-foreground">{count}/4</span>
        </div>

        <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto" aria-label="Compare queue">
          {items.map((item, index) => (
            <li key={item.id} className="tm-compare-tray-item">
              <span className="tm-compare-tray-index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 truncate text-xs font-medium">{item.name}</span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.name} from comparison`}
                className="ml-auto shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clear}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground sm:inline-flex"
          aria-label="Clear comparison queue"
        >
          <Trash2 size={16} aria-hidden />
        </button>
        <Link
          to="/analyze"
          search={{ font: first?.id, with: second?.id } as never}
          hash="compare"
          className="tm-btn-analyze shrink-0"
        >
          Compare selected
          <ArrowRight size={12} aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
