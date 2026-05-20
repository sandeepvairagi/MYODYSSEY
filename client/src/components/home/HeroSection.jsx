import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Wallet } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const heroSlides = [
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState({ keyword: '', budget: '', startDate: null, endDate: null });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.keyword) params.set('keyword', search.keyword);
    if (search.budget) params.set('pricePerPerson[lte]', search.budget);
    if (search.startDate) params.set('startDate', search.startDate.toISOString());
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {heroSlides.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-hero-pattern" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            ✈ Your Journey Begins Here
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Adventure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Explore breathtaking destinations, curated packages, and AI-powered itineraries — all in one premium travel experience.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where to?"
                value={search.keyword}
                onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <select
                value={search.budget}
                onChange={(e) => setSearch({ ...search, budget: e.target.value })}
                className="input-field pl-10 appearance-none"
              >
                <option value="">Any Budget</option>
                <option value="30000">Under ₹30,000</option>
                <option value="60000">Under ₹60,000</option>
                <option value="100000">Under ₹1,00,000</option>
                <option value="200000">Under ₹2,00,000</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <DatePicker
                selected={search.startDate}
                onChange={(date) => setSearch({ ...search, startDate: date })}
                placeholderText="Start Date"
                className="input-field pl-10 w-full"
                minDate={new Date()}
              />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto">
              <Search className="w-5 h-5" /> Search Trips
            </button>
          </div>
        </motion.form>

        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
