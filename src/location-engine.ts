/**
 * LocationEngine for 108 LOCK
 * Provides geolocation simulation, weather-linked location context,
 * and "one true object" discovery based on time-of-day and place.
 * 
 * @version 1.0.0
 * @date 2026-11-18
 */

export interface Location {
  lat: number;
  lon: number;
  name?: string;
  accuracy?: number;
}

export class LocationEngine {
  private current: Location | null = null;
  private watchers: Array<(loc: Location) => void> = [];
  private simulated = false;

  async getCurrent(): Promise<Location> {
    if (this.current) return this.current;
    // Simulated default (Dallas / São Paulo midpoint vibe)
    this.current = { lat: 32.7767, lon: -96.7970, name: "Dallas", accuracy: 50 };
    return this.current;
  }

  watch(callback: (loc: Location) => void) {
    this.watchers.push(callback);
    if (this.current) callback(this.current);
    return () => {
      this.watchers = this.watchers.filter((w) => w !== callback);
    };
  }

  // Simulate movement for demo
  simulateMove(deltaLat: number, deltaLon: number) {
    if (!this.current) return;
    this.current = {
      ...this.current,
      lat: this.current.lat + deltaLat,
      lon: this.current.lon + deltaLon,
    };
    this.watchers.forEach((w) => w(this.current!));
  }

  // Tie into the "one true object" concept
  suggestObject(hour: number, weatherCode?: string): string {
    if (hour >= 22 || hour < 5) return "night-lamp";
    if (weatherCode?.includes("rain")) return "umbrella";
    if (hour >= 6 && hour < 10) return "coffee";
    if (hour >= 12 && hour < 14) return "notebook";
    return "phone";
  }

  setSimulated(loc: Location) {
    this.current = loc;
    this.simulated = true;
    this.watchers.forEach((w) => w(loc));
  }
}

export default LocationEngine;
