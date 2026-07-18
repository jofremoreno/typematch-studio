import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { FontRecord } from "@/data/fonts";
import { useFontPreview } from "@/hooks/use-font-preview";

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog.";

export function FontSpecimenEditor({ font }: { font: FontRecord }) {
  const preview = useFontPreview(font);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [size, setSize] = useState(88);
  const [leading, setLeading] = useState(95);
  const [spacing, setSpacing] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = textareaRef.current;
    if (!canvas) return;
    canvas.style.height = "0px";
    canvas.style.height = `${Math.max(220, canvas.scrollHeight)}px`;
  }, []);

  useLayoutEffect(resizeCanvas, [leading, resizeCanvas, size, spacing, text]);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const reset = () => {
    setText(DEFAULT_TEXT);
    setSize(88);
    setLeading(95);
    setSpacing(0);
  };

  return (
    <section
      id="specimen"
      className="tm-detail-specimen scroll-mt-36"
      aria-labelledby="detail-specimen-title"
    >
      <div className="tm-detail-specimen-toolbar">
        <div className="tm-detail-specimen-heading">
          <div>
            <span className="label-eyebrow">01 — Interactive specimen</span>
            <h2 id="detail-specimen-title" className="mt-1 text-sm font-medium text-foreground">
              Test {font.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="tm-specimen-reset"
            aria-label="Reset specimen"
            title="Reset specimen"
          >
            <RotateCcw size={12} aria-hidden />
          </button>
        </div>

        <div className="tm-detail-specimen-controls">
          <label className="tm-specimen-control">
            <span>Size</span>
            <input
              type="range"
              min="12"
              max="800"
              step="1"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
            <output>{size}</output>
          </label>

          <label className="tm-specimen-control">
            <span>Leading</span>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              value={leading}
              onChange={(event) => setLeading(Number(event.target.value))}
            />
            <output>{leading}</output>
          </label>

          <label className="tm-specimen-control">
            <span>Spacing</span>
            <input
              type="range"
              min="-20"
              max="100"
              step="1"
              value={spacing}
              onChange={(event) => setSpacing(Number(event.target.value))}
            />
            <output>{spacing}</output>
          </label>
        </div>
      </div>

      {font.canPreviewInApp === false ? (
        <div className="tm-detail-specimen-unavailable ui-text">
          <span className="label-eyebrow">Preview unavailable</span>
          <p>This typeface remains a catalogue reference and is not replaced by a false preview.</p>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-label={`${font.name} specimen text`}
          spellCheck={false}
          className="tm-detail-specimen-canvas"
          style={{
            fontFamily: preview.family,
            fontSize: `${size}px`,
            fontWeight: 400,
            lineHeight: `${leading}%`,
            letterSpacing: `${spacing}px`,
          }}
        />
      )}
    </section>
  );
}
