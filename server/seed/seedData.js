import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const destinations = [
  {
    title: 'Divine Mathura & Vrindavan Braj Darshan',
    slug: 'divine-mathura-vrindavan-braj-darshan',
    description:
      'Immerse yourself in the sacred land of Lord Krishna. Experience the divine aura of Shri Krishna Janmasthan, the enchanting Prem Mandir musical fountain & lighting, the joyous blessings of Thakur Banke Bihari Ji Mandir, holy Govardhan Hill Parikrama, and the sacred Yamuna Maha Aarti at Vishram Ghat. Taste authentic Mathura Ke Pede and feel the bliss of Braj Bhoomi.',
    shortDescription: 'Krishna Janmabhoomi, Banke Bihari, Prem Mandir & Govardhan',
    location: 'Mathura & Vrindavan',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800' },
      { url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800' },
      { url: 'https://images.unsplash.com/photo-1599818494199-07cd5b45a995?w=800' },
    ],
    pricePerPerson: 11999,
    duration: 4,
    highlights: [
      'Shri Krishna Janmasthan Temple Complex (Mathura)',
      'Thakur Banke Bihari Ji Mandir (Vrindavan)',
      'Prem Mandir (Grand Musical Fountain & Architectural Lighting)',
      'Govardhan Parikrama, Radha Kund & Mansi Ganga',
      'Dwarkadhish Temple & Vishram Ghat Yamuna Aarti',
      'Nidhivan, ISKCON Vrindavan & Barsana Shriji Temple',
      'Authentic Mathura Ke Pede & Traditional Braj Thali',
    ],
    included: [
      '3 Nights AC Deluxe Hotel Stay',
      'Daily Satvik Breakfast & Dinner',
      'Dedicated AC Cab for all Temple Sightseeing',
      'Vishram Ghat Yamuna Evening Boating',
      'Local Guide for Temple History & Darshan Assistance',
    ],
    excluded: ['Personal offerings & Pooja samagri', 'Train/Flight tickets to Mathura', 'Personal expenses'],
    coordinates: { lat: 27.4924, lng: 77.6737 },
    rating: 5.0,
    numReviews: 320,
    isFeatured: true,
    isTrending: true,
    tags: ['spiritual', 'mathura', 'vrindavan', 'krishna', 'temple', 'heritage', 'uttar pradesh', 'budget'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Mathura & Sacred Yamuna Ghats',
        description:
          'Arrive in Mathura, check into your hotel and refresh. Visit the holy Vishram Ghat for a peaceful boat ride on the Yamuna, explore the historic Dwarkadhish Temple, and witness the divine Yamuna Maha Aarti at dusk.',
        activities: ['Check-in & Welcome Drink', 'Vishram Ghat Boating', 'Dwarkadhish Temple Darshan', 'Yamuna Maha Aarti'],
      },
      {
        day: 2,
        title: 'Shri Krishna Janmabhoomi & Mathura Heritage',
        description:
          'Visit the sacred Shri Krishna Janmasthan Temple Complex — the exact birthplace prison cell of Lord Krishna. Marvel at the grand Bhagwat Bhavan and Keshavdev Temple, stroll through Potara Kund, and visit the historic Mathura Archaeological Museum.',
        activities: ['Krishna Janmasthan Darshan', 'Bhagwat Bhavan & Keshavdev Temple', 'Potara Kund Visit', 'Taste Hot Mathura Pede'],
      },
      {
        day: 3,
        title: 'Vrindavan Dham: Banke Bihari & Prem Mandir',
        description:
          'Head to Vrindavan for soulful darshan at Thakur Banke Bihari Ji Mandir. Walk through the mystical Nidhivan and Seva Kunj, explore the grand white ISKCON Temple, and spend the evening watching the illuminated light and fountain show at Prem Mandir.',
        activities: ['Banke Bihari Ji Darshan', 'Nidhivan & Seva Kunj', 'ISKCON Temple Vrindavan', 'Prem Mandir Light & Fountain Spectacle'],
      },
      {
        day: 4,
        title: 'Govardhan Parikrama, Barsana & Departure',
        description:
          'Visit Govardhan Hill and Dan Ghati Temple, take holy blessings at Radha Kund and Shyam Kund. Proceed to Barsana to climb the palace-temple of Shri Radha Rani. Shop for traditional Braj souvenirs and sweet pedas before drop-off.',
        activities: ['Govardhan Dan Ghati Temple', 'Radha Kund & Mansi Ganga', 'Barsana Shriji Mandir', 'Peda Shopping & Departure'],
      },
    ],
  },
  {
    title: 'Varanasi Ghats & Kashi Vishwanath Spiritual Tour',
    slug: 'varanasi-ghats-kashi-vishwanath-spiritual-tour',
    description:
      'Experience the eternal spiritual city of Varanasi. Witness the divine Ganga Aarti at Dashashwamedh Ghat, take a sunrise boat ride on the sacred river, offer prayers at the glorious Kashi Vishwanath Corridor, and visit Sarnath where Lord Buddha gave his first sermon.',
    shortDescription: 'Kashi Vishwanath, Dashashwamedh Aarti & Sarnath',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800' },
      { url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800' },
    ],
    pricePerPerson: 13999,
    duration: 3,
    highlights: [
      'Kashi Vishwanath Jyotirlinga & Corridor',
      'Grand Dashashwamedh Ghat Ganga Aarti (VIP Boat View)',
      'Sunrise Subah-e-Banaras Boat Ride',
      'Historic Sarnath Buddhist Stupas & Museum',
      'Assi Ghat & Banarasi Silk & Chaat Trail',
    ],
    included: ['Heritage Haveli Stay', 'Daily Breakfast', 'Private Boat for Ganga Aarti', 'Temple Guide'],
    excluded: ['Flights/Train fare', 'Personal Pooja expenses'],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    rating: 4.9,
    numReviews: 285,
    isFeatured: true,
    isTrending: true,
    tags: ['spiritual', 'varanasi', 'kashi', 'ganga', 'uttar pradesh', 'cultural', 'budget'],
  },
  {
    title: 'Royal Rajasthan: Palaces, Forts & Desert Culture',
    slug: 'royal-rajasthan-palaces-forts-desert-culture',
    description:
      'Step into the majestic world of Rajput kings. Explore the pink sandstone walls of Jaipur, the regal Amer Fort, the romantic lakeside palaces of Udaipur, and the grand Mehrangarh Fort with vibrant cultural music and desert hospitality.',
    shortDescription: 'Amer Fort, Hawa Mahal, Lake Pichola & City Palace',
    location: 'Jaipur & Udaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'West India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800' },
      { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' },
    ],
    pricePerPerson: 24999,
    duration: 6,
    highlights: [
      'Amer Fort Elephant/Jeep Safari & Hawa Mahal',
      'Lake Pichola Sunset Boat Cruise in Udaipur',
      'City Palace & Jantar Mantar Observatory',
      'Chokhi Dhani Cultural Village & Rajasthani Thali',
      'Jodhpur Mehrangarh Fort & Blue City Walk',
    ],
    included: ['4-Star Heritage Palace Hotels', 'Daily Breakfast & Dinner', 'Private AC Transport', 'Monument Entry Passes'],
    excluded: ['Airfare', 'Personal shopping'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    rating: 4.9,
    numReviews: 198,
    isFeatured: true,
    isTrending: true,
    tags: ['heritage', 'rajasthan', 'jaipur', 'udaipur', 'palace', 'luxury'],
  },
  {
    title: 'Himachal Snow Valley: Manali & Rohtang Pass',
    slug: 'himachal-snow-valley-manali-rohtang-pass',
    description:
      'Escape to the snow-capped Himalayan peaks of Manali. Adventure awaits at Solang Valley with paragliding, snow scooters at Rohtang Pass, the scenic drive through Atal Tunnel, peaceful Hadimba Temple, and cozy riverside cafes in Old Manali.',
    shortDescription: 'Rohtang snow, Solang paragliding & Atal Tunnel',
    location: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'North India',
    category: 'mountain',
    images: [
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
      { url: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800' },
    ],
    pricePerPerson: 18999,
    duration: 5,
    highlights: [
      'Rohtang Pass Snow Point & Skiing',
      'Solang Valley Adventure Sports & Zorbing',
      'Engineering Marvel: Atal Tunnel to Sissu Waterfall',
      'Hadimba Devi Temple & Vashisht Hot Springs',
      'Old Manali Cafes, Mall Road & Beas River Trek',
    ],
    included: ['Resort Stay with Mountain View', 'Breakfast & Dinner', 'Private Cab for Solang/Rohtang', 'Campfire Night'],
    excluded: ['Adventure activity tickets', 'Rohtang green permit fees'],
    coordinates: { lat: 32.2396, lng: 77.1887 },
    rating: 4.8,
    numReviews: 215,
    isFeatured: true,
    isTrending: true,
    tags: ['mountain', 'snow', 'adventure', 'manali', 'himachal pradesh', 'budget'],
  },
  {
    title: 'Rishikesh & Haridwar: Ganga Aarti & River Rafting',
    slug: 'rishikesh-haridwar-ganga-aarti-river-rafting',
    description:
      'The ultimate blend of spirituality and thrilling adrenaline. Experience world-class white water rafting on the holy Ganges, cliff jumping, bungee jumping, peaceful yoga retreats, and the soul-stirring evening Ganga Aarti at Triveni Ghat and Har Ki Pauri.',
    shortDescription: 'White water rafting, bungee jumping & Har Ki Pauri',
    location: 'Rishikesh & Haridwar',
    state: 'Uttarakhand',
    country: 'India',
    region: 'North India',
    category: 'adventure',
    images: [
      { url: 'https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=800' },
      { url: 'https://images.unsplash.com/photo-1600100397608-f010f444f494?w=800' },
    ],
    pricePerPerson: 12499,
    duration: 4,
    highlights: [
      '16 km White Water River Rafting (Grade III/IV Rapids)',
      'Triveni Ghat Evening Ganga Aarti with Diyas',
      'Har Ki Pauri Haridwar Sacred Darshan',
      'Ram Jhula, Laxman Jhula & Beatles Ashram',
      'Riverside Camping with Bonfire & Music',
    ],
    included: ['Riverside Camp / Hotel Stay', 'All Meals (Breakfast, Lunch, Dinner)', 'Rafting Gear & Certified Instructor', 'Campfire'],
    excluded: ['Bungee jumping fee', 'Personal transport to Rishikesh'],
    coordinates: { lat: 30.0869, lng: 78.2676 },
    rating: 4.8,
    numReviews: 172,
    isTrending: true,
    tags: ['adventure', 'rafting', 'rishikesh', 'uttarakhand', 'spiritual', 'budget'],
  },
  {
    title: "Kerala God's Own Country: Munnar & Houseboat Cruise",
    slug: 'kerala-gods-own-country-munnar-houseboat-cruise',
    description:
      'Unwind in the emerald green paradise of Kerala. Cruise through tranquil palm-fringed backwaters on a private luxury houseboat in Alleppey, breathe fresh mountain air in Munnar tea plantations, and rejuvenate with authentic Ayurvedic wellness therapies.',
    shortDescription: 'Munnar tea hills, Alleppey backwaters & Ayurveda',
    location: 'Munnar & Alleppey',
    state: 'Kerala',
    country: 'India',
    region: 'South India',
    category: 'beach',
    images: [
      { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800' },
      { url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800' },
    ],
    pricePerPerson: 22999,
    duration: 5,
    highlights: [
      'Private Deluxe Houseboat Stay in Alleppey Backwaters',
      'Munnar Tea Gardens, Mattupetty Dam & Echo Point',
      'Kathakali & Kalaripayattu Martial Arts Live Show',
      'Spice Plantation Tour & Authentic Ayurvedic Massage',
      'Varkala Cliff Beach & Sunset Viewpoint',
    ],
    included: ['Houseboat Stay with All Traditional Meals', 'Munnar Resort Stay', 'AC Private Cab', 'Spice Garden Entry'],
    excluded: ['Flights to Kochi', 'Personal shopping'],
    coordinates: { lat: 10.0889, lng: 77.0595 },
    rating: 4.9,
    numReviews: 240,
    isFeatured: true,
    tags: ['nature', 'kerala', 'munnar', 'alleppey', 'beach', 'honeymoon', 'luxury'],
  },
  {
    title: 'Goa Tropical Paradise: Beaches, Waterfalls & Heritage',
    slug: 'goa-tropical-paradise-beaches-waterfalls-heritage',
    description:
      'Sun, sand, and coastal vibes! Relax on golden beaches of North and South Goa, enjoy thrilling watersports, explore colonial Portuguese architecture in Old Goa, and witness the roaring milky spray of Dudhsagar Waterfalls.',
    shortDescription: 'Baga Beach, Dudhsagar Falls & Portuguese churches',
    location: 'Panaji & Calangute',
    state: 'Goa',
    country: 'India',
    region: 'West India',
    category: 'beach',
    images: [
      { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800' },
      { url: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800' },
    ],
    pricePerPerson: 16999,
    duration: 4,
    highlights: [
      'Baga, Calangute & Anjuna Beach Exploration',
      'Dudhsagar Waterfall Jeep Safari & Spice Farm Tour',
      'Basilica of Bom Jesus & Old Goa Churches (UNESCO)',
      'Mandovi River Sunset Cruise with Goan Folk Dance',
      'Watersports: Parasailing, Banana Ride & Jet Ski',
    ],
    included: ['Beach Resort Stay', 'Daily Breakfast', 'South Goa Guided Tour', 'Mandovi Cruise Ticket'],
    excluded: ['Watersport tickets', 'Flights to Goa'],
    coordinates: { lat: 15.2993, lng: 74.124 },
    rating: 4.8,
    numReviews: 310,
    isTrending: true,
    tags: ['beach', 'goa', 'nightlife', 'adventure', 'budget'],
  },
  {
    title: 'Kashmir Crown: Dal Lake, Gulmarg & Pahalgam',
    slug: 'kashmir-crown-dal-lake-gulmarg-pahalgam',
    description:
      'Discover heaven on Earth. Glide through the lotus waters of Dal Lake on a traditional Shikara, ride the world’s second highest Gondola cable car in snow-clad Gulmarg, and walk through the pine meadows of Betaab Valley in Pahalgam.',
    shortDescription: 'Dal Lake Shikara, Gulmarg Gondola & Pahalgam valley',
    location: 'Srinagar, Gulmarg & Pahalgam',
    state: 'Jammu & Kashmir',
    country: 'India',
    region: 'North India',
    category: 'luxury',
    images: [
      { url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800' },
      { url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800' },
    ],
    pricePerPerson: 28999,
    duration: 6,
    highlights: [
      'Heritage Cedar Wood Houseboat Stay on Dal Lake',
      'Shikara Ride & Floating Vegetable Market Tour',
      'Gulmarg Gondola Phase 1 & 2 Snow Point',
      'Pahalgam Betaab Valley & Aru Valley Tour',
      'Mughal Gardens (Shalimar Bagh & Nishat Bagh)',
      'Authentic Kashmiri Wazwan Dinner & Saffron Farms',
    ],
    included: ['Dal Lake Houseboat & Deluxe Hotel Stay', 'Breakfast & Dinner', 'Private Cab for all valleys', 'Shikara Ride'],
    excluded: ['Gondola tickets Phase 2', 'Pahalgam pony charges', 'Airfare'],
    coordinates: { lat: 34.0837, lng: 74.7973 },
    rating: 5.0,
    numReviews: 290,
    isFeatured: true,
    tags: ['kashmir', 'srinagar', 'snow', 'luxury', 'honeymoon', 'mountain'],
  },
  {
    title: 'Divine Ujjain Mahakal & Malwa Heritage',
    slug: 'divine-ujjain-mahakal-malwa-heritage',
    description:
      'Seek the divine grace of Lord Shiva at the sacred Mahakaleshwar Jyotirlinga. Witness the legendary Bhasma Aarti, walk through the newly sculpted grand Mahakal Lok Corridor, visit Omkareshwar on the Narmada River, and savor world-famous street food in Indore.',
    shortDescription: 'Mahakal Bhasma Aarti, Mahakal Lok & Omkareshwar',
    location: 'Ujjain & Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    region: 'Central India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1600100397608-f010f444f494?w=800' },
      { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800' },
    ],
    pricePerPerson: 12999,
    duration: 3,
    highlights: [
      'Mahakaleshwar Jyotirlinga Darshan & Bhasma Aarti',
      'Grand Mahakal Lok Corridor Night Walk & Light Show',
      'Omkareshwar & Mamleshwar Jyotirlinga Island Tour',
      'Ram Ghat Kshipra River Evening Aarti',
      'Indore Sarafa Bazaar Night Street Food Tour (Poha, Garadu)',
    ],
    included: ['Hotel Stay in Ujjain/Indore', 'Daily Breakfast', 'AC Cab for Ujjain-Omkareshwar', 'Temple Darshan Guidance'],
    excluded: ['VIP Bhasma Aarti online token fee', 'Train fare to Ujjain'],
    coordinates: { lat: 23.1765, lng: 75.7885 },
    rating: 4.9,
    numReviews: 180,
    isFeatured: true,
    tags: ['spiritual', 'ujjain', 'mahakal', 'jyotirlinga', 'madhya pradesh', 'budget'],
  },
  {
    title: 'Tamil Nadu Temple Trail: Madurai & Rameswaram',
    slug: 'tamil-nadu-temple-trail-madurai-rameswaram',
    description:
      'Discover magnificent Dravidian architecture and profound sanctity. Marvel at the soaring gopurams of Meenakshi Amman Temple in Madurai, take holy teerth snan at Ramanathaswamy Temple in Rameswaram, and stand at Dhanushkodi where the Indian Ocean meets the Bay of Bengal.',
    shortDescription: 'Meenakshi Amman, Rameswaram 1000 Pillars & Dhanushkodi',
    location: 'Madurai & Rameswaram',
    state: 'Tamil Nadu',
    country: 'India',
    region: 'South India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800' },
      { url: 'https://images.unsplash.com/photo-1621644820610-c116a8b79313?w=800' },
    ],
    pricePerPerson: 18499,
    duration: 5,
    highlights: [
      'Meenakshi Amman Temple & Thirumalai Nayak Palace (Madurai)',
      'Ramanathaswamy Temple 22 Holy Wells & Thousand Pillar Hall',
      'Dhanushkodi Ghost Town & Ram Setu Origin Point',
      'Scenic Drive on the Pamban Sea Bridge',
      'Kanyakumari Vivekananda Rock Memorial & Triveni Sangam Sunset',
    ],
    included: ['Deluxe Hotel Stays', 'Breakfast & Dinner', 'Private AC Vehicle for all transfers', 'Local Temple Guide'],
    excluded: ['Temple special pooja tickets', 'Train/Flight fare'],
    coordinates: { lat: 9.2876, lng: 79.3129 },
    rating: 4.9,
    numReviews: 160,
    tags: ['spiritual', 'heritage', 'tamil nadu', 'rameswaram', 'madurai', 'cultural'],
  },
  {
    title: 'Colors of Gujarat: Rann of Kutch & Dwarkadhish',
    slug: 'colors-of-gujarat-rann-of-kutch-dwarkadhish',
    description:
      'Witness the breathtaking White Salt Desert of Kutch gleaming under the moonlight, immerse yourself in colorful Kutchi folk music and handicrafts, and pay homage at the ancient Dwarkadhish Temple by the Arabian Sea.',
    shortDescription: 'White Rann of Kutch, Dwarkadhish & Somnath Jyotirlinga',
    location: 'Kutch & Dwarka',
    state: 'Gujarat',
    country: 'India',
    region: 'West India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800' },
      { url: 'https://images.unsplash.com/photo-1599818494199-07cd5b45a995?w=800' },
    ],
    pricePerPerson: 21999,
    duration: 5,
    highlights: [
      'White Rann of Kutch Sunset & Moonlight Walk',
      'Dwarkadhish Jagat Mandir & Bet Dwarka Boat Ride',
      'Somnath Jyotirlinga Evening Sound & Light Show',
      'Kala Dungar (Black Hill) Highest Point View',
      'Traditional Kutchi Handicrafts, Bhujodi Village & Garba',
    ],
    included: ['Tent City / Resort Stay', 'All Meals (Pure Veg Gujarati & Kathiyawadi)', 'Rann Permit Fees', 'Private AC Transport'],
    excluded: ['Flight/Train fare to Bhuj/Ahmedabad', 'Camel ride fees'],
    coordinates: { lat: 23.8344, lng: 69.8394 },
    rating: 4.8,
    numReviews: 145,
    isFeatured: true,
    tags: ['gujarat', 'kutch', 'dwarka', 'cultural', 'heritage', 'desert'],
  },
  {
    title: 'Jim Corbett Wildlife Safari & Nainital Lakes',
    slug: 'jim-corbett-wildlife-safari-nainital-lakes',
    description:
      'Feel the thrill of the jungle! Embark on open jeep safaris in India’s oldest national park to track the royal Bengal tiger and wild elephants, then unwind in the charming lake hill station of Nainital with cool mountain breezes and boating.',
    shortDescription: 'Bengal tiger jungle safari, Naini lake & viewpoints',
    location: 'Jim Corbett & Nainital',
    state: 'Uttarakhand',
    country: 'India',
    region: 'North India',
    category: 'wildlife',
    images: [
      { url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800' },
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
    ],
    pricePerPerson: 15999,
    duration: 4,
    highlights: [
      'Open 4x4 Jeep Safari in Jim Corbett National Park Zone',
      'Royal Bengal Tiger, Leopard & Wild Elephant Spotting',
      'Nainital Lake Boating & Mall Road Evening Stroll',
      'Snow View Point by Aerial Cable Car',
      'Corbett Waterfalls & Riverside Jungle Campfire',
    ],
    included: ['Jungle Resort & Nainital Hotel Stay', 'Breakfast & Dinner', '1 Jungle Jeep Safari with Forest Guide', 'All Transfers'],
    excluded: ['Extra safari permits', 'Personal boating expenses'],
    coordinates: { lat: 29.53, lng: 78.7747 },
    rating: 4.8,
    numReviews: 195,
    isTrending: true,
    tags: ['wildlife', 'safari', 'tiger', 'nainital', 'corbett', 'uttarakhand', 'mountain'],
  },
];

const reviews = [
  { rating: 5, title: 'Divine experience in Mathura & Vrindavan!', comment: 'Banke Bihari Ji and Prem Mandir were unforgettable. Perfect arrangements, hassle-free darshan and delicious pedas. Highly recommended!' },
  { rating: 5, title: 'Incredible experience', comment: 'Top-tier service, knowledgeable guides, and breathtaking locations. Can not wait to book our next trip with My-Odyssey!' },
  { rating: 5, title: 'Spiritual awakening in Varanasi', comment: 'The Ganga Aarti boat ride was mesmerizing. Everything was arranged seamlessly.' },
  { rating: 4, title: 'Great memories made', comment: 'Wonderful destination, helpful drivers, and great accommodations. Truly value for money.' },
  { rating: 5, title: 'Exceeded all expectations', comment: 'Flawless booking and itinerary execution. The local guides were deeply knowledgeable.' },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Destination.deleteMany();
  await Review.deleteMany();
  await Wishlist.deleteMany();
  await Booking.deleteMany();
  await Payment.deleteMany();
  await Notification.deleteMany();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@myodyssey.com',
    password: 'admin123',
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'Sandeep Vairagi',
    email: 'user@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['cultural', 'mountain', 'beach'], budgetRange: { min: 0, max: 150000 } },
  });

  const user2 = await User.create({
    name: 'Jane Explorer',
    email: 'jane@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['mountain', 'adventure'], budgetRange: { min: 0, max: 180000 } },
  });

  const user3 = await User.create({
    name: 'Bob Nomad',
    email: 'bob@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['cultural', 'luxury'], budgetRange: { min: 0, max: 200000 } },
  });

  const users = [user1, user2, user3];

  const createdDestinations = await Destination.insertMany(
    destinations.map((d) => ({ ...d, createdBy: admin._id }))
  );

  // Seed wishlists
  await Wishlist.create({ user: user1._id, destinations: [createdDestinations[0]._id, createdDestinations[1]._id] });
  await Wishlist.create({ user: user2._id, destinations: [createdDestinations[2]._id, createdDestinations[4]._id] });
  await Wishlist.create({ user: user3._id, destinations: [createdDestinations[0]._id] });
  await Wishlist.create({ user: admin._id, destinations: [] });

  // Seed reviews distributed across destinations & users
  for (let dIdx = 0; dIdx < createdDestinations.length; dIdx++) {
    const dest = createdDestinations[dIdx];
    for (let uIdx = 0; uIdx < users.length; uIdx++) {
      const rev = reviews[(dIdx + uIdx) % reviews.length];
      await Review.create({
        ...rev,
        user: users[uIdx]._id,
        destination: dest._id,
        isVerified: true,
      });
    }
  }

  // Seed 2026 Bookings and Payments for Indian Destinations
  const destMathura = createdDestinations[0];
  const destVaranasi = createdDestinations[1];
  const destRajasthan = createdDestinations[2];
  const destManali = createdDestinations[3];
  const destRishikesh = createdDestinations[4];

  // Booking 1: Mathura (Completed 2026 trip for user1)
  const booking1 = await Booking.create({
    user: user1._id,
    destination: destMathura._id,
    startDate: new Date('2026-09-10T10:00:00Z'),
    endDate: new Date('2026-09-14T10:00:00Z'),
    travelers: 2,
    totalPrice: destMathura.pricePerPerson * 2,
    pricePerPerson: destMathura.pricePerPerson,
    status: 'completed',
    paymentStatus: 'paid',
    contactInfo: { name: user1.name, email: user1.email, phone: '+91 98765 11111' },
    specialRequests: 'Near Prem Mandir hotel preferred, pure vegetarian meals',
    createdAt: new Date('2026-08-25T14:30:00Z'),
  });

  const payment1 = await Payment.create({
    user: user1._id,
    booking: booking1._id,
    razorpayOrderId: 'order_mathura_2026_01',
    razorpayPaymentId: 'pay_mathura_2026_01',
    razorpaySignature: 'sig_demo_verified',
    amount: booking1.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'upi',
    receipt: 'rcpt_mathura_01',
    createdAt: new Date('2026-08-25T14:35:00Z'),
  });
  booking1.payment = payment1._id;
  await booking1.save();

  // Booking 2: Manali (Upcoming confirmed 2026 trip for user1)
  const booking2 = await Booking.create({
    user: user1._id,
    destination: destManali._id,
    startDate: new Date('2026-12-15T10:00:00Z'),
    endDate: new Date('2026-12-20T10:00:00Z'),
    travelers: 2,
    totalPrice: destManali.pricePerPerson * 2,
    pricePerPerson: destManali.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user1.name, email: user1.email, phone: '+91 98765 11111' },
    specialRequests: 'Snow point cab & mountain view room',
    createdAt: new Date('2026-10-12T11:20:00Z'),
  });

  const payment2 = await Payment.create({
    user: user1._id,
    booking: booking2._id,
    razorpayOrderId: 'order_manali_2026_02',
    razorpayPaymentId: 'pay_manali_2026_02',
    razorpaySignature: 'sig_demo_verified',
    amount: booking2.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'card',
    receipt: 'rcpt_manali_02',
    createdAt: new Date('2026-10-12T11:25:00Z'),
  });
  booking2.payment = payment2._id;
  await booking2.save();

  // Booking 3: Varanasi (Confirmed 2026 trip for user2)
  const booking3 = await Booking.create({
    user: user2._id,
    destination: destVaranasi._id,
    startDate: new Date('2026-11-20T10:00:00Z'),
    endDate: new Date('2026-11-23T10:00:00Z'),
    travelers: 2,
    totalPrice: destVaranasi.pricePerPerson * 2,
    pricePerPerson: destVaranasi.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user2.name, email: user2.email, phone: '+91 98765 22222' },
    specialRequests: 'Ganga view room and private boat for Aarti',
    createdAt: new Date('2026-10-28T09:15:00Z'),
  });

  const payment3 = await Payment.create({
    user: user2._id,
    booking: booking3._id,
    razorpayOrderId: 'order_varanasi_2026_03',
    razorpayPaymentId: 'pay_varanasi_2026_03',
    razorpaySignature: 'sig_demo_verified',
    amount: booking3.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'upi',
    receipt: 'rcpt_varanasi_03',
    createdAt: new Date('2026-10-28T09:20:00Z'),
  });
  booking3.payment = payment3._id;
  await booking3.save();

  // Booking 4: Rajasthan (Pending payment for user3)
  const booking4 = await Booking.create({
    user: user3._id,
    destination: destRajasthan._id,
    startDate: new Date('2026-12-01T10:00:00Z'),
    endDate: new Date('2026-12-07T10:00:00Z'),
    travelers: 1,
    totalPrice: destRajasthan.pricePerPerson,
    pricePerPerson: destRajasthan.pricePerPerson,
    status: 'pending',
    paymentStatus: 'pending',
    contactInfo: { name: user3.name, email: user3.email, phone: '+91 98765 33333' },
    specialRequests: 'Desert safari & heritage haveli stay',
    createdAt: new Date('2026-11-15T16:00:00Z'),
  });

  // Booking 5: Rishikesh (Confirmed for user2)
  const booking5 = await Booking.create({
    user: user2._id,
    destination: destRishikesh._id,
    startDate: new Date('2026-12-25T10:00:00Z'),
    endDate: new Date('2026-12-29T10:00:00Z'),
    travelers: 2,
    totalPrice: destRishikesh.pricePerPerson * 2,
    pricePerPerson: destRishikesh.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user2.name, email: user2.email, phone: '+91 98765 22222' },
    specialRequests: 'Riverside camping and Grade III rafting',
    createdAt: new Date('2026-11-18T10:30:00Z'),
  });

  const payment5 = await Payment.create({
    user: user2._id,
    booking: booking5._id,
    razorpayOrderId: 'order_rishikesh_2026_05',
    razorpayPaymentId: 'pay_rishikesh_2026_05',
    razorpaySignature: 'sig_demo_verified',
    amount: booking5.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'netbanking',
    receipt: 'rcpt_rishikesh_05',
    createdAt: new Date('2026-11-18T10:35:00Z'),
  });
  booking5.payment = payment5._id;
  await booking5.save();

  // Seed Notifications
  await Notification.create({
    user: user1._id,
    type: 'booking',
    title: 'Trip Confirmed: Divine Mathura & Vrindavan',
    message: 'Your sacred pilgrimage to Mathura & Vrindavan has been confirmed. Radhe Radhe!',
    link: '/my-trips',
    createdAt: new Date('2026-08-25T14:36:00Z'),
  });

  await Notification.create({
    user: user1._id,
    type: 'promo',
    title: 'Explore India State-wise on My-Odyssey!',
    message: 'Discover newly added packages across Uttar Pradesh, Rajasthan, Himachal Pradesh, Uttarakhand, Kerala & Kashmir.',
    link: '/explore',
    createdAt: new Date('2026-11-01T08:00:00Z'),
  });

  console.log('Seed completed successfully with India Destinations!');
  console.log('Destinations:', createdDestinations.length);
  console.log('Mathura Featured:', createdDestinations[0].title);
  console.log('Bookings seeded: 5');
  console.log('Payments seeded: 4');
  console.log('Admin: admin@myodyssey.com / admin123');
  console.log('User:  user@myodyssey.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
