import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, Users, Sparkles, Calendar } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';
import StarRating from '../components/common/StarRating';
import { fetchDestination, clearCurrent } from '../redux/slices/destinationSlice';
import { formatPrice, getImageUrl } from '../utils/formatters';
import { destinationService } from '../services/destinationService';
import { PageSkeleton } from '../components/common/Skeleton';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, reviews, loading } = useSelector((s) => s.destinations);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [itinerary, setItinerary] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchDestination(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleGenerateItinerary = async () => {
    if (!isAuthenticated) {
      toast.error('Login to generate AI itinerary');
      return;
    }
    setGenerating(true);
    try {
      const res = await destinationService.generateItinerary(current._id, { days: current.duration });
      setItinerary(res.data.itinerary);
      toast.success('Itinerary generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !current) return <div className="max-w-7xl mx-auto px-4 py-12"><PageSkeleton /></div>;

  const images = current.images?.length ? current.images : [{ url: getImageUrl(current) }];
  const displayItinerary = itinerary || current.itinerary;

  return (
    <div className="pb-20">
      <div className="h-[50vh] md:h-[60vh] relative">
        <Swiper modules={[Navigation, Pagination]} navigation pagination className="h-full">
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm rounded-full capitalize">{current.category}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">{current.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/80">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {current.location}, {current.country}</span>
            <StarRating rating={current.rating} size="md" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-4">About This Trip</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{current.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { icon: Clock, label: 'Duration', value: `${current.duration} days` },
                  { icon: Users, label: 'Group Size', value: `Up to ${current.maxGroupSize}` },
                  { icon: MapPin, label: 'Location', value: current.location },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Icon className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {current.highlights?.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {current.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-brand-500 rounded-full" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Itinerary</h2>
                <button onClick={handleGenerateItinerary} disabled={generating} className="btn-outline text-sm py-2 px-4">
                  <Sparkles className="w-4 h-4" /> {generating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              {displayItinerary?.length ? (
                <div className="space-y-4">
                  {displayItinerary.map((day) => (
                    <div key={day.day} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold shrink-0">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="font-semibold">{day.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{day.description}</p>
                        {day.activities && (
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {day.activities.map((a) => (
                              <li key={a} className="text-xs px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">{a}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Click AI Generate to create a personalized itinerary.</p>
              )}
            </div>

            {current.coordinates?.lat && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  {(() => {
                    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                    const hasGoogleKey = mapsKey && !mapsKey.startsWith('your_');
                    const { lat, lng } = current.coordinates;
                    if (hasGoogleKey) {
                      return (
                        <iframe
                          title="map"
                          className="w-full h-full"
                          src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=12`}
                          allowFullScreen
                          loading="lazy"
                        />
                      );
                    }
                    const delta = 0.08;
                    return (
                      <iframe
                        title="map"
                        className="w-full h-full"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`}
                        loading="lazy"
                      />
                    );
                  })()}
                </div>
                <a
                  href={`https://www.google.com/maps?q=${current.coordinates.lat},${current.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-brand-600 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            )}

            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Reviews ({current.numReviews})</h2>
              {reviews?.length ? reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-100 dark:border-gray-800 py-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                      {r.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{r.user?.name}</p>
                      <StarRating rating={r.rating} showValue={false} />
                    </div>
                  </div>
                  {r.title && <p className="font-medium mt-2">{r.title}</p>}
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{r.comment}</p>
                </div>
              )) : <p className="text-gray-500">No reviews yet.</p>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-brand-600">{formatPrice(current.pricePerPerson)}</span>
                <span className="text-gray-500">/ person</span>
              </div>
              <Link to={`/book/${current._id}`} className="btn-primary w-full mb-4">
                <Calendar className="w-5 h-5" /> Book This Trip
              </Link>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-green-600 mb-1">Included</p>
                  {current.included?.map((i) => <p key={i} className="text-gray-500">✓ {i}</p>)}
                </div>
                <div>
                  <p className="font-semibold text-red-500 mb-1">Not Included</p>
                  {current.excluded?.map((e) => <p key={e} className="text-gray-500">✗ {e}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
