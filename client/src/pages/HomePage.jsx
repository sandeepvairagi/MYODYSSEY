import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import Testimonials from '../components/home/Testimonials';
import DestinationCard from '../components/destinations/DestinationCard';
import { fetchTrending, fetchFeatured } from '../redux/slices/destinationSlice';
import { DestinationCardSkeleton } from '../components/common/Skeleton';

export default function HomePage() {
  const dispatch = useDispatch();
  const { trending, featured } = useSelector((s) => s.destinations);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchFeatured());
  }, [dispatch]);

  return (
    <>
      <HeroSection />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Hot Right Now</span>
            <h2 className="section-title mt-2">Trending Destinations</h2>
          </div>
          <Link to="/explore" className="btn-outline hidden sm:flex">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.length ? trending.map((d, i) => <DestinationCard key={d._id} destination={d} index={i} />) : [...Array(4)].map((_, i) => <DestinationCardSkeleton key={i} />)}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Curated For You</span>
              <h2 className="section-title mt-2">Popular Packages</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.length ? featured.map((d, i) => <DestinationCard key={d._id} destination={d} index={i} />) : [...Array(3)].map((_, i) => <DestinationCardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-brand-600 to-brand-800 text-white border-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span className="font-semibold text-amber-200">AI-Powered</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Smart Itinerary Generator</h2>
            <p className="text-brand-100 max-w-lg">
              Let our AI craft personalized day-by-day itineraries based on your interests, budget, and travel style.
            </p>
          </div>
          <Link to="/explore" className="btn-secondary whitespace-nowrap">Explore Destinations</Link>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
