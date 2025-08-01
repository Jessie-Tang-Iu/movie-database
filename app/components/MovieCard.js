'use client';
import { useState, useEffect } from 'react';

export default function MovieCard({ posterUrl = '', title = 'Movie Title', movie, onMovieClick }) {
  const fallbackImage = '/fallback2.png';
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setImgSrc(posterUrl || fallbackImage);
  }, [posterUrl]);

  const handleClick = () => {
    if (onMovieClick) {
      onMovieClick(movie || { title, posterUrl });
    }
  };

  return (
    <div
      className="relative flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800 shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
      style={{ width: '250px', height: '140px' }}
      onClick={handleClick}
    >
      <img
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(fallbackImage)}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-semibold drop-shadow">
        {title}
      </div>
    </div>
  );
}