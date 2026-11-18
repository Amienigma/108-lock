// ClockEngine - Advanced clock and time display for 108 LOCK
// Supports analog, digital, world clocks, and teal/magenta themes
// Daily addition 2026-11-17

export class ClockEngine {
  private intervalId: number | null = null;
  private format: '12h' | '24h' = '12h';
  private showSeconds: boolean = true;
  private timezone: string = 'America/Chicago';

  constructor(private onTick: (time: Date) => void) {}

  start() {
    this.stop();
    this.intervalId = window.setInterval(() => {
      this.onTick(new Date());
    }, 1000);
    this.onTick(new Date()); // immediate
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setFormat(format: '12h' | '24h') {
    this.format = format;
  }

  setShowSeconds(show: boolean) {
    this.showSeconds = show;
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      second: this.showSeconds ? '2-digit' : undefined,
      hour12: this.format === '12h',
      timeZone: this.timezone
    };
    return date.toLocaleTimeString('en-US', options);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: this.timezone 
    });
  }

  // World clock support
  getWorldTime(timezone: string): string {
    return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour12: this.format === '12h' });
  }

  // Theme-aware styling helpers
  getThemeColors() {
    return {
      teal: '#164e57',
      magenta: '#c21e6b',
      background: '#0a0a0a'
    };
  }
}

export default ClockEngine;

console.log('ClockEngine for 108 LOCK - 2026-11-17');
