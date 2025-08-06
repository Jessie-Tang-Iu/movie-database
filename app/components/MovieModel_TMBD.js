"use client";
import { useState, useEffect } from "react";
import { dbAddMovieItem, dbGetAllMovieList, dbRemoveMovieItem } from "../_services/movie-list-service";
import { useUserAuth } from "../_utils/auth-context";

export default function MovieModal2({ movie, isOpen, onClose }) {
  const {user, userMovieList, setUserMovieList} = useUserAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const fallbackImage = "/fallback2.png";

  const posterUrl = (() => {
    if (imageError) return fallbackImage;
    
    // Try multiple poster URL sources in order of preference
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    if (movie?.posterWUrl) {
      return movie.posterWUrl;
    }
    if (movie?.posterMUrl) {
      return movie.posterMUrl;
    }
    
    console.log("No valid poster URL found for movie:", movie);
    return fallbackImage;
  })();

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
      // Check if movie is already in list with more flexible matching
      const foundMovie = userMovieList.find(m => {
        // Try multiple matching criteria
        return (
          m.title === movie?.title ||
          (m.tmdbId && m.tmdbId === movie?.id) ||
          (m.id && m.id === movie?.id)
        );
      });
      
      console.log("Checking if movie is in list:");
      console.log("Current movie:", movie);
      console.log("Found in list:", foundMovie);
      console.log("Full user list:", userMovieList);
      
      setIsAdded(!!foundMovie);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } 
    else {
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
    let myMovie = {
      ...movie,
      tmdbId: movie.id, // Store TMDB ID separately
      dateAdded: new Date().toISOString()
    };
    
    setIsAdded(true);
    
    try {
      await dbAddMovieItem(user.uid, myMovie);
      // Refresh the user movie list to get the Firebase document ID
      await dbGetAllMovieList(user.uid, setUserMovieList);
      console.log("Movie added successfully");
    } catch (error) {
      console.error("Error adding movie:", error);
      setIsAdded(false); // Revert on error
    }
  };

  const handleRemoveFromMyList = async (e) => {
    e.preventDefault();
    
    console.log("=== REMOVE MOVIE DEBUG ===");
    console.log("Current movie to remove:", movie);
    console.log("Current user movie list:", userMovieList);
    
    // Find the movie in the user's list
    let itemToRemove = userMovieList.find(m => {
      const titleMatch = m.title === movie.title;
      const tmdbMatch = m.tmdbId && m.tmdbId === movie.id;
      
      console.log(`Checking movie: ${m.title}`);
      console.log(`- Title match: ${titleMatch}`);
      console.log(`- TMDB match: ${tmdbMatch} (${m.tmdbId} vs ${movie.id})`);
      console.log(`- Firebase ID: ${m.id}`);
      console.log(`- Firebase ID (backup): ${m.firebaseId}`);
      
      return titleMatch || tmdbMatch;
    });
    
    console.log("Item found for removal:", itemToRemove);
    
    if (itemToRemove) {
      try {
        console.log("Attempting to remove from Firebase...");
        await dbRemoveMovieItem(user.uid, itemToRemove);
        console.log("Successfully removed from Firebase");
        
        // Refresh the entire list from Firebase
        console.log("Refreshing movie list from Firebase...");
        await dbGetAllMovieList(user.uid, setUserMovieList);
        setIsAdded(false);
        console.log("Movie removal complete and list refreshed");
      } catch (error) {
        console.error("Error removing movie:", error);
        // Don't change isAdded state if removal failed
      }
    } else {
      console.warn("Movie not found in user list for removal");
      console.log("Available movies in list:");
      userMovieList.forEach((m, idx) => {
        console.log(`${idx}: "${m.title}"`);
        console.log(`  - Firebase ID: ${m.id}`);
        console.log(`  - Firebase ID (backup): ${m.firebaseId}`);
        console.log(`  - TMDB ID: ${m.tmdbId}`);
      });
    }
    
    console.log("=== END REMOVE DEBUG ===");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: isAnimating ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isAnimating ? 'blur(4px)' : 'blur(0px)',
        transition: 'all 300ms ease-out'
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
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
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
            <h2 className={`text-4xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-500 delay-100 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {movie.title}
            </h2>

            <div className={`flex gap-3 mb-4 transition-all duration-500 delay-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-105">
                <span className="text-lg">▶</span>
                Play
              </button>
              {isAdded ? (
                <button 
                  className="flex items-center gap-2 bg-red-500 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  onClick={handleRemoveFromMyList}
                >
                  <span className="text-lg">✓</span>
                  My List
                </button>
              ):(
                <button 
                  className="flex items-center gap-2 bg-neutral-600 bg-opacity-70 text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  onClick={handleAddList}
                >
                  <span className="text-lg">+</span>
                  My List
                </button>
              )}
              
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-all duration-200 hover:scale-110">
                <span className="text-white text-lg">👍</span>
              </button>
              <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition-all duration-200 hover:scale-110">
                <span className="text-white text-lg">👎</span>
              </button>
            </div>
          </div>
        </div>

        {/* Movie content */}
        <div className={`p-6 text-white transition-all duration-500 delay-300 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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