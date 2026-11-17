/**
 * WeatherEngine - Teal weather data integration and daily object selection for 108 LOCK
 * Fetches weather, generates teal-graded visuals, and selects the one true object of the day.
 * 
 * Daily code addition 2026-11-16
 */

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  timestamp: number;
  tealGrade: string;
}

export interface DailyObject {
  id: string;
  name: string;
  description: string;
  category: string;
  selectedAt: number;
  relatedWeather?: string;
}

export class WeatherEngine {
  private currentWeather: WeatherData | null = null;
  private dailyObject: DailyObject | null = null;
  private cache: Map<string, WeatherData> = new Map();

  async fetchWeather(location: string = 'Dallas'): Promise<WeatherData> {
    // Placeholder - in real would call weather API
    const cached = this.cache.get(location);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached;
    }
    const data: WeatherData = {
      temperature: 22 + Math.random() * 10,
      condition: ['Clear', 'Cloudy', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: 40 + Math.random() * 40,
      windSpeed: Math.random() * 15,
      location,
      timestamp: Date.now(),
      tealGrade: this.generateTealGrade()
    };
    this.cache.set(location, data);
    this.currentWeather = data;
    return data;
  }

  private generateTealGrade(): string {
    const teals = ['#164e57', '#1a5f6b', '#0f3d45', '#206b78', '#0d3940'];
    return teals[Math.floor(Math.random() * teals.length)];
  }

  getCurrentWeather(): WeatherData | null {
    return this.currentWeather;
  }

  selectDailyObject(weather?: WeatherData): DailyObject {
    const objects = [
      { name: 'Forgotten Key', description: 'A key to a door that no longer exists', category: 'memory' },
      { name: 'Magenta Pulse', description: 'The heartbeat of the night grade', category: 'aesthetic' },
      { name: 'Teal Fragment', description: 'A piece of the weather itself', category: 'element' },
      { name: 'Silent Watch', description: 'Time stopped at the perfect hour', category: 'time' },
      { name: 'Archive Dust', description: 'Residue of neglected media', category: 'neglect' }
    ];
    const selected = objects[Math.floor(Math.random() * objects.length)];
    this.dailyObject = {
      id: `obj_${Date.now()}`,
      ...selected,
      selectedAt: Date.now(),
      relatedWeather: weather?.condition
    };
    return this.dailyObject;
  }

  getDailyObject(): DailyObject | null {
    return this.dailyObject;
  }

  generateLockScreenData(): { weather: WeatherData | null; object: DailyObject | null; grade: string } {
    return {
      weather: this.currentWeather,
      object: this.dailyObject,
      grade: this.currentWeather?.tealGrade || '#164e57'
    };
  }

  applyTealFilter(color: string): string {
    // Simple color blending towards teal
    return this.blendTowardsTeal(color);
  }

  private blendTowardsTeal(hex: string): string {
    // Simplified blend
    return '#164e57';
  }

  getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      'Clear': '☀️',
      'Cloudy': '☁️',
      'Rain': '🌧️',
      'Partly Cloudy': '⛅',
      'default': '🌙'
    };
    return icons[condition] || icons['default'];
  }

  formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    if (unit === 'F') {
      return `${Math.round(temp * 9/5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export function createWeatherEngine(): WeatherEngine {
  return new WeatherEngine();
}

// Utility functions
export function getTealPalette(): string[] {
  return ['#164e57', '#1a5f6b', '#0f3d45', '#206b78', '#0d3940', '#248a99'];
}

export function getMagentaPulse(): string[] {
  return ['#c21e6b', '#d42a7a', '#a01858', '#e63d8c'];
}

export function isNightGrade(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

// End of WeatherEngine
