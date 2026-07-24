/**
 * @file location-config.ts
 * @description Centralized GPS coordinate repository for all pilgrimage, transit,
 * registration, medical, parking, and emergency nodes across the Nashik Mahakumbh portal.
 */

export interface LocationDetails {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
  address: string;
}

export const LOCATION_CONFIG: Record<string, LocationDetails> = {
  // --- CORE SHRINES & TEMPLES ---
  SHIRDI_SAI_BABA: {
    name: 'Shree Saibaba Sansthan Temple',
    lat: 19.7668,
    lng: 74.4754,
    placeId: 'ChIJP-o6-m5D2jsR1K37TmhP1W0',
    address: 'Mauli Nagar, Shirdi, Maharashtra 423109'
  },
  TRIMBAKESHWAR: {
    name: 'Trimbakeshwar Shiva Temple',
    lat: 19.9324,
    lng: 73.5307,
    placeId: 'ChIJV2d4wweD2DsRP-xveb2Z-2Q',
    address: 'Trimbak, Maharashtra 422212'
  },
  RAMKUND_GHAT: {
    name: 'Ram Kund Ghat',
    lat: 20.0039,
    lng: 73.7915,
    placeId: 'ChIJj362Qx6D2DsRk311H4lB-10',
    address: 'Panchavati, Nashik, Maharashtra 422003'
  },

  SHANI_SHINGNAPUR: {
    name: 'Shani Shingnapur Temple',
    lat: 19.3833,
    lng: 74.8167,
    placeId: 'ChIJP-o6-m5D2jsR-OilAbhishek',
    address: 'Shani Shingnapur, Maharashtra 414105'
  },
  GRISHNESHWAR: {
    name: 'Grishneshwar Jyotirlinga Temple',
    lat: 20.0268,
    lng: 75.1771,
    placeId: 'ChIJr2d4-m1D2jsRv2d4xweD2Ds',
    address: 'Verul, Maharashtra 431102'
  },
  ELLORA_CAVES: {
    name: 'Ellora Caves & Kailash Temple',
    lat: 20.0268,
    lng: 75.1771,
    placeId: 'ChIJVerul-Ellora-Caves',
    address: 'Ellora, Aurangabad, Maharashtra 431102'
  },
  AJANTA_CAVES: {
    name: 'Ajanta Caves',
    lat: 20.5519,
    lng: 75.7033,
    placeId: 'ChIJAjanta-Caves-UNESCO',
    address: 'Ajanta, Maharashtra 431117'
  },
  BHADRA_MARUTI: {
    name: 'Bhadra Maruti Temple',
    lat: 20.0101,
    lng: 75.1873,
    placeId: 'ChIJBhadra-Maruti-Khuldabad',
    address: 'Khuldabad, Aurangabad, Maharashtra 431101'
  },
  MOHINIRAJ_TEMPLE: {
    name: 'Mohiniraj Temple',
    lat: 19.5434,
    lng: 74.9126,
    placeId: 'ChIJMohiniraj-Nevasa',
    address: 'Nevasa, Ahmednagar, Maharashtra 414603'
  },

  // --- TRANSIT & STATIONS ---
  NASHIK_ROAD_STATION: {
    name: 'Nashik Road Railway Station',
    lat: 19.9634,
    lng: 73.8398,
    placeId: 'ChIJN-Road-Station-Nashik',
    address: 'Nashik Road, Nashik, Maharashtra 422101'
  },
  THAKKAR_BAZAR_BUS: {
    name: 'Thakkar Bazar Bus Stand (CBS)',
    lat: 20.0012,
    lng: 73.7845,
    placeId: 'ChIJThakkar-Bazar-CBS',
    address: 'CBS Road, Nashik, Maharashtra 422001'
  },
  OZAR_AIRPORT: {
    name: 'Ozar Airport Nashik (ISK)',
    lat: 20.1189,
    lng: 73.9135,
    placeId: 'ChIJOzar-Airport-Nashik',
    address: 'Ozar, Nashik, Maharashtra 422206'
  },
  PUNE_STATION: {
    name: 'Pune Junction Railway Station',
    lat: 18.5289,
    lng: 73.8744,
    placeId: 'ChIJPune-Station-Junction',
    address: 'Pune, Maharashtra 411001'
  },
  MUMBAI_CSMT: {
    name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    lat: 18.9402,
    lng: 72.8354,
    placeId: 'ChIJMumbai-CSMT-Terminal',
    address: 'Dhobi Talao, Fort, Mumbai, Maharashtra 400001'
  },
  NAGPUR_AIRPORT: {
    name: 'Dr. Babasaheb Ambedkar International Airport',
    lat: 21.0922,
    lng: 79.0472,
    placeId: 'ChIJNagpur-Airport-Intl',
    address: 'Sonegaon, Nagpur, Maharashtra 440005'
  },
  SHIRDI_STATION: {
    name: 'Sainagar Shirdi Railway Station',
    lat: 19.7712,
    lng: 74.4912,
    placeId: 'ChIJShirdi-Station-Sainagar',
    address: 'Shirdi, Ahmednagar, Maharashtra 423109'
  },

  // --- MEDICAL CENTRES ---

  SECTOR_C_MEDICAL: {
    name: 'Sector C Medical Camp',
    lat: 20.0150,
    lng: 73.8005,
    placeId: 'ChIJSector-C-Medical-Camp',
    address: 'Near Sadhugram Entry Gate, Sector C, Nashik'
  },
  TRIMBAK_MEDICAL: {
    name: 'Trimbak Medical Post',
    lat: 19.9320,
    lng: 73.5300,
    placeId: 'ChIJTrimbak-Medical-Post',
    address: 'Adjacent to Main Temple Steps, Trimbakeshwar'
  },
  RAMKUND_MEDICAL: {
    name: 'Ramkund First-Aid Hub',
    lat: 20.0035,
    lng: 73.7910,
    placeId: 'ChIJRamkund-First-Aid-Hub',
    address: 'Ghat Exit Pathway, Ramkund, Nashik'
  },

  // --- POLICE & EMERGENCY HELP CENTRES ---
  RAMKUND_POLICE: {
    name: 'Ram Kund Police Help Post',
    lat: 20.0058,
    lng: 73.7919,
    placeId: 'ChIJRamkund-Police-Help-Post',
    address: 'Ghat Entrance Post, adjacent to Ram Kund Steps, Nashik'
  },
  SADHVUGRAM_BOOTH: {
    name: 'Sadhugram Sector 1 Temporary Booth',
    lat: 20.0156,
    lng: 73.8012,
    placeId: 'ChIJSadhugram-Sector-1-Booth',
    address: 'Main Entrance Gate, Sector 1 Camp Area, Nashik'
  },
  COLLECTORATE_OFFICE: {
    name: 'Collectorate Office Government Hub',
    lat: 19.9975,
    lng: 73.7898,
    placeId: 'ChIJCollectorate-Complex-Nashik',
    address: 'Old Collectorate Complex, Court Road, Nashik City'
  },
};

/**
 * Safe navigation trigger that validates coordinates, logs the final URL,
 * and opens it in a secure blank window tab. Displays fallback alert on error.
 */
export function navigateToCoordinates(latitude: any, longitude: any): void {
  const latVal = parseFloat(latitude);
  const lngVal = parseFloat(longitude);

  if (
    latitude === undefined || latitude === null || String(latitude).trim() === '' ||
    longitude === undefined || longitude === null || String(longitude).trim() === '' ||
    isNaN(latVal) || isNaN(lngVal)
  ) {
    console.error("Invalid GPS coordinates audited:", { latitude, longitude });
    alert("Error: Location coordinates are invalid or missing. Navigation aborted.");
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&destination=${latVal},${lngVal}`;
  console.log("Audited Navigation Trigger - Opening URL:", url);
  window.open(url, "_blank", "noopener,noreferrer");
}
