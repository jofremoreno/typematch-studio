import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FONTS } from "@/data/fonts";
import { ArrowRight, Search } from "lucide-react";

const SUGGESTIONS = ["Inter", "Space Grotesk", "Playfair Display", "Fraunces", "IBM Plex Mono"];

export function FontSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const matches = value
    ? FONTS.filter((f) => f.name.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
    : [];

  const submit = (q?: string) => {
    const query = (q ?? value).trim();
    if (!query) return;
    navigate({ to: "/", search: { q: query } as never });
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-stretch gap-2 border border-border bg-card focus-within:border-foreground"
      >
        <div className="flex items-center pl-4 text-muted-foreground">
          <Search size={16} />
        </div>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Try Inter, Space Grotesk, Playfair Display…"
          className="font-editorial flex-1 bg-transparent px-2 py-4 text-lg outline-none placeholder:text-muted-foreground sm:text-xl"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="m-1 flex items-center gap-2 bg-foreground px-5 text-sm font-medium tracking-wide text-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Analyze typeface
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="label-eyebrow">Try</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            className="rounded-sm border border-border bg-card px-2 py-1 text-foreground transition-colors hover:border-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {open && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-[68px] z-30 border border-border bg-card shadow-lg">
          {matches.map((m) => (
            <button
              key={m.id}
              type="button"
              onMouseDown={() => submit(m.name)}
              className="flex w-full items-center justify-between gap-4 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-secondary"
            >
              <span className="text-lg" style={{ fontFamily: m.family }}>
                {m.name}
              </span>
              <span className="label-eyebrow">{m.classification}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}