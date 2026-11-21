/**
 * ParticleEngine for 108 LOCK
 * Generates and animates particle systems for teal/magenta visual effects
 * on the lock screen.
 *
 * @module ParticleEngine
 * @version 1.0.0
 * @date 2026-11-20
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private maxParticles: number = 200;
  private spawnRate: number = 5;
  private running: boolean = false;

  constructor(options: { max?: number; rate?: number } = {}) {
    this.maxParticles = options.max ?? 200;
    this.spawnRate = options.rate ?? 5;
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  spawn(x: number, y: number, color: string = '#00ffcc') {
    if (this.particles.length >= this.maxParticles) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    this.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 0,
      maxLife: 60 + Math.random() * 60,
      size: 2 + Math.random() * 4,
      color,
      alpha: 1,
    });
  }

  update(dt: number = 1) {
    if (!this.running) return;
    // Spawn
    for (let i = 0; i < this.spawnRate; i++) {
      this.spawn(Math.random() * 400, Math.random() * 800, Math.random() > 0.5 ? '#00ffcc' : '#ff00aa');
    }
    // Update
    this.particles = this.particles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.05; // gravity
      p.life += dt;
      p.alpha = 1 - p.life / p.maxLife;
      return p.life < p.maxLife;
    });
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  clear() {
    this.particles = [];
  }

  setMax(max: number) {
    this.maxParticles = max;
  }

  setRate(rate: number) {
    this.spawnRate = rate;
  }

  getStats() {
    return {
      count: this.particles.length,
      max: this.maxParticles,
      running: this.running,
    };
  }
}

export default ParticleEngine;
