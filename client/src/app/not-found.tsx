'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-800 opacity-10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-6xl font-bold text-gray-700">404</h2>
          </div>
        </div>

        {/* Main Message */}
        <div className="mt-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            The page you&apos;re looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Illustration or Icon */}
        <div className="my-10">
          <div className="relative inline-block">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        {/* Possible Reasons */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 text-left">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Why this might have happened:
          </h4>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              The page may have been moved or deleted
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              You might have typed the wrong URL
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              The page is temporarily unavailable
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Back Home
            </div>
          </Link>

          <div className="flex space-x-4">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              ← Go Back
            </button>
            <button
              onClick={handleRefresh}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              ↻ Refresh Page
            </button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@greenmet.com"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                i % 2 === 0
                  ? "from-green-300 to-blue-300"
                  : "from-blue-300 to-green-300"
              } animate-pulse`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;