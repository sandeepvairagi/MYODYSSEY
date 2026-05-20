import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal } from 'lucide-react';
import DestinationCard from '../components/destinations/DestinationCard';
import Pagination from '../components/common/Pagination';
import { PageSkeleton } from '../components/common/Skeleton';
import { fetchDestinations } from '../redux/slices/destinationSlice';
import { useDebounce } from '../hooks/useDebounce';

const categories = ['all', 'beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury', 'budget'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, loading, totalPages, currentPage } = useSelector((s) => s.destinations);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('-rating');
  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    const params = { page: searchParams.get('page') || 1, sort };
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (category !== 'all') params.category = category;
    if (searchParams.get('pricePerPerson[lte]')) params['pricePerPerson[lte]'] = searchParams.get('pricePerPerson[lte]');
    dispatch(fetchDestinations(params));
  }, [dispatch, debouncedKeyword, category, sort, searchParams]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Explore Destinations</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover your next adventure from our curated collection</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-auto">
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto">
            <option value="-rating">Top Rated</option>
            <option value="pricePerPerson">Price: Low to High</option>
            <option value="-pricePerPerson">Price: High to Low</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-50'
            }`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : list.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d, i) => <DestinationCard key={d._id} destination={d} index={i} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="text-center py-20">
          <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No destinations found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
