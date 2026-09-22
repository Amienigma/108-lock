import { LAW, SYMBOLS, type SubGrade } from "@/lib/lock-constants";
import { useLock } from "@/store/lock-store";
import { StillPick } from "./still-pick";

export function Rail({
  onFile,
  onReset,
  onExport,
}: {
  onFile: (f: File) => void;
  onReset: () => void;
  onExport: () => void;
}) {
  const s = useLock();

  return (
    <aside className="w-full shrink-0 overflow-y-auto border-t border-line bg-surface px-4 py-4 min-[900px]:h-dvh min-[900px]:w-[320px] min-[900px]:border-r min-[900px]:border-t-0">
      <header className="mb-4">
        <h1 className="text-[13px] tracking-[0.18em]">108 LOCK</h1>
        <p className="mt-1 text-[9px] leading-relaxed text-dim">{LAW}</p>
      </header>

      <section className="lock-sec">
        <p className="lock-k">FILE</p>
        <StillPick onFile={onFile} className="lock-btn w-full">
          UPLOAD STILL
        </StillPick>
        <div className="mt-2 text-[10px] text-dim">
          {s.file ? (
            <>
              <p className="truncate text-fg">{s.file.name}</p>
              <p>
                {s.file.width}×{s.file.height} · {Math.round(s.file.bytes / 1024)} KB
              </p>
              {s.file.exifTime && <p>EXIF {s.file.exifTime}</p>}
            </>
          ) : (
            <p>NO FILE</p>
          )}
          {s.error && <p className="mt-1 text-magenta">{s.error}</p>}
          {s.warn && <p className="mt-1">{s.warn}</p>}
          {s.busy && <p className="mt-1">LOCKING…</p>}
        </div>
        <button type="button" className="lock-btn mt-3 w-full" onClick={onReset} disabled={!s.file}>
          RESET
        </button>
      </section>

      <section className="lock-sec">
        <p className="lock-k">GRADE</p>
        <Slide label="INTENSITY" value={s.intensity} onChange={s.setIntensity} />
        <Slide label="TEAL DEPTH" value={s.tealDepth} onChange={s.setTeal} />
        <Slide label="MAGENTA KNIFE" value={s.magentaKnife} max={70} knife onChange={s.setKnife} />
        <Slide label="GRAIN" value={s.grain} onChange={s.setGrain} />
        <Slide label="BLACKS" value={s.blacks} onChange={s.setBlacks} />
      </section>

      <section className="lock-sec">
        <p className="lock-k">SUB</p>
        <div className="grid grid-cols-2 gap-1">
          {(["DRIVE", "CLOCK", "QUIET", "LAND"] as SubGrade[]).map((id) => (
            <button
              key={id}
              type="button"
              className="lock-btn"
              data-on={s.sub === id}
              onClick={() => s.setSub(id)}
            >
              {id}
            </button>
          ))}
        </div>
        {s.sub === "CLOCK" && <p className="mt-2 text-[9px] text-dim">Magenta sleeps on the clock.</p>}
      </section>

      <section className="lock-sec">
        <p className="lock-k">810</p>
        <button type="button" className="lock-btn w-full" data-on={s.invert810} onClick={() => s.set810(!s.invert810)}>
          810
        </button>
      </section>

      <section className="lock-sec">
        <p className="lock-k">SYMBOL</p>
        <p className="mb-2 text-[9px] text-dim">One object. Two souvenirs become a postcard.</p>
        <div className="grid grid-cols-2 gap-1">
          {SYMBOLS.map((sym) => (
            <button
              key={sym.id}
              type="button"
              className="lock-btn text-[9px]"
              data-on={s.symbol.id === sym.id}
              onClick={() => s.requestSymbol(sym.id)}
            >
              {sym.label}
            </button>
          ))}
        </div>
        {s.symbol.id === "fm" && (
          <label className="mt-2 block text-[10px] text-dim">
            FM
            <input
              className="mt-1 w-full border border-line bg-bg px-2 py-1 text-fg"
              value={s.symbol.fmNumber}
              maxLength={4}
              onChange={(e) => s.setFm(e.target.value)}
            />
          </label>
        )}
        {s.symbol.id !== "none" && (
          <>
            <Slide label="OPACITY" value={s.symbol.opacity} min={10} max={80} onChange={s.setSymbolOpacity} />
            <Slide
              label="SCALE"
              value={Math.round(s.symbol.scale * 100)}
              min={8}
              max={20}
              onChange={(v) => s.setSymbolScale(v / 100)}
            />
          </>
        )}
        {s.pendingSymbol && (
          <div className="mt-3 border border-magenta p-2">
            <p className="text-[10px]">REPLACE THE OBJECT?</p>
            <div className="mt-2 flex gap-1">
              <button type="button" className="lock-btn flex-1" data-on="true" onClick={s.confirmReplace}>
                REPLACE
              </button>
              <button type="button" className="lock-btn flex-1" onClick={s.cancelReplace}>
                KEEP
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="lock-sec">
        <p className="lock-k">EXPORT</p>
        <label className="mb-1 flex items-center gap-2 text-[10px]">
          <input type="checkbox" checked={s.flatten} onChange={(e) => s.setFlatten(e.target.checked)} />
          FLATTEN SYMBOL
        </label>
        <label className="mb-2 flex items-center gap-2 text-[10px]">
          <input type="checkbox" checked={s.keepExif} onChange={(e) => s.setKeepExif(e.target.checked)} />
          KEEP EXIF
        </label>
        <div className="mb-2 grid grid-cols-3 gap-1">
          {(["none", "4x6", "5x7"] as const).map((p) => (
            <button key={p} type="button" className="lock-btn text-[9px]" data-on={s.print === p} onClick={() => s.setPrint(p)}>
              {p === "none" ? "FRAME" : p.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="lock-btn w-full" data-on="true" disabled={!s.file || s.busy} onClick={onExport}>
          EXPORT PNG
        </button>
      </section>

      <section className="lock-sec">
        <p className="lock-k">LAW</p>
        <p className="text-[9px] leading-relaxed text-dim">{LAW}</p>
      </section>
    </aside>
  );
}

function Slide({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  knife,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  knife?: boolean;
}) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 flex justify-between text-[10px] text-dim">
        {label}
        <span className="tabular-nums text-fg">{value}</span>
      </span>
      <input
        type="range"
        className="lock-range"
        data-knife={knife ? "true" : "false"}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
