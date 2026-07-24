/**
 * @file Tourism and Weather API Interfaces
 * @description Future-ready type contracts for integrating external tourism,
 * weather, and image content delivery networks (CDNs).
 */

export interface MTDCPlaceDetail {
  placeId: string;
  name: string;
  category: 'religious' | 'heritage' | 'nature' | 'adventure' | 'wildlife';
  description: string;
  address: string;
  contactNumber?: string;
  entryFee?: string;
  operatingHours: string;
  governingBody: string;
  images: string[];
}

export interface MaharashtraTourismAPI {
  getPlacesByDistrict: (districtSlug: string) => Promise<MTDCPlaceDetail[]>;
  getDestinationsFiltered: (filter: {
    district: string;
    category: string;
    keyword?: string;
  }) => Promise<MTDCPlaceDetail[]>;
  getFestivalsCalendar: (year: number) => Promise<{
    name: string;
    date: string;
    district: string;
    significance: string;
  }[]>;
}

export interface GooglePlaceReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

export interface GooglePlacesAPI {
  searchPlaces: (query: string, locationBias?: { lat: number; lng: number }) => Promise<{
    placeId: string;
    name: string;
    rating: number;
    userRatingsTotal: number;
    formattedAddress: string;
  }[]>;
  getPlaceReviews: (placeId: string) => Promise<GooglePlaceReview[]>;
  getPlacePhotosUrls: (placeId: string, maxPhotos?: number) => Promise<string[]>;
}

export interface LiveWeatherMetrics {
  tempCelsius: number;
  humidityPercentage: number;
  windSpeedKmh: number;
  uvIndex: number;
  condition: string;
  conditionIconUrl: string;
  alertMessages?: string[];
  lastUpdated: string;
}

export interface WeatherAPI {
  getLiveWeather: (lat: number, lng: number) => Promise<LiveWeatherMetrics>;
  getForecast3Day: (lat: number, lng: number) => Promise<{
    date: string;
    tempMin: number;
    tempMax: number;
    condition: string;
  }[]>;
}

export interface ImageCDNConfig {
  baseUrl: string;
  provider: 'cloudinary' | 'imgix' | 'aws_s3' | 'custom_cdn';
  qualityAuto: boolean;
  formatWebp: boolean;
}

export interface ImageCDN {
  config: ImageCDNConfig;
  generateOptimizedUrl: (rawPath: string, width: number, height?: number) => string;
  fetchPreloadedThumbnails: (folderName: string) => Promise<string[]>;
}

export interface GovernmentTourismData {
  districtSlug: string;
  totalTouristFootfallYearly: number;
  activeSecurityAlerts: string[];
  officialHelplineNumber: string;
  emergencyAssemblyPoints: { name: string; lat: number; lng: number }[];
}
