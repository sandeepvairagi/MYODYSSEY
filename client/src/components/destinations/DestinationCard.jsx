import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import { formatPrice, getImageUrl } from '../../utils/formatters';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function DestinationCard({ destination, index = 0 }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const wishlistIds = useSelector((s) => s.wishlist.ids);
  const isWishlisted = wishlistIds.includes(destination._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to save destinations');
      return;
    }
    const result = await dispatch(toggleWishlist(destination._id));
    if (toggleWishlist.fulfilled.match(result)) {
      toast.success(result.payload.added ? 'Added to wishlist' : 'Removed from wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/destinations/${destination.slug || destination._id}`} className="card group block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={getImageUrl(destination)}
            alt={destination.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {destination.isTrending && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
              Trending
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">{destination.category}</span>
            <h3 className="text-lg font-bold text-white mt-1">{destination.title}</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{destination.location}, {destination.country}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StarRating rating={destination.rating} />
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" /> {destination.duration} days
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">from</p>
              <p className="font-bold text-brand-600 dark:text-brand-400">{formatPrice(destination.pricePerPerson)}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
