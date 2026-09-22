import { applyGrade, meanLuma } from "./grade";
import type { GradeParams } from "./lock-constants";
import { readImageSize, sniffMime } from "./still-bytes";
import { drawSymbol, type SymbolState } from "./symbols";

export const PREVIEW_MAX = 1024;
export const EXPORT_MAX = 1920;

export function containSize(sw: number, sh: number, max: number) {
  const m = Math.max(sw, sh);
  if (m <= max) return { w: sw, h: sh };
  const s = max / m;
  return { w: Math.max(1, Math.round(sw * s)), h: Math.max(1, Math.round(sh * s)) };
}

export type DecodedStill = {
  preview: ImageData;
  fullWidth: number;
  fullHeight: number;
  night: boolean;
};

function toImageData(bmp: ImageBitmap, max: number): ImageData {
  const { w, h } = containSize(bmp.width, bmp.height, max);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("NO FILE");
  ctx.drawImage(bmp, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

async function nativeBitmap(blob: Blob, w: number, h: number): Promise<ImageBitmap | null> {
  const tries: ImageBitmapOptions[] = [
    { resizeWidth: w, resizeHeight: h, resizeQuality: "low", imageOrientation: "from-image" },
    { resizeWidth: w, resizeHeight: h, resizeQuality: "low" },
    { resizeWidth: w, resizeHeight: h },
  ];
  for (const opts of tries) {
    try {
      const bmp = await createImageBitmap(blob, opts);
      if (bmp.width > 0 && bmp.height > 0) return bmp;
      try {
        bmp.close();
      } catch {
        /* */
      }
    } catch {
      /* next */
    }
  }
  try {
    const bmp = await createImageBitmap(blob);
    if (bmp.width > 0) return bmp;
  } catch {
    /* */
  }
  return null;
}

async function heicBitmap(blob: Blob, w: number, h: number): Promise<ImageBitmap | null> {
  try {
    const { heicTo } = await import("heic-to");
    try {
      const bmp = await heicTo({
        blob,
        type: "bitmap",
        options: { resizeWidth: w, resizeHeight: h, resizeQuality: "low" },
      });
      if (bmp && bmp.width > 0) return bmp;
    } catch {
      /* */
    }
    const jpeg = await heicTo({ blob, type: "image/jpeg", quality: 0.82 });
    return await nativeBitmap(jpeg, w, h);
  } catch {
    return null;
  }
}

export async function decodeStill(file: File, max = PREVIEW_MAX): Promise<DecodedStill> {
  const buf = await file.arrayBuffer();
  if (buf.byteLength < 24) throw new Error("NO FILE");
  const u8 = new Uint8Array(buf);
  const mime = file.type && file.type !== "application/octet-stream" ? file.type : sniffMime(u8);
  const dim = readImageSize(u8);
  const blob = new Blob([buf], { type: mime || "application/octet-stream" });
  const target = dim ? containSize(dim.w, dim.h, max) : { w: max, h: Math.round(max * 0.75) };

  let bmp = await nativeBitmap(blob, target.w, target.h);
  const heicLike = /heic|heif|avif/i.test(mime) || sniffMime(u8) === "image/heic";
  if (!bmp && heicLike) bmp = await heicBitmap(blob, target.w, target.h);
  if (!bmp) bmp = await heicBitmap(blob, target.w, target.h);
  if (!bmp) throw new Error("NO FILE");

  const preview = toImageData(bmp, max);
  const fullWidth = dim?.w ?? bmp.width;
  const fullHeight = dim?.h ?? bmp.height;
  try {
    bmp.close();
  } catch {
    /* */
  }
  return {
    preview,
    fullWidth,
    fullHeight,
    night: meanLuma(preview.data) < 0.18,
  };
}

export function gradeAsync(src: ImageData, params: GradeParams): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(applyGrade(src, params));
      } catch (err) {
        reject(err);
      }
    }, 0);
  });
}

export function paintFrame(
  canvas: HTMLCanvasElement,
  graded: ImageData,
  original: ImageData | null,
  compare: boolean,
  symbol: SymbolState,
) {
  const src = compare && original ? original : graded;
  if (canvas.width !== src.width) canvas.width = src.width;
  if (canvas.height !== src.height) canvas.height = src.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.putImageData(src, 0, 0);
  if (!compare && symbol.id !== "none") {
    drawSymbol(ctx, symbol, canvas.width, canvas.height);
  }
}

export function composeToCanvas(
  canvas: HTMLCanvasElement,
  graded: ImageData,
  original: ImageData | null,
  compare: boolean,
  symbol: SymbolState,
  flatten: boolean,
) {
  canvas.width = graded.width;
  canvas.height = graded.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (compare && original) ctx.putImageData(original, 0, 0);
  else ctx.putImageData(graded, 0, 0);
  if (!compare && flatten && symbol.id !== "none") {
    drawSymbol(ctx, symbol, canvas.width, canvas.height);
  }
}

export async function exportPng(
  file: File,
  params: GradeParams,
  symbol: SymbolState,
  flatten: boolean,
): Promise<Blob> {
  const decoded = await decodeStill(file, EXPORT_MAX);
  const graded = applyGrade(decoded.preview, params);
  const c = document.createElement("canvas");
  composeToCanvas(c, graded, decoded.preview, false, symbol, flatten);
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
  if (!blob) throw new Error("EXPORT FAIL");
  return blob;
}

export async function printSheet(
  photo: Blob,
  spec: string,
  kind: "4x6" | "5x7",
): Promise<Blob> {
  const bmp = await createImageBitmap(photo);
  const dpi = 300;
  const W = kind === "4x6" ? 6 * dpi : 7 * dpi;
  const H = kind === "5x7" ? 5 * dpi : 4 * dpi;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("EXPORT FAIL");
  ctx.fillStyle = "#07090a";
  ctx.fillRect(0, 0, W, H);
  const margin = 36;
  const caption = 28;
  const boxW = W - margin * 2;
  const boxH = H - margin * 2 - caption;
  const s = Math.min(boxW / bmp.width, boxH / bmp.height);
  const dw = bmp.width * s;
  const dh = bmp.height * s;
  const dx = margin + (boxW - dw) / 2;
  const dy = margin + (boxH - dh) / 2;
  ctx.drawImage(bmp, dx, dy, dw, dh);
  try {
    bmp.close();
  } catch {
    /* */
  }
  ctx.fillStyle = "#666666";
  ctx.font = `7px "Courier New", Courier, monospace`;
  ctx.textAlign = "left";
  ctx.fillText(spec.slice(0, 180), margin, H - 14);
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
  if (!blob) throw new Error("EXPORT FAIL");
  return blob;
}

export function stampName(original: string) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const base = original.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "_");
  return `108_${y}${m}${day}_${base}.png`;
}
