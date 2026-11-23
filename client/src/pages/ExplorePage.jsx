import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import DestinationCard from '../components/destinations/DestinationCard';
import Pagination from '../components/common/Pagination';
import { PageSkeleton } from '../components/common/Skeleton';
import { fetchDestinations } from '../redux/slices/destinationSlice';
import { useDebounce } from '../hooks/useDebounce';

const categories = ['all', 'beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury', 'budget'];

const priceFilters = [
  { value: '', label: 'Any Price' },
  { value: '50000', label: 'Under ₹50,000' },
  { value: '75000', label: 'Under ₹75,000' },
  { value: '100000', label: 'Under ₹1,00,000' },
  { value: '150000', label: 'Under ₹1,50,000' },
  { value: '200000', label: 'Under ₹2,00,000' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, loading, totalPages, currentPage } = useSelector((s) => s.destinations);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || searchParams.get('pricePerPerson[lte]') || ''
  );
  const [sort, setSort] = useState(searchParams.get('sort') || '-rating');
  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    const params = { page: searchParams.get('page') || 1, sort };
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (category === 'budget') {
      params.category = 'budget';
      if (!maxPrice) params.maxPrice = '75000';
    } else if (category !== 'all') {
      params.category = category;
    }
    if (maxPrice) params.maxPrice = maxPrice;
    dispatch(fetchDestinations(params));
  }, [dispatch, debouncedKeyword, category, maxPrice, sort, searchParams]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const handleCategoryClick = (c) => {
    setCategory(c);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    if (c === 'all') params.delete('category');
    else params.set('category', c);
    if (c === 'budget' && !maxPrice) {
      params.set('maxPrice', '75000');
      setMaxPrice('75000');
    }
    setSearchParams(params);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    if (value) params.set('maxPrice', value);
    else params.delete('maxPrice');
    params.delete('pricePerPerson[lte]');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('all');
    setMaxPrice('');
    setSort('-rating');
    setSearchParams({});
  };

  const activePriceLabel = priceFilters.find((p) => p.value === maxPrice)?.label;
  const hasFilters = keyword || category !== 'all' || maxPrice;

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
          <select
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="input-field w-auto min-w-[160px] cursor-pointer"
            aria-label="Filter by maximum price"
          >
            {priceFilters.map((p) => (
              <option key={p.value || 'any'} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="input-field w-auto cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c === 'budget' ? 'Budget Trips' : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto cursor-pointer"
          >
            <option value="-rating">Top Rated</option>
            <option value="pricePerPerson">Price: Low to High</option>
            <option value="-pricePerPerson">Price: High to Low</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {keyword && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200">
              Search: {keyword}
            </span>
          )}
          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200">
              {category === 'budget' ? 'Budget trips' : category}
            </span>
          )}
          {activePriceLabel && activePriceLabel !== 'Any Price' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200">
              {activePriceLabel}
            </span>
          )}
          <button type="button" onClick={clearFilters} className="text-sm text-gray-500 hover:text-brand-600 inline-flex items-center gap-1">
            <X className="w-4 h-4" /> Clear all
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleCategoryClick(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-50'
            }`}
          >
            {c === 'all' ? 'All' : c === 'budget' ? 'Budget' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : list.length ? (
        <>
          <p className="text-sm text-gray-500 mb-4">{list.length} package{list.length !== 1 ? 's' : ''} on this page</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d, i) => <DestinationCard key={d._id} destination={d} index={i} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="text-center py-20">
          <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No destinations found. Try adjusting your filters.</p>
          {maxPrice && (
            <p className="text-sm text-gray-400 mb-4">
              No trips under {activePriceLabel?.replace('Under ', '') || `₹${Number(maxPrice).toLocaleString('en-IN')}`}. Try a higher budget.
            </p>
          )}
          <button type="button" onClick={clearFilters} className="btn-outline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
