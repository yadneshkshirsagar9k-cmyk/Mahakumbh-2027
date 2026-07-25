'use client';

/**
 * @file DiscoverMaharashtra page
 * @description Official spiritual and heritage destinations explorer in the dashboard.
 * Supports keyword search, category filtering, facility checklists, and a dedicated
 * high-fidelity details sub-page for each location.
 */

import { useState } from 'react';
import { Search, MapPin, Clock, Check, ExternalLink, ArrowLeft, Accessibility, ShieldAlert, Award, Footprints, Landmark } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { navigateToCoordinates } from '@/constants/location-config';

interface Destination {
  id: string;
  name: string;
  category: 'Jyotirlinga' | 'Temple' | 'Ashram' | 'UNESCO' | 'Saint Circuit' | 'Spiritual Trail';
  district: string;
  desc: string;
  waitTime: string;
  wheelchair: boolean;
  medical: boolean;
  coords: { lat: number; lng: number };
  placeId?: string;
  detailedInfo: string;
  bestTimeToVisit: string;
  dressCode: string;
  howToReach: string;
  rituals: string[];
  images?: string[];
}

const DESTINATIONS: Destination[] = [
  {
    id: 'saibaba-temple',
    name: 'Shree Saibaba Sansthan Temple',
    category: 'Temple',
    district: 'Ahmednagar District',
    desc: 'The world-famous shrine of Saint Saibaba, promoting peace, faith, and patience. Visited by millions annually.',
    waitTime: '180m',
    wheelchair: true,
    medical: true,
    coords: { lat: 19.7668, lng: 74.4754 },
    placeId: 'ChIJP-o6-m5D2jsR1K37TmhP1W0',
    bestTimeToVisit: 'October to March (Thursdays draw the largest pilgrim gatherings)',
    dressCode: 'Decent, traditional clothing is highly recommended. Avoid shorts or revealing clothing.',
    howToReach: 'Located in Shirdi city center. Connected via Shirdi Railway Station (SNSI) and Shirdi Airport (15 km away). Regular bus connectivity from Mumbai, Pune, and Nashik.',
    rituals: ['Kakad Aarti (4:30 AM)', 'Madhyan Aarti (12:00 PM)', 'Dhoop Aarti (Sunset)', 'Shej Aarti (10:30 PM)', 'Satyanarayan Pooja'],
    detailedInfo: 'Shri Saibaba Sansthan Temple is the governing body of the world-famous shrine of Saint Saibaba of Shirdi. Saibaba is revered as one of the greatest saints ever born in India, who preached "Shraddha" (faith) and "Saburi" (patience) as key paths to spiritual liberation. The temple complex spans across a massive campus hosting the main Samadhi Mandir, Dwarkamai (the mosque where Baba lived), Chavadi, Gurusthan, and Lendi Baug. The Sansthan runs one of the largest community kitchens in Asia, serving free Prasad meals to over 100,000 devotees daily.',
    images: [
      '/assets/images/shirdi/shirdi-1.jpg',
      '/assets/images/shirdi/shirdi-2_v2.jpg',
      '/assets/images/shirdi/shirdi-3_v2.jpg'
    ]
  },
  {
    id: 'trimbakeshwar',
    name: 'Trimbakeshwar Shiva Temple',
    category: 'Jyotirlinga',
    district: 'Nashik District',
    desc: 'An ancient temple dedicated to Lord Shiva, housing one of the twelve Jyotirlingas. Origin of the sacred Godavari River.',
    waitTime: '240m',
    wheelchair: false,
    medical: true,
    coords: { lat: 19.9324, lng: 73.5307 },
    placeId: 'ChIJV2d4wweD2DsRP-xveb2Z-2Q',
    bestTimeToVisit: 'November to February (Mahashivratri festival is a major peak)',
    dressCode: 'Traditional Indian attire. Gents must wear dhotis/kurta-pyjamas for inner sanctum entry.',
    howToReach: 'Situated in Trimbak town, 28 km from Nashik city. Well connected by state transport buses and private cabs from Nashik Central Bus Stand.',
    rituals: ['Rudrabhishek Puja', 'Kaal Sarp Dosh Nivaran Puja', 'Tripindi Shradha', 'Mahamrityunjay Mantra Jaap', 'Panchamrut Snan'],
    detailedInfo: 'Trimbakeshwar Shiva Temple houses one of the 12 sacred Jyotirlingas. The unique feature of the Jyotirlinga here is its three faces representing Lord Brahma, Lord Vishnu, and Lord Rudra (Shiva). The temple is built of black stone in the classic Nagara architectural style and sits at the foothills of the Brahmagiri Mountain range. The holy Godavari River originates from the Brahmagiri hills at Kushavarta Kund, the sacred pond where millions of pilgrims bathe during the Simhastha Mahakumbh Mela to wash away their sins.',
    images: [
      '/assets/images/tourism/trimbakeshwar_1.jpg',
      '/assets/images/tourism/trimbakeshwar_2.jpg',
      '/assets/images/tourism/trimbakeshwar_3_v2.jpg'
    ]
  },
  {
    id: 'ramkund',
    name: 'Ram Kund Ghat',
    category: 'Spiritual Trail',
    district: 'Nashik District',
    desc: 'The sacred bathing ghat on the Godavari River where Lord Rama is believed to have performed rituals during exile.',
    waitTime: '120m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.0039, lng: 73.7915 },
    placeId: 'ChIJj362Qx6D2DsRk311H4lB-10',
    bestTimeToVisit: 'Throughout the year, especially during sunrise for holy baths and aartis.',
    dressCode: 'Modest wear suitable for holy river bathing. Changing rooms are available on the ghat.',
    howToReach: 'Located in Nashik city. Easily accessible by local auto-rickshaws, city buses, and cabs from Nashik Railway Station.',
    rituals: ['Asthi Visarjan (Ashes immersion)', 'Pitri Shradha & Tarpan', 'Ganga Aarti (Every Evening)', 'Holy Dip (Snan)'],
    detailedInfo: 'Ram Kund is the holiest spot on the Godavari River ghats in Nashik. According to the Ramayana, Lord Rama spent a significant part of his 14-year exile here and regularly bathed here. Lord Rama also performed the funeral rites and ash immersion of his father King Dasharatha at this pool. It is believed that the water of Ram Kund possesses unique properties that dissolve bone ashes instantly, making it a key national center for ancestral rites.',
    images: [
      '/assets/images/tourism/ramkund_1.jpg',
      '/assets/images/tourism/ramkund_2.jpg',
      '/assets/images/tourism/ramkund_3.jpg'
    ]
  },

  {
    id: 'ellora-caves',
    name: 'Ellora Caves & Kailash Temple',
    category: 'UNESCO',
    district: 'Aurangabad District',
    desc: 'UNESCO World Heritage Site with rock-cut monuments, including the breathtaking monolithic Kailash Temple carvings.',
    waitTime: '15m',
    wheelchair: false,
    medical: true,
    coords: { lat: 20.0268, lng: 75.1771 },
    placeId: 'ChIJVerul-Ellora-Caves',
    bestTimeToVisit: 'November to February (Cooler weather for exploring rock-cut caves)',
    dressCode: 'Comfortable walking shoes and light cotton clothes suitable for climbing and walking.',
    howToReach: 'Located 30 km from Aurangabad city (Chhatrapati Sambhajinagar). Regularly served by MSRTC buses, taxi tours, and auto-rickshaws.',
    rituals: ['Historical exploration', 'Cave meditation sessions', 'Photography'],
    detailedInfo: 'Ellora is a UNESCO World Heritage site representing the pinnacle of ancient Indian rock-cut architecture. Spanning Cave 1 to 34, it houses Buddhist, Hindu, and Jain temples carved side-by-side between the 6th and 10th centuries, demonstrating religious harmony. The crown jewel is Cave 16 (The Kailash Temple), the largest monolithic rock excavation in the world. Carved from top to bottom out of a single volcanic basalt cliff, ancient sculptors removed over 200,000 tons of rock to carve this complex structure.',
    images: [
      '/assets/images/tourism/ellora_1.jpg',
      '/assets/images/tourism/ellora_2.jpg',
      '/assets/images/tourism/ellora_3_v2.jpg'
    ]
  },
  {
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    category: 'UNESCO',
    district: 'Aurangabad District',
    desc: 'World-famous 30 rock-cut Buddhist cave monuments featuring exquisite ancient Indian frescoes and painting masterpieces.',
    waitTime: '10m',
    wheelchair: true,
    medical: false,
    coords: { lat: 20.5519, lng: 75.7033 },
    placeId: 'ChIJAjanta-Caves-UNESCO',
    bestTimeToVisit: 'Monsoon season (July to September) for lush waterfalls, or winter (November to February).',
    dressCode: 'Comfortable walking shoes, breathable clothes. Photography with flash is prohibited to protect murals.',
    howToReach: 'Situated 100 km from Aurangabad. Connected via regular tourism buses. Visitors must park at the T-point and board eco-friendly green buses to reach the caves.',
    rituals: ['Art Appreciation Tours', 'Buddhist Vihara Meditation', 'Scenic Viewpoint Hiking'],
    detailedInfo: 'The Ajanta Caves are 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE. Nestled in a horse-shoe shaped gorge along the Waghora River, the caves served as monsoon retreats for Buddhist monks. Ajanta is universally renowned for its classic frescoes and wall paintings, which represent the finest surviving examples of ancient Indian art. The murals depict stories from Jataka tales, illustrating the life events and past births of Gautama Buddha.',
    images: [
      '/assets/images/tourism/ajanta_1.jpg',
      '/assets/images/tourism/ajanta_2.jpg',
      '/assets/images/tourism/ajanta_3.jpg'
    ]
  },
  {
    id: 'bhimashankar',
    name: 'Bhimashankar Temple',
    category: 'Jyotirlinga',
    district: 'Pune District',
    desc: 'One of the five sacred Jyotirlingas of Maharashtra, situated in the ghat region of the Sahyadri hills.',
    waitTime: '180m',
    wheelchair: false,
    medical: true,
    coords: { lat: 19.0720, lng: 73.5358 },
    placeId: 'ChIJVy66-m5D2jsR1K37TmhP1W0',
    bestTimeToVisit: 'September to February (Fully operational and open to pilgrims during the Mahakumbh season)',
    dressCode: 'Traditional Indian clothing. Gents must remove shirts/vests for inner sanctum entry.',
    howToReach: 'Located 110 km from Pune and 250 km from Mumbai. State transport buses run regularly from Pune (Shivajinagar) and Kalyan.',
    rituals: ['Rudrabhishek', 'Laghurudra', 'Aarti (Morning, Afternoon, Evening)', 'Maha Pooja'],
    detailedInfo: 'Bhimashankar Temple is an ancient shrine housing one of the 12 Jyotirlingas of Lord Shiva. The temple architecture is a beautiful blend of old and new Nagara styles. It is also the source of the Bhima River. The surrounding forest area is a protected wildlife sanctuary, famous for the Indian Giant Squirrel (Shekru). During the Simhastha Mahakumbh, thousands of pilgrims complete the Maharashtra Jyotirlinga circuit by visiting Bhimashankar.',
    images: [
      '/assets/images/tourism/bhimashankar_1.jpg',
      '/assets/images/tourism/bhimashankar_2.jpg',
      '/assets/images/tourism/bhimashankar_3.jpg'
    ]
  },
  {
    id: 'grishneshwar',
    name: 'Grishneshwar Shiva Temple',
    category: 'Jyotirlinga',
    district: 'Aurangabad District',
    desc: 'The pre-eminent Jyotirlinga temple located near the Ellora Caves, rebuilt by Queen Ahilyabai Holkar.',
    waitTime: '120m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.0249, lng: 75.1685 },
    placeId: 'ChIJVerul-Ellora-Grishneshwar',
    bestTimeToVisit: 'October to March (Fully open and hosting special poojas during Kumbh Mela)',
    dressCode: 'Traditional attire. Gents must enter the inner sanctum bare-chested wearing a dhoti/sovale.',
    howToReach: 'Located 30 km from Aurangabad city and just 1 km from Ellora Caves. Easily reachable by local buses and cabs.',
    rituals: ['Jal Abhishek', 'Dudha Abhishek', 'Maha Pooja', 'Evening Aarti'],
    detailedInfo: 'Grishneshwar (also known as Ghushneshwar) is believed to be the last or 12th Jyotirlinga temple on Earth. Built of red stones, the temple architecture features a five-tier shikhara and beautiful carvings of Hindu deities. The temple was restored in the 18th century by the noble queen Ahilyabai Holkar. It is highly visited by devotees during the Mahakumbh pilgrimage as part of the regional holy tour.',
    images: [
      '/assets/images/tourism/grishneshwar_1.jpg',
      '/assets/images/tourism/grishneshwar_2.jpg',
      '/assets/images/tourism/grishneshwar_3.jpg'
    ]
  },
  {
    id: 'aundha-nagnath',
    name: 'Aundha Nagnath Temple',
    category: 'Jyotirlinga',
    district: 'Hingoli District',
    desc: 'An ancient Jyotirlinga temple believed to have been built by Yudhisthira, eldest of the Pandavas.',
    waitTime: '60m',
    wheelchair: false,
    medical: true,
    coords: { lat: 19.5369, lng: 77.0425 },
    placeId: 'ChIJAundha-Nagnath-Temple',
    bestTimeToVisit: 'Winter season (Fully open and accessible during the Mahakumbh mela)',
    dressCode: 'Modest traditional wear. Avoid shorts or western outfits inside the inner sanctum.',
    howToReach: 'Located in Aundha Nagnath town. Well-connected by road to Nanded (65 km) and Hingoli. Nearest railway station is Hingoli or Chordi.',
    rituals: ['Ekadasni', 'Rudrabhishek', 'Daily Aarti', 'Shringar Pooja'],
    detailedInfo: 'Aundha Nagnath is highly revered as the eighth Jyotirlinga. The temple features exquisite ancient Hemadpanthi style carvings. An interesting legend states that the saint Namdev was singing bhajans here when the temple rotates to face him. The sanctum sanctorum is located below ground level. It remains open and active throughout the Mahakumbh period for pilgrims.',
    images: [
      '/assets/images/tourism/aundha-nagnath_1.jpg',
      '/assets/images/tourism/aundha-nagnath_2.jpg',
      '/assets/images/tourism/aundha-nagnath_3.jpg'
    ]
  },
  {
    id: 'parli-vaijnath',
    name: 'Parli Vaijnath Temple',
    category: 'Jyotirlinga',
    district: 'Beed District',
    desc: 'A historical hilltop Jyotirlinga temple associated with Lord Vishnu and the nectar of immortality.',
    waitTime: '90m',
    wheelchair: true,
    medical: true,
    coords: { lat: 18.8475, lng: 76.5372 },
    placeId: 'ChIJParli-Vaijnath-Temple',
    bestTimeToVisit: 'Throughout the year (Fully operational during the Mahakumbh)',
    dressCode: 'Traditional clothing is preferred.',
    howToReach: 'Parli Vaijnath has its own railway station (PRLI) with direct trains. Well connected by state transport buses from Beed and Latur.',
    rituals: ['Abhishek', 'Maha Aarti', 'Bhasma Aarti', 'Bilvapatra Archana'],
    detailedInfo: 'Parli Vaijnath Temple sits on a small hill and is built of strong stone masonry. The temple is associated with the legend of Amrit (nectar) and is believed to have medicinal spiritual powers. It was rebuilt in the 18th century by Ahilyabai Holkar. It is a major pilgrimage hub during the Kumbh Mela circuit in Maharashtra.',
    images: [
      '/assets/images/tourism/parli-vaijnath_1.jpg',
      '/assets/images/tourism/parli-vaijnath_2.jpg',
      '/assets/images/tourism/parli-vaijnath_3.jpg'
    ]
  },
  {
    id: 'pandharpur',
    name: 'Vithoba Temple (Pandharpur)',
    category: 'Saint Circuit',
    district: 'Solapur District',
    desc: 'The spiritual heart of Maharashtra, hosting the beloved deity Lord Vitthal and Rukmini on the banks of Chandrabhaga.',
    waitTime: '300m',
    wheelchair: true,
    medical: true,
    coords: { lat: 17.6749, lng: 75.3306 },
    placeId: 'ChIJPandharpur-Vithoba-Temple',
    bestTimeToVisit: 'Ashadhi Ekadashi and Kartiki Ekadashi (Fully open during Mahakumbh pilgrim transits)',
    dressCode: 'Strictly traditional/modest Indian wear. Western clothes are discouraged.',
    howToReach: 'Located in Pandharpur. Well connected by rail (Kurduvadi railway junction is 50 km away) and state buses from Solapur and Pune.',
    rituals: ['Charan Sparsh (Touching the feet of Lord Vitthal)', 'Kakad Aarti', 'Mahapooja', 'Shej Aarti'],
    detailedInfo: 'The Vithoba Temple (Shri Vitthal-Rukmini Mandir) is the premier center of the Varkari sampradaya. Millions of pilgrims march on foot (Wari) to this temple every year. The deity Vitthal is worshipped as a form of Lord Krishna. The temple remains completely open and runs 24/7 during major festivals and the Mahakumbh transits to accommodate the sea of devotees.',
    images: [
      '/assets/images/tourism/pandharpur_1.jpg',
      '/assets/images/tourism/pandharpur_2.jpg',
      '/assets/images/tourism/pandharpur_3.jpg'
    ]
  },
  {
    id: 'dagadusheth',
    name: 'Dagadusheth Halwai Ganapati Temple',
    category: 'Temple',
    district: 'Pune District',
    desc: 'One of the most famous and beloved Ganapati temples in India, renowned for its golden deity and grand festivals.',
    waitTime: '45m',
    wheelchair: true,
    medical: true,
    coords: { lat: 18.5164, lng: 73.8561 },
    placeId: 'ChIJDagadusheth-Halwai-Ganapati',
    bestTimeToVisit: 'Ganeshotsav (August/September) and throughout the year (Open daily during Mahakumbh)',
    dressCode: 'Modest clothing.',
    howToReach: 'Located in the heart of Pune city (Budhwar Peth). Easily accessible by auto-rickshaws, local cabs, and Pune Metro.',
    rituals: ['Abhishek Pooja', 'Atharvashirsha Avartan', 'Maha Aarti', 'Prasad distribution'],
    detailedInfo: 'Founded by the sweetmaker Dagadusheth Halwai in the late 19th century, this temple houses a magnificent 7.5-foot Ganapati idol adorned with over 40 kilos of gold. The temple is managed by a trust that runs extensive charitable activities. It is a key spiritual stop for pilgrims traversing through Pune during the Kumbh Mela.',
    images: [
      '/assets/images/tourism/dagadusheth_1.jpg',
      '/assets/images/tourism/dagadusheth_2.jpg',
      '/assets/images/tourism/dagadusheth_3.jpg'
    ]
  },
  {
    id: 'siddhivinayak',
    name: 'Shree Siddhivinayak Temple',
    category: 'Temple',
    district: 'Mumbai City District',
    desc: 'The iconic Ganapati temple of Mumbai, visited by millions of devotees, celebrities, and global leaders.',
    waitTime: '120m',
    wheelchair: true,
    medical: true,
    coords: { lat: 19.0169, lng: 72.8302 },
    placeId: 'ChIJSiddhivinayak-Temple-Mumbai',
    bestTimeToVisit: 'Tuesdays and Angarki Sankashti Chaturthi (Fully operational during the Mahakumbh years)',
    dressCode: 'Decent, respectful clothing. No shorts or revealing clothes allowed.',
    howToReach: 'Located in Prabhadevi, Mumbai. Nearest railway stations are Dadar (Central/Western) and Prabhadevi. Taxis and buses are readily available.',
    rituals: ['Shree Darshan', 'Aarti (5:00 AM)', 'Abhishek', 'Kakad Aarti'],
    detailedInfo: 'Shree Siddhivinayak Temple, dedicated to Lord Ganesha (the remover of obstacles), was constructed in 1801. The inner dome of the sanctum is plated with gold, and the Ganesha idol is carved out of a single black stone with the trunk turned to the right. The temple runs advanced crowd management systems and is fully open to pilgrims traveling via Mumbai for the Kumbh Mela.',
    images: [
      '/assets/images/tourism/siddhivinayak_1.jpg',
      '/assets/images/tourism/siddhivinayak_2.jpg',
      '/assets/images/tourism/siddhivinayak_3.jpg'
    ]
  },
  {
    id: 'kolhapur-mahalakshmi',
    name: 'Shree Mahalakshmi Temple (Kolhapur)',
    category: 'Temple',
    district: 'Kolhapur District',
    desc: 'An ancient Shakti Peetha temple of Goddess Ambabai, built in the architectural style of the Chalukya dynasty.',
    waitTime: '150m',
    wheelchair: true,
    medical: true,
    coords: { lat: 16.6961, lng: 74.2235 },
    placeId: 'ChIJKolhapur-Mahalakshmi-Temple',
    bestTimeToVisit: 'Navratri Festival (October) and Kiranotsav (when sun rays fall on the deity) (Open throughout Kumbh Mela)',
    dressCode: 'Traditional Indian clothing is highly recommended.',
    howToReach: 'Located in Kolhapur city. Well connected by trains to Kolhapur Railway Station (CSMT) and national highway NH-48. Daily buses from Pune and Mumbai.',
    rituals: ['Kumkumarchana', 'Abhishek', 'Mahapuja', 'Alankar Pooja', 'Lalita Panchami procession'],
    detailedInfo: 'The Mahalakshmi Temple of Kolhapur is one of the six major Shakti Peethas in India. Built in the 7th century by Chalukya rulers, the temple features intricate stone carvings and houses the deity carved in gemstone. During the unique Kiranotsav festival, the rays of the setting sun fall directly on the feet, chest, and face of the goddess. It is a highly active spiritual center open to pilgrims during the Mahakumbh.',
    images: [
      '/assets/images/tourism/kolhapur-mahalakshmi_1.jpg',
      '/assets/images/tourism/kolhapur-mahalakshmi_2.jpg',
      '/assets/images/tourism/kolhapur-mahalakshmi_3.jpg'
    ]
  },
  {
    id: 'tuljapur',
    name: 'Tulja Bhavani Temple',
    category: 'Temple',
    district: 'Dharashiv District',
    desc: 'The historic family deity temple of Chhatrapati Shivaji Maharaj, one of the three complete Shakti Peethas of Maharashtra.',
    waitTime: '180m',
    wheelchair: false,
    medical: true,
    coords: { lat: 18.0125, lng: 76.1264 },
    placeId: 'ChIJTuljapur-Bhavani-Temple',
    bestTimeToVisit: 'Navratri festival (September/October) and winter months (Fully open during Mahakumbh)',
    dressCode: 'Strictly traditional Indian clothing. Gents in dhotis/kurta-pyjamas, ladies in sarees/salwar-kameez.',
    howToReach: 'Located in Tuljapur town, 45 km from Solapur. Solapur is the nearest major railway junction. Frequent buses operate between Solapur and Tuljapur.',
    rituals: ['Chhabina (Deity procession)', 'Abhishek Puja', 'Gondhal (Spiritual folk song)', 'Simhasan Puja'],
    detailedInfo: 'Tulja Bhavani Temple is dedicated to Goddess Bhavani (a form of Durga). Chhatrapati Shivaji Maharaj was a staunch devotee and is said to have received the divine sword "Bhavani Talwar" from the goddess here. The temple contains the holy Kallol Kund and Gomukh Tirtha. The temple is fully active and serves as a major station on the Mahakumbh spiritual trail.',
    images: [
      '/assets/images/tourism/tuljapur_1.jpg',
      '/assets/images/tourism/tuljapur_2.jpg',
      '/assets/images/tourism/tuljapur_3.jpg'
    ]
  },
  {
    id: 'saptashrungi',
    name: 'Saptashrungi Devi Temple',
    category: 'Temple',
    district: 'Nashik District',
    desc: 'A spectacular Shakti Peetha temple carved into a mountain of seven peaks, adjacent to the Kumbh Mela zone.',
    waitTime: '120m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.3831, lng: 73.8964 },
    placeId: 'ChIJSaptashrungi-Devi-Temple',
    bestTimeToVisit: 'Navratri and monsoon (Fully open with high security and ropeway during Kumbh Mela)',
    dressCode: 'Modest traditional wear.',
    howToReach: 'Located in Vani, 60 km north of Nashik. State transport buses run frequently from Nashik Central Bus Stand. A funicular trolley/ropeway is available to ascend the hill.',
    rituals: ['Mahapuja', 'Saree offering to Devi', 'Kumkumarchana', 'Chaitra Otsav'],
    detailedInfo: 'Saptashrungi Devi Temple is situated on a steep cliff surrounded by seven high mountain peaks (Saptashrunga). The idol of Goddess Saptashrungi Nivasini is 8 feet tall, carved in stone with 18 arms holding different weapons. This temple is a crucial part of the Nashik-Trimbakeshwar Kumbh Mela pilgrimage, and advanced ropeway transport is kept open 24/7 during peak days.',
    images: [
      '/assets/images/tourism/saptashrungi_1.jpg',
      '/assets/images/tourism/saptashrungi_2.jpg',
      '/assets/images/tourism/saptashrungi_3.jpg'
    ]
  },
  {
    id: 'shegaon',
    name: 'Gajanan Maharaj Mandir (Shegaon)',
    category: 'Ashram',
    district: 'Buldhana District',
    desc: 'The immaculate, highly organized spiritual ashram and samadhi temple of Saint Gajanan Maharaj.',
    waitTime: '90m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.7936, lng: 76.6853 },
    placeId: 'ChIJShegaon-Gajanan-Maharaj-Temple',
    bestTimeToVisit: 'August to February (Fully open and hosting thousands of pilgrims during Kumbh Mela season)',
    dressCode: 'Traditional, simple clothing.',
    howToReach: 'Situated in Shegaon city. Shegaon has its own railway station (SEG) with excellent train connectivity on the Mumbai-Howrah line. Directly connected by road.',
    rituals: ['Pooja & Aarti (Daily)', 'Bhajan & Kirtan', 'Mahaprasad (Free community kitchen)', 'Samadhi Sparsh'],
    detailedInfo: 'Shri Gajanan Maharaj Sansthan in Shegaon is universally famous for its exceptional cleanliness, order, and social services. Devotees visit the Samadhi of the great 19th-century saint Gajanan Maharaj. The ashram runs vast dining halls, clean lodging, and spiritual gardens. It remains fully open during the Kumbh Mela, serving as a peaceful retreat for passing pilgrims.',
    images: [
      '/assets/images/tourism/shegaon_1.jpg',
      '/assets/images/tourism/shegaon_2.jpg',
      '/assets/images/tourism/shegaon_3.jpg'
    ]
  },
  {
    id: 'hazur-sahib',
    name: 'Hazur Sahib Nanded',
    category: 'Spiritual Trail',
    district: 'Nanded District',
    desc: 'One of the five Takhts of Sikhism, the final resting place of Guru Gobind Singh Ji.',
    waitTime: '30m',
    wheelchair: true,
    medical: true,
    coords: { lat: 19.1539, lng: 77.3181 },
    placeId: 'ChIJHazur-Sahib-Nanded',
    bestTimeToVisit: 'October to March (Fully open and welcoming all devotees during the Mahakumbh period)',
    dressCode: 'Respectful, fully covered clothing. Head must be covered with a scarf or bandana before entering.',
    howToReach: 'Located in Nanded city. Directly connected via Nanded Railway Station (NED) and Nanded Airport. Regular buses and trains from Hyderabad, Mumbai, and Pune.',
    rituals: ['Langar (Free 24/7 community kitchen)', 'Nitnem (Daily prayers)', 'Shastar Darshan (Viewing of holy weapons)', 'Rehras Sahib & Aarti'],
    detailedInfo: 'Takht Sachkhand Sri Hazur Abchalnagar Sahib is a world-renowned Sikh shrine built at the site where the tenth Guru, Guru Gobind Singh Ji, breathed his last in 1708. The inner room of the temple houses the holy Guru Granth Sahib and the Guru\'s personal weapons. The complex runs massive pilgrim guest houses and serves free food to all. It is fully open and active, welcoming spiritual travelers during the Mahakumbh.',
    images: [
      '/assets/images/tourism/hazur-sahib_1.jpg',
      '/assets/images/tourism/hazur-sahib_2.jpg',
      '/assets/images/tourism/hazur-sahib_3.jpg'
    ]
  },
  {
    id: 'kalaram-temple',
    name: 'Kalaram Temple (Panchavati)',
    category: 'Temple',
    district: 'Nashik District',
    desc: 'The historic temple of Lord Rama in Panchavati, featuring a unique black stone deity and architecture.',
    waitTime: '60m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.0076, lng: 73.7958 },
    placeId: 'ChIJKalaram-Temple-Nashik',
    bestTimeToVisit: 'Ram Navami and throughout the Kumbh Mela (Centrally open in the heart of the Kumbh zone)',
    dressCode: 'Respectful traditional attire.',
    howToReach: 'Located in Panchavati, Nashik, easily reachable by local auto-rickshaws, cabs, or walking from Ramkund (just 500 meters away).',
    rituals: ['Rama Pooja', 'Hanuman Chalisa Path', 'Evening Aarti', 'Special Kumbh Mela Pujas'],
    detailedInfo: 'Kalaram Temple is a key mythological site built in 1782 by Sardar Rangrao Odhekar. The temple gets its name from the statue of Lord Rama, which is carved from a single piece of black stone. According to legend, Lord Rama lived in Panchavati during his exile. The temple plays an active, pivotal role during the Kumbh Mela, hosting key religious discourses and remaining open for 24-hour darshan during Shahi Snan days.',
    images: [
      '/assets/images/tourism/kalaram-temple_1.jpg',
      '/assets/images/tourism/kalaram-temple_2.jpg',
      '/assets/images/tourism/kalaram-temple_3.jpg'
    ]
  },
  {
    id: 'kushavarta-kund',
    name: 'Kushavarta Kund',
    category: 'Spiritual Trail',
    district: 'Nashik District',
    desc: 'The sacred reservoir in Trimbakeshwar representing the origin of the Godavari River and the center of Kumbh Mela Shahi Snan.',
    waitTime: '30m',
    wheelchair: true,
    medical: true,
    coords: { lat: 19.9318, lng: 73.5323 },
    placeId: 'ChIJKushavarta-Kund-Trimbak',
    bestTimeToVisit: 'Simhastha Kumbh Mela and weekly holy dips (Fully open, heavily fortified and managed for bathing during Kumbh)',
    dressCode: 'Appropriate bathing clothes. Clean towels and changing rooms are constructed around the pool.',
    howToReach: 'Located in Trimbakeshwar town center, walking distance from the Trimbakeshwar Shiva Temple.',
    rituals: ['Shahi Snan (Royal Bath for Akhada Sadhus)', 'Pitri Tarpan', 'Godavari Aarti', 'Holy Dip (Snan)'],
    detailedInfo: 'Kushavarta Kund is a fortified stone tank where the Godavari River emerges after flowing underground from the Brahmagiri Hills. It is the sanctum sanctorum for holy bathing in Trimbakeshwar. During the Simhastha Mahakumbh, the Shaiva Sadhus and Akhadas take their first royal dip here. The government ensures high-tech safety nets, filtration, and continuous water flow to keep it open and safe for millions.',
    images: [
      '/assets/images/tourism/kushavarta-kund_1.jpg',
      '/assets/images/tourism/kushavarta-kund_2.jpg',
      '/assets/images/tourism/kushavarta-kund_1.jpg'
    ]
  },
  {
    id: 'anjaneri-hills',
    name: 'Anjaneri Hills',
    category: 'Spiritual Trail',
    district: 'Nashik District',
    desc: 'The sacred birthplace of Lord Hanuman, offering a scenic spiritual trek in the Western Ghats.',
    waitTime: '15m',
    wheelchair: false,
    medical: false,
    coords: { lat: 19.9198, lng: 73.5794 },
    placeId: 'ChIJAnjaneri-Hills-Nashik',
    bestTimeToVisit: 'Monsoons (July-Sept) for scenic waterfalls, and winters (Oct-Feb) (Fully open and popular for trekking during Kumbh)',
    dressCode: 'Comfortable trekking clothes and sturdy hiking shoes.',
    howToReach: 'Located on the Nashik-Trimbakeshwar highway, about 20 km from Nashik and 7 km from Trimbak. Base village is Anjaneri, followed by a 2-hour hike.',
    rituals: ['Hanuman Temple worship at the peak', 'Eco-trail hiking', 'Photography of volcanic formations'],
    detailedInfo: 'Anjaneri Hills is named after Anjana, the mother of Lord Hanuman. The hill is believed to be Hanuman\'s birthplace. The trek passes through forests, rock-cut steps, and beautiful plateau formations, leading to a temple dedicated to Anjana Mata and Lord Hanuman at the summit. It remains open daily during the Kumbh Mela, attracting adventure-loving pilgrims.',
    images: [
      '/assets/images/tourism/anjaneri-hills_1.jpg',
      '/assets/images/tourism/anjaneri-hills_2.jpg',
      '/assets/images/tourism/anjaneri-hills_3.jpg'
    ]
  },
  {
    id: 'pandavleni-caves',
    name: 'Pandavleni Caves',
    category: 'UNESCO',
    district: 'Nashik District',
    desc: 'A cluster of 24 ancient rock-cut Buddhist caves dating from the 1st century BCE to the 3rd century CE.',
    waitTime: '15m',
    wheelchair: false,
    medical: false,
    coords: { lat: 19.9619, lng: 73.7485 },
    placeId: 'ChIJPandavleni-Caves-Nashik',
    bestTimeToVisit: 'October to March (Fully open and maintained by ASI during the Kumbh Mela)',
    dressCode: 'Comfortable walking shoes. Modest attire suitable for historical monastic caves.',
    howToReach: 'Located on the outskirts of Nashik on the Mumbai-Nashik highway (NH-3). Direct local buses and cabs drop at the base. Visitors must climb around 200 stone steps to reach the caves.',
    rituals: ['Historical Cave Exploration', 'Buddhist Vihara Meditation', 'Scenic Valley Views'],
    detailedInfo: 'Pandavleni Caves (also known as Trirashmi Leni) are a group of 24 Hinayana Buddhist caves. The caves contain ornate stone carvings, pillars, water tanks, and large assembly halls (viharas). These caves served as residences for Buddhist monks. They are managed by the Archaeological Survey of India (ASI) and remain fully open for history and art enthusiasts during the Kumbh Mela.',
    images: [
      '/assets/images/tourism/pandavleni-caves_1.jpg',
      '/assets/images/tourism/pandavleni-caves_2.jpg',
      '/assets/images/tourism/pandavleni-caves_3.jpg'
    ]
  },
  {
    id: 'kapaleshwar-temple',
    name: 'Kapaleshwar Temple',
    category: 'Temple',
    district: 'Nashik District',
    desc: 'A unique Shiva temple near Ramkund where Nandi is absent, holding deep significance during Kumbh Snan.',
    waitTime: '45m',
    wheelchair: true,
    medical: true,
    coords: { lat: 20.0048, lng: 73.7919 },
    placeId: 'ChIJKapaleshwar-Temple-Nashik',
    bestTimeToVisit: 'Pradosh days, Mahashivratri, and Kumbh Mela (Centrally open and directly adjacent to Ramkund ghat)',
    dressCode: 'Respectful traditional attire.',
    howToReach: 'Located in Panchavati, Nashik, right next to the sacred Ramkund bathing ghat. Easily reachable on foot.',
    rituals: ['Shiva Linga Pooja', 'Evening Aarti', 'Maha Pooja', 'Pradosha Vrat prayers'],
    detailedInfo: 'Kapaleshwar Mahadev Temple is one of the oldest Shiva temples in Nashik. Uniquely, there is no statue of Nandi (the bull) at the entrance. Lord Shiva is believed to have taken Nandi as his spiritual guru here to wash away his sin of killing a cow, hence Nandi is respected as a guru and sits on a higher plane. The temple is directly connected to the Ramkund Kumbh Mela zone and is open 24/7 during Shahi Snan.',
    images: [
      '/assets/images/tourism/kapaleshwar-temple_1.jpg',
      '/assets/images/tourism/kapaleshwar-temple_2.jpg',
      '/assets/images/tourism/kapaleshwar-temple_3.jpg'
    ]
  },
  {
    id: 'muktidham-temple',
    name: 'Muktidham Temple',
    category: 'Temple',
    district: 'Nashik District',
    desc: 'A magnificent marble temple complex housing replicas of the twelve Jyotirlingas and major Indian deities.',
    waitTime: '30m',
    wheelchair: true,
    medical: true,
    coords: { lat: 19.9576, lng: 73.8268 },
    placeId: 'ChIJMuktidham-Temple-Nashik',
    bestTimeToVisit: 'Throughout the year, especially during festivals (Fully open and serving as a key pilgrim transit hub during Kumbh)',
    dressCode: 'Modest traditional or casual clothing.',
    howToReach: 'Located in Nashik Road area, about 2 km from Nashik Road Railway Station. Direct auto-rickshaws and cabs run constantly.',
    rituals: ['Jyotirlinga Darshan', 'Baghavad Gita wall reading', 'Aarti', 'Bhajan assemblies'],
    detailedInfo: 'Muktidham is a unique temple built in 1971 using high-quality pure white Makrana marble from Rajasthan. The temple is famous for housing life-size replicas of the 12 Jyotirlingas, allowing pilgrims to worship them all under one roof. The entire 18 chapters of the Bhagavad Gita are beautifully inscribed on the marble walls. The temple is fully active and serves as an important tourist destination during the Kumbh Mela.',
    images: [
      '/assets/images/tourism/muktidham-temple_1.jpg',
      '/assets/images/tourism/muktidham-temple_2.jpg',
      '/assets/images/tourism/muktidham-temple_3.jpg'
    ]
  }
];

export default function DiscoverMaharashtra() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [wheelchair, setWheelchair] = useState(false);
  const [medical, setMedical] = useState(false);
  
  // Track selected destination for dynamic separate details page view
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);

  const categories = ['All', 'Jyotirlinga', 'Temple', 'Ashram', 'UNESCO', 'Saint Circuit', 'Spiritual Trail'];

  const filtered = DESTINATIONS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.district.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesWheelchair = !wheelchair || item.wheelchair;
    const matchesMedical = !medical || item.medical;

    return matchesSearch && matchesCategory && matchesWheelchair && matchesMedical;
  });

  const selectedDest = DESTINATIONS.find(d => d.id === selectedDestId);

  // ─── DEDICATED DETAILS SUB-PAGE VIEW ───
  if (selectedDest) {
    return (
      <div className="space-y-6 text-[#1A1A1A] animate-fadeIn">
        
        {/* Back header button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <button
            onClick={() => setSelectedDestId(null)}
            className="flex items-center gap-2 text-xs font-bold text-[#022B5D] bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Explorer</span>
          </button>
          
          <span className="px-3 py-1 rounded-full bg-[#F26F21] text-white text-[9px] font-black uppercase tracking-wider">
            {selectedDest.category}
          </span>
        </div>

        {/* Hero Section Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#005BAC] to-[#0070D2] text-white shadow-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
              <MapPin size={14} className="text-[#F26F21]" />
              <span>{selectedDest.district}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[var(--font-heading)] text-white">
              {selectedDest.name}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {selectedDest.desc}
            </p>
          </div>
        </div>

        {/* Two Column Layout details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Detailed description card */}
            <div className="bg-white border border-[#E5E7EB] p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                <Award size={16} className="text-[#F26F21]" />
                <span>Overview & History</span>
              </h3>
              <p className="text-xs text-[#374151] leading-relaxed font-medium">
                {selectedDest.detailedInfo}
              </p>
            </div>

            {/* Image Gallery */}
            {selectedDest.images && selectedDest.images.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#F26F21] text-lg leading-none">📷</span>
                  <span>Temple Gallery</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDest.images.map((img, idx) => (
                    <div key={idx} className={`relative overflow-hidden w-full h-48 rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-[1.02] duration-300 ${idx === 2 ? 'md:col-span-2 md:h-72' : ''}`}>
                      <Image src={img} alt={`${selectedDest.name} Gallery Image ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Directions and accessibility */}
            <div className="bg-white border border-[#E5E7EB] p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                <Footprints size={16} className="text-[#F26F21]" />
                <span>Travel & Route Directions</span>
              </h3>
              <p className="text-xs text-[#374151] leading-relaxed font-medium">
                {selectedDest.howToReach}
              </p>
            </div>

            {/* Rituals and Pujas card */}
            <div className="bg-white border border-[#E5E7EB] p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#005BAC] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                <Landmark size={16} className="text-[#F26F21]" />
                <span>Key Rituals & Sacred Timings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDest.rituals.map((ritual, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-sm">
                    <Check size={14} className="text-[#005BAC] shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-700">{ritual}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar stats card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Practical information panel */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm space-y-5">
              <div className="border-b border-[#E5E7EB] pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">Visitor Guide</h3>
              </div>

              {/* Waiting time info */}
              <div className="space-y-1">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Average Darshan Wait</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#005BAC]" />
                  <span className="text-base font-black text-[#111827]">{selectedDest.waitTime}</span>
                </div>
              </div>

              {/* Best time to visit */}
              <div className="space-y-1 pt-2 border-t border-[#E5E7EB]">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Best Months to Visit</span>
                <p className="text-xs font-semibold leading-relaxed text-[#374151]">{selectedDest.bestTimeToVisit}</p>
              </div>

              {/* Dress code */}
              <div className="space-y-1 pt-2 border-t border-[#E5E7EB]">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <ShieldAlert size={14} className="text-[#005BAC]" /> Dress Protocol
                </span>
                <p className="text-xs font-semibold leading-relaxed text-[#374151]">{selectedDest.dressCode}</p>
              </div>

              {/* Amenities tags */}
              <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Available Amenities</span>
                
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-stone-600">Wheelchair Accessible</span>
                  {selectedDest.wheelchair ? (
                    <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded font-black uppercase">Yes</span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black uppercase">No</span>
                  )}
                </div>


                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-stone-600">First Aid / Medical</span>
                  {selectedDest.medical ? (
                    <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded font-black uppercase">Yes</span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black uppercase">No</span>
                  )}
                </div>
              </div>

              {/* Navigation button */}
              <div className="pt-3 border-t border-[#E5E7EB]">
                <button
                  onClick={() => navigateToCoordinates(selectedDest.coords.lat, selectedDest.coords.lng)}
                  className="w-full text-center block bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer select-none border-none outline-none"
                >
                  Get Route Map Directions
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ─── MAIN SEARCH & LIST VIEW ───
  return (
    <div className="space-y-6 text-[#111827]">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Discover Maharashtra</h1>
        <p className="text-xs text-[#6B7280]">Official repository of all national-grade spiritual, heritage, and ashram destinations open during Mahakumbh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filter sidebar */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm space-y-5">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Search Filters</h3>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-grey-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, district, festival..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] outline-none"
            />
          </div>

          {/* Categories */}
          <CollapsibleSection title="Site Category" defaultOpen={true} card={false}>
            <div className="flex flex-col gap-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer border-none outline-none',
                    activeCategory === cat
                      ? 'bg-[#005BAC] text-white'
                      : 'text-[#374151] hover:bg-[#FAFBFC]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Amenities checkboxes */}
          <CollapsibleSection title="Required Facilities" defaultOpen={false} card={false}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={wheelchair}
                  onChange={(e) => setWheelchair(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC]"
                />
                <span>Wheelchair Accessible</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC]"
                />
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={medical}
                  onChange={(e) => setMedical(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC]"
                />
                <span>Medical Nearby</span>
              </label>
            </div>
          </CollapsibleSection>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Optional Image Header */}
              {item.images && item.images.length > 0 && (
                <div className="w-full h-36 border-b border-[#E5E7EB] relative overflow-hidden">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Category Header */}
              <div className="p-4 space-y-2.5 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#005BAC] text-white text-[8px] font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#111827]">{item.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-bold">
                    <MapPin size={11} className="text-[#005BAC]" />
                    <span>{item.district}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#374151] leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Bottom bar with Details Button */}
              <div className="bg-[#FAFBFC] border-t border-[#E5E7EB] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-500 font-bold">
                  <Clock size={12} className="text-[#005BAC]" />
                  <span>Wait Time: <strong className="text-[#111827]">{item.waitTime}</strong></span>
                </div>
                <button
                  onClick={() => setSelectedDestId(item.id)}
                  className="text-xs font-bold text-[#005BAC] hover:text-[#0F4C81] flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none select-none"
                >
                  <span>Details</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
