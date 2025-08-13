"use client";

import { use, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import MovieModal2 from "../components/MovieModel_TMBD";
import { TMDB_API_KEY, SIMKL_KEY } from "../_utils/thekey";
import { useUserAuth } from "../_utils/auth-context";
import MovieList from "../components/MovieList";

export default function SearchResultPage({ params }) {
  const tmdbKey = TMDB_API_KEY;
  const simklKey = SIMKL_KEY;

  const searchText = use(params);

  const { user } = useUserAuth();
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

  useEffect(() => {
    async function handleSearch(text) {
      const query = text;
      if (!query) return;

      try {
        const url = `https://api.simkl.com/search/movie?q=${query}&client_id=${simklKey}`;
        const res = await fetch(url);
        const data = await res.json();

        const validResults = data
          .map((entry) => entry?.movie || entry?.show || entry)
          .filter((item) => item?.title);

        if (validResults.length === 0) {
          console.warn("No usable search results");
          return;
        }
        setSearchResults(validResults);
      } catch (err) {
        console.error("Search failed:", err);
      }
    };
    handleSearch(searchText.movie);
  }, [user]);

  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />

      <MovieList
        title="Search Result"
        movies={searchResults}
        onMovieClick={handleMovieClick}
      />

      <MovieModal2
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
