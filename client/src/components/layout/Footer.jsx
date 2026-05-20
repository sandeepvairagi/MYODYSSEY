import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">My-Odyssey</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Your premium travel companion for discovering destinations, booking adventures, and creating unforgettable memories.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-brand-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Explore', 'My Trips', 'Wishlist', 'About Us'].map((item) => (
                <li key={item}><Link to={item === 'Explore' ? '/explore' : `/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-brand-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Beach', 'Mountain', 'City', 'Adventure', 'Cultural', 'Luxury'].map((cat) => (
                <li key={cat}><Link to={`/explore?category=${cat.toLowerCase()}`} className="hover:text-brand-400 transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> hello@myodyssey.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} My-Odyssey. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-400">Privacy Policy</a>
            <a href="#" className="hover:text-brand-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
