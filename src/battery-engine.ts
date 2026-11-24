/**
 * BatteryEngine for 108 LOCK
 * Simulated battery state, charging animations, and power-aware UI
 * for the teal/magenta lock screen experience.
 */

export interface BatteryState {
  level: number; // 0-100
  isCharging: boolean;
  isLow: boolean;
  estimatedTime: number; // minutes
  temperature: number;
}

export class BatteryEngine {
  private state: BatteryState = {
    level: 85,
    isCharging: false,
    isLow: false,
    estimatedTime: 240,
    temperature: 32
  };
  private listeners: ((s: BatteryState) => void)[] = [];
  private drainInterval: number | null = null;

  getState(): BatteryState {
    return { ...this.state };
  }

  setLevel(level: number) {
    this.state.level = Math.max(0, Math.min(100, level));
    this.state.isLow = this.state.level < 20;
    this.notify();
  }

  setCharging(charging: boolean) {
    this.state.isCharging = charging;
    if (charging) {
      this.startChargingSimulation();
    } else {
      this.startDrainSimulation();
    }
    this.notify();
  }

  private startDrainSimulation() {
    if (this.drainInterval) clearInterval(this.drainInterval);
    this.drainInterval = window.setInterval(() => {
      if (this.state.level > 0 && !this.state.isCharging) {
        this.setLevel(this.state.level - 0.1);
      }
    }, 10000);
  }

  private startChargingSimulation() {
    if (this.drainInterval) clearInterval(this.drainInterval);
    this.drainInterval = window.setInterval(() => {
      if (this.state.level < 100 && this.state.isCharging) {
        this.setLevel(this.state.level + 0.5);
      }
    }, 5000);
  }

  onChange(callback: (s: BatteryState) => void) {
    this.listeners.push(callback);
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => l(s));
  }

  getColor(): string {
    if (this.state.isCharging) return '#00ffcc'; // teal
    if (this.state.isLow) return '#ff00aa'; // magenta
    if (this.state.level > 50) return '#00cc99';
    return '#ffaa00';
  }

  getIcon(): string {
    if (this.state.isCharging) return '⚡';
    if (this.state.level > 80) return '🔋';
    if (this.state.level > 50) return '🔋';
    if (this.state.level > 20) return '🔋';
    return '⚠';
  }

  estimateRemaining(): number {
    const rate = this.state.isCharging ? 0.5 : -0.1;
    if (rate >= 0) return Infinity;
    return Math.round(this.state.level / Math.abs(rate) * 10);
  }

  // Additional battery logic
  simulateUsage(intensity: number) {
    const drain = intensity * 0.05;
    this.setLevel(this.state.level - drain);
  }

  getFormattedLevel(): string {
    return `${Math.round(this.state.level)}%`;
  }

  isCritical(): boolean {
    return this.state.level < 5 && !this.state.isCharging;
  }

  reset() {
    this.setLevel(100);
    this.setCharging(false);
  }

  dispose() {
    if (this.drainInterval) clearInterval(this.drainInterval);
    this.listeners = [];
  }
}

export function createBatteryEngine(): BatteryEngine {
  return new BatteryEngine();
}

export default BatteryEngine;
