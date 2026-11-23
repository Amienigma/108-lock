/**
 * AtmosphereEngine for 108 LOCK
 * Manages atmospheric effects, mood lighting, teal/magenta grading, and environmental simulation.
 * Controls the night grade aesthetic and one true object presentation.
 * Added 2026-11-22 as daily code addition.
 */

export interface AtmosphereState {
  mood: 'night' | 'twilight' | 'neon' | 'void' | 'pulse';
  intensity: number;
  tealAmount: number;
  magentaAmount: number;
  grain: number;
  vignette: number;
  bloom: number;
  timestamp: number;
}

export class AtmosphereEngine {
  private state: AtmosphereState;
  private listeners: Map<string, Function[]> = new Map();
  private animationFrame: number | null = null;
  private pulsePhase = 0;
  private debug = false;

  constructor() {
    this.state = {
      mood: 'night',
      intensity: 0.7,
      tealAmount: 0.6,
      magentaAmount: 0.4,
      grain: 0.15,
      vignette: 0.4,
      bloom: 0.2,
      timestamp: Date.now()
    };
    this.init();
  }

  private init() {
    console.log('AtmosphereEngine initialized');
    this.startPulse();
  }

  setMood(mood: AtmosphereState['mood']) {
    this.state.mood = mood;
    this.applyMoodDefaults(mood);
    this.state.timestamp = Date.now();
    this.emit('moodChanged', this.state);
  }

  private applyMoodDefaults(mood: AtmosphereState['mood']) {
    switch (mood) {
      case 'night':
        this.state.tealAmount = 0.7;
        this.state.magentaAmount = 0.3;
        this.state.intensity = 0.8;
        break;
      case 'twilight':
        this.state.tealAmount = 0.4;
        this.state.magentaAmount = 0.6;
        this.state.intensity = 0.5;
        break;
      case 'neon':
        this.state.tealAmount = 0.5;
        this.state.magentaAmount = 0.8;
        this.state.intensity = 1.0;
        this.state.bloom = 0.5;
        break;
      case 'void':
        this.state.tealAmount = 0.2;
        this.state.magentaAmount = 0.1;
        this.state.intensity = 0.3;
        this.state.grain = 0.3;
        break;
      case 'pulse':
        this.state.tealAmount = 0.6;
        this.state.magentaAmount = 0.6;
        this.state.intensity = 0.9;
        break;
    }
  }

  setIntensity(value: number) {
    this.state.intensity = Math.max(0, Math.min(1, value));
    this.emit('intensityChanged', this.state.intensity);
  }

  setTealMagenta(teal: number, magenta: number) {
    this.state.tealAmount = Math.max(0, Math.min(1, teal));
    this.state.magentaAmount = Math.max(0, Math.min(1, magenta));
    this.emit('colorBalanceChanged', { teal: this.state.tealAmount, magenta: this.state.magentaAmount });
  }

  setGrain(value: number) {
    this.state.grain = Math.max(0, Math.min(1, value));
  }

  setVignette(value: number) {
    this.state.vignette = Math.max(0, Math.min(1, value));
  }

  setBloom(value: number) {
    this.state.bloom = Math.max(0, Math.min(1, value));
  }

  private startPulse() {
    const animate = () => {
      this.pulsePhase += 0.02;
      if (this.state.mood === 'pulse') {
        const pulse = (Math.sin(this.pulsePhase) + 1) / 2;
        this.state.intensity = 0.6 + pulse * 0.4;
        this.emit('pulse', pulse);
      }
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  stopPulse() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  getState(): AtmosphereState {
    return { ...this.state };
  }

  generateCSSFilters(): string {
    const { tealAmount, magentaAmount, grain, vignette, bloom, intensity } = this.state;
    const filters = [];
    filters.push(`saturate(${1 + intensity * 0.3})`);
    filters.push(`contrast(${1 + intensity * 0.2})`);
    if (tealAmount > 0) {
      filters.push(`hue-rotate(${tealAmount * 15}deg)`);
    }
    if (magentaAmount > 0) {
      filters.push(`hue-rotate(${-magentaAmount * 20}deg)`);
    }
    return filters.join(' ');
  }

  generateOverlayStyles(): Record<string, string> {
    return {
      grain: `opacity: ${this.state.grain}; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");`,
      vignette: `box-shadow: inset 0 0 ${100 * this.state.vignette}px rgba(0,0,0,${this.state.vignette * 0.8});`,
      bloom: `filter: blur(${this.state.bloom * 2}px); opacity: ${this.state.bloom * 0.3};`
    };
  }

  applyToElement(element: HTMLElement) {
    element.style.filter = this.generateCSSFilters();
  }

  getMoodPresets(): string[] {
    return ['night', 'twilight', 'neon', 'void', 'pulse'];
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Atmosphere event error', e); }
    });
  }

  getStats() {
    return {
      currentMood: this.state.mood,
      intensity: this.state.intensity,
      teal: this.state.tealAmount,
      magenta: this.state.magentaAmount,
      isAnimating: this.animationFrame !== null
    };
  }

  destroy() {
    this.stopPulse();
    this.listeners.clear();
  }

  version = '1.0.0';
  description = 'Atmospheric mood and lighting system for 108 LOCK';
}

export default AtmosphereEngine;
