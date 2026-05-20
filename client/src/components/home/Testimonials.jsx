import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Travel Blogger', avatar: 'SM', text: 'My-Odyssey transformed how I plan trips. The AI itinerary feature saved me hours of research!', rating: 5, trip: 'Bali Paradise' },
  { name: 'Raj Patel', role: 'Software Engineer', avatar: 'RP', text: 'Seamless booking experience from search to payment. The Rajasthan package exceeded all expectations.', rating: 5, trip: 'Rajasthan Heritage' },
  { name: 'Emma Wilson', role: 'Photographer', avatar: 'EW', text: 'Beautiful UI, incredible destinations, and customer support that actually cares. Highly recommended!', rating: 5, trip: 'Santorini Dreams' },
  { name: 'James Chen', role: 'Entrepreneur', avatar: 'JC', text: 'Booked our honeymoon through My-Odyssey. Maldives package was flawless from start to finish.', rating: 5, trip: 'Maldives Bliss' },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">What Travelers Say</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Join thousands of happy explorers who found their perfect journey with My-Odyssey
          </p>
        </div>
        <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} className="pb-12">
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="card p-8 h-full">
                <Quote className="w-10 h-10 text-brand-200 dark:text-brand-800 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role} · {t.trip}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
