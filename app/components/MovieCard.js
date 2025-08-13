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
        className="relative flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800 shadow hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col"
        style={{ width: '250px' }}
        onClick={handleClick}
    >
        <div style={{ height: '140px', width: '100%', overflow: 'hidden' }}>
            <img
                src={imgSrc}
                alt={title}
                onError={() => setImgSrc(fallbackImage)}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="p-2 text-white text-center text-xs font-semibold">
            {title}
        </div>
    </div>
  );
}