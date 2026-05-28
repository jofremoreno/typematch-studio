import type { FontRecord } from "@/data/fonts";
import { printScreenReasoning } from "@/lib/pairing";
import { ScoreBar } from "./score-bar";

export function PrintScreenSuitability({ font }: { font: FontRecord }) {
  return (
    <section className="grid grid-cols-1 gap-10 border-b border-border py-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <span className="label-eyebrow">06 — Print vs Screen</span>
        <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
          Best for {font.bestMedium === "Both" ? "print and screen" : font.bestMedium.toLowerCase()}.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {printScreenReasoning(font)}
        </p>
      </div>
      <div className="space-y-6 border-l border-border pl-6">
        <ScoreBar label="Print" value={font.printScore} />
        <ScoreBar label="Screen" value={font.screenScore} />
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-5 text-xs">
          {(["Print", "Screen", "Both"] as const).map((m) => (
            <div
              key={m}
              className={
                "border p-3 " +
                (font.bestMedium === m
                  ? "border-foreground bg-secondary text-foreground"
                  : "border-border text-muted-foreground")
              }
            >
              <span className="label-eyebrow">{m}</span>
              <p className="mt-2 text-foreground">
                {font.bestMedium === m ? "Recommended" : "Secondary fit"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}