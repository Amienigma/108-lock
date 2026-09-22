import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C0wwTx1A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LAW = "108 Night is teal weather with a magenta pulse, analog grain, and one true object from the day — nothing added to win the picture.";
var SYMBOLS = [
	{
		id: "none",
		label: "NONE"
	},
	{
		id: "fm",
		label: "FM SHIELD"
	},
	{
		id: "cattle",
		label: "CATTLE GUARD"
	},
	{
		id: "caliche",
		label: "CALICHE"
	},
	{
		id: "hail",
		label: "HAIL BOX"
	},
	{
		id: "pumpjack",
		label: "PUMPJACK"
	},
	{
		id: "mesquite",
		label: "MESQUITE"
	},
	{
		id: "pear",
		label: "PEAR"
	},
	{
		id: "tank",
		label: "TANK+MILL"
	},
	{
		id: "siren",
		label: "SIREN HEAD"
	},
	{
		id: "stadium",
		label: "STADIUM"
	},
	{
		id: "brick",
		label: "BRICK"
	}
];
var SYMBOL_SCALE_MIN = .08;
var SYMBOL_SCALE_MAX = .2;
var DEFAULT_GRADE = {
	intensity: 62,
	tealDepth: 58,
	magentaKnife: 36,
	grain: 25,
	blacks: 52,
	sub: "DRIVE",
	invert810: false
};
async function readExifTime(file) {
	try {
		const buf = await file.slice(0, 131072).arrayBuffer();
		const view = new DataView(buf);
		if (view.byteLength < 12) return null;
		if (view.getUint16(0) !== 65496) return null;
		let offset = 2;
		while (offset + 4 < view.byteLength) {
			if (view.getUint8(offset) !== 255) break;
			const marker = view.getUint8(offset + 1);
			const len = view.getUint16(offset + 2);
			if (marker === 225) return parseExif(view, offset + 4, len - 2);
			offset += 2 + len;
		}
	} catch {
		return null;
	}
	return null;
}
function parseExif(view, start, _len) {
	const ascii = (i, n) => {
		let s = "";
		for (let k = 0; k < n; k++) s += String.fromCharCode(view.getUint8(i + k));
		return s;
	};
	if (ascii(start, 6) !== "Exif\0\0") return null;
	const tiff = start + 6;
	const le = ascii(tiff, 2) === "II";
	const u16 = (o) => le ? view.getUint16(o, true) : view.getUint16(o, false);
	const u32 = (o) => le ? view.getUint32(o, true) : view.getUint32(o, false);
	let ifd = tiff + u32(tiff + 4);
	const walk = (off) => {
		if (off + 2 > view.byteLength) return null;
		const n = u16(off);
		for (let i = 0; i < n; i++) {
			const e = off + 2 + i * 12;
			if (e + 12 > view.byteLength) break;
			const tag = u16(e);
			const type = u16(e + 2);
			const count = u32(e + 4);
			const val = u32(e + 8);
			if ((tag === 306 || tag === 36867) && type === 2 && count >= 19) {
				const ptr = val + tiff;
				if (ptr + 19 <= view.byteLength) return ascii(ptr, 19).replace(/\0/g, "").trim();
			}
		}
		return null;
	};
	return walk(ifd);
}
async function pngWithText(blob, key, value) {
	const buf = new Uint8Array(await blob.arrayBuffer());
	if (buf.length < 16 || buf[0] !== 137) return blob;
	let o = 8;
	while (o + 8 < buf.length) {
		const len = buf[o] << 24 | buf[o + 1] << 16 | buf[o + 2] << 8 | buf[o + 3];
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
function makeTextChunk(key, value) {
	const payload = new TextEncoder().encode(`${key}\0${value}`);
	const chunk = new Uint8Array(12 + payload.length);
	const len = payload.length;
	chunk[0] = len >>> 24 & 255;
	chunk[1] = len >>> 16 & 255;
	chunk[2] = len >>> 8 & 255;
	chunk[3] = len & 255;
	chunk[4] = 116;
	chunk[5] = 69;
	chunk[6] = 88;
	chunk[7] = 116;
	chunk.set(payload, 8);
	const crc = crc32(chunk.subarray(4, 8 + payload.length));
	const c = 8 + payload.length;
	chunk[c] = crc >>> 24 & 255;
	chunk[c + 1] = crc >>> 16 & 255;
	chunk[c + 2] = crc >>> 8 & 255;
	chunk[c + 3] = crc & 255;
	return chunk;
}
function crc32(data) {
	let c = 4294967295;
	for (let i = 0; i < data.length; i++) {
		c ^= data[i];
		for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
	}
	return (c ^ 4294967295) >>> 0;
}
function clamp(n, a, b) {
	return n < a ? a : n > b ? b : n;
}
function mix(a, b, t) {
	return a + (b - a) * t;
}
function smooth(e0, e1, x) {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
}
function hash2(x, y) {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
}
function srgbToLin(c) {
	const x = c / 255;
	return x <= .04045 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4);
}
function linToSrgb(c) {
	return clamp(c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - .055, 0, 1) * 255;
}
function meanLuma(data) {
	let acc = 0;
	const n = data.length / 4;
	for (let i = 0; i < data.length; i += 4) acc += .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
	return acc / n / 255;
}
function applyGrade(image, params) {
	const out = new ImageData(image.width, image.height);
	const src = image.data;
	const dst = out.data;
	const w = image.width;
	const h = image.height;
	const knife = Math.min(params.magentaKnife, 70) / 100;
	let intensity = params.intensity / 100;
	const teal = params.tealDepth / 100;
	const grainAmt = params.grain / 100;
	const blacks = params.blacks / 100;
	let ev = -.35 - intensity * .45;
	let contrast = 1.08;
	let hiPull = .3;
	let shadowOpen = mix(.06, .16, blacks);
	let knifeMul = 1;
	let tealMul = 1;
	let grainMul = 1;
	if (params.sub === "DRIVE") {
		contrast = 1.16;
		hiPull = .28;
		knifeMul = 1.08;
	} else if (params.sub === "CLOCK") {
		knifeMul = Math.min(1, .15 / Math.max(knife, .001));
		tealMul = 1.15;
		contrast = 1.04;
	} else if (params.sub === "QUIET") {
		knifeMul = .5;
		grainMul = 1.45;
		ev -= .16;
		contrast = .98;
	} else if (params.sub === "LAND") {
		tealMul = 1.22;
		hiPull = .42;
		contrast = 1.02;
		knifeMul = .82;
	}
	const invert = params.invert810;
	const t = intensity;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const i = (y * w + x) * 4;
		const or = src[i];
		const og = src[i + 1];
		const ob = src[i + 2];
		const oa = src[i + 3];
		let lr = srgbToLin(or);
		let lg = srgbToLin(og);
		let lb = srgbToLin(ob);
		const sr = lr;
		const sg = lg;
		const sb = lb;
		const exp = Math.pow(2, ev);
		lr *= exp;
		lg *= exp;
		lb *= exp;
		const Y0 = .2126 * lr + .7152 * lg + .0722 * lb;
		const warmth = Math.max(0, lr - lb) * .55 + Math.max(0, lg - lb * .85) * .4;
		const crush = Math.min(1, warmth * 1.8) * t;
		lr -= crush * .42;
		lg -= crush * .22;
		lb += crush * .18;
		const Y = Math.max(1e-6, .2126 * lr + .7152 * lg + .0722 * lb);
		const shadow = (1 - smooth(.08, invert ? .72 : .52, Y)) * teal * tealMul * t;
		const fieldTealR = Y * .22;
		const fieldTealG = Y * .48;
		const fieldTealB = Y * .58;
		const fieldMagR = Y * .7;
		const fieldMagG = Y * .08;
		const fieldMagB = Y * .26;
		if (invert) {
			lr = mix(lr, fieldMagR, shadow);
			lg = mix(lg, fieldMagG, shadow);
			lb = mix(lb, fieldMagB, shadow);
		} else {
			lr = mix(lr, fieldTealR, shadow);
			lg = mix(lg, fieldTealG, shadow);
			lb = mix(lb, fieldTealB, shadow);
		}
		let magW = clamp((Math.max(lr, lg, lb) - Y) * 3.2 + smooth(.45, .82, Y) * .35, 0, 1) * knife * knifeMul * t;
		magW = Math.min(magW, .34);
		if (invert) {
			lr = mix(lr, lr * .45 + Y * .08, magW);
			lg = mix(lg, lg * 1.08 + .05, magW);
			lb = mix(lb, lb * 1.12 + .07, magW);
		} else {
			lr = mix(lr, lr * 1.12 + .045, magW);
			lg = mix(lg, lg * .55, magW);
			lb = mix(lb, lb * .92 + .04, magW);
		}
		let r = lr;
		let g = lg;
		let b = lb;
		r = (r - Y) * contrast + Y;
		g = (g - Y) * contrast + Y;
		b = (b - Y) * contrast + Y;
		const hi = smooth(.55, 1.1, Y);
		r -= hi * hiPull * t * r;
		g -= hi * hiPull * t * g;
		b -= hi * hiPull * .85 * t * b;
		const sh = 1 - smooth(0, .28, Y);
		r += sh * shadowOpen * t * .04;
		g += sh * shadowOpen * t * .055;
		b += sh * shadowOpen * t * .06;
		r = mix(sr, r, t);
		g = mix(sg, g, t);
		b = mix(sb, b, t);
		if (Y0 > .78 && t > .2) {
			const bloom = (Y0 - .78) * .18 * t;
			r += bloom * .7;
			g += bloom * .85;
			b += bloom * .9;
		}
		let R = linToSrgb(r);
		let G = linToSrgb(g);
		let B = linToSrgb(b);
		if (grainAmt > 0) {
			const cell = 4.6;
			const nx = Math.floor(x / cell);
			const ny = Math.floor(y / cell);
			const coarse = hash2(nx + 3.1, ny + 7.7);
			const fine = hash2(x * .37, y * .91);
			const n = (coarse * .6 + fine * .4 * .4 - .5) * 2;
			const lum = (R + G + B) / 765;
			const gAmt = 22 * grainAmt * grainMul * (.45 + lum * .7);
			R += n * gAmt;
			G += n * gAmt;
			B += n * gAmt;
		}
		dst[i] = clamp(R, 0, 255);
		dst[i + 1] = clamp(G, 0, 255);
		dst[i + 2] = clamp(B, 0, 255);
		dst[i + 3] = oa;
	}
	return out;
}
function stroke(ctx, color, w) {
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = w;
	ctx.lineJoin = "miter";
	ctx.lineCap = "square";
}
function drawSymbol(ctx, sym, frameW, frameH) {
	if (sym.id === "none") return;
	const size = Math.min(frameW * Math.min(sym.scale, .2), frameW * .2);
	const cx = sym.x * frameW;
	const cy = sym.y * frameH;
	ctx.save();
	ctx.globalAlpha = Math.min(.8, Math.max(.1, sym.opacity / 100));
	ctx.globalCompositeOperation = "soft-light";
	ctx.translate(cx, cy);
	const ink = "rgba(232,232,232,0.95)";
	const ink2 = "rgba(8,8,8,0.85)";
	switch (sym.id) {
		case "fm":
			drawFm(ctx, size, sym.fmNumber || "543", ink, ink2);
			break;
		case "cattle":
			drawCattle(ctx, size, ink);
			break;
		case "caliche":
			drawCaliche(ctx, size);
			break;
		case "hail":
			drawHail(ctx, size, ink);
			break;
		case "pumpjack":
			drawPumpjack(ctx, size, ink);
			break;
		case "mesquite":
			drawMesquite(ctx, size, ink);
			break;
		case "pear":
			drawPear(ctx, size, ink);
			break;
		case "tank":
			drawTank(ctx, size, ink);
			break;
		case "siren":
			drawSiren(ctx, size, ink);
			break;
		case "stadium":
			drawStadium(ctx, size, ink);
			break;
		case "brick": drawBrick(ctx, size);
	}
	ctx.restore();
}
function drawFm(ctx, size, num, ink, ink2) {
	const w = size;
	const h = size * .72;
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = ink;
	ctx.strokeStyle = ink2;
	ctx.lineWidth = Math.max(1, size * .03);
	ctx.fillRect(-w / 2, -h / 2, w, h);
	ctx.strokeRect(-w / 2, -h / 2, w, h);
	ctx.fillStyle = ink2;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `600 ${size * .16}px "Courier New", Courier, monospace`;
	ctx.fillText("FM", 0, -h * .18);
	ctx.font = `700 ${size * .28}px "Courier New", Courier, monospace`;
	ctx.fillText(num.slice(0, 4), 0, h * .16);
}
function drawCattle(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1, size * .035));
	const w = size;
	const n = 10;
	for (let i = 0; i < n; i++) {
		const y = -size * .18 + i / 9 * size * .36;
		ctx.beginPath();
		ctx.moveTo(-w / 2, y);
		ctx.lineTo(w / 2, y);
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.moveTo(-w / 2, size * .22);
	ctx.lineTo(-w * .08, size * .42);
	ctx.moveTo(w / 2, size * .22);
	ctx.lineTo(w * .08, size * .42);
	ctx.stroke();
}
function drawCaliche(ctx, size) {
	ctx.globalCompositeOperation = "overlay";
	const w = size;
	const h = size * .38;
	ctx.fillStyle = "rgba(210,200,178,0.7)";
	ctx.fillRect(-w / 2, -h / 2, w, h);
	ctx.strokeStyle = "rgba(90,80,60,0.5)";
	ctx.lineWidth = 1;
	ctx.strokeRect(-w / 2, -h / 2, w, h);
	for (let i = 0; i < 28; i++) {
		const px = (hash(i, 2) - .5) * w;
		const py = (hash(i, 9) - .5) * h;
		ctx.fillStyle = `rgba(255,255,240,${.15 + hash(i, 4) * .25})`;
		ctx.fillRect(px, py, 2, 2);
	}
}
function hash(a, b) {
	const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
	return s - Math.floor(s);
}
function drawHail(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1, size * .04));
	const w = size * .55;
	ctx.strokeRect(-w / 2, -size * .05, w, size * .42);
	ctx.beginPath();
	ctx.moveTo(-w / 2, -size * .05);
	ctx.lineTo(0, -size * .38);
	ctx.lineTo(w / 2, -size * .05);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(w / 2, size * .08);
	ctx.lineTo(w / 2 + size * .12, size * .08);
	ctx.lineTo(w / 2 + size * .12, size * .22);
	ctx.stroke();
	for (const [dx, dy] of [
		[-.12, .12],
		[.02, .08],
		[.14, .18]
	]) {
		ctx.beginPath();
		ctx.arc(dx * size, dy * size, size * .045, 0, Math.PI * 2);
		ctx.stroke();
	}
}
function drawPumpjack(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1.2, size * .045));
	ctx.beginPath();
	ctx.moveTo(-size * .42, size * .28);
	ctx.lineTo(size * .08, -size * .22);
	ctx.lineTo(size * .38, -size * .02);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(-size * .05, size * .28);
	ctx.lineTo(-size * .05, -size * .02);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(size * .38, -size * .02, size * .06, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(size * .38, size * .04);
	ctx.lineTo(size * .38, size * .28);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(-size * .5, size * .28);
	ctx.lineTo(size * .5, size * .28);
	ctx.stroke();
}
function drawMesquite(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1.2, size * .04));
	ctx.beginPath();
	ctx.moveTo(-size * .1, size * .4);
	ctx.lineTo(0, -size * .05);
	ctx.lineTo(size * .22, -size * .32);
	ctx.moveTo(0, -size * .05);
	ctx.lineTo(-size * .28, -size * .18);
	ctx.moveTo(-size * .12, size * .12);
	ctx.lineTo(size * .18, size * .02);
	ctx.stroke();
}
function drawPear(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1.2, size * .04));
	for (const [x, y, r] of [
		[
			0,
			.08,
			.22
		],
		[
			-.22,
			-.12,
			.18
		],
		[
			.2,
			-.16,
			.17
		]
	]) {
		ctx.beginPath();
		ctx.ellipse(x * size, y * size, r * size, r * size * 1.15, .3, 0, Math.PI * 2);
		ctx.stroke();
	}
}
function drawTank(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1.2, size * .04));
	ctx.beginPath();
	ctx.ellipse(0, size * .18, size * .42, size * .16, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(size * .12, size * .18);
	ctx.lineTo(size * .12, -size * .28);
	ctx.moveTo(size * 0, -size * .08);
	ctx.lineTo(size * .24, -size * .08);
	ctx.moveTo(size * .12, -size * .28);
	ctx.lineTo(size * .02, -size * .4);
	ctx.lineTo(size * .22, -size * .4);
	ctx.lineTo(size * .12, -size * .28);
	ctx.stroke();
}
function drawSiren(ctx, size, ink) {
	stroke(ctx, ink, Math.max(1.2, size * .04));
	for (const a of [
		-.7,
		-.25,
		.25,
		.7
	]) {
		ctx.beginPath();
		ctx.moveTo(0, size * .12);
		ctx.lineTo(Math.sin(a) * size * .42, -size * .32 + Math.abs(a) * size * .08);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(Math.sin(a) * size * .42, -size * .32 + Math.abs(a) * size * .08, size * .07, size * .04, a, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.strokeRect(-size * .1, size * .08, size * .2, size * .16);
}
function drawStadium(ctx, size, ink) {
	for (const x of [-.28, .28]) {
		const gx = x * size;
		const gy = -size * .22;
		const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, size * .42);
		grad.addColorStop(0, "rgba(255,240,220,0.55)");
		grad.addColorStop(1, "rgba(255,240,220,0)");
		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.arc(gx, gy, size * .42, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = ink;
		ctx.fillRect(gx - 1, gy, 2, size * .5);
	}
}
function drawBrick(ctx, size) {
	ctx.globalCompositeOperation = "overlay";
	const w = size * .9;
	const h = size * .45;
	ctx.fillStyle = "rgba(176,92,48,0.55)";
	ctx.fillRect(-w / 2, -h / 2, w, h);
	ctx.strokeStyle = "rgba(40,18,10,0.7)";
	ctx.lineWidth = 1;
	ctx.strokeRect(-w / 2, -h / 2, w, h);
	ctx.beginPath();
	ctx.moveTo(0, -h / 2);
	ctx.lineTo(0, h / 2);
	ctx.moveTo(-w / 2, 0);
	ctx.lineTo(w / 2, 0);
	ctx.stroke();
}
function defaultSymbol(id) {
	return {
		id,
		x: .5,
		y: .78,
		scale: .12,
		opacity: 35,
		fmNumber: "543"
	};
}
var PREVIEW_MAX = 1400;
var worker = null;
var workerOk = true;
var job = 0;
function getWorker() {
	if (!workerOk) return null;
	if (worker) return worker;
	try {
		worker = new Worker(new URL("./grade-worker.ts", import.meta.url), { type: "module" });
		worker.onerror = () => {
			workerOk = false;
			worker = null;
		};
		return worker;
	} catch {
		workerOk = false;
		return null;
	}
}
function containSize(sw, sh, max) {
	const m = Math.max(sw, sh);
	if (m <= max) return {
		w: sw,
		h: sh
	};
	const s = max / m;
	return {
		w: Math.max(1, Math.round(sw * s)),
		h: Math.max(1, Math.round(sh * s))
	};
}
async function bitmapFromFile(file) {
	try {
		return await createImageBitmap(file);
	} catch {
		const url = URL.createObjectURL(file);
		try {
			const img = await new Promise((res, rej) => {
				const el = new Image();
				el.onload = () => res(el);
				el.onerror = () => rej(/* @__PURE__ */ new Error("NO FILE"));
				el.src = url;
			});
			return await createImageBitmap(img);
		} finally {
			URL.revokeObjectURL(url);
		}
	}
}
function imageDataFromBitmap(bmp, max = PREVIEW_MAX) {
	const { w, h } = containSize(bmp.width, bmp.height, max);
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("NO FILE");
	ctx.drawImage(bmp, 0, 0, w, h);
	return ctx.getImageData(0, 0, w, h);
}
function lumaOfBitmap(bmp) {
	return meanLuma(imageDataFromBitmap(bmp, 256).data);
}
function gradeAsync(src, params) {
	const w = getWorker();
	if (!w) return Promise.resolve(applyGrade(src, params));
	const id = ++job;
	return new Promise((resolve) => {
		const copy = new Uint8ClampedArray(src.data);
		const onMsg = (e) => {
			if (e.data.id !== id) return;
			w.removeEventListener("message", onMsg);
			resolve(new ImageData(new Uint8ClampedArray(e.data.buffer), e.data.width, e.data.height));
		};
		w.addEventListener("message", onMsg);
		w.postMessage({
			id,
			width: src.width,
			height: src.height,
			buffer: copy.buffer,
			params
		}, [copy.buffer]);
	});
}
function composeToCanvas(canvas, graded, original, compare, symbol, flatten) {
	canvas.width = graded.width;
	canvas.height = graded.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	if (compare && original) ctx.putImageData(original, 0, 0);
	else ctx.putImageData(graded, 0, 0);
	if (!compare && flatten && symbol.id !== "none") drawSymbol(ctx, symbol, canvas.width, canvas.height);
}
async function exportPng(full, params, symbol, flatten) {
	const src = imageDataFromBitmap(full, Math.max(full.width, full.height));
	const graded = applyGrade(src, params);
	const c = document.createElement("canvas");
	composeToCanvas(c, graded, src, false, symbol, flatten);
	const blob = await new Promise((res) => c.toBlob(res, "image/png"));
	if (!blob) throw new Error("EXPORT FAIL");
	return blob;
}
async function printSheet(photo, spec, kind) {
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
	const boxW = W - 72;
	const boxH = H - 72 - caption;
	const s = Math.min(boxW / bmp.width, boxH / bmp.height);
	const dw = bmp.width * s;
	const dh = bmp.height * s;
	const dx = margin + (boxW - dw) / 2;
	const dy = margin + (boxH - dh) / 2;
	ctx.drawImage(bmp, dx, dy, dw, dh);
	ctx.fillStyle = "#666666";
	ctx.font = `7px "Courier New", Courier, monospace`;
	ctx.textAlign = "left";
	ctx.fillText(spec.slice(0, 180), margin, H - 14);
	const blob = await new Promise((res) => c.toBlob(res, "image/png"));
	if (!blob) throw new Error("EXPORT FAIL");
	return blob;
}
function stampName(original) {
	const d = /* @__PURE__ */ new Date();
	return `108_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}_${original.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "_")}.png`;
}
function clampKnife(v) {
	return Math.max(0, Math.min(70, v));
}
var useLock = create((set, get) => ({
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
	setFile: (file) => set({
		file,
		error: null
	}),
	setError: (error) => set({ error }),
	setWarn: (warn) => set({ warn }),
	setBusy: (busy) => set({ busy }),
	setCompare: (compare) => set({ compare }),
	requestSymbol: (id) => {
		const cur = get().symbol.id;
		if (id === "none" || cur === "none" || cur === id) {
			set({
				symbol: id === "none" ? defaultSymbol("none") : {
					...get().symbol,
					id
				},
				pendingSymbol: null
			});
			return;
		}
		set({ pendingSymbol: id });
	},
	confirmReplace: () => {
		const id = get().pendingSymbol;
		if (!id) return;
		set({
			symbol: {
				...get().symbol,
				id
			},
			pendingSymbol: null
		});
	},
	cancelReplace: () => set({ pendingSymbol: null }),
	setSymbolPos: (x, y) => set({ symbol: {
		...get().symbol,
		x: Math.min(1, Math.max(0, x)),
		y: Math.min(1, Math.max(0, y))
	} }),
	setSymbolScale: (s) => set({ symbol: {
		...get().symbol,
		scale: Math.min(SYMBOL_SCALE_MAX, Math.max(SYMBOL_SCALE_MIN, s))
	} }),
	setSymbolOpacity: (o) => set({ symbol: {
		...get().symbol,
		opacity: Math.min(80, Math.max(10, o))
	} }),
	setFm: (n) => set({ symbol: {
		...get().symbol,
		fmNumber: n.replace(/\D/g, "").slice(0, 4)
	} }),
	setFlatten: (flatten) => set({ flatten }),
	setKeepExif: (keepExif) => set({ keepExif }),
	setPrint: (print) => set({ print }),
	resetLook: (night) => set({
		...DEFAULT_GRADE,
		intensity: night ? 38 : DEFAULT_GRADE.intensity,
		symbol: defaultSymbol("none"),
		pendingSymbol: null,
		compare: false
	})
}));
function gradeParamsOf(s) {
	return {
		intensity: s.intensity,
		tealDepth: s.tealDepth,
		magentaKnife: s.magentaKnife,
		grain: s.grain,
		blacks: s.blacks,
		sub: s.sub,
		invert810: s.invert810
	};
}
function Rail({ onFile, onReset, onExport }) {
	const s = useLock();
	const inputId = "lock-file";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-full shrink-0 overflow-y-auto border-t border-line bg-surface px-4 py-4 min-[900px]:h-dvh min-[900px]:w-[320px] min-[900px]:border-r min-[900px]:border-t-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[13px] tracking-[0.18em]",
					children: "108 LOCK"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[9px] leading-relaxed text-dim",
					children: LAW
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lock-k",
						children: "FILE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "lock-btn w-full",
						htmlFor: inputId,
						children: "UPLOAD STILL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: inputId,
						type: "file",
						className: "sr-only",
						accept: "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onFile(f);
							e.currentTarget.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-[10px] text-dim",
						children: s.file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-fg",
								children: s.file.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								s.file.width,
								"×",
								s.file.height,
								" · ",
								Math.round(s.file.bytes / 1024),
								" KB"
							] }),
							s.file.exifTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["EXIF ", s.file.exifTime] })
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "NO FILE" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "lock-btn mt-3 w-full",
						onClick: onReset,
						disabled: !s.file,
						children: "RESET"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lock-k",
						children: "GRADE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "INTENSITY",
						value: s.intensity,
						onChange: s.setIntensity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "TEAL DEPTH",
						value: s.tealDepth,
						onChange: s.setTeal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "MAGENTA KNIFE",
						value: s.magentaKnife,
						max: 70,
						knife: true,
						onChange: s.setKnife
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "GRAIN",
						value: s.grain,
						onChange: s.setGrain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "BLACKS",
						value: s.blacks,
						onChange: s.setBlacks
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lock-k",
						children: "SUB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1",
						children: [
							"DRIVE",
							"CLOCK",
							"QUIET",
							"LAND"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lock-btn",
							"data-on": s.sub === id,
							onClick: () => s.setSub(id),
							children: id
						}, id))
					}),
					s.sub === "CLOCK" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[9px] text-dim",
						children: "Magenta sleeps on the clock."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lock-k",
					children: "810"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "lock-btn w-full",
					"data-on": s.invert810,
					onClick: () => s.set810(!s.invert810),
					children: "810"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lock-k",
						children: "SYMBOL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[9px] text-dim",
						children: "One object. Two souvenirs become a postcard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1",
						children: SYMBOLS.map((sym) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lock-btn text-[9px]",
							"data-on": s.symbol.id === sym.id,
							onClick: () => s.requestSymbol(sym.id),
							children: sym.label
						}, sym.id))
					}),
					s.symbol.id === "fm" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 block text-[10px] text-dim",
						children: ["FM", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 w-full border border-line bg-bg px-2 py-1 text-fg",
							value: s.symbol.fmNumber,
							maxLength: 4,
							onChange: (e) => s.setFm(e.target.value)
						})]
					}),
					s.symbol.id !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "OPACITY",
						value: s.symbol.opacity,
						min: 10,
						max: 80,
						onChange: s.setSymbolOpacity
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slide, {
						label: "SCALE",
						value: Math.round(s.symbol.scale * 100),
						min: 8,
						max: 20,
						onChange: (v) => s.setSymbolScale(v / 100)
					})] }),
					s.pendingSymbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 border border-magenta p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px]",
							children: "REPLACE THE OBJECT?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "lock-btn flex-1",
								"data-on": "true",
								onClick: s.confirmReplace,
								children: "REPLACE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "lock-btn flex-1",
								onClick: s.cancelReplace,
								children: "KEEP"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lock-k",
						children: "EXPORT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1 flex items-center gap-2 text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.flatten,
							onChange: (e) => s.setFlatten(e.target.checked)
						}), "FLATTEN SYMBOL"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-2 flex items-center gap-2 text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.keepExif,
							onChange: (e) => s.setKeepExif(e.target.checked)
						}), "KEEP EXIF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 grid grid-cols-3 gap-1",
						children: [
							"none",
							"4x6",
							"5x7"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lock-btn text-[9px]",
							"data-on": s.print === p,
							onClick: () => s.setPrint(p),
							children: p === "none" ? "FRAME" : p.toUpperCase()
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "lock-btn w-full",
						"data-on": "true",
						disabled: !s.file || s.busy,
						onClick: onExport,
						children: "EXPORT PNG"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lock-sec",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lock-k",
					children: "LAW"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[9px] leading-relaxed text-dim",
					children: LAW
				})]
			})
		]
	});
}
function Slide({ label, value, onChange, min = 0, max = 100, knife }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-2 block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex justify-between text-[10px] text-dim",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-fg",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			className: "lock-range",
			"data-knife": knife ? "true" : "false",
			min,
			max,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function PreviewStage({ source, rev }) {
	const vis = (0, import_react.useRef)(null);
	const file = useLock((s) => s.file);
	const compare = useLock((s) => s.compare);
	const setCompare = useLock((s) => s.setCompare);
	const invert = useLock((s) => s.invert810);
	const symbol = useLock((s) => s.symbol);
	const setPos = useLock((s) => s.setSymbolPos);
	const busy = useLock((s) => s.busy);
	const error = useLock((s) => s.error);
	const warn = useLock((s) => s.warn);
	(0, import_react.useEffect)(() => {
		const v = vis.current;
		if (!v || !source) return;
		v.width = source.width;
		v.height = source.height;
		v.getContext("2d")?.drawImage(source, 0, 0);
	}, [source, rev]);
	const map = (e) => {
		const r = e.currentTarget.getBoundingClientRect();
		return {
			x: (e.clientX - r.left) / r.width,
			y: (e.clientY - r.top) / r.height
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-[52dvh] flex-1 flex-col items-center justify-center bg-bg p-4 min-[900px]:min-h-dvh",
		children: [
			!file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex aspect-[4/5] w-full max-w-[520px] items-center justify-center border border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 m-auto h-px w-1/2 bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 m-auto h-1/2 w-px bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "relative z-10 text-[11px] tracking-[0.14em] text-dim",
						children: "WAIT FOR A STILL."
					})
				]
			}),
			file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: vis,
				className: "max-h-[78dvh] max-w-full",
				style: {
					boxShadow: "0 20px 40px #000",
					outline: invert ? "2px solid #c21e6b" : "2px solid #164e57",
					width: "auto",
					height: "auto"
				},
				onPointerDown: (e) => {
					e.currentTarget.setPointerCapture(e.pointerId);
					if (e.button === 2 || e.altKey || e.shiftKey) {
						setCompare(true);
						return;
					}
					if (symbol.id !== "none") {
						const p = map(e);
						setPos(p.x, p.y);
					}
				},
				onPointerMove: (e) => {
					if (e.buttons !== 1 || compare) return;
					if (symbol.id === "none") return;
					const p = map(e);
					setPos(p.x, p.y);
				},
				onPointerUp: () => setCompare(false),
				onPointerCancel: () => setCompare(false),
				onContextMenu: (e) => e.preventDefault()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 w-full max-w-[520px] text-[9px] tracking-[0.08em] text-dim",
				children: [
					file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						file.name,
						" · ",
						file.width,
						"×",
						file.height,
						file.exifTime ? ` · ${file.exifTime}` : "",
						" · LOCKED",
						busy ? " · LOCKING…" : "",
						compare ? " · ORIGINAL" : ""
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "NO FILE" }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-magenta",
						children: error
					}),
					warn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: warn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-[52ch] text-[9px] leading-relaxed",
						children: LAW
					}),
					file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "lock-btn mt-3",
						onPointerDown: () => setCompare(true),
						onPointerUp: () => setCompare(false),
						onPointerLeave: () => setCompare(false),
						children: "HOLD ORIGINAL"
					})
				]
			})
		]
	});
}
function AppShell() {
	const fullRef = (0, import_react.useRef)(null);
	const srcPreview = (0, import_react.useRef)(null);
	const gradedPreview = (0, import_react.useRef)(null);
	const work = (0, import_react.useRef)(null);
	const [rev, setRev] = (0, import_react.useState)(0);
	const seq = (0, import_react.useRef)(0);
	const file = useLock((s) => s.file);
	const compare = useLock((s) => s.compare);
	const symbol = useLock((s) => s.symbol);
	const intensity = useLock((s) => s.intensity);
	const tealDepth = useLock((s) => s.tealDepth);
	const magentaKnife = useLock((s) => s.magentaKnife);
	const grain = useLock((s) => s.grain);
	const blacks = useLock((s) => s.blacks);
	const sub = useLock((s) => s.sub);
	const invert810 = useLock((s) => s.invert810);
	const paint = (0, import_react.useCallback)(() => {
		const canvas = work.current;
		const graded = gradedPreview.current;
		const src = srcPreview.current;
		if (!canvas || !graded || !src) return;
		composeToCanvas(canvas, graded, src, useLock.getState().compare, useLock.getState().symbol, true);
		setRev((n) => n + 1);
	}, []);
	const runGrade = (0, import_react.useCallback)(async () => {
		const src = srcPreview.current;
		if (!src || !work.current) return;
		const id = ++seq.current;
		useLock.getState().setBusy(true);
		const graded = await gradeAsync(src, gradeParamsOf(useLock.getState()));
		if (id !== seq.current) return;
		gradedPreview.current = graded;
		useLock.getState().setBusy(false);
		paint();
	}, [paint]);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setLive(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!live) return;
		if (!work.current) work.current = document.createElement("canvas");
	}, [live]);
	(0, import_react.useEffect)(() => {
		if (!live) return;
		const t = window.setTimeout(() => {
			runGrade();
		}, 50);
		return () => window.clearTimeout(t);
	}, [
		live,
		runGrade,
		intensity,
		tealDepth,
		magentaKnife,
		grain,
		blacks,
		sub,
		invert810,
		file
	]);
	(0, import_react.useEffect)(() => {
		if (!live) return;
		paint();
	}, [
		live,
		paint,
		compare,
		symbol
	]);
	if (!live) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-[11px] tracking-[0.14em] text-dim",
		children: "WAIT FOR A STILL."
	});
	const onFile = async (f) => {
		useLock.getState().setError(null);
		useLock.getState().setWarn(null);
		if (f.size > 20971520) {
			useLock.getState().setError("NO FILE");
			return;
		}
		try {
			const bmp = await bitmapFromFile(f);
			fullRef.current?.close();
			fullRef.current = bmp;
			srcPreview.current = imageDataFromBitmap(bmp, 1400);
			const night = lumaOfBitmap(bmp) < .18;
			const exifTime = await readExifTime(f);
			const thin = Math.min(bmp.width, bmp.height) < 640;
			useLock.getState().setFile({
				name: f.name,
				width: bmp.width,
				height: bmp.height,
				bytes: f.size,
				exifTime,
				thin,
				night
			});
			useLock.getState().resetLook(night);
			useLock.getState().setWarn(thin ? "THIN FILE." : night ? "ALREADY NIGHT. INTENSITY LOWERED." : null);
			runGrade();
		} catch {
			useLock.getState().setError("NO FILE");
			useLock.getState().setFile(null);
		}
	};
	const onReset = () => {
		const night = useLock.getState().file?.night;
		useLock.getState().resetLook(night);
		runGrade();
	};
	const onExport = async () => {
		const bmp = fullRef.current;
		const meta = useLock.getState().file;
		if (!bmp || !meta) return;
		useLock.getState().setBusy(true);
		try {
			const params = gradeParamsOf(useLock.getState());
			const st = useLock.getState();
			let blob = await exportPng(bmp, params, st.symbol, st.flatten);
			if (st.keepExif && meta.exifTime) blob = await pngWithText(blob, "DateTimeOriginal", meta.exifTime);
			if (st.print === "4x6" || st.print === "5x7") blob = await printSheet(blob, LAW, st.print);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col-reverse bg-bg text-fg min-[900px]:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
			onFile,
			onReset,
			onExport
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewStage, {
			source: work.current,
			rev
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
