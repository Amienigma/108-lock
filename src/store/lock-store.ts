import { create } from "zustand";
import {
  DEFAULT_GRADE,
  MAGENTA_KNIFE_CAP,
  SYMBOL_OPACITY_MAX,
  SYMBOL_OPACITY_MIN,
  SYMBOL_SCALE_MAX,
  SYMBOL_SCALE_MIN,
  type GradeParams,
  type SubGrade,
  type SymbolId,
} from "@/lib/lock-constants";
import { defaultSymbol, type SymbolState } from "@/lib/symbols";

export type FileMeta = {
  name: string;
  width: number;
  height: number;
  bytes: number;
  exifTime: string | null;
  thin: boolean;
  night: boolean;
};

type LockState = GradeParams & {
  file: FileMeta | null;
  error: string | null;
  warn: string | null;
  busy: boolean;
  compare: boolean;
  symbol: SymbolState;
  pendingSymbol: SymbolId | null;
  flatten: boolean;
  keepExif: boolean;
  print: "none" | "4x6" | "5x7";
  setIntensity: (v: number) => void;
  setTeal: (v: number) => void;
  setKnife: (v: number) => void;
  setGrain: (v: number) => void;
  setBlacks: (v: number) => void;
  setSub: (s: SubGrade) => void;
  set810: (v: boolean) => void;
  setFile: (f: FileMeta | null) => void;
  setError: (e: string | null) => void;
  setWarn: (w: string | null) => void;
  setBusy: (b: boolean) => void;
  setCompare: (v: boolean) => void;
  requestSymbol: (id: SymbolId) => void;
  confirmReplace: () => void;
  cancelReplace: () => void;
  setSymbolPos: (x: number, y: number) => void;
  setSymbolScale: (s: number) => void;
  setSymbolOpacity: (o: number) => void;
  setFm: (n: string) => void;
  setFlatten: (v: boolean) => void;
  setKeepExif: (v: boolean) => void;
  setPrint: (p: "none" | "4x6" | "5x7") => void;
  resetLook: (night?: boolean) => void;
};

function clampKnife(v: number) {
  return Math.max(0, Math.min(MAGENTA_KNIFE_CAP, v));
}

export const useLock = create<LockState>((set, get) => ({
  ...DEFAULT_GRADE,
  file: null,
  error: null,
  warn: null,
  busy: false,
  compare: false,
  symbol: defaultSymbol("none"),
  pendingSymbol: null,
  flatten: true,
  keepExif: false,
  print: "none",
  setIntensity: (intensity) => set({ intensity: Math.max(0, Math.min(100, intensity)) }),
  setTeal: (tealDepth) => set({ tealDepth: Math.max(0, Math.min(100, tealDepth)) }),
  setKnife: (magentaKnife) => set({ magentaKnife: clampKnife(magentaKnife) }),
  setGrain: (grain) => set({ grain: Math.max(0, Math.min(100, grain)) }),
  setBlacks: (blacks) => set({ blacks: Math.max(0, Math.min(100, blacks)) }),
  setSub: (sub) => set({ sub }),
  set810: (invert810) => set({ invert810 }),
  setFile: (file) => set({ file, error: null }),
  setError: (error) => set({ error }),
  setWarn: (warn) => set({ warn }),
  setBusy: (busy) => set({ busy }),
  setCompare: (compare) => set({ compare }),
  requestSymbol: (id) => {
    const cur = get().symbol.id;
    if (id === "none" || cur === "none" || cur === id) {
      set({
        symbol: id === "none" ? defaultSymbol("none") : { ...get().symbol, id },
        pendingSymbol: null,
      });
      return;
    }
    set({ pendingSymbol: id });
  },
  confirmReplace: () => {
    const id = get().pendingSymbol;
    if (!id) return;
    set({ symbol: { ...get().symbol, id }, pendingSymbol: null });
  },
  cancelReplace: () => set({ pendingSymbol: null }),
  setSymbolPos: (x, y) =>
    set({ symbol: { ...get().symbol, x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) } }),
  setSymbolScale: (s) =>
    set({
      symbol: {
        ...get().symbol,
        scale: Math.min(SYMBOL_SCALE_MAX, Math.max(SYMBOL_SCALE_MIN, s)),
      },
    }),
  setSymbolOpacity: (o) =>
    set({
      symbol: {
        ...get().symbol,
        opacity: Math.min(SYMBOL_OPACITY_MAX, Math.max(SYMBOL_OPACITY_MIN, o)),
      },
    }),
  setFm: (n) => set({ symbol: { ...get().symbol, fmNumber: n.replace(/\D/g, "").slice(0, 4) } }),
  setFlatten: (flatten) => set({ flatten }),
  setKeepExif: (keepExif) => set({ keepExif }),
  setPrint: (print) => set({ print }),
  resetLook: (night) =>
    set({
      ...DEFAULT_GRADE,
      intensity: night ? 38 : DEFAULT_GRADE.intensity,
      symbol: defaultSymbol("none"),
      pendingSymbol: null,
      compare: false,
    }),
}));

export function gradeParamsOf(s: LockState): GradeParams {
  return {
    intensity: s.intensity,
    tealDepth: s.tealDepth,
    magentaKnife: s.magentaKnife,
    grain: s.grain,
    blacks: s.blacks,
    sub: s.sub,
    invert810: s.invert810,
  };
}
