export async function readExifTime(file: File): Promise<string | null> {
  try {
    const buf = await file.slice(0, 128 * 1024).arrayBuffer();
    const view = new DataView(buf);
    if (view.byteLength < 12) return null;
    if (view.getUint16(0) !== 0xffd8) return null;
    let offset = 2;
    while (offset + 4 < view.byteLength) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);
      const len = view.getUint16(offset + 2);
      if (marker === 0xe1) {
        return parseExif(view, offset + 4, len - 2);
      }
      offset += 2 + len;
    }
  } catch {
    return null;
  }
  return null;
}

function parseExif(view: DataView, start: number, _len: number): string | null {
  const ascii = (i: number, n: number) => {
    let s = "";
    for (let k = 0; k < n; k++) s += String.fromCharCode(view.getUint8(i + k));
    return s;
  };
  if (ascii(start, 6) !== "Exif\0\0") return null;
  const tiff = start + 6;
  const le = ascii(tiff, 2) === "II";
  const u16 = (o: number) => (le ? view.getUint16(o, true) : view.getUint16(o, false));
  const u32 = (o: number) => (le ? view.getUint32(o, true) : view.getUint32(o, false));
  let ifd = tiff + u32(tiff + 4);
  const walk = (off: number) => {
    if (off + 2 > view.byteLength) return null;
    const n = u16(off);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12;
      if (e + 12 > view.byteLength) break;
      const tag = u16(e);
      const type = u16(e + 2);
      const count = u32(e + 4);
      const val = u32(e + 8);
      if ((tag === 0x0132 || tag === 0x9003) && type === 2 && count >= 19) {
        const ptr = val + tiff;
        if (ptr + 19 <= view.byteLength) return ascii(ptr, 19).replace(/\0/g, "").trim();
      }
    }
    return null;
  };
  return walk(ifd);
}

export async function pngWithText(blob: Blob, key: string, value: string): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  if (buf.length < 16 || buf[0] !== 0x89) return blob;
  let o = 8;
  while (o + 8 < buf.length) {
    const len = (buf[o] << 24) | (buf[o + 1] << 16) | (buf[o + 2] << 8) | buf[o + 3];
    const type = String.fromCharCode(buf[o + 4], buf[o + 5], buf[o + 6], buf[o + 7]);
    const next = o + 12 + len;
    if (type === "IHDR") {
      const chunk = makeTextChunk(key, value);
      const out = new Uint8Array(buf.length + chunk.length);
      out.set(buf.subarray(0, next), 0);
      out.set(chunk, next);
      out.set(buf.subarray(next), next + chunk.length);
      return new Blob([out], { type: "image/png" });
    }
    o = next;
  }
  return blob;
}

function makeTextChunk(key: string, value: string) {
  const payload = new TextEncoder().encode(`${key}\0${value}`);
  const chunk = new Uint8Array(12 + payload.length);
  const len = payload.length;
  chunk[0] = (len >>> 24) & 255;
  chunk[1] = (len >>> 16) & 255;
  chunk[2] = (len >>> 8) & 255;
  chunk[3] = len & 255;
  chunk[4] = 116;
  chunk[5] = 69;
  chunk[6] = 88;
  chunk[7] = 116;
  chunk.set(payload, 8);
  const crc = crc32(chunk.subarray(4, 8 + payload.length));
  const c = 8 + payload.length;
  chunk[c] = (crc >>> 24) & 255;
  chunk[c + 1] = (crc >>> 16) & 255;
  chunk[c + 2] = (crc >>> 8) & 255;
  chunk[c + 3] = crc & 255;
  return chunk;
}

function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c ^= data[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
