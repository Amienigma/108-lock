export type ImageDim = { w: number; h: number };

export function sniffMime(u8: Uint8Array): string {
  if (u8.length >= 3 && u8[0] === 0xff && u8[1] === 0xd8 && u8[2] === 0xff) return "image/jpeg";
  if (u8.length >= 8 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4e && u8[3] === 0x47) return "image/png";
  if (u8.length >= 12 && ascii(u8, 0, 4) === "RIFF" && ascii(u8, 8, 4) === "WEBP") return "image/webp";
  if (u8.length >= 12 && ascii(u8, 4, 4) === "ftyp") {
    const brand = ascii(u8, 8, 4);
    if (["heic", "heix", "heif", "mif1", "msf1", "hevc", "hevx", "avif", "avis"].includes(brand)) {
      return brand.startsWith("av") ? "image/avif" : "image/heic";
    }
    return "image/heic";
  }
  if (u8.length >= 6 && ascii(u8, 0, 3) === "GIF") return "image/gif";
  return "application/octet-stream";
}

export function readImageSize(u8: Uint8Array): ImageDim | null {
  const mime = sniffMime(u8);
  if (mime === "image/jpeg") return jpegSize(u8);
  if (mime === "image/png") return pngSize(u8);
  if (mime === "image/webp") return webpSize(u8);
  if (mime === "image/gif") return gifSize(u8);
  if (mime === "image/heic" || mime === "image/avif") return ispeSize(u8);
  return jpegSize(u8) || pngSize(u8) || webpSize(u8) || ispeSize(u8);
}

export async function snapshotFile(file: File): Promise<File> {
  const buf = await file.arrayBuffer();
  if (buf.byteLength < 24) throw new Error("NO FILE");
  const u8 = new Uint8Array(buf);
  const sniffed = sniffMime(u8);
  const type = file.type && file.type !== "application/octet-stream" ? file.type : sniffed;
  const name = file.name && file.name !== "blob" ? file.name : "still";
  return new File([buf], name, { type: type || "application/octet-stream" });
}

function ascii(u8: Uint8Array, start: number, n: number) {
  let s = "";
  const end = Math.min(u8.length, start + n);
  for (let i = start; i < end; i++) s += String.fromCharCode(u8[i]);
  return s;
}

function pngSize(u8: Uint8Array): ImageDim | null {
  if (u8.length < 24) return null;
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const w = view.getUint32(16);
  const h = view.getUint32(20);
  return sane(w, h);
}

function gifSize(u8: Uint8Array): ImageDim | null {
  if (u8.length < 10) return null;
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  return sane(view.getUint16(6, true), view.getUint16(8, true));
}

function jpegSize(u8: Uint8Array): ImageDim | null {
  if (u8.length < 8 || u8[0] !== 0xff || u8[1] !== 0xd8) return null;
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let o = 2;
  while (o + 8 < view.byteLength) {
    if (view.getUint8(o) !== 0xff) {
      o += 1;
      continue;
    }
    const marker = view.getUint8(o + 1);
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      o += 2;
      continue;
    }
    if (marker === 0x01) {
      o += 2;
      continue;
    }
    const len = view.getUint16(o + 2);
    if (len < 2) break;
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (o + 8 >= view.byteLength) break;
      const h = view.getUint16(o + 5);
      const w = view.getUint16(o + 7);
      return sane(w, h);
    }
    o += 2 + len;
  }
  return null;
}

function webpSize(u8: Uint8Array): ImageDim | null {
  if (u8.length < 30 || ascii(u8, 0, 4) !== "RIFF" || ascii(u8, 8, 4) !== "WEBP") return null;
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const kind = ascii(u8, 12, 4);
  if (kind === "VP8X" && u8.length >= 30) {
    const w = 1 + (u8[24] | (u8[25] << 8) | (u8[26] << 16));
    const h = 1 + (u8[27] | (u8[28] << 8) | (u8[29] << 16));
    return sane(w, h);
  }
  if (kind === "VP8 " && u8.length >= 30) {
    const w = view.getUint16(26, true) & 0x3fff;
    const h = view.getUint16(28, true) & 0x3fff;
    return sane(w, h);
  }
  if (kind === "VP8L" && u8.length >= 25) {
    const bits = view.getUint32(21, true);
    const w = (bits & 0x3fff) + 1;
    const h = ((bits >> 14) & 0x3fff) + 1;
    return sane(w, h);
  }
  return null;
}

function ispeSize(u8: Uint8Array): ImageDim | null {
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let best: ImageDim | null = null;
  for (let i = 0; i < u8.length - 16; i++) {
    if (u8[i] !== 0x69 || u8[i + 1] !== 0x73 || u8[i + 2] !== 0x70 || u8[i + 3] !== 0x65) continue;
    const w = view.getUint32(i + 8);
    const h = view.getUint32(i + 12);
    if (!sane(w, h)) continue;
    if (!best || w * h > best.w * best.h) best = { w, h };
  }
  return best;
}

function sane(w: number, h: number): ImageDim | null {
  if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
  if (w < 16 || h < 16 || w > 20000 || h > 20000) return null;
  return { w, h };
}
