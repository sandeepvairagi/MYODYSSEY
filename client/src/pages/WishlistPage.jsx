import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/destinations/DestinationCard';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { PageSkeleton } from '../components/common/Skeleton';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">My Wishlist</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">Destinations you&apos;ve saved for later</p>
      {loading ? (
        <PageSkeleton />
      ) : items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d, i) => <DestinationCard key={d._id} destination={d} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/explore" className="btn-primary">Explore Destinations</Link>
        </div>
      )}
    </div>
  );
}
