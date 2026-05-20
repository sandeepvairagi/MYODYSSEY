import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Compass className="w-20 h-20 text-brand-300 mx-auto mb-6 animate-float" />
        <h1 className="font-display text-8xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Lost in Transit?</h2>
        <p className="text-gray-500 mb-8 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
