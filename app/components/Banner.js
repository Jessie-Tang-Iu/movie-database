"use client";

import { useEffect, useState } from "react";

export default function Banner({ movies = [] }) {
  const fallbackImage = "/fallback2.png";
  const [randomMovie, setRandomMovie] = useState(null);
  const [bgImage, setBgImage] = useState(fallbackImage);

  useEffect(() => {
    if (movies.length > 0) {
      const filtered = movies.filter((m) => m.posterUrl); // only valid-looking ones
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const movie = filtered[randomIndex];

      // Preload and validate image
      const img = new Image();
      img.src = movie?.posterUrl || fallbackImage;
      img.onload = () => {
        setBgImage(movie.posterUrl);
        setRandomMovie(movie);
      };
      img.onerror = () => {
        setBgImage(fallbackImage);
        setRandomMovie(movie); // still show movie title
      };
    }
  }, [movies]);

  if (!randomMovie) return null;

  return (
    <div
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-b-md"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
          {randomMovie.title}
        </h2>
        <p className="text-white text-sm mt-2 italic">Now Streaming</p>
      </div>
    </div>
  );
}
