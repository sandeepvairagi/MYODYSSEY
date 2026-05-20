import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';

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
];

const reviews = [
  { rating: 5, title: 'Absolutely magical!', comment: 'Best trip of my life. Everything was perfectly organized.' },
  { rating: 4, title: 'Great experience', comment: 'Wonderful destination, would recommend to friends and family.' },
  { rating: 5, title: 'Exceeded expectations', comment: 'The guides were knowledgeable and accommodations were top-notch.' },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Destination.deleteMany();
  await Review.deleteMany();
  await Wishlist.deleteMany();

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
    preferences: { categories: ['beach', 'cultural'], budgetRange: { min: 0, max: 100000 } },
  });

  const user2 = await User.create({
    name: 'Jane Explorer',
    email: 'jane@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['mountain', 'adventure'], budgetRange: { min: 0, max: 150000 } },
  });

  const user3 = await User.create({
    name: 'Bob Nomad',
    email: 'bob@myodyssey.com',
    password: 'user123',
    role: 'user',
    preferences: { categories: ['city', 'luxury'], budgetRange: { min: 0, max: 200000 } },
  });

  const users = [user1, user2, user3];

  await Wishlist.create({ user: user1._id, destinations: [] });
  await Wishlist.create({ user: user2._id, destinations: [] });
  await Wishlist.create({ user: user3._id, destinations: [] });
  await Wishlist.create({ user: admin._id, destinations: [] });

  const createdDestinations = await Destination.insertMany(
    destinations.map((d) => ({ ...d, createdBy: admin._id }))
  );

  for (const dest of createdDestinations.slice(0, 4)) {
    for (let i = 0; i < reviews.length; i++) {
      await Review.create({
        ...reviews[i],
        user: users[i % users.length]._id,
        destination: dest._id,
        isVerified: true,
      });
    }
  }

  console.log('Seed completed!');
  console.log('Admin: admin@myodyssey.com / admin123');
  console.log('User:  user@myodyssey.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
