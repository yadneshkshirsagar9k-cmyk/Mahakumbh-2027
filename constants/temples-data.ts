/**
 * @file Pilgrimage Destinations data source
 * @description Centralized data source representing the official spiritual circuit
 * associated with the Nashik Mahakumbh region. Used by the Hero Slider
 * and dynamic temple detail pages at /temples/[slug].
 */

export interface HowToReach {
  road: string;
  rail: string;
  air: string;
  publicTransport: string;
  walkingRoute: string;
}

export interface TempleData {
  id: string;
  slug: string;
  name: string;
  location: string;
  district: string;
  category: string;
  heroImage: string;
  thumbnailImages: string[];
  tagline: string;
  shortDescription: string;
  historicalImportance: string;
  spiritualImportance: string;
  coordinates: { lat: number; lng: number };
  exploreRoute: string;
  futureWeatherAPIKey: string;
  futureGalleryFolder: string;
  futureMapLocation: string;
  
  // Compatibility mappings for the temple detail page layout
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  religiousSignificance: string;
  timings: string;
  weatherPlaceholder: string;
  medicalInfo: string;
  policeInfo: string;
  helpCentreInfo: string;
  howToReach: HowToReach;
  facts: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  guidelines: string[];
}

export const TEMPLES_DATA: TempleData[] = [
  {
    id: 'trim-001',
    slug: 'trimbakeshwar-temple',
    name: 'Trimbakeshwar Temple, Nashik',
    location: 'Trimbakeshwar',
    district: 'Nashik',
    category: 'Jyotirlinga Temple',
    heroImage: '/assets/images/temples/trimbakeshwar.jpg',
    thumbnailImages: [
      '/assets/images/temples/kushavarta_kund.jpg',
      '/assets/images/temples/trimbakeshwar_basalt.jpg',
      '/assets/images/temples/trimbakeshwar_angle.jpg'
    ],
    tagline: 'One of the Twelve Sacred Shiva Jyotirlingas',
    shortDescription: 'An ancient temple housing a unique three-faced linga representing Brahma, Vishnu, and Mahesh, nestled in the foothills of Brahmagiri hills.',
    historicalImportance: 'The temple was rebuilt in black stone by Peshwa Balaji Baji Rao in the mid-18th century, showcasing stunning Indo-Aryan architecture and basalt stone carvings.',
    spiritualImportance: 'It is considered the source of the sacred Godavari River and is one of the most auspicious spiritual locations for purification, especially during the Mahakumbh.',
    coordinates: { lat: 19.9322, lng: 73.5307 },
    exploreRoute: '/temples/trimbakeshwar-temple',
    futureWeatherAPIKey: 'WEATHER_PLACEHOLDER_KEY',
    futureGalleryFolder: 'GALLERY_TRIMBAKESHWAR',
    futureMapLocation: 'MAP_TRIMBAKESHWAR',
    
    // Compatibility fields
    title: 'Trimbakeshwar Temple',
    subtitle: 'One of the Twelve Sacred Jyotirlingas',
    description: 'An ancient temple housing a unique three-faced linga representing Brahma, Vishnu, and Mahesh.',
    longDescription: 'Located 28 km from Nashik city, Trimbakeshwar Jyotirlinga is situated at the foothills of Brahmagiri mountain, the source of the Godavari River. The temple, constructed by Peshwa Balaji Baji Rao, exhibits majestic basalt stone architecture with detailed carvings. Unlike other Jyotirlingas, the linga here is a hollow cavity containing three small pillars, representing the holy trinity.',
    religiousSignificance: 'One of the most sacred pilgrimage sites in India. Bathing in Kushavarta Kund nearby and visiting this shrine is believed to grant salvation.',
    timings: '5:30 AM to 9:00 PM daily',
    weatherPlaceholder: 'Mist-clad, 24°C, gentle breeze',
    medicalInfo: 'Trimbak Sub-District Hospital (600m away)',
    policeInfo: 'Trimbakeshwar Police Station (400m from north gate)',
    helpCentreInfo: 'Temple Trust Help Desk inside inner courtyard',
    howToReach: {
      road: 'Regular state transport (MSRTC) buses run from Nashik CBS Bus Stand to Trimbak every 15 minutes.',
      rail: 'Nashik Road Railway Station is 38 km away. Cabs charge flat rates.',
      air: 'Ozar Airport is 50 km away.',
      publicTransport: 'Local shared mini-vans and public buses run regularly.',
      walkingRoute: 'Pedestrian-only zone starts from Kushavarta Ghat to main temple (600m).'
    },
    facts: [
      { label: 'Deity Name', value: 'Trimbakeshwar Shiv' },
      { label: 'Significance', value: '12 Jyotirlingas' },
      { label: 'Architecture', value: 'Hemadpanthi / Indo-Aryan' },
      { label: 'District', value: 'Nashik' },
      { label: 'Holy Pool', value: 'Kushavarta Kund' }
    ],
    faqs: [
      { question: 'How long does the general queue take?', answer: 'On weekdays, it takes 1-2 hours. On Mondays and holidays, it can extend to 4-5 hours. Special passes are available online.' },
      { question: 'Is dress code mandatory?', answer: 'Yes, traditional attire is required for entering the sanctum sanctorum for special offerings.' }
    ],
    guidelines: [
      'Photography is strictly prohibited inside the temple premises.',
      'Keep mobile phones switched off or in lockers.',
      'Respect line queuing protocols.'
    ]
  },
  {
    id: 'ramk-002',
    slug: 'ramkund-ghat',
    name: 'Ramkund Ghat, Nashik',
    location: 'Nashik',
    district: 'Nashik',
    category: 'Holy Bathing Ghat',
    heroImage: '/assets/images/temples/ramkund.jpg',
    thumbnailImages: [
      '/assets/images/temples/ramkund_daytime.jpg',
      '/assets/images/temples/ramkund.jpg',
      '/assets/images/temples/ramkund_saree_offering.jpg'
    ],
    tagline: 'The Sacred Dipping Ghat of Godavari',
    shortDescription: 'The holy reservoir where Lord Rama is believed to have bathed during his exile, attracting millions for sacred bathing rituals and prayers.',
    historicalImportance: 'Built in 1696 by Chitrarao Khatarkar, this iconic reservoir has served as the spiritual center for holy dips and bone immersion rituals during the Peshwa era.',
    spiritualImportance: 'It is the central point of Nashik Mahakumbh bathing rituals. Bathing here is believed to wash away all earthly sins.',
    coordinates: { lat: 20.0055, lng: 73.7915 },
    exploreRoute: '/temples/ramkund-ghat',
    futureWeatherAPIKey: 'WEATHER_PLACEHOLDER_KEY',
    futureGalleryFolder: 'GALLERY_RAMKUND',
    futureMapLocation: 'MAP_RAMKUND',
    
    // Compatibility fields
    title: 'Ramkund Ghat',
    subtitle: 'Sacred Dipping Ghat of Nashik',
    description: 'The holy pond in Godavari where Lord Rama is believed to have performed his daily rituals during exile.',
    longDescription: 'Ram Kund is the central focus of religious activity in Nashik. Built in 1696 by Chitrarao Khatarkar, this holy reservoir is where lakhs of pilgrims take a holy dip during the Kumbh Mela to cleanse their sins. Water from this Kund is also used for performing bone immersion rituals, as it is believed that bones dissolve instantly here due to the sacred nature of the river flow.',
    religiousSignificance: 'It is believed Lord Rama bathed here during his exile. The water is considered as holy as the Ganges.',
    timings: 'Open 24 hours (Bathing ghats), rituals active from 5:00 AM to 8:00 PM',
    weatherPlaceholder: 'Moderate, 28°C, Humidity 62%',
    medicalInfo: 'Ghat First-Aid Unit (100m away near Naroshankar temple)',
    policeInfo: 'Ramkund Police Help Post (at the entrance of the ghat)',
    helpCentreInfo: 'Nashik Corporation Pilgrim Help Desk (Ghat Entrance)',
    howToReach: {
      road: 'Well connected via local auto-rickshaws and public city buses from CBS Bus Stand (3 km away).',
      rail: 'Nashik Road Railway Station is 10 km away. Taxi services run frequently.',
      air: 'Ozar Airport Nashik is 22 km away. Regular cabs are available.',
      publicTransport: 'Auto and bus available',
      walkingRoute: 'Follow the dedicated pedestrian riverwalk from Talkoot Depot (1.5 km).'
    },
    facts: [
      { label: 'Location', value: 'Nashik' },
      { label: 'Primary Deity', value: 'Goddess Godavari' },
      { label: 'Built In', value: '1696 (Renovated)' },
      { label: 'Key Festival', value: 'Kumbh Mela / Ram Navami' },
      { label: 'Best Time to Visit', value: 'Karthik Poornima' }
    ],
    faqs: [
      { question: 'Is changing rooms available near Ram Kund?', answer: 'Yes, separate female changing rooms are situated adjacent to the primary bathing steps.' },
      { question: 'What are the charges for taking a dip?', answer: 'Taking a holy dip is completely free. Local priests charge nominal amounts for custom rituals.' }
    ],
    guidelines: [
      'Do not use soap or detergents while bathing in the sacred waters.',
      'Keep your belongings at designated locker rooms.',
      'Always follow administrative instructions regarding crowd movement lines.'
    ]
  },

  {
    id: 'shir-004',
    slug: 'sai-baba-samadhi-mandir',
    name: 'Shri Sai Baba Samadhi Mandir, Shirdi',
    location: 'Shirdi',
    district: 'Ahilyanagar',
    category: 'Spiritual Shrine',
    heroImage: '/assets/images/temples/sai_baba.jpg',
    thumbnailImages: [
      '/assets/images/temples/shirdi_dwarkamai_dhuni.jpg',
      '/assets/images/temples/shirdi_chavadi.jpg',
      '/assets/images/temples/shirdi_gurusthan.jpg'
    ],
    tagline: 'The Land of Sabka Malik Ek',
    shortDescription: 'The holy resting place of the saint Shri Sai Baba, attracting devotees from all faiths to experience peace, prayer, and community service.',
    historicalImportance: 'The temple building was originally constructed as a private stone mansion (wada) in the early 20th century by a wealthy devotee, Gopalrao Booty, where Baba was laid to rest in 1918.',
    spiritualImportance: 'Preaches the messages of Shraddha (Faith) and Saburi (Patience). Devotees believe that visiting the shrine brings peace and fulfillments of sincere prayers.',
    coordinates: { lat: 19.7694, lng: 74.4759 },
    exploreRoute: '/temples/sai-baba-samadhi-mandir',
    futureWeatherAPIKey: 'WEATHER_PLACEHOLDER_KEY',
    futureGalleryFolder: 'GALLERY_SHIRDI',
    futureMapLocation: 'MAP_SHIRDI',
    
    // Compatibility fields
    title: 'Shri Sai Baba Samadhi Mandir',
    subtitle: 'The Land of Sabka Malik Ek',
    description: 'The divine resting place of the revered 19th-century saint Shri Sai Baba, preaching harmony, self-realization, and charity.',
    longDescription: 'The Samadhi Mandir in Shirdi houses the sacred body of Shri Sai Baba, who lived in Shirdi for over 50 years. The temple features a beautiful white Italian marble idol of Sai Baba sitting on a golden throne. It is visited by millions of devotees yearly, irrespective of religion, caste, or creed.',
    religiousSignificance: 'Shirdi represents absolute religious harmony and unity. The temple bhandara (free community kitchen) is one of the largest in Asia.',
    timings: '4:00 AM to 11:15 PM daily (Dussehra and festivals run 24 hours)',
    weatherPlaceholder: 'Warm and dry, 29°C',
    medicalInfo: 'Sai Baba Super Speciality Hospital (800m away)',
    policeInfo: 'Shirdi Police Command Center (200m from entrance gate)',
    helpCentreInfo: 'Shri Saibaba Sansthan Trust Office',
    howToReach: {
      road: 'Well connected via state buses from Nashik, Mumbai, and Pune. 90-minute drive from Nashik.',
      rail: 'Sainagar Shirdi Railway Station is 3 km away. Taxis and autos are abundant.',
      air: 'Shirdi International Airport (Kakadi) is 14 km away.',
      publicTransport: 'Sansthan operates free shuttle buses between the railway station and the temple.',
      walkingRoute: 'Pedestrian plaza links main bus drop points directly to Gate 2 entrance.'
    },
    facts: [
      { label: 'Saint Name', value: 'Shri Sai Baba' },
      { label: 'Resting Year', value: '1918 (Vijayadashami)' },
      { label: 'Trust Name', value: 'Shri Saibaba Sansthan' },
      { label: 'Key Message', value: 'Shraddha & Saburi' },
      { label: 'Bhandara capacity', value: 'approx 40,000 daily' }
    ],
    faqs: [
      { question: 'Is online booking available for Darshan?', answer: 'Yes, devotees can book Kakad Aarti, general darshan, and accommodation passes online through the Sansthan portal.' }
    ],
    guidelines: [
      'Electronic items, cameras, and mobiles are strictly not allowed inside the main complex.',
      'Sardar dress code rules apply for entering the inner boundary area.'
    ]
  },
  {
    id: 'shan-005',
    slug: 'shani-shingnapur',
    name: 'Shri Kshetra Shani Shingnapur, Ahilyanagar District',
    location: 'Shingnapur',
    district: 'Ahilyanagar',
    category: 'Unique Open-Air Temple',
    heroImage: '/assets/images/temples/shani_shingnapur_crowned.jpg',
    thumbnailImages: [
      '/assets/images/temples/shani_shingnapur_village_house.jpg',
      '/assets/images/temples/shani_shingnapur.jpg'
    ],
    tagline: 'The Village of Doorless Homes protected by Lord Shani',
    shortDescription: 'A unique open-air temple where the self-manifested black stone idol of Lord Shani stands in the open, guarding a village where houses have no doors or locks.',
    historicalImportance: 'According to legend, a massive black stone slab washed ashore after heavy floods, and when local shepherds touched it with a rod, blood started oozing, leading to the discovery of the deity.',
    spiritualImportance: 'Believed to be a live shrine (Jagrut Devasthana) where Lord Shani himself protects the village. Devotees perform oil offerings (Abhishek) on the open-air pedestal.',
    coordinates: { lat: 19.3986, lng: 74.8197 },
    exploreRoute: '/temples/shani-shingnapur',
    futureWeatherAPIKey: 'WEATHER_PLACEHOLDER_KEY',
    futureGalleryFolder: 'GALLERY_SHINGNAPUR',
    futureMapLocation: 'MAP_SHINGNAPUR',
    
    // Compatibility fields
    title: 'Shri Kshetra Shani Shingnapur',
    subtitle: 'The Village of Doorless Homes protected by Lord Shani',
    description: 'A unique village where houses have no doors or locks, protected by the self-manifested black stone idol of Lord Shani.',
    longDescription: 'Shri Kshetra Shani Shingnapur is famous for its open-air temple of Lord Shani (the planet Saturn). The deity is represented by a five and a half feet high black stone rock standing on an open platform. The village has gained worldwide fame because none of the houses, shops, or even commercial banks have doors or locks, as the villagers believe Lord Shani protects them from theft.',
    religiousSignificance: 'Devotees perform oil Abhishek to Lord Shani to relieve themselves of planetary afflictions (Shani Dosha).',
    timings: 'Open 24 hours daily',
    weatherPlaceholder: 'Sunny and dry, 31°C',
    medicalInfo: 'Rural Dispensary (300m away)',
    policeInfo: 'Shingnapur Police Station (500m away)',
    helpCentreInfo: 'Devalaya Devasthan Trust Information Counter',
    howToReach: {
      road: 'Well connected by roads. 65 km from Shirdi and 115 km from Nashik city.',
      rail: 'Rahuri Railway Station is 32 km away. Ahmednagar railway station is 35 km away.',
      air: 'Shirdi Airport is approximately 75 km away.',
      publicTransport: 'Shared taxis and state transport buses run frequently from Ahmednagar and Shirdi.',
      walkingRoute: 'Easy walk from village entrance.'
    },
    facts: [
      { label: 'Primary Deity', value: 'Swayambhu Lord Shani' },
      { label: 'Village Feature', value: 'No Doors or Locks' },
      { label: 'Pedestal Type', value: 'Open-Air Platform' },
      { label: 'Slab Height', value: '5.5 Feet' },
      { label: 'District', value: 'Ahilyanagar' }
    ],
    faqs: [
      { question: 'Is everyone allowed to go near the platform?', answer: 'Yes, devotees are permitted to ascend the platform to offer oil, but traditional dhotis/saris are required to touch the platform area.' }
    ],
    guidelines: [
      'Offerings of pure mustard/sesame oil are traditional here and sold by authorized local trust outlets.',
      'Beware of street vendors selling duplicate oils.'
    ]
  }
];
