import type { SymbolId } from "./lock-constants";

export type SymbolState = {
  id: SymbolId;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  fmNumber: string;
};

function stroke(ctx: CanvasRenderingContext2D, color: string, w: number) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = w;
  ctx.lineJoin = "miter";
  ctx.lineCap = "square";
}

export function drawSymbol(
  ctx: CanvasRenderingContext2D,
  sym: SymbolState,
  frameW: number,
  frameH: number,
) {
  if (sym.id === "none") return;
  const size = Math.min(frameW * Math.min(sym.scale, 0.2), frameW * 0.2);
  const cx = sym.x * frameW;
  const cy = sym.y * frameH;
  ctx.save();
  ctx.globalAlpha = Math.min(0.8, Math.max(0.1, sym.opacity / 100));
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
    case "brick":
      drawBrick(ctx, size);
      break;
  }
  ctx.restore();
}

function drawFm(ctx: CanvasRenderingContext2D, size: number, num: string, ink: string, ink2: string) {
  const w = size;
  const h = size * 0.72;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink2;
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = ink2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${size * 0.16}px "Courier New", Courier, monospace`;
  ctx.fillText("FM", 0, -h * 0.18);
  ctx.font = `700 ${size * 0.28}px "Courier New", Courier, monospace`;
  ctx.fillText(num.slice(0, 4), 0, h * 0.16);
}

function drawCattle(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1, size * 0.035));
  const w = size;
  const n = 10;
  for (let i = 0; i < n; i++) {
    const y = -size * 0.18 + (i / (n - 1)) * size * 0.36;
    ctx.beginPath();
    ctx.moveTo(-w / 2, y);
    ctx.lineTo(w / 2, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-w / 2, size * 0.22);
  ctx.lineTo(-w * 0.08, size * 0.42);
  ctx.moveTo(w / 2, size * 0.22);
  ctx.lineTo(w * 0.08, size * 0.42);
  ctx.stroke();
}

function drawCaliche(ctx: CanvasRenderingContext2D, size: number) {
  ctx.globalCompositeOperation = "overlay";
  const w = size;
  const h = size * 0.38;
  ctx.fillStyle = "rgba(210,200,178,0.7)";
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = "rgba(90,80,60,0.5)";
  ctx.lineWidth = 1;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  for (let i = 0; i < 28; i++) {
    const px = (hash(i, 2) - 0.5) * w;
    const py = (hash(i, 9) - 0.5) * h;
    ctx.fillStyle = `rgba(255,255,240,${0.15 + hash(i, 4) * 0.25})`;
    ctx.fillRect(px, py, 2, 2);
  }
}

function hash(a: number, b: number) {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function drawHail(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1, size * 0.04));
  const w = size * 0.55;
  ctx.strokeRect(-w / 2, -size * 0.05, w, size * 0.42);
  ctx.beginPath();
  ctx.moveTo(-w / 2, -size * 0.05);
  ctx.lineTo(0, -size * 0.38);
  ctx.lineTo(w / 2, -size * 0.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w / 2, size * 0.08);
  ctx.lineTo(w / 2 + size * 0.12, size * 0.08);
  ctx.lineTo(w / 2 + size * 0.12, size * 0.22);
  ctx.stroke();
  for (const [dx, dy] of [
    [-0.12, 0.12],
    [0.02, 0.08],
    [0.14, 0.18],
  ] as const) {
    ctx.beginPath();
    ctx.arc(dx * size, dy * size, size * 0.045, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPumpjack(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1.2, size * 0.045));
  ctx.beginPath();
  ctx.moveTo(-size * 0.42, size * 0.28);
  ctx.lineTo(size * 0.08, -size * 0.22);
  ctx.lineTo(size * 0.38, -size * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.05, size * 0.28);
  ctx.lineTo(-size * 0.05, -size * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(size * 0.38, -size * 0.02, size * 0.06, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(size * 0.38, size * 0.04);
  ctx.lineTo(size * 0.38, size * 0.28);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, size * 0.28);
  ctx.lineTo(size * 0.5, size * 0.28);
  ctx.stroke();
}

function drawMesquite(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1.2, size * 0.04));
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, size * 0.4);
  ctx.lineTo(0, -size * 0.05);
  ctx.lineTo(size * 0.22, -size * 0.32);
  ctx.moveTo(0, -size * 0.05);
  ctx.lineTo(-size * 0.28, -size * 0.18);
  ctx.moveTo(-size * 0.12, size * 0.12);
  ctx.lineTo(size * 0.18, size * 0.02);
  ctx.stroke();
}

function drawPear(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1.2, size * 0.04));
  const pads: [number, number, number][] = [
    [0, 0.08, 0.22],
    [-0.22, -0.12, 0.18],
    [0.2, -0.16, 0.17],
  ];
  for (const [x, y, r] of pads) {
    ctx.beginPath();
    ctx.ellipse(x * size, y * size, r * size, r * size * 1.15, 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTank(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1.2, size * 0.04));
  ctx.beginPath();
  ctx.ellipse(0, size * 0.18, size * 0.42, size * 0.16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(size * 0.12, size * 0.18);
  ctx.lineTo(size * 0.12, -size * 0.28);
  ctx.moveTo(size * 0.0, -size * 0.08);
  ctx.lineTo(size * 0.24, -size * 0.08);
  ctx.moveTo(size * 0.12, -size * 0.28);
  ctx.lineTo(size * 0.02, -size * 0.4);
  ctx.lineTo(size * 0.22, -size * 0.4);
  ctx.lineTo(size * 0.12, -size * 0.28);
  ctx.stroke();
}

function drawSiren(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  stroke(ctx, ink, Math.max(1.2, size * 0.04));
  for (const a of [-0.7, -0.25, 0.25, 0.7]) {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.12);
    ctx.lineTo(Math.sin(a) * size * 0.42, -size * 0.32 + Math.abs(a) * size * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(Math.sin(a) * size * 0.42, -size * 0.32 + Math.abs(a) * size * 0.08, size * 0.07, size * 0.04, a, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeRect(-size * 0.1, size * 0.08, size * 0.2, size * 0.16);
}

function drawStadium(ctx: CanvasRenderingContext2D, size: number, ink: string) {
  for (const x of [-0.28, 0.28]) {
    const gx = x * size;
    const gy = -size * 0.22;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, size * 0.42);
    grad.addColorStop(0, "rgba(255,240,220,0.55)");
    grad.addColorStop(1, "rgba(255,240,220,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, size * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.fillRect(gx - 1, gy, 2, size * 0.5);
  }
}

function drawBrick(ctx: CanvasRenderingContext2D, size: number) {
  ctx.globalCompositeOperation = "overlay";
  const w = size * 0.9;
  const h = size * 0.45;
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

export function defaultSymbol(id: SymbolId): SymbolState {
  return {
    id,
    x: 0.5,
    y: 0.78,
    scale: 0.12,
    opacity: 35,
    fmNumber: "543",
  };
}
