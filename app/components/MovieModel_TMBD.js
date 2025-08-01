"use client";
import { useState, useEffect } from "react";
import { dbAddMovieItem } from "../_services/movie-list-service";
import { useUserAuth } from "../_utils/auth-context";

export default function MovieModal2({ movie, isOpen, onClose }) {
  const {user, userMovieList} = useUserAuth();
  const [favorite, setFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/fallback2.png";

  const posterUrl =
    (!imageError &&
      movie?.poster_path &&
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`) ||
    fallbackImage;

  const cast = movie?.cast || "N/A";

  const director = movie?.director || "N/A";

  const genres = movie?.genres || "N/A";

  const duration = movie?.runtime ? `${movie.runtime}` : "N/A";

  useEffect(() => {

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      const foundMovie = userMovieList.find(m => m.title == movie.title);
      if (foundMovie) setFavorite(true);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      setFavorite(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const handleAddList = async (e) => {
    e.preventDefault();
    let myMovie = movie;
    setFavorite(true);
    console.dir(myMovie);
    userMovieList.push(myMovie);
    dbAddMovieItem(user.uid, myMovie);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={(e) => {
        // Close only if clicked directly on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-neutral-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
        >
          <span className="text-white text-xl font-bold">✕</span>
        </button>

        {/* Poster image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

          {/* Overlay title and actions */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h2>

            <div className="flex gap-3 mb-4">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                <span className="text-lg">▶</span>
                Play
              </button>
              {favorite ? (
                <button className="flex items-center gap-2 bg-red-500 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                  <span className="text-lg">✓</span>
                  My List
                </button>
              ):(
                <button 
                  className="flex items-center gap-2 bg-neutral-600 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
                  onClick={handleAddList}
                >
                  <span className="text-lg">+</span>
                  My List
                </button>
              )}
              
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-colors">
                <span className="text-white text-lg">👍</span>
              </button>
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-colors">
                <span className="text-white text-lg">👎</span>
              </button>
            </div>
          </div>
        </div>

        {/* Movie content */}
        <div className="p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                <span className="text-green-400 font-semibold">TMDB</span>
                {movie.release_date && (
                  <span>{movie.release_date.slice(0, 4)}</span>
                )}
                {movie.vote_average && (
                  <span className="border border-gray-400 px-1">
                    {movie.vote_average.toFixed(1)} ★
                  </span>
                )}
              </div>

              <p className="text-white mb-4 leading-relaxed">
                {movie.overview || "No description available."}
              </p>
            </div>

            {/* Right side */}
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400">Cast: </span>
                <span className="text-white">{cast}</span>
              </div>
              <div>
                <span className="text-gray-400">Genres: </span>
                <span className="text-white">{genres}</span>
              </div>
              <div>
                <span className="text-gray-400">Director: </span>
                <span className="text-white">{director}</span>
              </div>
              <div>
                <span className="text-gray-400">Duration: </span>
                <span className="text-white">{duration}</span>
              </div>
            </div>
          </div>

          {/* More like this — static for now */}
          {/* <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="h-32 bg-neutral-700 flex items-center justify-center">
                    <span className="text-gray-400">Related Movie {item}</span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">Title {item}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Description of related movie...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
