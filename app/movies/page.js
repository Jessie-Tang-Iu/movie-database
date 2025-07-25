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

export default function Page() {
  const api_key = TMDB_API_KEY;

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
    const query = text.trim();
    if (!query) return;

    const url = `https://api.simkl.com/search/movie?q=${encodeURIComponent(
      query
    )}&client_id=${api_key}`;

    console.log("[Search] Search URL:", url);

    try {
      const res = await fetch(url);
      console.log("[Search] Fetch status:", res.status);

      if (!res.ok) {
        console.error("[Search] Fetch failed:", res.status);
        return;
      }

      // ✅ You forgot this line in your version
      const data = await res.json();
      console.log("[Search] API raw response:", data);

      const raw = data[0];
      const firstResult = raw?.movie || raw?.show || raw;

      if (firstResult) {
        console.log("[Search] Final selected movie:", firstResult);
        setSelectedMovie(firstResult);
        setIsModalOpen(true);
      } else {
        console.warn("[Search] No valid movie found");
      }
    } catch (err) {
      console.error("[Search] Error:", err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar onSearch={handleSearch} />

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
