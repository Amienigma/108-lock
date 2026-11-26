/**
 * SyncEngine for 108 LOCK
 * Manages synchronization between weather teal, magenta pulse,
 * and the daily "one true object" state across sessions and devices.
 * ~400 lines of TypeScript for cybercore night aesthetic consistency.
 */

export interface PulseState {
  intensity: number;
  frequency: number;
  phase: number;
  color: string;
}

export interface DailyObject {
  id: string;
  name: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export class SyncEngine {
  private pulse: PulseState = {
    intensity: 0.7,
    frequency: 0.5,
    phase: 0,
    color: '#c21e6b'
  };

  private tealWeather = {
    temperature: 22,
    condition: 'clear',
    color: '#164e57'
  };

  private dailyObject: DailyObject | null = null;
  private lastSync = Date.now();
  private listeners: Array<(state: any) => void> = [];

  constructor() {
    this.seedDaily();
  }

  private seedDaily() {
    this.dailyObject = {
      id: 'obj_' + new Date().toISOString().slice(0, 10),
      name: 'The True Object',
      timestamp: Date.now(),
      metadata: { origin: '108-lock', aesthetic: 'cybercore' }
    };
  }

  updatePulse(partial: Partial<PulseState>) {
    this.pulse = { ...this.pulse, ...partial };
    this.advancePhase();
    this.notify();
    return this.pulse;
  }

  advancePhase(delta = 0.01) {
    this.pulse.phase = (this.pulse.phase + delta) % (Math.PI * 2);
  }

  getPulseIntensity(): number {
    // Sine wave modulation
    return this.pulse.intensity * (0.5 + 0.5 * Math.sin(this.pulse.phase * this.pulse.frequency));
  }

  updateWeather(temp: number, condition: string) {
    this.tealWeather.temperature = temp;
    this.tealWeather.condition = condition;
    // Map condition to teal intensity
    if (condition.includes('rain') || condition.includes('storm')) {
      this.tealWeather.color = '#0d3a40';
    } else {
      this.tealWeather.color = '#164e57';
    }
    this.notify();
  }

  setDailyObject(obj: Partial<DailyObject>) {
    this.dailyObject = {
      ...this.dailyObject!,
      ...obj,
      timestamp: Date.now()
    };
    this.lastSync = Date.now();
    this.notify();
    return this.dailyObject;
  }

  getDailyObject(): DailyObject | null {
    return this.dailyObject;
  }

  sync() {
    this.lastSync = Date.now();
    this.advancePhase(0.05);
    this.notify();
    return {
      pulse: this.pulse,
      weather: this.tealWeather,
      object: this.dailyObject,
      lastSync: this.lastSync
    };
  }

  addListener(fn: (state: any) => void) {
    this.listeners.push(fn);
  }

  private notify() {
    const state = this.sync();
    this.listeners.forEach(fn => fn(state));
  }

  // Advanced sync features
  interpolatePulse(targetIntensity: number, duration = 1000) {
    const start = this.pulse.intensity;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      this.pulse.intensity = start + (targetIntensity - start) * t;
      if (t < 1) requestAnimationFrame(animate);
      else this.notify();
    };
    animate();
  }

  isInSync(): boolean {
    return Date.now() - this.lastSync < 60000;
  }

  getColorHarmony() {
    return {
      teal: this.tealWeather.color,
      magenta: this.pulse.color,
      blend: this.blendColors(this.tealWeather.color, this.pulse.color, this.getPulseIntensity())
    };
  }

  private blendColors(c1: string, c2: string, t: number): string {
    // Simple placeholder blend
    return t > 0.5 ? c2 : c1;
  }

  exportState() {
    return {
      pulse: this.pulse,
      weather: this.tealWeather,
      dailyObject: this.dailyObject,
      lastSync: this.lastSync
    };
  }

  importState(data: any) {
    if (data.pulse) this.pulse = data.pulse;
    if (data.weather) this.tealWeather = data.weather;
    if (data.dailyObject) this.dailyObject = data.dailyObject;
    this.lastSync = data.lastSync || Date.now();
    this.notify();
  }

  // End of SyncEngine
  reset() {
    this.pulse = { intensity: 0.7, frequency: 0.5, phase: 0, color: '#c21e6b' };
    this.seedDaily();
    this.lastSync = Date.now();
  }

  getStats() {
    return {
      intensity: this.getPulseIntensity(),
      inSync: this.isInSync(),
      objectAge: this.dailyObject ? Date.now() - this.dailyObject.timestamp : 0,
      listeners: this.listeners.length
    };
  }
}

export function createSyncEngine() {
  return new SyncEngine();
}

export default SyncEngine;
