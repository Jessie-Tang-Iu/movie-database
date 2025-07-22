'use client';
import { useState, useEffect } from 'react';

export default function MovieModal({ movie, isOpen, onClose }) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = '/fallback2.png';

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const posterUrl = movie.posterUrl && !imageError ? movie.posterUrl : fallbackImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-neutral-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
        >
          <span className="text-white text-xl font-bold">✕</span>
        </button>

        {/* Hero section with image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
          
          {/* Movie title and controls overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h2>
            
            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                <span className="text-lg">▶</span>
                Play
              </button>
              <button className="flex items-center gap-2 bg-neutral-600 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                <span className="text-lg">+</span>
                My List
              </button>
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-colors">
                <span className="text-white text-lg">👍</span>
              </button>
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-colors">
                <span className="text-white text-lg">👎</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-green-400 font-semibold">98% Match</span>
                <span className="border border-gray-400 px-1 text-gray-400">HD</span>
                <span className="text-gray-300">2023</span>
                <span className="border border-gray-400 px-1 text-gray-400">13+</span>
              </div>
              
              <p className="text-white mb-4 leading-relaxed">
                {movie.description || 
                  "A thrilling adventure that takes you on an unforgettable journey through compelling characters and stunning visuals. Experience the story that captivated audiences worldwide with its unique blend of drama, action, and heart."
                }
              </p>
            </div>

            {/* Side content */}
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400">Cast: </span>
                <span className="text-white">
                  {movie.cast || "John Doe, Jane Smith, Mike Johnson, Sarah Wilson"}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400">Genres: </span>
                <span className="text-white">
                  {movie.genres || "Drama, Action, Thriller"}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400">Director: </span>
                <span className="text-white">
                  {movie.director || "Christopher Nolan"}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400">Duration: </span>
                <span className="text-white">
                  {movie.duration || "2h 28m"}
                </span>
              </div>
            </div>
          </div>

          {/* More Like This section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer">
                  <div className="h-32 bg-neutral-700 flex items-center justify-center">
                    <span className="text-gray-400">Similar Movie {item}</span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">Related Title {item}</h4>
                    <p className="text-xs text-gray-400 mt-1">Brief description of this related content...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}