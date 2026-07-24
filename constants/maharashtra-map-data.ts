/**
 * @file maharashtra-map-data.ts
 * @description Comprehensive dataset for all 36 official Maharashtra districts.
 * Used by the Explore Maharashtra interactive SVG map component.
 * Contains geographic polygon data (lat/lng pairs), rich cultural content,
 * spiritual importance, attractions, and image deck for each district.
 */

// ─────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────

export interface MHDistrictImage {
  /** Display title of the place or attraction */
  title: string;
  /** Short descriptive subtitle */
  subtitle: string;
  /** CSS linear-gradient value for the placeholder card */
  gradientStyle: string;
  /** Category label (Pilgrimage, Heritage, Nature, Culture) */
  category: string;
  /** Optional absolute URL path to local asset image file */
  imageUrl?: string;
}

export interface MHDistrict {
  /** Unique kebab-case identifier */
  id: string;
  /** Official district name */
  name: string;
  /** Short abbreviated label for SVG map overlay */
  mapLabel: string;
  /** Administrative division */
  division: string;
  /** District headquarters city */
  headquarters: string;
  /** Short introductory description */
  description: string;
  /** Unique or surprising fact about the district */
  interestingFact: string;
  /** Approximate number of temples (placeholder) */
  templeCount: number;
  /** Major tourist/pilgrimage attractions */
  majorAttractions: string[];
  /** Spiritual significance text */
  spiritualImportance: string;
  /** Nearby pilgrimage sites list */
  nearbyPilgrimageSites: string[];
  /** Image deck items for the slider */
  images: MHDistrictImage[];
  /** Geographic polygon as [lat, lng] pairs (approximate, clockwise) */
  polygon: [number, number][];
  /** Approximate centroid [lat, lng] for SVG label placement */
  labelPos: [number, number];
}

// ─────────────────────────────────────────────────────────────
// ALL 36 MAHARASHTRA DISTRICTS DATA
// ─────────────────────────────────────────────────────────────

export const MAHARASHTRA_DISTRICTS: MHDistrict[] = [

  // ══════════════════════════════════════════════
  // NASHIK DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'nandurbar',
    name: 'Nandurbar',
    mapLabel: 'Nandurbar',
    division: 'Nashik',
    headquarters: 'Nandurbar',
    description: 'A tribal-majority district in the far northwest of Maharashtra, Nandurbar is covered with dense Satpura forests, hosts ancient Bhil and Mavchi tribal cultures, and is home to the beautiful Toranmal hill station.',
    interestingFact: 'Over 70% of Nandurbar\'s population belongs to Scheduled Tribes, making it Maharashtra\'s most tribal district. The Shulpaneshwar Wildlife Sanctuary here protects the last lion-tailed macaques in Maharashtra.',
    templeCount: 48,
    majorAttractions: ['Toranmal Hill Station', 'Shulpaneshwar Wildlife Sanctuary', 'Narsinghpur Fort', 'Akkalkuwa Tribal Culture Centre'],
    spiritualImportance: 'Sacred nature temples and ancient tribal shrines revered by Bhil, Mavchi and Pavra tribal communities for centuries, honouring nature deities.',
    nearbyPilgrimageSites: ['Shulpaneshwar Mandir', 'Toranmal Giri Temple', 'Akkalkuwa Swami Swaroopanand Ashram'],
    images: [
      { title: 'Toranmal Forest Reserve', subtitle: 'Pristine tribal highlands at 1100m elevation', gradientStyle: 'linear-gradient(135deg,#064e3b,#065f46,#047857)', category: 'Nature' },
      { title: 'Adivasi Heritage Village', subtitle: 'Ancient Bhil tribal art and forest traditions', gradientStyle: 'linear-gradient(135deg,#92400e,#b45309,#d97706)', category: 'Culture' },
      { title: 'Shulpaneshwar Sanctuary', subtitle: 'Rich forest corridor on the Gujarat-Maharashtra border', gradientStyle: 'linear-gradient(135deg,#166534,#15803d,#22c55e)', category: 'Nature' },
    ],
    polygon: [[22.1,73.5],[22.1,74.9],[21.3,74.9],[21.3,73.8],[21.6,73.5]],
    labelPos: [21.7, 74.2],
  },

  {
    id: 'dhule',
    name: 'Dhule',
    mapLabel: 'Dhule',
    division: 'Nashik',
    headquarters: 'Dhule',
    description: 'Located in the historic Khandesh region on the banks of the Panzara river, Dhule is a major commercial hub known for its textile mills, ancient forts, and role as a key crossroads of Deccan trade.',
    interestingFact: 'Dhule was the capital of the powerful Khandesh Sultanate (1382-1601). During British rule, it became one of India\'s most important cotton trade centres, with goods exported worldwide.',
    templeCount: 64,
    majorAttractions: ['Laling Fort', 'Songir Fort', 'Panzara River Gardens', 'Dhule Museum'],
    spiritualImportance: 'Ancient temples and the cultural heritage of the Khandesh region, including the Shri Waman Mandir at Shirpur which draws thousands of devotees.',
    nearbyPilgrimageSites: ['Shirpur Waman Mandir', 'Amrut Mahadev Shrine', 'Sindkheda Vitthal Temple'],
    images: [
      { title: 'Laling Fort', subtitle: 'Imposing medieval fort overlooking the Panzara valley', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#475569)', category: 'Heritage' },
      { title: 'Songir Fort Panorama', subtitle: 'Hilltop Khandesh citadel with sweeping Deccan views', gradientStyle: 'linear-gradient(135deg,#292524,#44403c,#57534e)', category: 'Heritage' },
    ],
    polygon: [[21.3,73.8],[21.3,75.0],[20.7,75.0],[20.7,73.9],[21.0,73.7]],
    labelPos: [21.0, 74.4],
  },

  {
    id: 'jalgaon',
    name: 'Jalgaon',
    mapLabel: 'Jalgaon',
    division: 'Nashik',
    headquarters: 'Jalgaon',
    description: 'The "Banana Capital of India," Jalgaon sits along the Tapi river on the northern Deccan plateau, famous for its banana plantations and housing the UNESCO World Heritage Ajanta Cave Murals.',
    interestingFact: 'Jalgaon produces over 25% of India\'s total banana output. The UNESCO Ajanta Caves (2nd century BCE–6th century CE) within the district are considered the finest examples of ancient Buddhist art in the world.',
    templeCount: 82,
    majorAttractions: ['Ajanta Caves (UNESCO World Heritage)', 'Muktainagar (Sant Muktabai Temple)', 'Yawal Wildlife Sanctuary', 'Jalgaon Fort'],
    spiritualImportance: 'The Ajanta Caves are a supreme pilgrimage for Buddhists worldwide. The Muktai Temple at Muktainagar honours the 13th-century Varkari saint Muktabai.',
    nearbyPilgrimageSites: ['Ajanta Cave Temples', 'Muktainagar Muktai Mandir', 'Amalner Prasanna Ganesh Temple'],
    images: [
      { title: 'Ajanta Cave Murals', subtitle: 'UNESCO World Heritage Buddhist art from 2nd century BCE', gradientStyle: 'linear-gradient(135deg,#92400e,#b45309,#78350f)', category: 'Heritage' },
      { title: 'Banana Plantation Vista', subtitle: 'Endless green banana groves along the Tapi river', gradientStyle: 'linear-gradient(135deg,#365314,#4d7c0f,#65a30d)', category: 'Nature' },
      { title: 'Yawal Wildlife Sanctuary', subtitle: 'Rich forest corridor sheltering leopards and wolves', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
    ],
    polygon: [[21.3,75.0],[21.3,76.5],[20.6,76.5],[20.6,75.0]],
    labelPos: [20.9, 75.7],
  },

  {
    id: 'nashik',
    name: 'Nashik',
    mapLabel: 'Nashik',
    division: 'Nashik',
    headquarters: 'Nashik',
    description: 'The sacred city on the Godavari river, Nashik hosts the Simhastha Mahakumbh Mela (one of 4 Kumbh sites in India) and houses the revered Trimbakeshwar Jyotirlinga.',
    interestingFact: 'Nashik is simultaneously the "Wine Capital of India" — home to Sula Vineyards exporting to 35+ countries — and one of the most sacred Hindu cities, hosting Kumbh Mela every 12 years that draws 30+ million pilgrims.',
    templeCount: 342,
    majorAttractions: ['Trimbakeshwar Jyotirlinga', 'Ramkund Sacred Ghat', 'Sula Vineyards', 'Anjaneri Hill (Hanuman Birthplace)', 'Saptashrungi Devi Mandir'],
    spiritualImportance: 'One of the four sacred Kumbh Mela sites in India. Houses the Trimbakeshwar Jyotirlinga (one of 12) and the origin of the Godavari river.',
    nearbyPilgrimageSites: ['Trimbakeshwar Jyotirlinga', 'Saptashrungi Devi Vani', 'Nivruttinath Temple Trimbak'],
    images: [
      { title: 'Trimbakeshwar Jyotirlinga', subtitle: 'One of 12 sacred Jyotirlingas – source of the holy Godavari', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#c2410c)', category: 'Pilgrimage', imageUrl: '/assets/images/temples/trimbakeshwar.jpg' },
      { title: 'Ramkund Sacred Ghat', subtitle: 'Ancient Kumbh Mela bathing ghat on the Godavari', gradientStyle: 'linear-gradient(135deg,#1e3a5f,#1e40af,#2563eb)', category: 'Pilgrimage', imageUrl: '/assets/images/temples/ramkund.jpg' },

      { title: 'Sula Vineyards Nashik', subtitle: 'India\'s finest wine country in the Godavari valley', gradientStyle: 'linear-gradient(135deg,#4c1d95,#6d28d9,#7c3aed)', category: 'Tourism', imageUrl: '/assets/images/temples/sunset_lake.jpg' },
      { title: 'Anjaneri Hill Sunrise', subtitle: 'Sacred birthplace of Lord Hanuman, revered by millions', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', category: 'Pilgrimage', imageUrl: '/assets/images/temples/ankai_fort.jpg' },
    ],
    polygon: [[20.9,73.3],[20.9,74.7],[20.4,74.7],[19.9,74.7],[19.5,74.5],[19.4,74.0],[19.5,73.3]],
    labelPos: [20.2, 74.0],
  },

  // ══════════════════════════════════════════════
  // KONKAN DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'palghar',
    name: 'Palghar',
    mapLabel: 'Palghar',
    division: 'Konkan',
    headquarters: 'Palghar',
    description: 'Maharashtra\'s newest district (formed 2014), Palghar is a coastal gem with pristine beaches, the hilltop Jivdani Mata temple, the Portuguese-era Vasai Fort, and rich tribal Warli art heritage.',
    interestingFact: 'Palghar is home to the famed Warli tribal paintings — abstract geometric art using white on mud walls — now recognised internationally and displayed in global museums.',
    templeCount: 127,
    majorAttractions: ['Jivdani Mata Temple Virar', 'Vasai Fort (Portuguese-era)', 'Satpati Beach', 'Kelwa Beach', 'Dahanu Chikoo Farms'],
    spiritualImportance: 'Jivdani Mata of Virar is one of Maharashtra\'s most-visited Shakti shrines, perched atop a hill accessible by ropeway.',
    nearbyPilgrimageSites: ['Jivdani Temple Virar', 'Vaitarna Ganesh Shrine', 'Kacheri Gaon Durga Mandir'],
    images: [
      { title: 'Jivdani Mata Temple', subtitle: 'Hilltop Shakti shrine above Virar, accessible by ropeway', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c)', category: 'Pilgrimage' },
      { title: 'Vasai Fort Ruins', subtitle: 'Portuguese-era fort overlooking the Arabian Sea', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#475569)', category: 'Heritage' },
      { title: 'Warli Tribal Paintings', subtitle: 'Ancient geometric art of the Warli indigenous community', gradientStyle: 'linear-gradient(135deg,#451a03,#78350f,#92400e)', category: 'Culture' },
    ],
    polygon: [[20.5,72.6],[20.5,73.3],[19.5,73.3],[19.4,72.9],[20.0,72.7]],
    labelPos: [20.0, 72.95],
  },

  {
    id: 'mumbai-suburban',
    name: 'Mumbai Suburban',
    mapLabel: 'Mum. Sub.',
    division: 'Konkan',
    headquarters: 'Bandra',
    description: 'The densely populated northern extension of Greater Mumbai, Mumbai Suburban encompasses bustling Bandra, Andheri, Borivali and is home to India\'s only national park within a metropolitan city.',
    interestingFact: 'Mumbai Suburban is India\'s most densely populated district, with over 20,000 people per sq. km. in parts. It houses Sanjay Gandhi National Park — the world\'s most-visited national park inside a city.',
    templeCount: 156,
    majorAttractions: ['Sanjay Gandhi National Park', 'Kanheri Buddhist Caves (1st century BCE)', 'Bandra-Worli Sea Link', 'Essel World Gorai'],
    spiritualImportance: 'The Kanheri Buddhist Cave complex (109 caves) is a major Buddhist pilgrimage site from the 1st–9th century CE.',
    nearbyPilgrimageSites: ['Kanheri Caves Borivali', 'Mount Mary Basilica Bandra', 'Siddhivinayak Temple Prabhadevi'],
    images: [
      { title: 'Sanjay Gandhi National Park', subtitle: 'Ancient forest within the world\'s largest urban agglomeration', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
      { title: 'Kanheri Cave Monasteries', subtitle: '1st century BCE Buddhist rock-cut monasteries', gradientStyle: 'linear-gradient(135deg,#451a03,#78350f,#92400e)', category: 'Heritage' },
    ],
    polygon: [[19.45,72.82],[19.45,73.15],[19.05,73.15],[19.05,72.82]],
    labelPos: [19.25, 72.97],
  },

  {
    id: 'mumbai-city',
    name: 'Mumbai City',
    mapLabel: 'Mumbai',
    division: 'Konkan',
    headquarters: 'Mumbai',
    description: 'The financial capital of India and a global metropolis on the Arabian Sea, Mumbai City is home to UNESCO World Heritage sites, India\'s most-visited temples, and is the gateway for international pilgrims.',
    interestingFact: 'Mumbai generates approximately 6% of India\'s GDP and handles over 40% of India\'s maritime trade. The Chhatrapati Shivaji Maharaj Terminus (Victoria Terminus) is a UNESCO World Heritage site.',
    templeCount: 89,
    majorAttractions: ['Gateway of India', 'CSMT (UNESCO)', 'Elephanta Caves (UNESCO)', 'Haji Ali Dargah', 'Marine Drive'],
    spiritualImportance: 'Mumbadevi Temple (the patron goddess who gives Mumbai its name), Mahalaxmi Temple, and Siddhivinayak draw millions of devotees each week.',
    nearbyPilgrimageSites: ['Mumbadevi Mandir Fort Area', 'Mahalaxmi Temple', 'Walkeshwar Temple Malabar Hill'],
    images: [
      { title: 'Gateway of India', subtitle: 'Iconic colonial arch overlooking the Arabian Sea', gradientStyle: 'linear-gradient(135deg,#92400e,#b45309,#d97706)', category: 'Heritage' },
      { title: 'Elephanta Caves UNESCO', subtitle: '5th-6th century Shiva sculptures on Elephanta Island', gradientStyle: 'linear-gradient(135deg,#292524,#44403c,#78716c)', category: 'Heritage' },
      { title: 'Haji Ali Dargah', subtitle: 'Sufi shrine on a tidal islet in Mahim Bay', gradientStyle: 'linear-gradient(135deg,#0f4c75,#1b6ca8,#0a3d62)', category: 'Pilgrimage' },
    ],
    polygon: [[19.05,72.77],[19.05,73.0],[18.87,73.0],[18.87,72.77]],
    labelPos: [18.95, 72.87],
  },

  {
    id: 'thane',
    name: 'Thane',
    mapLabel: 'Thane',
    division: 'Konkan',
    headquarters: 'Thane',
    description: 'India\'s first railway terminus (1853) and known as the "City of Lakes," Thane is a dynamic urban district northeast of Mumbai with 33 lakes, the ancient Kopineshwar Temple, and lush Yeoor Hills.',
    interestingFact: 'Thane was the destination of India\'s first passenger train from Bombay in 1853. With 33 lakes within its boundaries, it holds the unique record of being the most lake-rich city in Maharashtra.',
    templeCount: 214,
    majorAttractions: ['Kopineshwar Mahadev Temple (400+ years old)', 'Upvan Lake', 'Yeoor Forest Hills', 'Tikuji-ni-Wadi', 'Kala Talao'],
    spiritualImportance: 'The ancient Kopineshwar Mahadev temple is one of the most important Shaiva centres in the Konkan, with a history of over 400 years.',
    nearbyPilgrimageSites: ['Kopineshwar Temple Thane', 'Ballaleshwar Ashtavinayak Pali', 'Ekvira Devi Temple Karla'],
    images: [
      { title: 'Kopineshwar Mahadev Temple', subtitle: 'Centuries-old Shiva temple in the heart of Thane city', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Pilgrimage' },
      { title: 'Thane City of Lakes', subtitle: '33 pristine lakes reflecting the Western Ghats skyline', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#075985,#0369a1)', category: 'Nature' },
      { title: 'Yeoor Forest Hills', subtitle: 'Dense jungle hiking trails minutes from Mumbai', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
    ],
    polygon: [[20.2,73.1],[20.2,73.9],[19.5,74.0],[19.2,73.7],[19.1,73.2],[19.45,73.15],[19.45,73.3],[20.2,73.3]],
    labelPos: [19.7, 73.5],
  },

  {
    id: 'raigad',
    name: 'Raigad',
    mapLabel: 'Raigad',
    division: 'Konkan',
    headquarters: 'Alibag',
    description: 'The land of Chhatrapati Shivaji Maharaj\'s imperial capital, Raigad district encompasses stunning Konkan coastline, Ashtavinayak shrines, pristine beaches, and the legendary Raigad Fort where Shivaji was crowned.',
    interestingFact: 'Raigad Fort was the capital of the Maratha Empire. Chhatrapati Shivaji Maharaj was coronated here in 1674 CE. The district is also called the "Cashew Capital" of Maharashtra.',
    templeCount: 178,
    majorAttractions: ['Raigad Fort', 'Alibaug Beach', 'Murud-Janjira Sea Fort', 'Ballaleshwar Ashtavinayak (Pali)', 'Varadvinayak Ashtavinayak (Mahad)'],
    spiritualImportance: 'Houses two Ashtavinayak Ganesh shrines (Ballaleshwar and Varadvinayak) among the eight most sacred Ganesha temples in Maharashtra.',
    nearbyPilgrimageSites: ['Ballaleshwar Pali Ashtavinayak', 'Varadvinayak Mahad Ashtavinayak', 'Raigad Jagdishwar Temple'],
    images: [
      { title: 'Raigad Fort Ropeway', subtitle: 'Shivaji Maharaj\'s legendary capital citadel at 820m altitude', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Heritage' },
      { title: 'Alibaug Kolaba Sea Fort', subtitle: 'Island sea fort off Maharashtra\'s Konkan shore', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#075985,#0284c7)', category: 'Heritage' },
      { title: 'Ballaleshwar Temple Pali', subtitle: 'Sacred Ashtavinayak Ganesh shrine in lush Konkan', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', category: 'Pilgrimage' },
    ],
    polygon: [[19.05,73.0],[19.2,73.7],[19.2,74.2],[18.0,74.2],[17.8,73.5],[17.8,73.0],[18.87,73.0]],
    labelPos: [18.6, 73.6],
  },

  {
    id: 'ratnagiri',
    name: 'Ratnagiri',
    mapLabel: 'Ratnagiri',
    division: 'Konkan',
    headquarters: 'Ratnagiri',
    description: 'The jewel of the Konkan coast, Ratnagiri is world-famous for Alphonso (Hapus) mangoes, pristine beaches, Ganpatipule\'s Swayambhu Ganesh temple, and the birthplace of Lokmanya Bal Gangadhar Tilak.',
    interestingFact: 'Ratnagiri\'s Alphonso (Hapus) mangoes hold a Geographical Indication (GI) tag and are exported to 35+ countries. Lokmanya Tilak, father of India\'s independence movement, was born at Ratnagiri in 1856.',
    templeCount: 134,
    majorAttractions: ['Ganpatipule (Swayambhu Ganapati Beach Temple)', 'Thiba Palace', 'Ratnadurg Fort', 'Pawas Ashram (Swami Swaroopanand)', 'Marleshwar Waterfalls'],
    spiritualImportance: 'The Swayambhu (self-manifested) Ganesh at Ganpatipule is an ancient shrine on a pristine beach, drawing hundreds of thousands of pilgrims annually.',
    nearbyPilgrimageSites: ['Ganpatipule Swayambhu Ganapati', 'Pawas Swaroopanand Ashram', 'Velneshwar Shiva Temple'],
    images: [
      { title: 'Ganpatipule Beach Temple', subtitle: 'Ancient Swayambhu Ganesh on an untouched Konkan shore', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Alphonso Mango Orchards', subtitle: 'GI-tagged Hapus — the undisputed King of Mangoes', gradientStyle: 'linear-gradient(135deg,#713f12,#a16207,#ca8a04)', category: 'Nature' },
      { title: 'Ratnadurg Coastal Fort', subtitle: '16th century sea fortification above the Arabian Sea', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#64748b)', category: 'Heritage' },
    ],
    polygon: [[17.8,73.0],[17.8,74.2],[16.4,74.2],[16.4,73.2],[16.9,73.0]],
    labelPos: [17.1, 73.6],
  },

  {
    id: 'sindhudurg',
    name: 'Sindhudurg',
    mapLabel: 'Sindhudurg',
    division: 'Konkan',
    headquarters: 'Oros (Sindhudurg)',
    description: 'Maharashtra\'s southernmost coastal district, Sindhudurg is renowned for the majestic sea fort built by Shivaji Maharaj, the pristine scuba beaches of Tarkarli, Amboli Hill Station, and vibrant Malvani culture.',
    interestingFact: 'Sindhudurg Fort was built directly on a rocky island in the Arabian Sea (1664–1667). It contains a unique temple with Shivaji Maharaj\'s hand and foot impressions preserved in stone — the only such temple in India.',
    templeCount: 112,
    majorAttractions: ['Sindhudurg Sea Fort (1664)', 'Tarkarli Beach & Scuba Diving', 'Amboli Hill Station', 'Malvan Marine Sanctuary', 'Sawantwadi Palace'],
    spiritualImportance: 'The Kunkeshwar Shiva temple on the Sindhudurg coast is a revered Shaiva pilgrimage site. The Sindhudurg Fort contains the only temple in India with Shivaji Maharaj\'s idol.',
    nearbyPilgrimageSites: ['Kunkeshwar Shiva Temple', 'Wagh Devi Mandir Malvan', 'Redi Ganapati Temple'],
    images: [
      { title: 'Sindhudurg Sea Fort', subtitle: 'Shivaji Maharaj\'s island fortress — built 1664–67 in the sea', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#075985,#0369a1)', category: 'Heritage' },
      { title: 'Tarkarli Scuba Coral Reefs', subtitle: 'Crystal-clear waters and coral reefs along the Karli estuary', gradientStyle: 'linear-gradient(135deg,#083344,#0e7490,#06b6d4)', category: 'Nature' },
      { title: 'Amboli Hill Station', subtitle: 'Lush Western Ghats with spectacular monsoon waterfalls', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
    ],
    polygon: [[16.4,73.2],[16.4,74.2],[15.6,74.2],[15.6,73.6],[15.8,73.2]],
    labelPos: [16.0, 73.75],
  },

  // ══════════════════════════════════════════════
  // NASHIK DIVISION (continued)
  // ══════════════════════════════════════════════

  {
    id: 'ahilyanagar',
    name: 'Ahilyanagar',
    mapLabel: 'Ahilyanagar',
    division: 'Nashik',
    headquarters: 'Ahmednagar',
    description: 'Maharashtra\'s largest district by area, Ahilyanagar (formerly Ahmednagar) is the sacred gateway to Shirdi Sai Dham and Shani Shingnapur, drawing tens of millions of pilgrims from around the world annually.',
    interestingFact: 'Shirdi receives 50,000–100,000 visitors daily — often surpassing Tirupati. The Sai Baba Temple Trust is one of India\'s wealthiest religious trusts, with annual donations exceeding ₹600 crore.',
    templeCount: 524,
    majorAttractions: ['Shirdi Sai Baba Samadhi Mandir', 'Shani Shingnapur Shrine', 'Harishchandragad Fort', 'Siddhtek Ashtavinayak', 'Ahmednagar Fort'],
    spiritualImportance: 'Shirdi is one of India\'s most sacred pilgrim destinations — the eternal samadhi of Sai Baba of Shirdi who preached "Sabka Malik Ek" (All are One God) to all faiths.',
    nearbyPilgrimageSites: ['Shirdi Sai Baba Temple', 'Shani Shingnapur Temple', 'Siddhtek Ashtavinayak Ganesh'],
    images: [
      { title: 'Shirdi Sai Baba Samadhi', subtitle: 'The marble samadhi of the universal saint — most visited in India', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Shani Shingnapur Shrine', subtitle: 'The open-roofed doorless village — a unique Shani devotion', gradientStyle: 'linear-gradient(135deg,#1e293b,#374151,#4b5563)', category: 'Pilgrimage' },
      { title: 'Ahmednagar Fort', subtitle: 'Where Nehru, Patel & Azad were imprisoned during independence movement', gradientStyle: 'linear-gradient(135deg,#1e3a5f,#1e40af,#1d4ed8)', category: 'Heritage' },
      { title: 'Siddhtek Ganapati Temple', subtitle: 'Sacred Ashtavinayak Ganesh on the Bhima river banks', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', category: 'Pilgrimage' },
    ],
    polygon: [[19.9,74.0],[19.9,75.7],[18.5,76.0],[18.3,75.2],[18.5,74.0],[19.4,74.0]],
    labelPos: [19.2, 75.0],
  },

  // ══════════════════════════════════════════════
  // PUNE DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'pune',
    name: 'Pune',
    mapLabel: 'Pune',
    division: 'Pune',
    headquarters: 'Pune',
    description: 'The cultural capital of Maharashtra and seat of the Peshwa Maratha Empire, Pune houses the grand Shaniwar Wada palace, the sacred Bhimashankar Jyotirlinga, and several Ashtavinayak Ganesh shrines.',
    interestingFact: 'Called the "Oxford of the East" for its educational density, Pune\'s Shaniwar Wada was the administrative capital of the Maratha Confederacy that controlled most of the Indian subcontinent at its peak.',
    templeCount: 487,
    majorAttractions: ['Bhimashankar Jyotirlinga', 'Shaniwar Wada Palace', 'Dagadusheth Halwai Ganesh', 'Alandi (Dnyaneshwar Samadhi)', 'Dehu (Tukaram Mandir)'],
    spiritualImportance: 'Home to Bhimashankar Jyotirlinga, sacred Ashtavinayak temples, and the samadhi shrines of beloved Varkari poet-saints Dnyaneshwar and Tukaram.',
    nearbyPilgrimageSites: ['Bhimashankar Jyotirlinga', 'Morgaon Mayureshwar Ashtavinayak', 'Alandi Dnyaneshwar Samadhi', 'Dehu Tukaram Mandir'],
    images: [
      { title: 'Bhimashankar Jyotirlinga', subtitle: 'Ancient Shiva temple in the pristine Western Ghats forest', gradientStyle: 'linear-gradient(135deg,#78350f,#c2410c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Shaniwar Wada Palace', subtitle: 'Grand Peshwa palace — seat of the Maratha Confederacy', gradientStyle: 'linear-gradient(135deg,#713f12,#a16207,#b45309)', category: 'Heritage' },
      { title: 'Dagadusheth Ganapati', subtitle: 'Beloved Pune Ganapati — one of Maharashtra\'s most revered', gradientStyle: 'linear-gradient(135deg,#7c2d12,#dc2626,#ef4444)', category: 'Pilgrimage' },
      { title: 'Alandi Dnyaneshwar Shrine', subtitle: 'Samadhi of saint-poet Dnyaneshwar on the Indrayani river', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Pilgrimage' },
    ],
    polygon: [[19.2,73.3],[19.4,74.0],[19.0,74.1],[18.5,75.1],[17.8,75.2],[17.9,73.5],[18.3,73.3]],
    labelPos: [18.7, 74.0],
  },

  {
    id: 'satara',
    name: 'Satara',
    mapLabel: 'Satara',
    division: 'Pune',
    headquarters: 'Satara',
    description: 'The heart of the Maratha homeland, Satara was the Maratha Empire\'s capital under Chhatrapati Shahu Maharaj. Famous for Mahabaleshwar\'s hill stations, the Kaas Plateau (UNESCO World Heritage), and Sajjangad Fort.',
    interestingFact: 'Kaas Plateau ("Maharashtra\'s Valley of Flowers") is a UNESCO World Heritage site that blooms with over 850 species of flowers in September. The district\'s Sajjangad Fort is the samadhi of Samartha Ramdas Swami, Shivaji\'s spiritual guru.',
    templeCount: 218,
    majorAttractions: ['Mahabaleshwar Hill Station', 'Kaas Plateau (UNESCO — Valley of Flowers)', 'Pratapgad Fort', 'Sajjangad (Ramdas Swami Samadhi)', 'Panchgani'],
    spiritualImportance: 'Sajjangad Fort is the samadhi of Samartha Ramdas Swami, the spiritual guru of Chhatrapati Shivaji Maharaj, drawing thousands of pilgrims.',
    nearbyPilgrimageSites: ['Sajjangad Ramdas Swami Samadhi', 'Mahuli Vitthal Temple', 'Shri Kshettra Wai Ganesh'],
    images: [
      { title: 'Kaas Plateau Wildflowers', subtitle: 'UNESCO Valley of Flowers — 850+ species bloom every September', gradientStyle: 'linear-gradient(135deg,#701a75,#a21caf,#d946ef)', category: 'Nature' },
      { title: 'Pratapgad Fort', subtitle: 'Where Shivaji slew Afzal Khan in the legendary battle of 1659', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#475569)', category: 'Heritage' },
      { title: 'Mahabaleshwar Plateau', subtitle: 'Origin of 5 rivers atop the Western Ghats at 1372m', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#15803d)', category: 'Nature' },
    ],
    polygon: [[17.9,73.5],[17.8,75.2],[17.2,75.3],[17.0,74.9],[17.0,73.6]],
    labelPos: [17.5, 74.4],
  },

  {
    id: 'sangli',
    name: 'Sangli',
    mapLabel: 'Sangli',
    division: 'Pune',
    headquarters: 'Sangli',
    description: 'Known as the "Turmeric City," Sangli controls nearly 30% of India\'s turmeric trade, rests on the Krishna river, and is renowned for Hindustani classical music traditions and the revered Narsobachi Wadi Datta shrine.',
    interestingFact: 'Sangli produces 30% of India\'s turmeric. The legendary classical vocalist Pandit Kumar Gandharva hailed from Sangli. The district\'s Narsobachi Wadi is one of the most sacred Datta (Dattatreya) pilgrimage sites in India.',
    templeCount: 167,
    majorAttractions: ['Narsobachi Wadi (Datta Mandir)', 'Sangli Palace', 'Audumbar Datta Temple', 'Miraj Palace & Music Tradition'],
    spiritualImportance: 'Narsobachi Wadi at the confluence of the Krishna and Panchaganga rivers is one of the holiest Datta pilgrimage sites in Maharashtra, receiving lakhs of devotees.',
    nearbyPilgrimageSites: ['Narsobachi Wadi Datta Mandir', 'Audumbar Datta Peeth', 'Khandoba Temple Jejuri (nearby)'],
    images: [
      { title: 'Narsobachi Wadi', subtitle: 'Sacred Datta shrine at the Krishna-Panchaganga confluence', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Sangli Turmeric Markets', subtitle: 'Asia\'s largest turmeric wholesale market — 30% of India\'s trade', gradientStyle: 'linear-gradient(135deg,#713f12,#a16207,#ca8a04)', category: 'Culture' },
    ],
    polygon: [[17.0,73.8],[17.0,75.3],[16.7,75.4],[16.5,75.0],[16.7,73.8]],
    labelPos: [16.85, 74.6],
  },

  {
    id: 'kolhapur',
    name: 'Kolhapur',
    mapLabel: 'Kolhapur',
    division: 'Pune',
    headquarters: 'Kolhapur',
    description: 'The cultural powerhouse of western Maharashtra, Kolhapur is famed for the Mahalaxmi Ambabai Temple (primary Shakti Pitha), Kolhapuri leather chappals, traditional wrestling (kusti), and fiery Kolhapuri cuisine.',
    interestingFact: 'The Mahalaxmi (Ambabai) temple at Kolhapur is mentioned in the ancient Devi Bhagavata Purana as one of the primary Shakti Pithas. The Kolhapuri chappal has a 2000-year history and holds a GI (Geographical Indication) tag.',
    templeCount: 294,
    majorAttractions: ['Mahalaxmi Ambabai Temple (Shakti Pitha)', 'New Palace Museum', 'Rankala Lake', 'Panhala Fort', 'Radhanagari Wildlife Sanctuary'],
    spiritualImportance: 'Mahalaxmi Ambabai at Kolhapur is one of the most sacred Shakti Pithas in India. The temple has the rare distinction of receiving divine sunlight directly on the deity idol twice a year.',
    nearbyPilgrimageSites: ['Mahalaxmi Temple Kolhapur', 'Jotiba Temple Wadi Ratnagiri (Kolhapur)', 'Siddhagiri Math Kaneri'],
    images: [
      { title: 'Mahalaxmi Ambabai Temple', subtitle: 'Ancient Shakti Pitha — one of the most sacred goddess shrines in India', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#991b1b,#dc2626)', category: 'Pilgrimage' },
      { title: 'Panhala Fort Ramparts', subtitle: 'Massive hilltop fort — headquarters of Adil Shahi rulers', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#475569)', category: 'Heritage' },
      { title: 'Kolhapuri Chappal Craft', subtitle: 'GI-tagged leather footwear with 2000-year artisan tradition', gradientStyle: 'linear-gradient(135deg,#451a03,#78350f,#92400e)', category: 'Culture' },
    ],
    polygon: [[16.7,73.8],[16.5,75.0],[16.0,75.1],[15.6,74.5],[15.6,74.0],[15.8,73.8],[16.4,73.8]],
    labelPos: [16.2, 74.3],
  },

  {
    id: 'solapur',
    name: 'Solapur',
    mapLabel: 'Solapur',
    division: 'Pune',
    headquarters: 'Solapur',
    description: 'A major city on the Deccan plateau, Solapur is Maharashtra\'s handloom capital producing iconic Chaddar and Terry Towels, and houses the spiritual capital of Maharashtra — the Pandharpur Vitthal-Rukmini Temple.',
    interestingFact: 'The Vari (Wari) pilgrimage to Pandharpur Vitthal Temple in Solapur is one of the world\'s largest walking pilgrimages — with 2 million walkers (Warkaris) converging twice annually since the 13th century CE.',
    templeCount: 189,
    majorAttractions: ['Pandharpur Vitthal-Rukmini Temple', 'Tuljapur Bhavani Mata', 'Akkalkot Swami Samarth Math', 'Siddheshwar Temple', 'Solapur Fort'],
    spiritualImportance: 'Pandharpur is considered the spiritual capital of Maharashtra — the seat of Lord Vitthal (Vithoba), patron deity of the Varkari movement, worshipped for over 1000 years.',
    nearbyPilgrimageSites: ['Pandharpur Vitthal Mandir', 'Tuljapur Bhavani Mata Temple', 'Akkalkot Swami Samarth Math'],
    images: [
      { title: 'Pandharpur Vitthal Temple', subtitle: 'Spiritual capital of Maharashtra — 1000-year Warkari devotion', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Tuljapur Bhavani Mata', subtitle: 'Kuldevata (clan deity) of Shivaji Maharaj — fierce Shakti shrine', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Akkalkot Swami Math', subtitle: 'Revered Datta pilgrimage in Solapur — draws millions annually', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Pilgrimage' },
    ],
    polygon: [[18.5,75.2],[18.5,76.5],[17.2,76.5],[17.0,76.0],[17.2,75.3],[18.3,75.2]],
    labelPos: [17.8, 76.0],
  },

  // ══════════════════════════════════════════════
  // AURANGABAD (MARATHWADA) DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'chhatrapati-sambhajinagar',
    name: 'Chh. Sambhajinagar',
    mapLabel: 'CSN',
    division: 'Aurangabad',
    headquarters: 'Chh. Sambhajinagar',
    description: 'Renamed in 2023, Chhatrapati Sambhajinagar (formerly Aurangabad) is the "City of Gates" — gateway to UNESCO Ellora Caves, Bibi Ka Maqbara (Taj of the Deccan), and the Grishneshwar Jyotirlinga.',
    interestingFact: 'Bibi Ka Maqbara in CSN is called the "Taj of the Deccan" — built in 1679 by Mughal prince Azam Shah as a near-replica of the Taj Mahal for his mother Rabia-ud-Daurani.',
    templeCount: 267,
    majorAttractions: ['Ellora Caves (UNESCO)', 'Grishneshwar Jyotirlinga', 'Bibi Ka Maqbara', 'Daulatabad Fort', 'Aurangabad Caves'],
    spiritualImportance: 'Grishneshwar is the last of the 12 sacred Jyotirlingas of Lord Shiva. The Ellora Caves contain Hindu, Buddhist, and Jain masterpieces carved between 5th–11th century CE.',
    nearbyPilgrimageSites: ['Grishneshwar Jyotirlinga Verul', 'Ellora Cave Temples', 'Khultabad Ziyarat Dargah'],
    images: [
      { title: 'Ellora Caves UNESCO', subtitle: 'Hindu, Buddhist & Jain cave temples from 5th–11th century', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Heritage' },
      { title: 'Grishneshwar Jyotirlinga', subtitle: 'The 12th and last sacred Jyotirlinga of Lord Shiva', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Bibi Ka Maqbara', subtitle: '"Taj of the Deccan" — Mughal masterpiece built 1679', gradientStyle: 'linear-gradient(135deg,#e2e8f0,#cbd5e1,#94a3b8)', category: 'Heritage' },
      { title: 'Daulatabad Fort', subtitle: 'Impregnable hilltop citadel once named capital of all India', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#475569)', category: 'Heritage' },
    ],
    polygon: [[20.4,74.7],[20.5,76.1],[19.5,76.3],[19.4,75.6],[19.6,74.7]],
    labelPos: [20.0, 75.4],
  },

  {
    id: 'jalna',
    name: 'Jalna',
    mapLabel: 'Jalna',
    division: 'Aurangabad',
    headquarters: 'Jalna',
    description: 'A trading hub on the Marathwada plateau, Jalna is India\'s certified seed capital and an ancient Yadava dynasty town. It\'s connected to Aurangabad\'s heritage circuit and has important local shrines.',
    interestingFact: 'Jalna is India\'s top producer of certified agricultural seeds (cotton, soybean), supplying a major portion of India\'s farming needs. The town was an important Yadava and later Mughal administrative garrison.',
    templeCount: 89,
    majorAttractions: ['Jalna Fort', 'Ghansavangi Saptashrungi Devi', 'Ambad Fort', 'Pipla Ganapati Temple'],
    spiritualImportance: 'Ghansavangi Saptashrungi Devi is an important regional goddess shrine connected to the Nashik Saptashrungi tradition.',
    nearbyPilgrimageSites: ['Ghansavangi Saptashrungi Devi', 'Ambad Yogeshwar Temple', 'Jalna Vitthal Mandir'],
    images: [
      { title: 'Jalna Fort', subtitle: 'Historical stronghold of the Marathwada plateau', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#64748b)', category: 'Heritage' },
      { title: 'Marathwada Seed Farms', subtitle: 'India\'s certified seed heartland — cotton and soybean', gradientStyle: 'linear-gradient(135deg,#365314,#4d7c0f,#65a30d)', category: 'Nature' },
    ],
    polygon: [[20.5,75.9],[20.5,76.8],[19.7,76.8],[19.5,76.3],[20.2,76.1]],
    labelPos: [20.1, 76.35],
  },

  {
    id: 'beed',
    name: 'Beed',
    mapLabel: 'Beed',
    division: 'Aurangabad',
    headquarters: 'Beed',
    description: 'An agricultural Marathwada district known for sugarcane cultivation, Beed is home to the Parli Vaijnath Jyotirlinga — one of the 12 most sacred Shiva shrines in India.',
    interestingFact: 'Parli Vaijnath in Beed houses one of the 12 Jyotirlingas. Beed also has one of the highest seasonal labour migration rates in Maharashtra, with hundreds of thousands of workers migrating for sugarcane harvesting.',
    templeCount: 143,
    majorAttractions: ['Parli Vaijnath Jyotirlinga', 'Kaij Vitthal Temple', 'Beed Fort', 'Ambajogai Yogeshwari Devi'],
    spiritualImportance: 'Parli Vaijnath Jyotirlinga is one of the 12 most sacred Shiva shrines in India, drawing millions of pilgrims annually, especially on Mahashivaratri.',
    nearbyPilgrimageSites: ['Parli Vaijnath Jyotirlinga', 'Ambajogai Yogeshwari Temple', 'Kaij Vitthal Mandir'],
    images: [
      { title: 'Parli Vaijnath Jyotirlinga', subtitle: 'One of India\'s 12 sacred Jyotirlingas — revered for millennia', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Marathwada Sugarcane Fields', subtitle: 'Golden sugarcane harvest across the Deccan plateau', gradientStyle: 'linear-gradient(135deg,#365314,#4d7c0f,#65a30d)', category: 'Nature' },
    ],
    polygon: [[19.5,75.6],[19.5,76.5],[18.5,76.5],[18.3,75.8],[18.5,75.3],[19.0,75.3]],
    labelPos: [19.0, 76.0],
  },

  {
    id: 'parbhani',
    name: 'Parbhani',
    mapLabel: 'Parbhani',
    division: 'Aurangabad',
    headquarters: 'Parbhani',
    description: 'Located on the Purna river in Marathwada, Parbhani is the birthplace of Sant Namdev — the beloved 13th-century bhakti poet-saint whose compositions appear in the Sikh Guru Granth Sahib.',
    interestingFact: 'Parbhani is the birthplace of Sant Namdev (1270–1350 CE) — whose works are included in the Guru Granth Sahib of Sikhism, making him a saint revered by both Hindus and Sikhs.',
    templeCount: 98,
    majorAttractions: ['Narsi Namdev (Sant Namdev Birthplace)', 'Parbhani Fort', 'Jintur Fort', 'Gangakhed Vitthal Temple'],
    spiritualImportance: 'Narsi Namdev is sacred as the birthplace of Sant Namdev — whose bhakti poetry is enshrined in the Sikh Guru Granth Sahib, representing the unity of Hindu and Sikh spirituality.',
    nearbyPilgrimageSites: ['Narsi Namdev Birth Site', 'Gangakhed Vitthal Mandir', 'Parbhani Datta Mandir'],
    images: [
      { title: 'Narsi Namdev Shrine', subtitle: 'Birthplace of bhakti saint revered in both Hinduism & Sikhism', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Parbhani Fort', subtitle: 'Historical fortification overlooking the Purna river', gradientStyle: 'linear-gradient(135deg,#1e293b,#374151,#4b5563)', category: 'Heritage' },
    ],
    polygon: [[20.2,76.1],[20.2,77.4],[19.0,77.4],[19.0,76.5],[19.7,76.5],[19.7,76.1]],
    labelPos: [19.6, 76.85],
  },

  {
    id: 'hingoli',
    name: 'Hingoli',
    mapLabel: 'Hingoli',
    division: 'Aurangabad',
    headquarters: 'Hingoli',
    description: 'A small but spiritually significant Marathwada district, Hingoli is home to the ancient Aundha Nagnath Jyotirlinga — believed to be the very first Jyotirlinga established by Lord Shiva.',
    interestingFact: 'Aundha Nagnath in Hingoli is traditionally considered the very first Jyotirlinga among the 12 sacred Shiva shrines. The temple is a 13th-century Hemadpanthi architecture masterpiece.',
    templeCount: 76,
    majorAttractions: ['Aundha Nagnath Jyotirlinga', 'Basmat Fort', 'Kalamnuri Devi Temple', 'Kund Fort'],
    spiritualImportance: 'Aundha Nagnath is one of the 12 Jyotirlingas — traditionally considered the oldest, representing the Adisha (primordial) form of Lord Shiva.',
    nearbyPilgrimageSites: ['Aundha Nagnath Jyotirlinga', 'Kalamnuri Devi Mandir', 'Hingoli Vitthal Mandir'],
    images: [
      { title: 'Aundha Nagnath Jyotirlinga', subtitle: 'Believed to be the first established Jyotirlinga of Lord Shiva', gradientStyle: 'linear-gradient(135deg,#7c2d12,#b91c1c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Hemadpanthi Temple Architecture', subtitle: '13th-century Yadava dynasty stone temple craftsmanship', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Heritage' },
    ],
    polygon: [[20.2,77.0],[20.2,77.9],[19.5,77.9],[19.5,77.0],[20.0,77.0]],
    labelPos: [19.85, 77.45],
  },

  {
    id: 'dharashiv',
    name: 'Dharashiv',
    mapLabel: 'Dharashiv',
    division: 'Aurangabad',
    headquarters: 'Dharashiv',
    description: 'Renamed Dharashiv in 2023 from Osmanabad, this Marathwada agricultural district contains the ancient Dharashiva Buddhist caves (5th-6th century CE), the Ter archaeological site, and the impressive Naldurg Fort.',
    interestingFact: 'The Dharashiva caves predate the Ellora Caves and are rare 5th-6th century Buddhist rock-cut temples in Marathwada. The district was renamed from Osmanabad to its pre-Islamic historical name Dharashiv.',
    templeCount: 87,
    majorAttractions: ['Dharashiva Buddhist Caves (5th century)', 'Ter Archaeological Site', 'Naldurg Fort', 'Tuljapur Bhavani Mata'],
    spiritualImportance: 'The Dharashiva Buddhist caves represent early monastic heritage. Nearby Tuljapur Bhavani Mata (Solapur) is one of Maharashtra\'s most powerful Shakti shrines.',
    nearbyPilgrimageSites: ['Tuljapur Bhavani Mata Temple', 'Naldurg Fort Mosque & Temples', 'Ter Temple Complex'],
    images: [
      { title: 'Dharashiva Buddhist Caves', subtitle: '5th-6th century Buddhist rock-cut cave temples', gradientStyle: 'linear-gradient(135deg,#451a03,#78350f,#92400e)', category: 'Heritage' },
      { title: 'Naldurg Fort', subtitle: 'Impressive Bidar Sultanate fort guarding the Bori river', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#4b5563)', category: 'Heritage' },
    ],
    polygon: [[18.3,75.8],[18.5,76.5],[17.5,76.8],[17.2,76.5],[17.2,75.8],[17.8,75.6]],
    labelPos: [17.85, 76.2],
  },

  {
    id: 'latur',
    name: 'Latur',
    mapLabel: 'Latur',
    division: 'Aurangabad',
    headquarters: 'Latur',
    description: 'A resilient Marathwada district that rebuilt itself after the devastating 1993 earthquake, Latur today is known for its educational institutions, soybean farming, historic forts, and the nearby Udgir city.',
    interestingFact: 'The 1993 Latur earthquake (magnitude 6.2) was one of India\'s worst, killing 10,000+ people. Today Latur stands as a model of resilience, with a per capita density of engineering colleges among the highest in Maharashtra.',
    templeCount: 94,
    majorAttractions: ['Udgir Fort', 'Ausa Fort', 'Kandhar Fort', '1993 Earthquake Memorial Museum'],
    spiritualImportance: 'The Chandramauleshwar temple is an important local Shaiva shrine. Udgir has historic dargahs and temples representing Marathwada\'s communal harmony tradition.',
    nearbyPilgrimageSites: ['Chandramauleshwar Temple Latur', 'Udgir Datta Temple', 'Ausa Durga Mandir'],
    images: [
      { title: 'Udgir Fort', subtitle: 'Powerful Bidar Sultanate fort with ancient cannons', gradientStyle: 'linear-gradient(135deg,#1e3a5f,#1e40af,#1d4ed8)', category: 'Heritage' },
      { title: 'Latur Resilience Story', subtitle: 'Symbol of Maharashtra\'s remarkable recovery from 1993 earthquake', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Culture' },
    ],
    polygon: [[18.5,76.5],[18.5,77.6],[17.5,77.6],[17.5,76.8]],
    labelPos: [18.0, 77.1],
  },

  {
    id: 'nanded',
    name: 'Nanded',
    mapLabel: 'Nanded',
    division: 'Aurangabad',
    headquarters: 'Nanded',
    description: 'One of the five Takhts (seats of authority) of Sikhism, Nanded is a sacred city on the Godavari river and home to Hazur Sahib — where Guru Gobind Singh Ji attained eternal peace in 1708 CE.',
    interestingFact: 'Hazur Sahib at Nanded is one of the five Takhts of Sikhism. Every year, hundreds of thousands of Sikh pilgrims travel from across the world. Mahur Renuka Mata in Nanded is also one of the primary Shakti Pithas (Devi Bhagavata Pitha).',
    templeCount: 312,
    majorAttractions: ['Hazur Sahib (Sikh Takht)', 'Mahur Renuka Mata Temple (Shakti Pitha)', 'Nanded Fort', 'Kandhar Fort'],
    spiritualImportance: 'Hazur Sahib is Sikhism\'s holiest Takht — where Guru Gobind Singh Ji passed the Guruship to Guru Granth Sahib Eternal in 1708. Mahur Renuka Mata is a primary Shakti Pitha.',
    nearbyPilgrimageSites: ['Hazur Sahib Nanded Takht', 'Mahur Renuka Mata Temple', 'Kandhar Fort Devi Mandir'],
    images: [
      { title: 'Hazur Sahib Takht Nanded', subtitle: 'Sikh Takht where Guru Gobind Singh Ji attained liberation in 1708', gradientStyle: 'linear-gradient(135deg,#713f12,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Mahur Renuka Mata', subtitle: 'Primary Shakti Pitha on Sahyadri ranges — Devi Bhagavata Pitha', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Godavari Ghats Nanded', subtitle: 'Sacred Godavari river bathing ghats and evening aarti', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#075985,#0284c7)', category: 'Pilgrimage' },
    ],
    polygon: [[19.0,77.0],[19.0,78.4],[17.8,78.4],[17.5,77.6],[18.5,77.4],[18.5,77.0]],
    labelPos: [18.4, 77.8],
  },

  // ══════════════════════════════════════════════
  // AMRAVATI DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'buldhana',
    name: 'Buldhana',
    mapLabel: 'Buldhana',
    division: 'Amravati',
    headquarters: 'Buldhana',
    description: 'A Vidarbha district known for the unique Lonar Crater Lake — Asia\'s only hyper-saline meteorite impact crater (50,000 years old), the Shegaon Gajanan Maharaj pilgrimage centre, and cotton cultivation.',
    interestingFact: 'Lonar Crater Lake in Buldhana is Asia\'s only hyper-saline impact crater lake, formed 50,000 years ago by a meteorite. Its alkaline water (pH 10.5) supports extremophile microorganisms found nowhere else on Earth.',
    templeCount: 108,
    majorAttractions: ['Lonar Crater Lake (UNESCO Geoheritage)', 'Daitya Sudan Vishnu Temple (8th century, in crater)', 'Shegaon Gajanan Maharaj Sansthan', 'Mehkar Balaji Temple'],
    spiritualImportance: 'The Daitya Sudan Temple inside the Lonar crater is an 8th-century Vishnu shrine. Shegaon Gajanan Maharaj is among Maharashtra\'s most visited saint shrines.',
    nearbyPilgrimageSites: ['Lonar Daitya Sudan Temple', 'Shegaon Gajanan Maharaj (Akola nearby)', 'Mehkar Balaji Mandir'],
    images: [
      { title: 'Lonar Crater Lake', subtitle: 'Asia\'s only hyper-saline meteorite impact crater — 50,000 years old', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)', category: 'Nature' },
      { title: 'Daitya Sudan Temple Inside Crater', subtitle: '8th century Vishnu shrine within the ancient meteorite crater', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Heritage' },
    ],
    polygon: [[21.3,76.0],[21.3,77.2],[20.5,77.2],[20.3,76.5],[20.5,76.0]],
    labelPos: [20.9, 76.6],
  },

  {
    id: 'akola',
    name: 'Akola',
    mapLabel: 'Akola',
    division: 'Amravati',
    headquarters: 'Akola',
    description: 'The commercial hub of Vidarbha and Maharashtra\'s "White Gold City" (cotton capital), Akola is also home to the Shegaon Gajanan Maharaj pilgrimage centre — one of Maharashtra\'s most-visited saint shrines.',
    interestingFact: 'Akola\'s Shegaon Gajanan Maharaj Sansthan receives over 5 million pilgrims annually and is one of the wealthiest religious trusts in Vidarbha. The district also has the Narnala Fort — a major Mughal-era hilltop fortress.',
    templeCount: 134,
    majorAttractions: ['Shegaon Gajanan Maharaj Sansthan', 'Narnala Fort', 'Wan Wildlife Sanctuary', 'Akola Fort'],
    spiritualImportance: 'Shegaon Gajanan Maharaj is one of Maharashtra\'s most beloved saint-shrines. Sant Gajanan Maharaj (1878–1910) is revered as a powerful spiritual master across Maharashtra and beyond.',
    nearbyPilgrimageSites: ['Shegaon Gajanan Maharaj Temple', 'Akola Rajrajeshwar Mandir', 'Murtizapur Balaji Temple'],
    images: [
      { title: 'Shegaon Gajanan Maharaj', subtitle: 'One of Maharashtra\'s most beloved saint shrines — 5M+ annual visitors', gradientStyle: 'linear-gradient(135deg,#78350f,#c2410c,#ea580c)', category: 'Pilgrimage' },
      { title: 'Narnala Fort', subtitle: 'Magnificent Mughal-era hilltop fort complex in Akola', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#64748b)', category: 'Heritage' },
    ],
    polygon: [[21.3,77.0],[21.3,78.0],[20.5,78.0],[20.5,77.2],[21.0,77.2]],
    labelPos: [20.9, 77.5],
  },

  {
    id: 'washim',
    name: 'Washim',
    mapLabel: 'Washim',
    division: 'Amravati',
    headquarters: 'Washim',
    description: 'A small Vidarbha district, Washim was known in ancient India as Vatsagulma — capital of the powerful Vakataka dynasty (3rd–5th century CE), and is home to the revered Vyankatesh (Balaji) temple at Karanja Lad.',
    interestingFact: 'Washim town (ancient Vatsagulma) was the capital of the Vakataka dynasty, the same dynasty that patronised the Ajanta Cave paintings and built some of India\'s finest early temples.',
    templeCount: 67,
    majorAttractions: ['Vyankatesh Temple Karanja Lad', 'Washim Fort', 'Mahalaxmi Temple Washim', 'Vakataka Heritage Site'],
    spiritualImportance: 'Vyankatesh Temple at Karanja is an important Vaishnava centre in Vidarbha, drawing thousands of devotees from across the region.',
    nearbyPilgrimageSites: ['Vyankatesh Temple Karanja Lad', 'Akola Shegaon (nearby)', 'Washim Datta Mandir'],
    images: [
      { title: 'Vyankatesh Temple Karanja', subtitle: 'Revered Balaji shrine drawing pilgrims from across Vidarbha', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Pilgrimage' },
      { title: 'Vakataka Heritage Landscape', subtitle: 'Ancient 4th century CE dynasty capital on the black cotton plateau', gradientStyle: 'linear-gradient(135deg,#451a03,#78350f,#92400e)', category: 'Heritage' },
    ],
    polygon: [[20.5,77.2],[20.5,78.0],[19.9,78.0],[19.7,77.5],[19.7,77.2]],
    labelPos: [20.2, 77.6],
  },

  {
    id: 'amravati',
    name: 'Amravati',
    mapLabel: 'Amravati',
    division: 'Amravati',
    headquarters: 'Amravati',
    description: 'The historic capital of the Vidarbha region, Amravati is known for Ambadevi Mata Temple (the city\'s patron goddess), Melghat Tiger Reserve, and Chikhaldara — Maharashtra\'s only coffee-growing hill station.',
    interestingFact: 'Melghat Tiger Reserve was established in 1974 as one of India\'s first 9 tiger reserves under Project Tiger. Amravati is the birthplace of Pandit Jawaharlal Nehru\'s prison diary and has a rich freedom movement history.',
    templeCount: 198,
    majorAttractions: ['Melghat Tiger Reserve', 'Chikhaldara Hill Station (Maharashtra\'s only coffee hills)', 'Ambadevi Mata Temple', 'Amravati Museum'],
    spiritualImportance: 'Ambadevi Mata is the patron goddess giving Amravati its ancient name. Chikhaldara\'s hills are sacred to local Korku tribal communities.',
    nearbyPilgrimageSites: ['Ambadevi Mata Temple Amravati', 'Chikhaldara Devi Mandir', 'Anjansain Hanuman Mandir'],
    images: [
      { title: 'Melghat Tiger Reserve', subtitle: 'One of India\'s first Project Tiger reserves — Bengal Tigers in Satpura', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
      { title: 'Ambadevi Mata Temple', subtitle: 'City\'s patron goddess — gives Amravati its ancient name', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#991b1b,#dc2626)', category: 'Pilgrimage' },
      { title: 'Chikhaldara Coffee Hills', subtitle: 'Maharashtra\'s only coffee plantation hill station at 1118m', gradientStyle: 'linear-gradient(135deg,#065f46,#047857,#059669)', category: 'Nature' },
    ],
    polygon: [[21.3,77.8],[21.5,78.5],[20.5,78.5],[20.5,78.0],[21.0,78.0]],
    labelPos: [21.0, 78.15],
  },

  {
    id: 'yavatmal',
    name: 'Yavatmal',
    mapLabel: 'Yavatmal',
    division: 'Amravati',
    headquarters: 'Yavatmal',
    description: 'A large Vidarbha district along the Wardha and Penganga rivers, Yavatmal is primarily an agricultural cotton-growing district with significant ecological importance — Tipeshwar Wildlife Sanctuary shelters tigers.',
    interestingFact: 'Yavatmal is one of Maharashtra\'s top cotton-growing districts. Tipeshwar Wildlife Sanctuary in Yavatmal is a critical tiger corridor connecting the Tadoba-Andhari, Melghat, and Navegaon reserves.',
    templeCount: 112,
    majorAttractions: ['Tipeshwar Wildlife Sanctuary (Tiger Reserve)', 'Ghodazari Lake', 'Bor Wildlife Reserve', 'Wani Vitthal Temple'],
    spiritualImportance: 'Mahalaxmi Temple at Yavatmal is an important local Shakti shrine. The Wani Vitthal Mandir draws Warkari pilgrims during Ashadhi and Kartiki Ekadashi.',
    nearbyPilgrimageSites: ['Yavatmal Mahalaxmi Temple', 'Wani Vitthal Mandir', 'Pusad Vitthal Temple'],
    images: [
      { title: 'Tipeshwar Tiger Sanctuary', subtitle: 'Critical tiger corridor connecting Tadoba and Melghat reserves', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#15803d)', category: 'Nature' },
      { title: 'Ghodazari Lake Sunrise', subtitle: 'Pristine reservoir mirroring the vast Vidarbha sky', gradientStyle: 'linear-gradient(135deg,#0c4a6e,#075985,#0369a1)', category: 'Nature' },
    ],
    polygon: [[20.5,77.8],[20.5,79.0],[19.5,79.0],[19.5,77.8]],
    labelPos: [20.0, 78.4],
  },

  // ══════════════════════════════════════════════
  // NAGPUR DIVISION
  // ══════════════════════════════════════════════

  {
    id: 'wardha',
    name: 'Wardha',
    mapLabel: 'Wardha',
    division: 'Nagpur',
    headquarters: 'Wardha',
    description: 'The spiritual home of Mahatma Gandhi\'s Sevagram Ashram, Wardha is a sacred district at the heart of Vidarbha. Gandhi chose Wardha as the nerve centre of his constructive programme and ashram movement from 1936.',
    interestingFact: 'Mahatma Gandhi established Sevagram Ashram at Wardha in 1936, making it the functional capital of India\'s independence movement. Gandhi\'s historic correspondence and most pivotal decisions were made here.',
    templeCount: 89,
    majorAttractions: ['Sevagram Ashram (Mahatma Gandhi)', 'Pavnar Ashram (Vinoba Bhave)', 'Magan Sangrahalaya (Khadi Museum)', 'Wardha Gandhi Museum'],
    spiritualImportance: 'Sevagram Ashram embodies Gandhian values of Satya (truth) and Ahimsa (non-violence). Pavnar Ashram continues Vinoba Bhave\'s Bhoodan (land-gift) movement spiritual traditions.',
    nearbyPilgrimageSites: ['Sevagram Gandhi Ashram', 'Pavnar Vinoba Bhave Ashram', 'Wardha Datta Mandir'],
    images: [
      { title: 'Sevagram Gandhi Ashram', subtitle: 'Mahatma Gandhi\'s home — nerve centre of India\'s independence movement', gradientStyle: 'linear-gradient(135deg,#78350f,#92400e,#b45309)', category: 'Heritage' },
      { title: 'Pavnar Vinoba Bhave Ashram', subtitle: 'Centre of the Bhoodan land-gift movement on the Wardha river', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#15803d)', category: 'Heritage' },
    ],
    polygon: [[21.0,78.5],[21.0,79.4],[20.3,79.4],[20.3,78.5]],
    labelPos: [20.65, 78.95],
  },

  {
    id: 'nagpur',
    name: 'Nagpur',
    mapLabel: 'Nagpur',
    division: 'Nagpur',
    headquarters: 'Nagpur',
    description: 'The "Orange City" and Winter Capital of Maharashtra, Nagpur is the geographic centre of India, home to Deekshabhoomi (where Ambedkar converted to Buddhism in 1956), the ancient Ramtek temple, and the finest Nagpuri oranges.',
    interestingFact: 'Nagpur is the exact geographic centre of India — a Zero Mile Stone marks this spot. It is the global headquarters of the RSS and the location of Deekshabhoomi, where 500,000 Dalits converted to Buddhism on 14th October 1956.',
    templeCount: 276,
    majorAttractions: ['Deekshabhoomi (Buddhist Pilgrimage)', 'Ramtek Rama Temple', 'Dragon Palace Buddhist Temple', 'Futala Lake', 'Tekdi Ganesh Temple'],
    spiritualImportance: 'Deekshabhoomi is one of India\'s most sacred Buddhist sites — where Dr. B.R. Ambedkar converted to Buddhism with 500,000 followers, igniting the modern Buddhist revival in India.',
    nearbyPilgrimageSites: ['Deekshabhoomi Nagpur', 'Ramtek Rama Temple', 'Koradi Mahalaxmi Temple Nagpur'],
    images: [
      { title: 'Deekshabhoomi Nagpur', subtitle: 'Where Ambedkar\'s 1956 Buddhist conversion sparked a modern revival', gradientStyle: 'linear-gradient(135deg,#78350f,#c2410c,#ea580c)', category: 'Pilgrimage' },
      { title: 'Ramtek Rama Temple', subtitle: 'Ancient hill temple where Lord Ram rested during his northward journey', gradientStyle: 'linear-gradient(135deg,#7c2d12,#b91c1c,#dc2626)', category: 'Pilgrimage' },
      { title: 'Dragon Palace Temple', subtitle: 'Japanese-inspired Buddhist sanctuary in the heart of Nagpur', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#9f1239,#be185d)', category: 'Heritage' },
      { title: 'Nagpuri Orange Orchards', subtitle: 'The legendary sweet oranges of India\'s geographic heartland', gradientStyle: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', category: 'Nature' },
    ],
    polygon: [[21.8,78.9],[21.8,80.1],[21.0,80.1],[20.6,80.0],[20.6,78.9],[21.0,78.8]],
    labelPos: [21.2, 79.4],
  },

  {
    id: 'bhandara',
    name: 'Bhandara',
    mapLabel: 'Bhandara',
    division: 'Nagpur',
    headquarters: 'Bhandara',
    description: 'Known as the "Rice Bowl of Vidarbha," Bhandara is a lush green district in eastern Maharashtra with over 2,000 irrigation tanks, Itiadoh Dam, and Navegaon National Park — one of central India\'s finest birdwatching destinations.',
    interestingFact: 'Bhandara has over 2,000 historic irrigation tanks, earning it the nickname "Land of a Thousand Lakes." Navegaon National Park in Bhandara is one of India\'s top birdwatching destinations with 300+ species.',
    templeCount: 87,
    majorAttractions: ['Navegaon National Park', 'Itiadoh Dam', 'Bhandara Rice Terraces', 'Mansar Vakataka Caves'],
    spiritualImportance: 'The Mansar Caves near Bhandara contain ancient Vakataka dynasty temples with significant Buddhist and Hindu heritage from the 4th–5th century CE.',
    nearbyPilgrimageSites: ['Mansar Vakataka Caves', 'Bhandara Vitthal Mandir', 'Ramtek Temple (Nagpur nearby)'],
    images: [
      { title: 'Navegaon National Park', subtitle: 'Central Indian forests with tigers, leopards & 300+ bird species', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
      { title: 'Bhandara Rice Bowl', subtitle: 'Lush paddy cultivation in Vidarbha\'s greenest district', gradientStyle: 'linear-gradient(135deg,#365314,#4d7c0f,#65a30d)', category: 'Nature' },
    ],
    polygon: [[21.3,79.4],[21.7,79.4],[21.7,80.5],[21.0,80.5],[21.0,79.4]],
    labelPos: [21.4, 79.95],
  },

  {
    id: 'gondia',
    name: 'Gondia',
    mapLabel: 'Gondia',
    division: 'Nagpur',
    headquarters: 'Gondia',
    description: 'Maharashtra\'s easternmost district bordering Chhattisgarh and Madhya Pradesh, Gondia is known for extensive rice cultivation, the pristine Navegaon-Nagzira Tiger Reserve and Wildlife Corridor, and Gond tribal heritage.',
    interestingFact: 'Gondia borders three states — Maharashtra, Chhattisgarh, and Madhya Pradesh — making it a critical biodiversity corridor. Navegaon-Nagzira is one of India\'s most successful tiger reintroduction sites.',
    templeCount: 64,
    majorAttractions: ['Navegaon-Nagzira Tiger Reserve', 'Itiadoh Reservoir', 'Gondia Fort', 'Gond Tribal Art Village'],
    spiritualImportance: 'Gondia has sacred tribal forest shrines revered by the Gond, Mahar, and Pardhan communities, with ancient shamanistic traditions honouring forest deities.',
    nearbyPilgrimageSites: ['Gondia Vitthal Temple', 'Nagzira Forest Shrine', 'Bhandara Mansar Caves (nearby)'],
    images: [
      { title: 'Navegaon-Nagzira Tiger Reserve', subtitle: 'Thriving tiger corridor connecting three state forest ranges', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#15803d)', category: 'Nature' },
      { title: 'Gond Tribal Heritage', subtitle: 'Rich Gond Pardhan tribal art and forest wisdom traditions', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Culture' },
    ],
    polygon: [[21.7,79.4],[22.1,79.4],[22.1,80.9],[21.3,80.9],[21.3,80.5],[21.7,80.5]],
    labelPos: [21.75, 80.15],
  },

  {
    id: 'chandrapur',
    name: 'Chandrapur',
    mapLabel: 'Chandrapur',
    division: 'Nagpur',
    headquarters: 'Chandrapur',
    description: 'The "Black Gold District" of Maharashtra with massive coal reserves, Chandrapur is home to the Tadoba-Andhari Tiger Reserve — Maharashtra\'s finest wildlife sanctuary with India\'s highest tiger density per sq km.',
    interestingFact: 'Tadoba-Andhari Tiger Reserve in Chandrapur has one of India\'s highest Bengal tiger densities — averaging one tiger sighting every 2–3 hours of safari. The Chandrapur Virudheshwar temple was built by the Gond Maharajas in the 13th century.',
    templeCount: 134,
    majorAttractions: ['Tadoba-Andhari Tiger Reserve', 'Chandrapur Fort', 'Virudheshwar Temple (13th century Gond)', 'Mahakali Temple Chandrapur'],
    spiritualImportance: 'Mahakali Temple at Chandrapur is a powerful Shakti goddess shrine. The Virudheshwar Shiva complex represents ancient Gond dynasty sacred architecture.',
    nearbyPilgrimageSites: ['Mahakali Temple Chandrapur', 'Virudheshwar Shiva Complex', 'Ghugus Padmavati Temple'],
    images: [
      { title: 'Tadoba Tiger Reserve', subtitle: 'Maharashtra\'s premier tiger sanctuary — highest tiger density in India', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#166534)', category: 'Nature' },
      { title: 'Chandrapur Fort', subtitle: '13th century Gond dynasty fortification with ancient temples', gradientStyle: 'linear-gradient(135deg,#1e293b,#334155,#64748b)', category: 'Heritage' },
      { title: 'Mahakali Temple', subtitle: 'Powerful Shakti goddess shrine in the heart of Chandrapur city', gradientStyle: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)', category: 'Pilgrimage' },
    ],
    polygon: [[21.0,79.0],[21.0,80.0],[19.6,80.0],[19.5,78.9],[20.3,78.9]],
    labelPos: [20.3, 79.5],
  },

  {
    id: 'gadchiroli',
    name: 'Gadchiroli',
    mapLabel: 'Gadchiroli',
    division: 'Nagpur',
    headquarters: 'Gadchiroli',
    description: 'Maharashtra\'s largest district by area and least densely populated, Gadchiroli is a pristine forested frontier home to the Gond and Madia tribal communities, the Allapalli teak forests, and rich biodiversity.',
    interestingFact: 'Gadchiroli has 75% forest cover — the highest in Maharashtra. The Gond and Madia tribes have sustained here for millennia in harmony with the forest, practising ancient Gondi spiritual traditions honouring forest deities.',
    templeCount: 43,
    majorAttractions: ['Allapalli Teak Forests', 'Chamorshi Fort', 'Sironcha Wildlife Sanctuary', 'Gond Tribal Art Village Kesalapur'],
    spiritualImportance: 'Gadchiroli tribal communities practise the ancient Gondi faith centred on forest deities (Bara Dev). The Sironcha confluence of Godavari and Pranhita rivers is considered sacred.',
    nearbyPilgrimageSites: ['Sironcha Godavari-Pranhita Confluence', 'Gadchiroli Vitthal Mandir', 'Chamorshi Devi Temple'],
    images: [
      { title: 'Gadchiroli Tribal Forest', subtitle: 'Pristine 75% forest cover with ancient Gond tribal communities', gradientStyle: 'linear-gradient(135deg,#052e16,#14532d,#15803d)', category: 'Nature' },
      { title: 'Madia Gond Heritage', subtitle: 'Ancient tribal art traditions of India\'s most forested district', gradientStyle: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', category: 'Culture' },
    ],
    polygon: [[20.5,80.0],[21.0,80.0],[21.0,80.5],[21.3,80.5],[21.3,80.9],[18.5,80.9],[18.5,80.0]],
    labelPos: [19.8, 80.45],
  },

];

export default MAHARASHTRA_DISTRICTS;
