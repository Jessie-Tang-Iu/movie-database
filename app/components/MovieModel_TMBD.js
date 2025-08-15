"use client";
import { useState, useEffect } from "react";
import {
  dbAddMovieItem,
  dbGetAllMovieList,
  dbRemoveMovieItem,
} from "../_services/movie-list-service";
import { useUserAuth } from "../_utils/auth-context";

export default function MovieModal2({ movie, isOpen, onClose }) {
  const { user, userMovieList, setUserMovieList } = useUserAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
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

  // Handle modal animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before starting animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      const foundMovie = userMovieList.find((m) => m.title == movie.title);
      console.log(userMovieList);
      if (foundMovie) setIsAdded(true);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      setIsAdded(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, userMovieList, movie]);

  if (!shouldRender || !movie) return null;

  const handleAddList = async (e) => {
    e.preventDefault();
    let myMovie = movie;
    setIsAdded(true);
    userMovieList.push(myMovie);
    await dbAddMovieItem(user.uid, myMovie);
    setUserMovieList(userMovieList);
    await dbGetAllMovieList(user.uid, setUserMovieList);
    console.log(userMovieList);
  };

  const handleRemoveFromMyList = async (e) => {
    e.preventDefault();
    let itemToRemove = userMovieList.find((m) => m.title == movie.title);
    console.log("Movie Id:", movie.id);
    console.log(itemToRemove.id);
    await dbRemoveMovieItem(user.uid, itemToRemove);
    const updatedList = userMovieList.filter((m) => m.id !== movie.id);
    setUserMovieList(updatedList);
    await dbGetAllMovieList(user.uid, setUserMovieList);
    setIsAdded(false);
    console.log("Is Added", isAdded);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: isAnimating
          ? "rgba(0, 0, 0, 0.75)"
          : "rgba(0, 0, 0, 0)",
        backdropFilter: isAnimating ? "blur(4px)" : "blur(0px)",
        transition: "all 300ms ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative bg-neutral-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transition-all duration-300 ease-out transform ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-all duration-200 hover:scale-110"
        >
          <span className="text-white text-xl font-bold">✕</span>
        </button>

        {/* Poster image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

          {/* Overlay title and actions */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2
              className={`text-4xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-500 delay-100 ${
                isAnimating
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {movie.title}
            </h2>

            <div
              className={`flex gap-3 mb-4 transition-all duration-500 delay-200 ${
                isAnimating
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-105">
                <span className="text-lg">▶</span>
                Play (Currently unavailable)
              </button>
              {isAdded ? (
                <button
                  className="flex items-center gap-2 bg-red-500 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  onClick={handleRemoveFromMyList}
                >
                  <span className="text-lg">✓</span>
                  My List
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 bg-neutral-600 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  onClick={handleAddList}
                >
                  <span className="text-lg">+</span>
                  My List
                </button>
              )}

              {/* <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-all duration-200 hover:scale-110">
                <span className="text-white text-lg">👍</span>
              </button>
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-all duration-200 hover:scale-110">
                <span className="text-white text-lg">👎</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Movie content */}
        <div
          className={`p-6 text-white transition-all duration-500 delay-300 ${
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
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
        </div>
      </div>
    </div>
  );
}
