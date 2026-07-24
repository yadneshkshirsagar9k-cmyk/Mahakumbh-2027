/**
 * @file Weather dataset
 * @description Centralized data source representing weather metrics,
 * forecasts, alerts, and advisories for all 36 districts of Maharashtra.
 */

export interface CurrentWeather {
  tempCelsius: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Thunderstorm' | 'Heatwave' | 'Cold' | 'Windy';
  icon: string; // lucide icon name
  humidity: number; // percentage
  windSpeedKmh: number;
  rainProbability: number; // percentage
  visibilityKm: number;
  uvIndex: number;
  lastUpdated: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  rainProbability: number;
}

export interface HourlyForecast {
  time: string;
  tempCelsius: number;
  condition: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  category: 'Heavy Rain' | 'Heatwave' | 'Strong Winds' | 'Flood Warning' | 'River Water Level' | 'Storm Warning' | 'Fog' | 'Travel Advisory';
  priority: 'low' | 'medium' | 'high' | 'critical';
  color: 'red' | 'amber' | 'green' | 'blue';
  icon: string;
  timestamp: string;
  message: string;
}

export interface AirQuality {
  aqi: number;
  status: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
}

export interface WeatherDistrict {
  id: string;
  name: string;
  slug: string;
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  hourlyForecast: HourlyForecast[];
  alerts: WeatherAlert[];
  airQuality: AirQuality;
  sunrise: string;
  sunset: string;
  pilgrimAdvisory: string[];
  travelAdvisory: string[];
  crowdWeatherImpact: string;
  coordinates: { lat: number; lng: number };
}

// Map conditions to specific colors for visual markers/cards
export const CONDITION_COLORS: Record<string, string> = {
  Sunny: 'text-amber-500 bg-amber-500/10 border-amber-500/25',
  Cloudy: 'text-sky-500 bg-sky-500/10 border-sky-500/25',
  Rain: 'text-blue-500 bg-blue-500/10 border-blue-500/25',
  Thunderstorm: 'text-purple-500 bg-purple-500/10 border-purple-500/25',
  Heatwave: 'text-red-500 bg-red-500/10 border-red-500/25',
  Cold: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/25',
  Windy: 'text-slate-500 bg-slate-500/10 border-slate-500/25'
};

export const WEATHER_DISTRICTS_DATA: WeatherDistrict[] = [
  {
    id: 'wd-nsk',
    name: 'Nashik',
    slug: 'nashik',
    currentWeather: {
      tempCelsius: 28,
      condition: 'Cloudy',
      icon: 'Cloud',
      humidity: 78,
      windSpeedKmh: 14,
      rainProbability: 40,
      visibilityKm: 8,
      uvIndex: 4,
      lastUpdated: '10 mins ago'
    },
    forecast: [
      { date: 'Today', tempMin: 22, tempMax: 30, condition: 'Light rain showers', icon: 'CloudRain', rainProbability: 60 },
      { date: 'Tomorrow', tempMin: 21, tempMax: 29, condition: 'Heavy thunderstorms', icon: 'CloudLightning', rainProbability: 80 },
      { date: 'Tue', tempMin: 22, tempMax: 31, condition: 'Partly cloudy', icon: 'Cloud', rainProbability: 30 },
      { date: 'Wed', tempMin: 23, tempMax: 32, condition: 'Sunny intervals', icon: 'CloudSun', rainProbability: 20 },
      { date: 'Thu', tempMin: 23, tempMax: 33, condition: 'Clear sunny day', icon: 'Sun', rainProbability: 10 },
      { date: 'Fri', tempMin: 22, tempMax: 31, condition: 'Light rain', icon: 'CloudRain', rainProbability: 50 },
      { date: 'Sat', tempMin: 22, tempMax: 30, condition: 'Overcast', icon: 'Cloud', rainProbability: 40 }
    ],
    hourlyForecast: [
      { time: '12:00 PM', tempCelsius: 29, condition: 'Cloudy', icon: 'Cloud' },
      { time: '02:00 PM', tempCelsius: 30, condition: 'Cloudy', icon: 'Cloud' },
      { time: '04:00 PM', tempCelsius: 28, condition: 'Light Drizzle', icon: 'CloudRain' },
      { time: '06:00 PM', tempCelsius: 27, condition: 'Rain', icon: 'CloudRain' },
      { time: '08:00 PM', tempCelsius: 25, condition: 'Overcast', icon: 'Cloud' },
      { time: '10:00 PM', tempCelsius: 24, condition: 'Clear', icon: 'Moon' }
    ],
    alerts: [
      {
        id: 'wa-1',
        category: 'Heavy Rain',
        priority: 'high',
        color: 'amber',
        icon: 'CloudRain',
        timestamp: '1h ago',
        message: 'Advisory: Thunderstorms with heavy rainfall expected at Godavari river banks. Devotees are advised to stay clear of the safety lines.'
      }
    ],
    airQuality: { aqi: 48, status: 'Good' },
    sunrise: '05:58 AM',
    sunset: '07:12 PM',
    pilgrimAdvisory: [
      'Carry umbrella or raincoat for the evening prayers at Ram Kund.',
      'Slippery steps near bathing ghats. Use safety grab-rails.',
      'High humidity during afternoon. Stay hydrated with clean drinking water.'
    ],
    travelAdvisory: [
      'Thick fog potential along the Kasara Ghat sector road early morning.',
      'Godavari river water release might increase levels. Avoid swimming beyond markers.'
    ],
    crowdWeatherImpact: 'High humidity is expected to increase congestion discomfort in indoor darshan queue lines by 15%. Air ventilation systems activated in Sadhu camps.',
    coordinates: { lat: 19.9975, lng: 73.7898 }
  },
  {
    id: 'wd-mum',
    name: 'Mumbai City',
    slug: 'mumbai-city',
    currentWeather: {
      tempCelsius: 31,
      condition: 'Rain',
      icon: 'CloudRain',
      humidity: 88,
      windSpeedKmh: 22,
      rainProbability: 90,
      visibilityKm: 6,
      uvIndex: 5,
      lastUpdated: '15 mins ago'
    },
    forecast: [
      { date: 'Today', tempMin: 26, tempMax: 31, condition: 'Heavy monsoonal rain', icon: 'CloudRain', rainProbability: 95 },
      { date: 'Tomorrow', tempMin: 25, tempMax: 30, condition: 'Continuous downpour', icon: 'CloudRain', rainProbability: 90 },
      { date: 'Tue', tempMin: 26, tempMax: 31, condition: 'Thunder showers', icon: 'CloudLightning', rainProbability: 80 }
    ],
    hourlyForecast: [
      { time: '12:00 PM', tempCelsius: 31, condition: 'Rain', icon: 'CloudRain' },
      { time: '02:00 PM', tempCelsius: 30, condition: 'Heavy Rain', icon: 'CloudRain' }
    ],
    alerts: [
      {
        id: 'wa-2',
        category: 'Flood Warning',
        priority: 'critical',
        color: 'red',
        icon: 'AlertTriangle',
        timestamp: '30m ago',
        message: 'Red Alert: High tide concurrent with heavy rainfall might cause localized urban flooding near low-lying coastal areas.'
      }
    ],
    airQuality: { aqi: 24, status: 'Good' },
    sunrise: '06:02 AM',
    sunset: '07:18 PM',
    pilgrimAdvisory: ['Check rail status at CSMT/Dadar before starting journey.', 'Avoid visiting open beachfronts.'],
    travelAdvisory: ['Waterlogging reported at standard subway locations. Use arterial roads.'],
    crowdWeatherImpact: 'Rain is expected to delay outbound pilgrim trains by 30-45 minutes. Expect higher crowd densities in station waiting halls.',
    coordinates: { lat: 18.9402, lng: 72.8354 }
  },
  {
    id: 'wd-pne',
    name: 'Pune',
    slug: 'pune',
    currentWeather: {
      tempCelsius: 26,
      condition: 'Windy',
      icon: 'Wind',
      humidity: 62,
      windSpeedKmh: 24,
      rainProbability: 20,
      visibilityKm: 10,
      uvIndex: 7,
      lastUpdated: '5 mins ago'
    },
    forecast: [
      { date: 'Today', tempMin: 20, tempMax: 27, condition: 'Gusty winds, cool climate', icon: 'Wind', rainProbability: 20 },
      { date: 'Tomorrow', tempMin: 19, tempMax: 28, condition: 'Partly cloudy', icon: 'Cloud', rainProbability: 10 }
    ],
    hourlyForecast: [
      { time: '12:00 PM', tempCelsius: 27, condition: 'Windy', icon: 'Wind' },
      { time: '02:00 PM', tempCelsius: 26, condition: 'Gusty Winds', icon: 'Wind' }
    ],
    alerts: [],
    airQuality: { aqi: 55, status: 'Satisfactory' },
    sunrise: '06:01 AM',
    sunset: '07:13 PM',
    pilgrimAdvisory: ['Pleasant cool winds ideal for walking, but keep light windbreakers ready.'],
    travelAdvisory: ['Gusty crosswinds active near mountain ghat roads. Drive heavy vehicles carefully.'],
    crowdWeatherImpact: 'Favorable temperature will support steady pedestrian movement without thermal fatigue.',
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 'wd-ahn',
    name: 'Ahilyanagar',
    slug: 'ahilyanagar',
    currentWeather: {
      tempCelsius: 32,
      condition: 'Sunny',
      icon: 'Sun',
      humidity: 45,
      windSpeedKmh: 10,
      rainProbability: 0,
      visibilityKm: 10,
      uvIndex: 9,
      lastUpdated: '20 mins ago'
    },
    forecast: [
      { date: 'Today', tempMin: 23, tempMax: 33, condition: 'Sunny and warm', icon: 'Sun', rainProbability: 0 },
      { date: 'Tomorrow', tempMin: 22, tempMax: 34, condition: 'Dry sunny day', icon: 'Sun', rainProbability: 5 }
    ],
    hourlyForecast: [
      { time: '12:00 PM', tempCelsius: 32, condition: 'Sunny', icon: 'Sun' },
      { time: '02:00 PM', tempCelsius: 33, condition: 'Intense Sun', icon: 'Sun' }
    ],
    alerts: [
      {
        id: 'wa-3',
        category: 'Heatwave',
        priority: 'medium',
        color: 'amber',
        icon: 'Thermometer',
        timestamp: '2h ago',
        message: 'Advisory: High solar UV indexes near Shirdi. Cover head and drink plenty of water between 12:00 PM and 3:00 PM.'
      }
    ],
    airQuality: { aqi: 62, status: 'Satisfactory' },
    sunrise: '05:59 AM',
    sunset: '07:11 PM',
    pilgrimAdvisory: ['Cover heads with white cotton cloths when standing in open Shirdi queue gates.', 'Drink water at free municipal cooling booths.'],
    travelAdvisory: ['Avoid afternoon driving through interior state highways due to radiative asphalt heat.'],
    crowdWeatherImpact: 'High thermal heat index increases cooling booth demand. Crowd management is routing devotees to shaded waiting areas.',
    coordinates: { lat: 19.0948, lng: 74.7480 }
  }
];

// Fallback filler generator for all other 32 districts of Maharashtra to ensure complete coverage 
// without repeating massive hardcoded text blocks, while avoiding random reloads.
const OTHER_DISTRICT_NAMES = [
  'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Dhule', 'Nandurbar', 'Jalgaon',
  'Satara', 'Sangli', 'Solapur', 'Kolhapur', 'Chhatrapati Sambhajinagar', 'Jalna', 'Parbhani',
  'Hingoli', 'Beed', 'Nanded', 'Dharashiv', 'Latur', 'Buldhana', 'Akola', 'Washim',
  'Amravati', 'Yavatmal', 'Wardha', 'Nagpur', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli', 'Mumbai Suburban'
];

const MOCK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Palghar': { lat: 19.6967, lng: 72.7656 },
  'Raigad': { lat: 18.5158, lng: 73.1822 },
  'Ratnagiri': { lat: 16.9902, lng: 73.3120 },
  'Sindhudurg': { lat: 16.1172, lng: 73.7291 },
  'Dhule': { lat: 20.9042, lng: 74.7749 },
  'Nandurbar': { lat: 21.7469, lng: 74.1240 },
  'Jalgaon': { lat: 21.0077, lng: 75.5626 },
  'Satara': { lat: 17.6805, lng: 73.9918 },
  'Sangli': { lat: 16.8524, lng: 74.5815 },
  'Solapur': { lat: 17.6599, lng: 75.9064 },
  'Kolhapur': { lat: 16.7050, lng: 74.2433 },
  'Chhatrapati Sambhajinagar': { lat: 19.8762, lng: 75.3433 },
  'Jalna': { lat: 19.8410, lng: 75.8864 },
  'Parbhani': { lat: 19.2608, lng: 76.7748 },
  'Hingoli': { lat: 19.7214, lng: 77.1407 },
  'Beed': { lat: 18.9891, lng: 75.7601 },
  'Nanded': { lat: 19.1383, lng: 77.3210 },
  'Dharashiv': { lat: 18.1853, lng: 76.0420 },
  'Latur': { lat: 18.4088, lng: 76.5630 },
  'Buldhana': { lat: 20.5292, lng: 76.1842 },
  'Akola': { lat: 20.7002, lng: 77.0082 },
  'Washim': { lat: 20.1005, lng: 77.1350 },
  'Amravati': { lat: 20.9320, lng: 77.7523 },
  'Yavatmal': { lat: 20.3888, lng: 78.1204 },
  'Wardha': { lat: 20.7453, lng: 78.6022 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Bhandara': { lat: 21.1719, lng: 79.6522 },
  'Gondia': { lat: 21.4598, lng: 80.2198 },
  'Chandrapur': { lat: 19.9615, lng: 79.2961 },
  'Gadchiroli': { lat: 20.1005, lng: 80.0001 },
  'Mumbai Suburban': { lat: 19.1235, lng: 72.8876 }
};

// Populate the remainder of the 36 districts using a deterministic static mock builder
OTHER_DISTRICT_NAMES.forEach((name, idx) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const tempSeed = 24 + (idx % 8); // static range 24 - 31
  const conditionList: ('Sunny' | 'Cloudy' | 'Rain' | 'Thunderstorm')[] = ['Sunny', 'Cloudy', 'Rain', 'Thunderstorm'];
  const condition = conditionList[idx % 4];
  const icon = condition === 'Sunny' ? 'Sun' : condition === 'Rain' ? 'CloudRain' : condition === 'Thunderstorm' ? 'CloudLightning' : 'Cloud';

  WEATHER_DISTRICTS_DATA.push({
    id: `wd-gen-${idx}`,
    name,
    slug,
    currentWeather: {
      tempCelsius: tempSeed,
      condition,
      icon,
      humidity: 50 + (idx * 3) % 40,
      windSpeedKmh: 8 + (idx * 2) % 15,
      rainProbability: condition === 'Rain' ? 80 : condition === 'Thunderstorm' ? 90 : 10,
      visibilityKm: 9,
      uvIndex: 6,
      lastUpdated: '30 mins ago'
    },
    forecast: [
      { date: 'Today', tempMin: tempSeed - 5, tempMax: tempSeed + 2, condition: `General ${condition}`, icon, rainProbability: condition === 'Rain' ? 80 : 10 },
      { date: 'Tomorrow', tempMin: tempSeed - 6, tempMax: tempSeed + 1, condition: 'Overcast', icon: 'Cloud', rainProbability: 30 },
      { date: 'Tue', tempMin: tempSeed - 5, tempMax: tempSeed + 3, condition: 'Sunny patches', icon: 'CloudSun', rainProbability: 15 }
    ],
    hourlyForecast: [
      { time: '12:00 PM', tempCelsius: tempSeed + 1, condition, icon },
      { time: '02:00 PM', tempCelsius: tempSeed + 2, condition, icon }
    ],
    alerts: idx % 10 === 0 ? [
      {
        id: `wa-gen-${idx}`,
        category: 'Strong Winds',
        priority: 'low',
        color: 'blue',
        icon: 'Wind',
        timestamp: '3h ago',
        message: `Winds up to 35 km/h expected in ${name} district sectors. Clear light tents.`
      }
    ] : [],
    airQuality: { aqi: 50 + (idx * 4) % 100, status: idx % 3 === 0 ? 'Satisfactory' : 'Good' },
    sunrise: '06:05 AM',
    sunset: '07:15 PM',
    pilgrimAdvisory: [`Pilgrims visiting ${name} should wear light clothing.`],
    travelAdvisory: [`Road transit conditions in ${name} are standard. No bottlenecks reported.`],
    crowdWeatherImpact: 'Standard ambient thermal index. No expected thermal-induced crowd diversion triggers.',
    coordinates: MOCK_COORDINATES[name] || { lat: 19.0, lng: 76.0 }
  });
});
