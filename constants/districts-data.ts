/**
 * @file Districts and Heritage data source
 * @description Centralized data source representing the cultural and spiritual
 * districts of Maharashtra. Used by the "Explore Maharashtra" locator map.
 */

export interface DistrictDestination {
  name: string;
  category: string;
  image: string;
  slug: string;
}

export interface GalleryItem {
  category: 'tourist' | 'temples' | 'ghats' | 'nature' | 'heritage' | 'culture' | 'cuisine';
  url: string;
  title: string;
}

export interface DistrictFacts {
  population: string;
  area: string;
  famousFor: string;
  language: string;
  unescoSites: string;
  rivers: string;
  temples: string;
  mahakumbhConnection: string;
}

export interface DistrictData {
  id: string;
  slug: string;
  name: string;
  image: string;
  introduction: string;
  historicalImportance: string;
  religiousImportance: string;
  culture: string;
  festivals: string[];
  cuisine: string[];
  bestTime: string;
  facts: DistrictFacts;
  coordinates: { lat: number; lng: number };
  polygon: [number, number][]; // bounding coordinates
  destinations: DistrictDestination[];
  gallery: GalleryItem[];
}

export const DISTRICTS_DATA: DistrictData[] = [
  {
    id: 'dist-nsk',
    slug: 'nashik',
    name: 'Nashik District',
    image: '/assets/images/districts/nashik.jpg',
    introduction: 'Nashik is an ancient holy city in Maharashtra, situated on the banks of the Godavari River, renowned for its association with the Ramayana and hosting the Simhastha Mahakumbh Mela.',
    historicalImportance: 'An ancient city dating back to the Mauryan and Peshwa dynasties, Nashik is historically significant as the place where the epic Ramayana events took place. It also served as a major trading hub and mint town under Peshwa rule.',
    religiousImportance: 'According to epic scriptures, Lord Rama spent major parts of his 14-year exile here. It houses the sacred Trimbakeshwar Jyotirlinga and Ram Kund.',
    culture: 'A rich mixture of traditional Vedic culture, classical musical traditions, and modern industrialization. Celebrates the circular Kumbh Mela once every 12 years.',
    festivals: ['Simhastha Mahakumbh Mela', 'Ram Navami', 'Maha Shivratri', 'Tripuri Poornima'],
    cuisine: ['Nashik Misal Pav', 'Khandeshi Shev Bhaji', 'Sugarcane Juice', 'Fresh Grapes'],
    bestTime: 'October to March (Pleasant and cool winters)',
    facts: {
      population: '6.1 Million (Approx)',
      area: '15,530 sq km',
      famousFor: 'Mahakumbh, Jyotirlinga, Panchavati, and Holy Snan',
      language: 'Marathi, Hindi, English',
      unescoSites: 'None ( Brahmagiri Hills under heritage review )',
      rivers: 'Godavari, Girna, Darna',
      temples: 'Trimbakeshwar, Kapaleshwar, Saptashrungi Gad',
      mahakumbhConnection: 'Host district of the sacred Simhastha Mahakumbh bathing rituals at Ram Kund.'
    },
    coordinates: { lat: 19.9975, lng: 73.7898 },
    polygon: [
      [20.55, 73.30],
      [20.80, 73.80],
      [20.30, 74.45],
      [19.65, 74.55],
      [19.45, 73.90],
      [19.70, 73.30]
    ],
    destinations: [
      { name: 'Trimbakeshwar Temple', category: 'Pilgrimage', image: '/assets/images/heroes/trimbakeshwar-temple.jpg', slug: 'trimbakeshwar-temple' },
      { name: 'Ramkund Ghat', category: 'Ghat', image: '/assets/images/heroes/ramkund-ghat.jpg', slug: 'ramkund-ghat' }
    ],
    gallery: [
      { category: 'temples', url: '/assets/images/gallery/nashik-temple.jpg', title: 'Trimbakeshwar Spire' },
      { category: 'ghats', url: '/assets/images/gallery/nashik-ghat.jpg', title: 'Godavari Evening Aarti' },
      { category: 'cuisine', url: '/assets/images/gallery/nashik-misal.jpg', title: 'Authentic Misal Pav' }
    ]
  },
  {
    id: 'dist-ahn',
    slug: 'ahilyanagar',
    name: 'Ahilyanagar District',
    image: '/assets/images/districts/ahilyanagar.jpg',
    introduction: 'Ahilyanagar (formerly Ahmednagar) is the largest district in Maharashtra, serving as a vital spiritual gateway housing Shirdi Sai Dham and Shani Shingnapur.',
    historicalImportance: 'Founded in 1490 by Ahmad Nizam Shah, the district has historic monuments like the Ahmednagar Fort, where national leaders like Jawaharlal Nehru were imprisoned during the freedom struggle.',
    religiousImportance: 'Deeply holy region hosting the samadhi of the universal saint Sai Baba at Shirdi, and the doorless spiritual village of Shani Shingnapur.',
    culture: 'Known for agricultural success, cooperative sugar movements, and strong spiritual devotion. Preaches unity, service, and harmony across religions.',
    festivals: ['Sai Baba Punyatithi', 'Shani Amavasya', 'Guru Purnima', 'Ram Navami'],
    cuisine: ['Pithla Bhakri', 'Jowar Roti', 'Shirdi pedha', 'Ahilyanagar Khoya Jalebi'],
    bestTime: 'November to February',
    facts: {
      population: '4.5 Million',
      area: '17,048 sq km',
      famousFor: 'Shirdi Sai Temple, Shani Shingnapur doorless houses',
      language: 'Marathi, Hindi, English',
      unescoSites: 'None',
      rivers: 'Pravara, Mula, Bhima',
      temples: 'Sai Baba Samadhi Mandir, Shani Shingnapur, Siddhtek Ashtavinayak',
      mahakumbhConnection: 'Major satellite transit hub housing lakhs of pilgrims visiting Shirdi before reaching Nashik.'
    },
    coordinates: { lat: 19.0948, lng: 74.7480 },
    polygon: [
      [19.90, 74.30],
      [19.95, 74.80],
      [19.10, 75.20],
      [18.45, 75.00],
      [18.70, 74.20],
      [19.45, 73.90]
    ],
    destinations: [
      { name: 'Shri Sai Baba Samadhi Mandir', category: 'Pilgrimage', image: '/assets/images/heroes/sai-baba-samadhi-mandir.jpg', slug: 'sai-baba-samadhi-mandir' },
      { name: 'Shri Kshetra Shani Shingnapur', category: 'Pilgrimage', image: '/assets/images/heroes/shani-shingnapur.jpg', slug: 'shani-shingnapur' }
    ],
    gallery: [
      { category: 'temples', url: '/assets/images/gallery/shirdi-samadhi.jpg', title: 'Sai Baba Marble Altar' },
      { category: 'heritage', url: '/assets/images/gallery/ahilyanagar-fort.jpg', title: 'Ahmednagar Fort Walls' },
      { category: 'culture', url: '/assets/images/gallery/shirdi-palki.jpg', title: 'Thursday Palki Procession' }
    ]
  },
  {
    id: 'dist-mum',
    slug: 'mumbai',
    name: 'Mumbai District',
    image: '/assets/images/districts/mumbai.jpg',
    introduction: 'Mumbai, the financial capital of India, is an island city on the Konkan coast, housing historic temples and serving as the primary international gateway for foreign pilgrims.',
    historicalImportance: 'Originally an archipelago of seven islands inhabited by Koli fishermen, ceded to the Portuguese and British, evolving into a Victorian Gothic trade port.',
    religiousImportance: 'Houses the historic Siddhivinayak Temple, Mahalaxmi Temple, Mumbadevi Temple (after which the city is named), and the floating Haji Ali Dargah.',
    culture: 'Highly cosmopolitan melting pot of cultures, global festivals, and Bollywood, retaining strong Marathi roots and traditional coastal celebrations.',
    festivals: ['Ganesh Chaturthi', 'Mount Mary Fair', 'Narali Purnima', 'Gudi Padwa'],
    cuisine: ['Vada Pav', 'Bombay Bhel Puri', 'Pav Bhaji', 'Koli Fish Curry'],
    bestTime: 'December to February',
    facts: {
      population: '12.5 Million',
      area: '603 sq km (Metro)',
      famousFor: 'Gateway of India, Siddhivinayak, Bollywood, Financial Exchange',
      language: 'Marathi, Hindi, English, Gujarati',
      unescoSites: 'Chhatrapati Shivaji Maharaj Terminus, Victorian Gothic & Art Deco Ensembles',
      rivers: 'Mithi, Dahisar',
      temples: 'Siddhivinayak, Mahalaxmi, Mumbadevi, Babulnath Shiv Temple',
      mahakumbhConnection: 'Main international airport and express rail hub directing overseas pilgrims to Nashik.'
    },
    coordinates: { lat: 18.9750, lng: 72.8258 },
    polygon: [
      [19.25, 72.75],
      [19.28, 72.95],
      [18.90, 72.88],
      [18.90, 72.78]
    ],
    destinations: [
      { name: 'Siddhivinayak Temple', category: 'Pilgrimage', image: '/assets/images/districts/mumbai-siddhi.jpg', slug: 'trimbakeshwar-temple' }, // redirect to placeholder slug
      { name: 'Mahalaxmi Temple', category: 'Pilgrimage', image: '/assets/images/districts/mumbai-laxmi.jpg', slug: 'ramkund-ghat' }
    ],
    gallery: [
      { category: 'temples', url: '/assets/images/gallery/mumbai-siddhi.jpg', title: 'Siddhivinayak Dome' },
      { category: 'heritage', url: '/assets/images/gallery/mumbai-cst.jpg', title: 'CSMT Heritage Spire' },
      { category: 'cuisine', url: '/assets/images/gallery/mumbai-vada.jpg', title: 'Classic Vada Pav' }
    ]
  },
  {
    id: 'dist-pne',
    slug: 'pune',
    name: 'Pune District',
    image: '/assets/images/districts/pune.jpg',
    introduction: 'Pune, the cultural capital of Maharashtra, is situated on the Deccan plateau, famous for its historic forts, educational institutes, and Ashtavinayak temples.',
    historicalImportance: 'The seat of the Peshwas of the Maratha Empire. Celebrated as the center of Shivaji Maharaj\'s early life, featuring Shaniwar Wada and Lal Mahal.',
    religiousImportance: 'Hosts the Bhimashankar Jyotirlinga, the sacred samadhi sanctuaries of saint Dnyaneshwar (Alandi) and Tukaram (Dehu), and multiple Ashtavinayak Ganesh shrines.',
    culture: 'Known as the Oxford of the East, Pune combines a rich historical Marathi heritage with a massive modern IT and automotive ecosystem.',
    festivals: ['Ganeshotsav (Pune Style)', 'Alandi Kartiki Yatra', 'Shiv Jayanti'],
    cuisine: ['Punyari Misal', 'Bakarwadi', 'Mango Mastani', 'Puran Poli'],
    bestTime: 'October to March',
    facts: {
      population: '9.4 Million',
      area: '15,643 sq km',
      famousFor: 'Maratha History, Shaniwar Wada, Bhimashankar Jyotirlinga, IT Parks',
      language: 'Marathi, English, Hindi',
      unescoSites: 'Western Ghats (Bhimashankar forest reserves)',
      rivers: 'Mutha, Mula, Indrayani, Bhima',
      temples: 'Bhimashankar Jyotirlinga, Dagadusheth Halwai Ganapati, Alandi, Dehu',
      mahakumbhConnection: 'Primary starting transit junction for pilgrims coming from southern India towards Nashik.'
    },
    coordinates: { lat: 18.5204, lng: 73.8567 },
    polygon: [
      [19.25, 73.35],
      [19.30, 73.90],
      [18.70, 74.80],
      [17.90, 74.45],
      [18.05, 73.35]
    ],
    destinations: [
      { name: 'Bhimashankar Jyotirlinga', category: 'Pilgrimage', image: '/assets/images/districts/pune-bhima.jpg', slug: 'trimbakeshwar-temple' }
    ],
    gallery: [
      { category: 'temples', url: '/assets/images/gallery/pune-bhima.jpg', title: 'Bhimashankar Sanctuary' },
      { category: 'heritage', url: '/assets/images/gallery/pune-shaniwar.jpg', title: 'Shaniwar Wada Gate' },
      { category: 'nature', url: '/assets/images/gallery/pune-ghats.jpg', title: 'Lonavala Western Ghats' }
    ]
  }
];
