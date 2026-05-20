// AI itinerary generator - uses OpenAI when key is set, otherwise rule-based fallback
export const generateItinerary = async ({ destination, days, interests = [] }) => {
  const { title, location, country, category, highlights = [] } = destination;

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a travel planner. Return JSON array of day itineraries with day, title, description, activities fields.',
            },
            {
              role: 'user',
              content: `Create a ${days}-day itinerary for ${title} in ${location}, ${country}. Category: ${category}. Interests: ${interests.join(', ') || 'general sightseeing'}. Highlights: ${highlights.join(', ')}.`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed.itinerary || parsed.days || parsed;
    } catch {
      // fall through to rule-based
    }
  }

  const activitiesByCategory = {
    beach: ['Beach relaxation', 'Water sports', 'Sunset cruise', 'Seafood dining'],
    mountain: ['Trekking', 'Scenic viewpoints', 'Local village visit', 'Campfire evening'],
    city: ['City walking tour', 'Museum visit', 'Local cuisine', 'Night market'],
    adventure: ['Adventure sports', 'Guided expedition', 'Wildlife spotting', 'Camping'],
    cultural: ['Heritage sites', 'Local crafts workshop', 'Traditional performance', 'Temple tour'],
    default: ['Sightseeing', 'Local food tour', 'Photography spots', 'Free exploration'],
  };

  const pool = activitiesByCategory[category] || activitiesByCategory.default;
  const itinerary = [];

  for (let d = 1; d <= days; d++) {
    itinerary.push({
      day: d,
      title: d === 1 ? `Arrival in ${location}` : d === days ? 'Departure Day' : `Explore ${location} - Day ${d}`,
      description: `Day ${d} of your ${title} adventure in ${country}.`,
      activities: [
        pool[(d - 1) % pool.length],
        pool[d % pool.length],
        d === 1 ? 'Check-in & orientation' : 'Evening leisure time',
      ],
    });
  }

  return itinerary;
};
