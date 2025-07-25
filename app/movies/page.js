"use client";

import { useState } from "react";
import Library from "../components/Library";
import Genre from "../components/Genre";
import MovieRow from "../components/MovieRow";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import MovieModal from "../components/MovieModal";
import { TMDB_API_KEY } from "../_utils/thekey";

const genres = [
  "Action",
  "Animation",
  "Crime",
  "Drama",
  "Family",
  "History",
  "Music",
  "Romance",
  "Thriller",
  "War",
  "Adventure",
  "Comedy",
  "Documentary",
  "Erotica",
  "Fantasy",
  "Horror",
  "Mystery",
  "Science fiction",
  "Western",
];

const api_key = TMDB_API_KEY;

export default function Page() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearch = async (text) => {
    console.log("[SearchBar] Input text:", text);

    if (!text.trim()) {
      console.log("[SearchBar] Empty input. Clearing results.");
      setSearchResults([]);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        text
      )}&api_key=${api_key}`;
      console.log("[SearchBar] Fetching from:", url);

      const res = await fetch(url);
      console.log("[SearchBar] Fetch status:", res.status);

      if (!res.ok) {
        console.error("[SearchBar] Fetch failed:", res.status);
        setSearchResults([]);
        return;
      }

      const data = await res.json();
      console.log("[SearchBar] API response:", data);

      if (!data.results || !Array.isArray(data.results)) {
        console.warn("[SearchBar] No valid results:", data);
        setSearchResults([]);
        return;
      }

      setSearchResults(data.results.slice(0, 6));
    } catch (error) {
      console.error("[SearchBar] Request error:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar onSearch={handleSearch} />

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3">Search Results</h2>
          <div className="flex gap-4 overflow-x-auto">
            {searchResults.map((movie, idx) => (
              <div
                key={idx}
                className="cursor-pointer"
                onClick={() =>
                  handleMovieClick({
                    title: movie.title,
                    posterWUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    description: movie.overview,
                    year: movie.release_date?.slice(0, 4),
                    cast: "N/A",
                    genres: "N/A",
                    director: "N/A",
                    duration: "2h",
                  })
                }
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  className="w-40 h-60 object-cover rounded-lg shadow"
                  alt={movie.title}
                />
                <p className="text-sm text-center mt-2">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Library type="Trending Now" onMovieClick={handleMovieClick} />
      <Library type="New Release" onMovieClick={handleMovieClick} />

      {/* {genres.map(
        (item) => ( <Genre key={item}  genre={item} onMovieClick={handleMovieClick} /> )
      )} */}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
