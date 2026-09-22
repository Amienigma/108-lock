import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { LAW } from "@/lib/lock-constants";
import { paintFrame } from "@/lib/processor";
import { useLock } from "@/store/lock-store";
import { StillPick } from "./still-pick";

type Props = {
  graded: ImageData | null;
  original: ImageData | null;
  rev: number;
  onFile: (f: File) => void;
};

export function PreviewStage({ graded, original, rev, onFile }: Props) {
  const vis = useRef<HTMLCanvasElement>(null);
  const file = useLock((s) => s.file);
  const compare = useLock((s) => s.compare);
  const setCompare = useLock((s) => s.setCompare);
  const invert = useLock((s) => s.invert810);
  const symbol = useLock((s) => s.symbol);
  const setPos = useLock((s) => s.setSymbolPos);
  const busy = useLock((s) => s.busy);
  const error = useLock((s) => s.error);
  const warn = useLock((s) => s.warn);

  useEffect(() => {
    const v = vis.current;
    if (!v || !graded) return;
    paintFrame(v, graded, original, compare, symbol);
  }, [graded, original, rev, compare, symbol]);

  const map = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  return (
    <section className="relative flex min-h-[52dvh] flex-1 flex-col items-center justify-center bg-bg p-4 min-[900px]:min-h-dvh">
      {!file && (
        <StillPick
          onFile={onFile}
          className="relative flex aspect-[4/5] w-full max-w-[520px] cursor-pointer items-center justify-center border border-line"
        >
          <span className="pointer-events-none absolute inset-0 m-auto h-px w-1/2 bg-line" />
          <span className="pointer-events-none absolute inset-0 m-auto h-1/2 w-px bg-line" />
          <p className="pointer-events-none relative z-10 text-center text-[11px] tracking-[0.14em] text-dim">
            WAIT FOR A STILL.
            <br />
            TAP TO LOAD.
          </p>
        </StillPick>
      )}

      {file && (
        <canvas
          ref={vis}
          className="max-h-[78dvh] max-w-full"
          style={{
            boxShadow: "0 20px 40px #000",
            outline: invert ? "2px solid #c21e6b" : "2px solid #164e57",
            width: "auto",
            height: "auto",
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            if (e.button === 2 || e.altKey || e.shiftKey) {
              setCompare(true);
              return;
            }
            if (symbol.id !== "none") {
              const p = map(e);
              setPos(p.x, p.y);
            }
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1 || compare) return;
            if (symbol.id === "none") return;
            const p = map(e);
            setPos(p.x, p.y);
          }}
          onPointerUp={() => setCompare(false)}
          onPointerCancel={() => setCompare(false)}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      <div className="mt-2 w-full max-w-[520px] text-[9px] tracking-[0.08em] text-dim">
        {file ? (
          <p>
            {file.name} · {file.width}×{file.height}
            {file.exifTime ? ` · ${file.exifTime}` : ""} · LOCKED
            {busy ? " · LOCKING…" : ""}
            {compare ? " · ORIGINAL" : ""}
          </p>
        ) : (
          <p>NO FILE</p>
        )}
        {error && <p className="mt-1 text-magenta">{error}</p>}
        {warn && <p className="mt-1">{warn}</p>}
        <p className="mt-3 max-w-[52ch] text-[9px] leading-relaxed">{LAW}</p>
        {file && (
          <button
            type="button"
            className="lock-btn mt-3"
            onPointerDown={() => setCompare(true)}
            onPointerUp={() => setCompare(false)}
            onPointerLeave={() => setCompare(false)}
          >
            HOLD ORIGINAL
          </button>
        )}
      </div>
    </section>
  );
}
