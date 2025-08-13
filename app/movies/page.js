"use client";

import { useState } from "react";
import Library from "../components/Library";
import Genre from "../components/Genre";
import NavBar from "../components/NavBar";
import MovieModal2 from "../components/MovieModel_TMBD";
import { TMDB_API_KEY } from "../_utils/thekey";

const genres = ["action", "comedy", "drama", "horror", "sci-fi"]; // Customize this list

export default function Page() {
  const tmdbKey = TMDB_API_KEY;

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = async (movie) => {
    try {
      if (!movie?.title) return;

      // Step 1: Search TMDB by title
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          movie.title
        )}&api_key=${tmdbKey}`
      );
      const searchData = await searchRes.json();
      // console.dir(searchData);
      const tmdbMatch = searchData.results?.[0];

      if (!tmdbMatch?.id) {
        console.warn("TMDB movie not found");
        return;
      }

      // Step 2: Fetch details using TMDB ID
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMatch.id}?api_key=${tmdbKey}&language=en-US`
      );
      const details = await detailsRes.json();
      console.dir(details);

      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMatch.id}/credits?api_key=${tmdbKey}`
      );
      const credits = await creditsRes.json();
      console.dir(credits);

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
            ?.map((p) => p.name)
            ?.join(", ") || "N/A",
        director:
          credits.crew?.find((member) => member.job === "Director")?.name ||
          "N/A",
        poster_path: tmdbMatch.poster_path,
        backdrop_path: tmdbMatch.backdrop_path,
        release_date: tmdbMatch.release_date,
        vote_average: tmdbMatch.vote_average,
        posterWUrl:
          movie.posterWUrl ||
          `https://image.tmdb.org/t/p/w500${tmdbMatch.poster_path}`,
      };

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

  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />

      <Library type="Trending Now" onMovieClick={handleMovieClick} />
      <Library type="New Release" onMovieClick={handleMovieClick} />

      {/* Optional genres */}
      {genres.map((item) => (
        <Genre key={item} genre={item} onMovieClick={handleMovieClick} />
      ))}

      <MovieModal2
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
