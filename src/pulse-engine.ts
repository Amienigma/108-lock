/**
 * PulseEngine for 108 LOCK
 * Manages the magenta pulse, object locking, and daily true object selection
 */

export interface LockObject {
  id: string;
  name: string;
  description: string;
  image?: string;
  locked: boolean;
  pulseIntensity: number;
  timestamp: number;
}

export class PulseEngine {
  private objects: Map<string, LockObject> = new Map();
  private currentTrue: string | null = null;
  private pulsePhase: number = 0;
  private animationFrame: number | null = null;

  constructor() {
    this.startPulse();
  }

  registerObject(obj: Omit<LockObject, 'locked' | 'pulseIntensity' | 'timestamp'>): string {
    const id = obj.id || `obj_${Date.now()}`;
    const full: LockObject = {
      ...obj,
      id,
      locked: false,
      pulseIntensity: 0,
      timestamp: Date.now()
    };
    this.objects.set(id, full);
    return id;
  }

  setTrueObject(id: string) {
    if (this.currentTrue) {
      const prev = this.objects.get(this.currentTrue);
      if (prev) prev.locked = true;
    }
    this.currentTrue = id;
    const obj = this.objects.get(id);
    if (obj) {
      obj.locked = false;
      obj.pulseIntensity = 1;
    }
  }

  getTrueObject(): LockObject | null {
    return this.currentTrue ? this.objects.get(this.currentTrue) || null : null;
  }

  lockAllExcept(id: string) {
    this.objects.forEach((obj, oid) => {
      obj.locked = oid !== id;
      obj.pulseIntensity = oid === id ? 1 : 0;
    });
    this.currentTrue = id;
  }

  private startPulse() {
    const animate = () => {
      this.pulsePhase = (this.pulsePhase + 0.02) % (Math.PI * 2);
      if (this.currentTrue) {
        const obj = this.objects.get(this.currentTrue);
        if (obj) {
          obj.pulseIntensity = 0.5 + Math.sin(this.pulsePhase) * 0.5;
        }
      }
      this.animationFrame = requestAnimationFrame(animate);
    };
    this.animationFrame = requestAnimationFrame(animate);
  }

  stopPulse() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  getPulseColor(): string {
    const intensity = this.getTrueObject()?.pulseIntensity || 0;
    const alpha = Math.floor(intensity * 255).toString(16).padStart(2, '0');
    return `#ff00aa${alpha}`;
  }

  listObjects(): LockObject[] {
    return Array.from(this.objects.values());
  }

  removeObject(id: string) {
    this.objects.delete(id);
    if (this.currentTrue === id) this.currentTrue = null;
  }

  selectDailyTrue(): string | null {
    const unlocked = Array.from(this.objects.values()).filter(o => !o.locked);
    if (unlocked.length === 0) return null;
    const daily = unlocked[Math.floor(Math.random() * unlocked.length)];
    this.setTrueObject(daily.id);
    return daily.id;
  }

  getStats() {
    return {
      total: this.objects.size,
      locked: Array.from(this.objects.values()).filter(o => o.locked).length,
      trueObject: this.currentTrue,
      pulsePhase: this.pulsePhase
    };
  }

  exportState() {
    return {
      objects: Array.from(this.objects.values()),
      currentTrue: this.currentTrue
    };
  }

  importState(state: { objects: LockObject[]; currentTrue: string | null }) {
    this.objects.clear();
    state.objects.forEach(o => this.objects.set(o.id, o));
    this.currentTrue = state.currentTrue;
  }
}

export default PulseEngine;
