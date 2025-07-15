'use client';

import { useState } from 'react';

export default function MovieCard({ posterUrl = '', title = 'Movie Title' }) {
  const fallbackImage = '/fallback.png';
  const [imgSrc, setImgSrc] = useState(posterUrl || fallbackImage);

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-md shadow-md hover:scale-105 transition-transform duration-300 bg-neutral-800"
      style={{ width: '250px', height: '130px' }}
    >
     {/* Movie Poster */}
      <img
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(fallbackImage)}
        className="w-full h-full object-cover rounded-md"
      />

      {/* Movie Title Overlay */}
      {/* <div className="absolute bottom-2 left-0 w-full px-2 text-center z-10">
        <span className="text-white text-xs font-semibold drop-shadow-md bg-black/40 px-1 rounded">
          {title}
        </span>
      </div> */}
    </div>
  );
}