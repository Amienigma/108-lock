import type { GradeParams } from "./lock-constants";
import { MAGENTA_KNIFE_CAP } from "./lock-constants";

function clamp(n: number, a: number, b: number) {
  return n < a ? a : n > b ? b : n;
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function srgbToLin(c: number) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function linToSrgb(c: number) {
  const x = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
  return clamp(x, 0, 1);
}

function mixHue(h: number, target: number, w: number) {
  let d = target - h;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  let x = h + d * w;
  if (x < 0) x += 1;
  if (x >= 1) x -= 1;
  return x;
}

function rgbToHsl(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number) {
  if (s <= 1e-6) return { r: l, g: l, b: l };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

export function meanLuma(data: Uint8ClampedArray) {
  let acc = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    acc += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  return acc / n / 255;
}

const TEAL_H = 180 / 360;
const NAVY_H = 210 / 360;
const MAG_H = 322 / 360;

export function applyGrade(image: ImageData, params: GradeParams): ImageData {
  const out = new ImageData(image.width, image.height);
  const src = image.data;
  const dst = out.data;
  const w = image.width;
  const hgt = image.height;

  const knife = Math.min(params.magentaKnife, MAGENTA_KNIFE_CAP) / 100;
  const t = params.intensity / 100;
  const teal = params.tealDepth / 100;
  const grainAmt = params.grain / 100;
  const blacks = params.blacks / 100;

  let ev = -0.35 - t * 0.45;
  let contrast = 1.08;
  let hiPull = 0.3;
  let shadowOpen = mix(0.06, 0.16, blacks);
  let knifeMul = 1;
  let tealMul = 1;
  let grainMul = 1;

  if (params.sub === "DRIVE") {
    contrast = 1.14;
    hiPull = 0.28;
    knifeMul = 1.12;
  } else if (params.sub === "CLOCK") {
    knifeMul = Math.min(1, 0.15 / Math.max(knife, 0.001));
    tealMul = 1.18;
    contrast = 1.04;
  } else if (params.sub === "QUIET") {
    knifeMul = 0.5;
    grainMul = 1.45;
    ev -= 0.16;
    contrast = 0.98;
  } else if (params.sub === "LAND") {
    tealMul = 1.28;
    hiPull = 0.42;
    contrast = 1.02;
    knifeMul = 0.82;
  }

  const invert = params.invert810;
  const fieldH = invert ? MAG_H : TEAL_H;
  const knifeH = invert ? TEAL_H : MAG_H;
  const skyH = invert ? MAG_H : NAVY_H;

  const tealW = teal * tealMul;
  const knifeW = knife * knifeMul;

  for (let y = 0; y < hgt; y++) {
    let prevL = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const or = src[i] / 255;
      const og = src[i + 1] / 255;
      const ob = src[i + 2] / 255;
      const oa = src[i + 3];

      let lr = srgbToLin(src[i]);
      let lg = srgbToLin(src[i + 1]);
      let lb = srgbToLin(src[i + 2]);

      const exp = Math.pow(2, ev);
      lr *= exp;
      lg *= exp;
      lb *= exp;

      const Y0 = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
      const warmth = Math.max(0, lr - lb) * 0.55 + Math.max(0, lg - lb * 0.85) * 0.4;
      let crush = Math.min(1, warmth * 1.8) * t;
      crush *= 1 - smooth(0.32, 0.7, Y0) * 0.8;
      lr -= crush * 0.42;
      lg -= crush * 0.22;
      lb += crush * 0.18;

      let r = linToSrgb(lr);
      let g = linToSrgb(lg);
      let b = linToSrgb(lb);

      let { h, s, l } = rgbToHsl(r, g, b);
      const L = l;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const edge = Math.min(1, Math.abs(L - prevL) * 5);
      prevL = L;
      const srcH = h;
      const warmHue = srcH < 0.16 || srcH > 0.90;

      const sky = smooth(0.42, 0.72, L) * (1 - smooth(0.18, 0.4, s));
      if (sky > 0.02) {
        h = mixHue(h, skyH, 0.78 * t * sky);
        s = mix(s, invert ? 0.26 : 0.2, 0.5 * t * sky);
        l = mix(l, mix(0.14, 0.24, L), 0.45 * t * sky);
      }

      let tw = clamp(tealW * (0.4 + (1 - sky) * 0.75) * (1 - smooth(0.7, 0.95, L)), 0, 1);
      if (sky > 0.25) tw *= 0.22;
      if (warmHue && L > 0.18) tw *= 0.06;
      if (tw > 0.01) {
        h = mixHue(h, fieldH, tw * 0.9);
        s = mix(s, clamp((invert ? 0.4 : 0.36) + tealW * 0.2, 0, 0.65), tw * 0.88);
        l = mix(l, l * (invert ? 0.9 : 0.87), tw * 0.25);
      }

      let spec =
        smooth(0.32, 0.78, L) * 0.45 +
        chroma * 0.5 +
        edge * 0.45 +
        (warmHue && L > 0.18 ? 0.85 : 0);
      if (srcH > 0.22 && srcH < 0.55) spec *= 0.1;
      if (sky > 0.35) spec *= 0.06;
      spec = clamp(spec, 0, 1);

      let mw = Math.min(spec * knifeW, 0.62);
      if (mw > 0.01) {
        h = mixHue(h, knifeH, mw);
        s = mix(s, clamp(0.52 + knifeW * 0.28, 0, 0.82), mw);
        l = mix(l, Math.min(1, l * 1.03 + 0.015), mw * 0.3);
      }

      const rgb = hslToRgb(h, clamp(s, 0, 1), clamp(l, 0, 1));
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;

      if (mw > 0.01) {
        if (invert) {
          r = mix(r, r * 0.45, mw * 0.7);
          g = mix(g, Math.min(1, g * 0.9 + 0.18), mw * 0.7);
          b = mix(b, Math.min(1, b * 0.85 + 0.22), mw * 0.7);
        } else {
          r = mix(r, Math.min(1, r * 0.55 + 0.48), mw * 0.75);
          g = mix(g, g * 0.22, mw * 0.75);
          b = mix(b, Math.min(1, b * 0.45 + 0.28), mw * 0.75);
        }
      }

      const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = (r - Y) * contrast + Y;
      g = (g - Y) * contrast + Y;
      b = (b - Y) * contrast + Y;

      const hi = smooth(0.55, 1.05, Y);
      r -= hi * hiPull * t * r;
      g -= hi * hiPull * t * g;
      b -= hi * hiPull * 0.85 * t * b;

      const sh = 1 - smooth(0.0, 0.28, Y);
      r += sh * shadowOpen * t * 0.04;
      g += sh * shadowOpen * t * 0.055;
      b += sh * shadowOpen * t * 0.06;

      r = mix(or, r, t);
      g = mix(og, g, t);
      b = mix(ob, b, t);

      if (grainAmt > 0) {
        const cell = 1 + 30 * 0.12;
        const nx = Math.floor(x / cell);
        const ny = Math.floor(y / cell);
        const coarse = hash2(nx + 3.1, ny + 7.7);
        const fine = hash2(x * 0.37, y * 0.91);
        const n = (coarse * 0.6 + fine * 0.16 - 0.5) * 2;
        const lum = (r + g + b) / 3;
        const gAmt = (22 / 255) * grainAmt * grainMul * (0.45 + lum * 0.7);
        r += n * gAmt;
        g += n * gAmt;
        b += n * gAmt;
      }

      dst[i] = clamp(r, 0, 1) * 255;
      dst[i + 1] = clamp(g, 0, 1) * 255;
      dst[i + 2] = clamp(b, 0, 1) * 255;
      dst[i + 3] = oa;
    }
  }

  return out;
}
