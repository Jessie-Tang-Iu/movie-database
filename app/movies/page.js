"use client";

import { useState } from "react";
import Library from "../components/Library";
import Genre from "../components/Genre";
import MovieRow from "../components/MovieRow";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import MovieModal from "../components/MovieModal";
import { TMDB_API_KEY, SIMKL_KEY } from "../_utils/thekey";
import MovieModal2 from "../components/MovieModel_TMBD";
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

  const handleMovieClick = async (movie) => {
    try {
      if (!movie?.title) return;

      // Step 1: Search TMDB by title
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          movie.title
        )}&api_key=${api_key}`
      );
      const searchData = await searchRes.json();
      const tmdbMatch = searchData.results?.[0];

      if (!tmdbMatch?.id) {
        console.warn("TMDB movie not found");
        return;
      }

      // Step 2: Fetch details using correct TMDB id
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMatch.id}?api_key=${api_key}&language=en-US`
      );
      const details = await detailsRes.json();

      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMatch.id}/credits?api_key=${api_key}`
      );
      const credits = await creditsRes.json();

      const enrichedMovie = {
        title: tmdbMatch.title || movie.title,
        overview: details.overview || "No description available.",
        runtime: details.runtime
          ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
          : "N/A",
        genres: details.genres?.map((g) => g.name).join(", ") || "N/A",
        cast:
          credits.cast
            ?.slice(0, 3)
            .map((p) => p.name)
            .join(", ") || "N/A",
        director:
          credits.crew?.find((member) => member.job === "Director")?.name ||
          "N/A",
        poster_path: tmdbMatch.poster_path,
        backdrop_path: tmdbMatch.backdrop_path,
      };

      console.log("[TMDB] Final enriched movie:", enrichedMovie);

      setSelectedMovie(enrichedMovie);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error enriching TMDB movie:", err);
    }
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
      {/* <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      /> */}

      <MovieModal2
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
