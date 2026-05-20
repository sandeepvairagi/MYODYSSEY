import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Destination from '../models/Destination.js';

// Decode optional token to personalize chatbot responses
const getOptionalUser = async (req) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.id).select('-password');
    }
  } catch (err) {
    // Ignore invalid tokens for chatbot guest session
  }
  return null;
};

export const getChatbotResponse = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const user = await getOptionalUser(req);
  const userName = user ? user.name : 'Guest';

  // 1. If OpenAI key is set, use AI model
  if (process.env.OPENAI_API_KEY) {
    try {
      const activeDestinations = await Destination.find({ isActive: true })
        .select('title location country pricePerPerson category rating highlights duration')
        .limit(10);

      const destinationContext = activeDestinations.map(d => (
        `- ${d.title} in ${d.location}, ${d.country} (Category: ${d.category}, Price: ₹${d.pricePerPerson}, Rating: ${d.rating} stars, Highlights: ${d.highlights.join(', ')}, Duration: ${d.duration} days)`
      )).join('\n');

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
              content: `You are OdysseyBot, a friendly virtual travel assistant for the travel platform "My-Odyssey".
User's Name: ${userName}. Address them nicely if appropriate.
Here are the current destinations available in our catalog:
${destinationContext}

Be concise, warm, helpful, and encourage users to book packages. Limit your response to 3-4 sentences. Format your output nicely using markdown.`
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        return res.json({ success: true, response: data.choices[0].message.content });
      }
    } catch (openaiError) {
      console.error('OpenAI Chatbot error, falling back to database query matching:', openaiError);
    }
  }

  // 2. Fallback Rule-Based & Database Query Assistant
  const cleanedMsg = message.toLowerCase().trim();

  // Greetings
  if (cleanedMsg.match(/\b(hi|hello|hey|greetings|hola)\b/)) {
    return res.json({
      success: true,
      response: `Hello ${userName}! 👋 Welcome to My-Odyssey. I am your virtual travel assistant. How can I help you today? You can ask me to "recommend a trip", "list beach destinations", or ask "how to book a trip".`
    });
  }

  // Booking details
  if (cleanedMsg.match(/\b(book|booking|reserve|reservation|how to book)\b/)) {
    return res.json({
      success: true,
      response: `Booking a trip is easy! 🗺️\n\n1. **Register/Login** to your account.\n2. Go to the **Explore** page and choose your dream destination.\n3. Click **Book Now** on the detail page, fill in the travelers list, and complete the secure payment through Razorpay.\n\nYou can track all your active packages under your **My Trips** dashboard.`
    });
  }

  // Budget/Price queries
  if (cleanedMsg.match(/\b(price|budget|cheap|cost|expensive|amount|rate)\b/)) {
    const cheapDestinations = await Destination.find({ isActive: true })
      .sort({ pricePerPerson: 1 })
      .limit(3)
      .select('title location pricePerPerson rating slug');

    const destList = cheapDestinations.map(d => `- **${d.title}** (₹${d.pricePerPerson} per person, Rating: ${d.rating}⭐)`).join('\n');
    return res.json({
      success: true,
      response: `We have great packages for all budgets! Here are some of our most affordable packages:\n\n${destList}\n\nYou can browse more destinations on our **Explore** page and filter by price range.`
    });
  }

  // Category search (beach, mountain, city, adventure, cultural, luxury, wildlife)
  const categories = ['beach', 'mountain', 'city', 'adventure', 'cultural', 'luxury', 'wildlife'];
  for (const cat of categories) {
    if (cleanedMsg.includes(cat)) {
      const matches = await Destination.find({ isActive: true, category: cat })
        .limit(3)
        .select('title location country pricePerPerson rating');

      if (matches.length > 0) {
        const list = matches.map(d => `- **${d.title}** in ${d.location}, ${d.country} (₹${d.pricePerPerson}, Rating: ${d.rating}⭐)`).join('\n');
        return res.json({
          success: true,
          response: `Here are some amazing **${cat}** destinations available right now:\n\n${list}\n\nWould you like more details on any of these?`
        });
      }
    }
  }

  // Particular destination search
  const allDestinations = await Destination.find({ isActive: true }).select('title location country pricePerPerson category highlights duration');
  for (const dest of allDestinations) {
    const searchTerms = [
      dest.title.toLowerCase(),
      dest.location.toLowerCase(),
      dest.country.toLowerCase()
    ];
    if (searchTerms.some(term => cleanedMsg.includes(term))) {
      return res.json({
        success: true,
        response: `**${dest.title}** is a gorgeous ${dest.duration}-day **${dest.category}** package located in ${dest.location}, ${dest.country}.\n\n* **Price**: ₹${dest.pricePerPerson} per person\n* **Highlights**: ${dest.highlights.join(', ')}\n\nWould you like to book this trip? You can do so by visiting the destination detail page!`
      });
    }
  }

  // Recommendations query
  if (cleanedMsg.match(/\b(recommend|recommendation|suggest|suggestion|where to go|help me choose)\b/)) {
    const topRated = await Destination.find({ isActive: true, isFeatured: true })
      .sort({ rating: -1 })
      .limit(3)
      .select('title location country pricePerPerson rating');

    const list = topRated.map(d => `- **${d.title}** in ${d.country} (Rating: ${d.rating}⭐, ₹${d.pricePerPerson})`).join('\n');
    return res.json({
      success: true,
      response: `I highly recommend checking out our featured destinations:\n\n${list}\n\nIf you tell me what you prefer (e.g. beach relaxation, mountain climbing, city exploring), I can refine the suggestions for you!`
    });
  }

  // Help/Default response
  return res.json({
    success: true,
    response: `I'm here to help you plan your perfect trip! 🌍 You can ask me:\n\n- "Which beach destinations do you have?"\n- "How do I book a trip?"\n- "What are the cheapest travel packages?"\n- "Tell me about Bali or Swiss Alps Adventure"`
  });
});
