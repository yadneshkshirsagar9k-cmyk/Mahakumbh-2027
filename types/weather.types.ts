/**
 * @file Weather API Interfaces
 * @description Future-ready type contracts for integrating OpenWeather,
 * WeatherAPI, India Meteorological Department (IMD), and Government weather feeds.
 */

// ============================================================
// EXTERNAL SERVICES CONTRACTS
// ============================================================

export interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: OpenWeatherCondition[];
  main: {
    temp: number; // Kelvin
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  name: string;
}

export interface OpenWeatherAPI {
  apiKey: string;
  fetchCurrentWeather: (lat: number, lon: number) => Promise<OpenWeatherResponse>;
  fetch5DayForecast: (lat: number, lon: number) => Promise<any>;
}

export interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    condition: { text: string; icon: string; code: number };
    wind_kph: number;
    humidity: number;
    uv: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
    };
  };
}

export interface WeatherAPIService {
  apiKey: string;
  fetchLiveMetrics: (query: string) => Promise<WeatherAPIResponse>;
}

export interface IMDDistrictWarning {
  districtName: string;
  warningDate: string;
  alertType: 'rainfall' | 'thunderstorm' | 'heatwave' | 'coldwave' | 'fog';
  colorCode: 'green' | 'yellow' | 'orange' | 'red';
  descriptionHindi: string;
  descriptionEnglish: string;
}

export interface IMDIntegrationAPI {
  fetchDistrictWarnings: () => Promise<IMDDistrictWarning[]>;
  getWeatherRadarTileUrl: (radarId: string) => string;
}

export interface GovtWeatherStation {
  stationId: string;
  district: string;
  latitude: number;
  longitude: number;
  rainfallPast24HoursMm: number;
  riverWaterLevelStatus?: 'normal' | 'warning' | 'danger';
}

export interface GovernmentWeatherServices {
  getActiveStations: () => Promise<GovtWeatherStation[]>;
  getTelemetryPayload: (stationId: string) => Promise<Record<string, any>>;
}
