import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 'sm', showValue = true }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5' };
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
      {showValue && <span className="text-sm font-medium ml-1">{rating?.toFixed(1)}</span>}
    </div>
  );
}
