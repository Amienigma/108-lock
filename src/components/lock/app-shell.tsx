import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_BYTES, THIN_PX, LAW } from "@/lib/lock-constants";
import { readExifTime, pngWithText } from "@/lib/exif";
import { decodeStill, exportPng, gradeAsync, printSheet, stampName } from "@/lib/processor";
import { gradeParamsOf, useLock } from "@/store/lock-store";
import { Rail } from "./rail";
import { PreviewStage } from "./preview";

export function AppShell() {
  const sourceFile = useRef<File | null>(null);
  const srcPreview = useRef<ImageData | null>(null);
  const loading = useRef(false);
  const [graded, setGraded] = useState<ImageData | null>(null);
  const [original, setOriginal] = useState<ImageData | null>(null);
  const [rev, setRev] = useState(0);
  const seq = useRef(0);
  const [live, setLive] = useState(false);

  const file = useLock((s) => s.file);
  const intensity = useLock((s) => s.intensity);
  const tealDepth = useLock((s) => s.tealDepth);
  const magentaKnife = useLock((s) => s.magentaKnife);
  const grain = useLock((s) => s.grain);
  const blacks = useLock((s) => s.blacks);
  const sub = useLock((s) => s.sub);
  const invert810 = useLock((s) => s.invert810);

  const runGrade = useCallback(async () => {
    const src = srcPreview.current;
    if (!src) return;
    const id = ++seq.current;
    useLock.getState().setBusy(true);
    try {
      const params = gradeParamsOf(useLock.getState());
      const next = await gradeAsync(src, params);
      if (id !== seq.current) return;
      setGraded(next);
      setOriginal(src);
      setRev((n) => n + 1);
    } catch {
      if (id !== seq.current) return;
      useLock.getState().setError("NO FILE");
    } finally {
      if (id === seq.current) useLock.getState().setBusy(false);
    }
  }, []);

  useEffect(() => {
    setLive(true);
  }, []);

  useEffect(() => {
    const onErr = () => {
      useLock.getState().setBusy(false);
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onErr);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onErr);
    };
  }, []);

  useEffect(() => {
    if (!live || !srcPreview.current) return;
    const t = window.setTimeout(() => {
      void runGrade();
    }, 40);
    return () => window.clearTimeout(t);
  }, [live, runGrade, intensity, tealDepth, magentaKnife, grain, blacks, sub, invert810]);

  const onFile = useCallback(async (f: File) => {
    if (loading.current) return;
    loading.current = true;
    useLock.getState().setError(null);
    useLock.getState().setWarn(null);
    if (f.size > MAX_BYTES) {
      useLock.getState().setError("NO FILE");
      loading.current = false;
      return;
    }
    useLock.getState().setBusy(true);
    try {
      await new Promise((r) => window.setTimeout(r, 30));
      const decoded = await decodeStill(f);
      sourceFile.current = f;
      srcPreview.current = decoded.preview;
      setOriginal(decoded.preview);
      setGraded(decoded.preview);
      setRev((n) => n + 1);
      const exifTime = await readExifTime(f);
      const thin = Math.min(decoded.fullWidth, decoded.fullHeight) < THIN_PX;
      useLock.getState().setFile({
        name: f.name || "still",
        width: decoded.fullWidth,
        height: decoded.fullHeight,
        bytes: f.size,
        exifTime,
        thin,
        night: decoded.night,
      });
      useLock.getState().resetLook(decoded.night);
      useLock.getState().setWarn(thin ? "THIN FILE." : decoded.night ? "ALREADY NIGHT. INTENSITY LOWERED." : null);
      void runGrade();
    } catch {
      sourceFile.current = null;
      srcPreview.current = null;
      setGraded(null);
      setOriginal(null);
      useLock.getState().setError("NO FILE");
      useLock.getState().setFile(null);
      useLock.getState().setBusy(false);
    } finally {
      loading.current = false;
    }
  }, [runGrade]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith("image/") || i.type === "");
      const blob = item?.getAsFile();
      if (blob) {
        e.preventDefault();
        void onFile(blob);
      }
    };
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      const f = e.dataTransfer?.files?.[0];
      if (!f) return;
      e.preventDefault();
      void onFile(f);
    };
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [onFile]);

  if (!live) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-[11px] tracking-[0.14em] text-dim">
        WAIT FOR A STILL.
      </div>
    );
  }

  const onReset = () => {
    const night = useLock.getState().file?.night;
    useLock.getState().resetLook(night);
    void runGrade();
  };

  const onExport = async () => {
    const src = sourceFile.current;
    const meta = useLock.getState().file;
    if (!src || !meta) return;
    useLock.getState().setBusy(true);
    try {
      const params = gradeParamsOf(useLock.getState());
      const st = useLock.getState();
      let blob = await exportPng(src, params, st.symbol, st.flatten);
      if (st.keepExif && meta.exifTime) {
        blob = await pngWithText(blob, "DateTimeOriginal", meta.exifTime);
      }
      if (st.print === "4x6" || st.print === "5x7") {
        blob = await printSheet(blob, LAW, st.print);
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = stampName(meta.name);
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      useLock.getState().setError("NO FILE");
    } finally {
      useLock.getState().setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col-reverse bg-bg text-fg min-[900px]:flex-row">
      <Rail onFile={onFile} onReset={onReset} onExport={onExport} />
      <PreviewStage graded={graded} original={original} rev={rev} onFile={onFile} />
    </div>
  );
}
