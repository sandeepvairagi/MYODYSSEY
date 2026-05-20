import Destination from '../models/Destination.js';

export const getPersonalizedRecommendations = async (user, limit = 6) => {
  const query = { isActive: true };

  if (user?.preferences?.categories?.length) {
    query.category = { $in: user.preferences.categories };
  }

  if (user?.preferences?.budgetRange?.max) {
    query.pricePerPerson = { $lte: user.preferences.budgetRange.max };
  }

  const viewedIds = user?.recentlyViewed?.map((r) => r.destination).filter(Boolean) || [];
  if (viewedIds.length) {
    const viewed = await Destination.find({ _id: { $in: viewedIds } }).select('category country');
    const categories = [...new Set(viewed.map((d) => d.category))];
    const countries = [...new Set(viewed.map((d) => d.country))];
    if (categories.length) query.$or = [{ category: { $in: categories } }, { country: { $in: countries } }];
  }

  return Destination.find(query)
    .sort({ rating: -1, isTrending: -1 })
    .limit(limit)
    .select('-itinerary');
};
