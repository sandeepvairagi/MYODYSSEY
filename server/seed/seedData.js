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
    title: 'Bali Paradise Escape',
    slug: 'bali-paradise-escape',
    description: 'Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Perfect for honeymooners and adventure seekers alike.',
    shortDescription: 'Tropical beaches, temples & rice terraces',
    location: 'Ubud',
    country: 'Indonesia',
    category: 'beach',
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
      { url: 'https://images.unsplash.com/photo-1518548419970-58e985b0a0e0?w=800' },
    ],
    pricePerPerson: 45999,
    duration: 7,
    highlights: ['Tanah Lot Temple', 'Rice Terraces', 'Beach Clubs', 'Spa Retreat'],
    included: ['Flights', '4-Star Hotel', 'Breakfast', 'Airport Transfer'],
    excluded: ['Lunch', 'Dinner', 'Personal expenses'],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    rating: 4.8,
    numReviews: 124,
    isFeatured: true,
    isTrending: true,
    tags: ['beach', 'romantic', 'wellness'],
  },
  {
    title: 'Swiss Alps Adventure',
    slug: 'swiss-alps-adventure',
    description: 'Experience breathtaking alpine scenery, world-class skiing, and charming Swiss villages in this unforgettable mountain getaway.',
    shortDescription: 'Alpine peaks, skiing & chocolate trails',
    location: 'Zermatt',
    country: 'Switzerland',
    category: 'mountain',
    images: [
      { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    ],
    pricePerPerson: 125000,
    duration: 6,
    highlights: ['Matterhorn Views', 'Cable Car Rides', 'Swiss Cuisine', 'Hiking Trails'],
    included: ['Hotel', 'Ski Pass', 'Guide', 'Breakfast'],
    excluded: ['Flights', 'Equipment rental'],
    coordinates: { lat: 46.0207, lng: 7.7491 },
    rating: 4.9,
    numReviews: 89,
    isFeatured: true,
    isTrending: true,
    tags: ['adventure', 'winter', 'luxury'],
  },
  {
    title: 'Tokyo Neon Nights',
    slug: 'tokyo-neon-nights',
    description: 'Immerse yourself in the electric energy of Tokyo — from ancient shrines to futuristic districts, sushi masters to karaoke bars.',
    shortDescription: 'Modern metropolis meets ancient tradition',
    location: 'Shibuya',
    country: 'Japan',
    category: 'city',
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
      { url: 'https://images.unsplash.com/photo-1493976040374-85c8e912f1f7?w=800' },
    ],
    pricePerPerson: 89999,
    duration: 5,
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market', 'Akihabara'],
    included: ['Hotel', 'JR Pass', 'Guided Tour', 'Breakfast'],
    excluded: ['Flights', 'Lunch', 'Dinner'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    rating: 4.7,
    numReviews: 203,
    isTrending: true,
    tags: ['city', 'food', 'culture'],
  },
  {
    title: 'Santorini Sunset Dreams',
    slug: 'santorini-sunset-dreams',
    description: 'Whitewashed villages perched on volcanic cliffs, infinity pools overlooking the Aegean, and sunsets that steal your breath.',
    shortDescription: 'Iconic Greek island romance',
    location: 'Oia',
    country: 'Greece',
    category: 'beach',
    images: [
      { url: 'https://images.unsplash.com/photo-1613395877344-13d2713bb166?w=800' },
      { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69adce7?w=800' },
    ],
    pricePerPerson: 78999,
    duration: 5,
    highlights: ['Oia Sunset', 'Wine Tasting', 'Volcano Tour', 'Blue Domes'],
    included: ['Boutique Hotel', 'Catamaran Cruise', 'Transfers'],
    excluded: ['Flights', 'Meals'],
    coordinates: { lat: 36.4618, lng: 25.3753 },
    rating: 4.9,
    numReviews: 156,
    isFeatured: true,
    tags: ['romantic', 'luxury', 'beach'],
  },
  {
    title: 'Rajasthan Royal Heritage',
    slug: 'rajasthan-royal-heritage',
    description: 'Walk through palaces of maharajas, ride camels across golden dunes, and witness the colors of India\'s most regal state.',
    shortDescription: 'Palaces, forts & desert safaris',
    location: 'Jaipur',
    country: 'India',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1477587458883-1a9ed978d8cf?w=800' },
      { url: 'https://images.unsplash.com/photo-1524492412937-280b9d999ca8?w=800' },
    ],
    pricePerPerson: 28999,
    duration: 8,
    highlights: ['Amber Fort', 'Desert Safari', 'Palace Hotels', 'Folk Dance'],
    included: ['Heritage Hotel', 'All Meals', 'AC Transport', 'Guide'],
    excluded: ['Flights', 'Tips'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    rating: 4.6,
    numReviews: 312,
    isTrending: true,
    tags: ['culture', 'heritage', 'budget'],
  },
  {
    title: 'Maldives Overwater Bliss',
    slug: 'maldives-overwater-bliss',
    description: 'Ultimate luxury in overwater villas with crystal-clear lagoons, world-class diving, and private beach dinners under the stars.',
    shortDescription: 'Luxury overwater villa experience',
    location: 'Male Atoll',
    country: 'Maldives',
    category: 'luxury',
    images: [
      { url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800' },
      { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800' },
    ],
    pricePerPerson: 189999,
    duration: 4,
    highlights: ['Overwater Villa', 'Snorkeling', 'Spa', 'Private Dining'],
    included: ['Resort Stay', 'All Meals', 'Seaplane Transfer', 'Water Sports'],
    excluded: ['International Flights'],
    coordinates: { lat: 3.2028, lng: 73.2207 },
    rating: 5.0,
    numReviews: 67,
    isFeatured: true,
    tags: ['luxury', 'honeymoon', 'beach'],
  },
  {
    title: 'Amazon Wildlife Expedition',
    slug: 'amazon-wildlife-expedition',
    description: 'Venture deep into the Amazon rainforest for an eco-adventure featuring exotic wildlife, indigenous communities, and river cruises.',
    shortDescription: 'Rainforest eco-adventure',
    location: 'Manaus',
    country: 'Brazil',
    category: 'wildlife',
    images: [
      { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800' },
    ],
    pricePerPerson: 67999,
    duration: 6,
    highlights: ['Jungle Trek', 'River Cruise', 'Wildlife Spotting', 'Local Tribes'],
    included: ['Lodge Stay', 'Meals', 'Guide', 'Equipment'],
    excluded: ['Flights', 'Vaccinations'],
    coordinates: { lat: -3.119, lng: -60.0217 },
    rating: 4.5,
    numReviews: 45,
    tags: ['adventure', 'nature', 'eco'],
  },
  {
    title: 'Dubai Desert & Skyline',
    slug: 'dubai-desert-skyline',
    description: 'Experience the contrast of futuristic skyscrapers and ancient desert traditions in the city of gold.',
    shortDescription: 'Luxury shopping & desert safaris',
    location: 'Dubai',
    country: 'UAE',
    category: 'city',
    images: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
    ],
    pricePerPerson: 54999,
    duration: 4,
    highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Palm Jumeirah'],
    included: ['5-Star Hotel', 'Desert Safari', 'City Tour'],
    excluded: ['Flights', 'Shopping'],
    coordinates: { lat: 25.2048, lng: 55.2708 },
    rating: 4.6,
    numReviews: 178,
    isTrending: true,
    tags: ['luxury', 'shopping', 'desert'],
  },
  {
    title: 'Amalfi Coast & Capri Explorer',
    slug: 'amalfi-coast-capri-explorer',
    description: 'Cliffside colorful towns, Mediterranean azure waters, limoncello groves, and glamorous Italian coastal living.',
    shortDescription: 'Italian cliffside paradise and boat excursions',
    location: 'Positano',
    country: 'Italy',
    category: 'luxury',
    images: [
      { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
      { url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800' },
    ],
    pricePerPerson: 115000,
    duration: 6,
    highlights: ['Capri Boat Cruise', 'Positano Cliff Walk', 'Limoncello Tasting', 'Pompeii Day Tour'],
    included: ['Boutique Villa Hotel', 'Daily Breakfast', 'Private Boat Transfer', 'Wine Tour'],
    excluded: ['Flights', 'Personal shopping'],
    coordinates: { lat: 40.6281, lng: 14.4850 },
    rating: 4.9,
    numReviews: 112,
    isFeatured: true,
    isTrending: true,
    tags: ['luxury', 'romantic', 'scenic'],
  },
  {
    title: 'Northern Lights & Ice Caves',
    slug: 'northern-lights-ice-caves',
    description: 'Witness the ethereal Aurora Borealis glowing across glacier lagoons, volcanic black sands, and crystalline blue ice caves.',
    shortDescription: 'Aurora Borealis and blue glacier caves',
    location: 'Reykjavik',
    country: 'Iceland',
    category: 'adventure',
    images: [
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800' },
      { url: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800' },
    ],
    pricePerPerson: 139999,
    duration: 7,
    highlights: ['Northern Lights Hunt', 'Crystal Ice Cave', 'Blue Lagoon Thermal Spa', 'Golden Circle'],
    included: ['4-Star Lodging', 'Super Jeep Aurora Tour', 'Spa Entrance', 'Thermal Gear'],
    excluded: ['International Flights', 'Optional snowmobile rental'],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    rating: 4.9,
    numReviews: 95,
    isFeatured: true,
    isTrending: true,
    tags: ['adventure', 'nature', 'winter'],
  },
  {
    title: 'Kyoto Zen & Cherry Blossoms',
    slug: 'kyoto-zen-cherry-blossoms',
    description: 'Wander through thousands of vermilion torii gates, bamboo groves, and ancient wooden pagodas surrounded by sakura petals.',
    shortDescription: 'Historic shrines, tea ceremonies & sakura gardens',
    location: 'Kyoto',
    country: 'Japan',
    category: 'cultural',
    images: [
      { url: 'https://images.unsplash.com/photo-1493976040374-85c8e912f1f7?w=800' },
      { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800' },
    ],
    pricePerPerson: 92000,
    duration: 6,
    highlights: ['Fushimi Inari Taisha', 'Arashiyama Bamboo Grove', 'Traditional Tea Ceremony', 'Kinkaku-ji Gold Pavilion'],
    included: ['Traditional Ryokan & Hotel', 'Bullet Train Passes', 'Certified Local Guide', 'Breakfast'],
    excluded: ['Flights', 'Souvenirs'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
    rating: 4.8,
    numReviews: 148,
    isTrending: true,
    tags: ['cultural', 'heritage', 'zen'],
  },
  {
    title: 'Serengeti Great Migration Safari',
    slug: 'serengeti-great-migration-safari',
    description: 'Experience nature\'s greatest spectacle on Earth. Witness massive herds of wildebeest and zebra crossing the savannah alongside lions and cheetahs.',
    shortDescription: 'Witness the Big Five in Tanzania\'s wilderness',
    location: 'Serengeti National Park',
    country: 'Tanzania',
    category: 'wildlife',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800' },
      { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800' },
    ],
    pricePerPerson: 165000,
    duration: 6,
    highlights: ['Big Five Game Drives', 'Ngorongoro Crater', 'Hot Air Balloon Safari', 'Masai Cultural Experience'],
    included: ['Luxury Tented Camps', 'All Meals', '4x4 Safari Land Cruiser', 'Park Entrance Fees'],
    excluded: ['International Flights', 'Tips'],
    coordinates: { lat: -2.3333, lng: 34.8333 },
    rating: 5.0,
    numReviews: 83,
    isFeatured: true,
    tags: ['wildlife', 'safari', 'adventure'],
  },
];

const reviews = [
  { rating: 5, title: 'Absolutely magical!', comment: 'Best trip of my life in 2026. Everything was perfectly organized from airport pickup to tours.' },
  { rating: 5, title: 'Incredible experience', comment: 'Top-tier service and breathtaking locations. Can not wait to book our next trip with My-Odyssey!' },
  { rating: 4, title: 'Great memories made', comment: 'Wonderful destination, helpful guides, and great accommodations. Highly recommended.' },
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
    name: 'John Traveler',
    email: 'user@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['beach', 'cultural', 'mountain'], budgetRange: { min: 0, max: 150000 } },
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
    preferences: { categories: ['city', 'luxury'], budgetRange: { min: 0, max: 200000 } },
  });

  const users = [user1, user2, user3];

  const createdDestinations = await Destination.insertMany(
    destinations.map((d) => ({ ...d, createdBy: admin._id }))
  );

  // Seed wishlists
  await Wishlist.create({ user: user1._id, destinations: [createdDestinations[0]._id, createdDestinations[1]._id] });
  await Wishlist.create({ user: user2._id, destinations: [createdDestinations[3]._id, createdDestinations[5]._id] });
  await Wishlist.create({ user: user3._id, destinations: [createdDestinations[2]._id] });
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

  // Seed 2026 Bookings and Payments
  const destBali = createdDestinations[0];
  const destSwiss = createdDestinations[1];
  const destTokyo = createdDestinations[2];
  const destSantorini = createdDestinations[3];
  const destRajasthan = createdDestinations[4];

  // Booking 1 (Completed 2026 trip for user1)
  const booking1 = await Booking.create({
    user: user1._id,
    destination: destBali._id,
    startDate: new Date('2026-09-10T10:00:00Z'),
    endDate: new Date('2026-09-17T10:00:00Z'),
    travelers: 2,
    totalPrice: destBali.pricePerPerson * 2,
    pricePerPerson: destBali.pricePerPerson,
    status: 'completed',
    paymentStatus: 'paid',
    contactInfo: { name: user1.name, email: user1.email, phone: '+91 98765 11111' },
    specialRequests: 'Ocean view room preferred',
    createdAt: new Date('2026-08-25T14:30:00Z'),
  });

  const payment1 = await Payment.create({
    user: user1._id,
    booking: booking1._id,
    razorpayOrderId: 'order_demo_2026_01',
    razorpayPaymentId: 'pay_demo_2026_01',
    razorpaySignature: 'sig_demo_verified',
    amount: booking1.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'upi',
    receipt: 'rcpt_2026_01',
    createdAt: new Date('2026-08-25T14:35:00Z'),
  });
  booking1.payment = payment1._id;
  await booking1.save();

  // Booking 2 (Upcoming confirmed 2026 trip for user1)
  const booking2 = await Booking.create({
    user: user1._id,
    destination: destSwiss._id,
    startDate: new Date('2026-12-15T10:00:00Z'),
    endDate: new Date('2026-12-21T10:00:00Z'),
    travelers: 2,
    totalPrice: destSwiss.pricePerPerson * 2,
    pricePerPerson: destSwiss.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user1.name, email: user1.email, phone: '+91 98765 11111' },
    specialRequests: 'Ski pass equipment included',
    createdAt: new Date('2026-10-12T11:20:00Z'),
  });

  const payment2 = await Payment.create({
    user: user1._id,
    booking: booking2._id,
    razorpayOrderId: 'order_demo_2026_02',
    razorpayPaymentId: 'pay_demo_2026_02',
    razorpaySignature: 'sig_demo_verified',
    amount: booking2.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'card',
    receipt: 'rcpt_2026_02',
    createdAt: new Date('2026-10-12T11:25:00Z'),
  });
  booking2.payment = payment2._id;
  await booking2.save();

  // Booking 3 (Confirmed 2026 trip for user2 Jane)
  const booking3 = await Booking.create({
    user: user2._id,
    destination: destSantorini._id,
    startDate: new Date('2026-11-20T10:00:00Z'),
    endDate: new Date('2026-11-25T10:00:00Z'),
    travelers: 2,
    totalPrice: destSantorini.pricePerPerson * 2,
    pricePerPerson: destSantorini.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user2.name, email: user2.email, phone: '+91 98765 22222' },
    createdAt: new Date('2026-10-28T09:15:00Z'),
  });

  const payment3 = await Payment.create({
    user: user2._id,
    booking: booking3._id,
    razorpayOrderId: 'order_demo_2026_03',
    razorpayPaymentId: 'pay_demo_2026_03',
    razorpaySignature: 'sig_demo_verified',
    amount: booking3.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'netbanking',
    receipt: 'rcpt_2026_03',
    createdAt: new Date('2026-10-28T09:20:00Z'),
  });
  booking3.payment = payment3._id;
  await booking3.save();

  // Booking 4 (Confirmed 2026 trip for user3 Bob)
  const booking4 = await Booking.create({
    user: user3._id,
    destination: destTokyo._id,
    startDate: new Date('2026-12-01T10:00:00Z'),
    endDate: new Date('2026-12-06T10:00:00Z'),
    travelers: 1,
    totalPrice: destTokyo.pricePerPerson,
    pricePerPerson: destTokyo.pricePerPerson,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: { name: user3.name, email: user3.email, phone: '+91 98765 33333' },
    createdAt: new Date('2026-11-05T16:40:00Z'),
  });

  const payment4 = await Payment.create({
    user: user3._id,
    booking: booking4._id,
    razorpayOrderId: 'order_demo_2026_04',
    razorpayPaymentId: 'pay_demo_2026_04',
    razorpaySignature: 'sig_demo_verified',
    amount: booking4.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'card',
    receipt: 'rcpt_2026_04',
    createdAt: new Date('2026-11-05T16:45:00Z'),
  });
  booking4.payment = payment4._id;
  await booking4.save();

  // Booking 5 (Completed 2026 trip for user1)
  const booking5 = await Booking.create({
    user: user1._id,
    destination: destRajasthan._id,
    startDate: new Date('2026-10-05T10:00:00Z'),
    endDate: new Date('2026-10-13T10:00:00Z'),
    travelers: 2,
    totalPrice: destRajasthan.pricePerPerson * 2,
    pricePerPerson: destRajasthan.pricePerPerson,
    status: 'completed',
    paymentStatus: 'paid',
    contactInfo: { name: user1.name, email: user1.email, phone: '+91 98765 11111' },
    createdAt: new Date('2026-09-20T12:00:00Z'),
  });

  const payment5 = await Payment.create({
    user: user1._id,
    booking: booking5._id,
    razorpayOrderId: 'order_demo_2026_05',
    razorpayPaymentId: 'pay_demo_2026_05',
    razorpaySignature: 'sig_demo_verified',
    amount: booking5.totalPrice,
    currency: 'INR',
    status: 'captured',
    method: 'upi',
    receipt: 'rcpt_2026_05',
    createdAt: new Date('2026-09-20T12:05:00Z'),
  });
  booking5.payment = payment5._id;
  await booking5.save();

  // Seed Notifications for 2026
  await Notification.create({
    user: user1._id,
    type: 'booking',
    title: 'Trip Confirmed: Swiss Alps Adventure',
    message: 'Your booking for Swiss Alps Adventure (Dec 15–21, 2026) is confirmed! Prepare for an unforgettable journey.',
    link: '/my-trips',
    createdAt: new Date('2026-10-12T11:26:00Z'),
  });

  await Notification.create({
    user: user1._id,
    type: 'promo',
    title: 'Welcome to My-Odyssey 2026!',
    message: 'Check out our newly added destinations including Amalfi Coast, Northern Lights, and Serengeti Safaris.',
    link: '/explore',
    createdAt: new Date('2026-11-01T08:00:00Z'),
  });

  await Notification.create({
    user: user2._id,
    type: 'booking',
    title: 'Trip Confirmed: Santorini Sunset Dreams',
    message: 'Your romantic Santorini getaway (Nov 20–25, 2026) has been confirmed.',
    link: '/my-trips',
    createdAt: new Date('2026-10-28T09:21:00Z'),
  });

  console.log('Seed completed successfully for 2026!');
  console.log('Destinations:', createdDestinations.length);
  console.log('Bookings seeded: 5');
  console.log('Payments seeded: 5');
  console.log('Admin: admin@myodyssey.com / admin123');
  console.log('User:  user@myodyssey.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
