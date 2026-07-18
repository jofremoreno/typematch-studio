interface ScoreBarProps {
  label: string;
  value: number;
  caption?: string;
}

export function ScoreBar({ label, value, caption }: ScoreBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="label-eyebrow">{label}</span>
        <span className="font-mono-ui text-sm tabular-nums text-foreground">{value}</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-700"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {caption && <p className="text-xs leading-relaxed text-muted-foreground">{caption}</p>}
    </div>
  );
}
