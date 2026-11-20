/**
 * StampEngine for 108 LOCK
 * Manages Texas symbol stamps, magenta pulse overlays,
 * and layered visual effects on the night-grade UI.
 * 
 * @module StampEngine
 * @version 1.0.0
 * @date 2026-11-19
 */

export interface Stamp {
  id: string;
  symbol: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  pulse: boolean;
}

export class StampEngine {
  private stamps: Stamp[] = [];
  private pulsePhase = 0;
  private teal = '#164e57';
  private magenta = '#c21e6b';

  addStamp(symbol: string, x = 50, y = 50): Stamp {
    const stamp: Stamp = {
      id: `stamp-${Date.now()}`,
      symbol,
      x,
      y,
      scale: 1,
      rotation: 0,
      opacity: 0.8,
      pulse: true,
    };
    this.stamps.push(stamp);
    return stamp;
  }

  removeStamp(id: string): void {
    this.stamps = this.stamps.filter(s => s.id !== id);
  }

  updatePulse(delta: number): void {
    this.pulsePhase = (this.pulsePhase + delta) % (Math.PI * 2);
    this.stamps.forEach(s => {
      if (s.pulse) {
        s.opacity = 0.6 + 0.3 * Math.sin(this.pulsePhase);
        s.scale = 1 + 0.05 * Math.sin(this.pulsePhase);
      }
    });
  }

  getStamps(): Stamp[] {
    return [...this.stamps];
  }

  setColors(teal: string, magenta: string): void {
    this.teal = teal;
    this.magenta = magenta;
  }

  generateOverlayCSS(): string {
    return this.stamps.map((s, i) => `
.stamp-${i} {
  position: absolute;
  left: ${s.x}%;
  top: ${s.y}%;
  transform: scale(${s.scale}) rotate(${s.rotation}deg);
  opacity: ${s.opacity};
  color: ${this.magenta};
  font-size: 2rem;
  pointer-events: none;
  text-shadow: 0 0 8px ${this.teal};
}
`).join('');
  }

  export(): string {
    return JSON.stringify({
      stamps: this.stamps,
      colors: { teal: this.teal, magenta: this.magenta },
    }, null, 2);
  }
}

export default StampEngine;
