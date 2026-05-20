import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Oops!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Something went wrong. Please try refreshing the page.</p>
            <Link to="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
