"use client";

import { useEffect, useState } from "react";
import { SIMKL_KEY, TMDB_API_KEY } from "../_utils/thekey";

export default function TestFetchPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCombinedMovies() {
      try {
        const res = await fetch(
          `https://api.simkl.com/movies/trending/day?client_id=${SIMKL_KEY}`
        );

        if (!res.ok) throw new Error(`Simkl Error ${res.status}`);

        const simklData = await res.json();
        const simklTop15 = simklData.slice(0, 15);

        const enrichedMovies = await Promise.all(
          simklTop15.map(async (simklItem) => {
            let tmdbData = null;
            const imdbId = simklItem.ids?.imdb;

            // Try TMDB Find API using IMDb ID
            if (imdbId) {
              const tmdbRes = await fetch(
                `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
              );
              const tmdbJson = await tmdbRes.json();
              tmdbData = tmdbJson?.movie_results?.[0] || null;
            }

            // Fallback: TMDB search by title/year
            // fallback: search TMDB if imdb not available
            if (!tmdbData) {
              const title = simklItem.show?.title;
              const year = simklItem.show?.year;

              if (title && year) {
                const searchRes = await fetch(
                  `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                    title
                  )}&year=${year}`
                );
                const searchData = await searchRes.json();
                tmdbData = searchData.results?.[0] || null;

                if (!tmdbData) {
                  console.warn("TMDB not found for:", title, year);
                }
              } else {
                console.warn(
                  "Missing title/year for Simkl ID:",
                  simklItem.ids?.simkl_id
                );
              }
            }

            return {
              ...simklItem,
              tmdb: tmdbData,
            };
          })
        );

        setMovies(enrichedMovies);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchCombinedMovies();
  }, []);

  function renderObject(obj, prefix = "") {
    return Object.entries(obj || {}).map(([key, value]) => {
      const compoundKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return renderObject(value, compoundKey);
      }
      return (
        <p key={compoundKey} className="text-sm text-gray-300">
          <strong>{compoundKey}:</strong> {String(value)}
        </p>
      );
    });
  }

  function renderItem(item, index) {
    return (
      <li key={index} className="bg-neutral-800 p-4 rounded space-y-1">
        {renderObject(item)}
      </li>
    );
  }

  return (
    <div className="space-y-8 p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Raw Movie Data Viewer</h1>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold mb-2">List {i + 1}</h2>
              <ul className="space-y-2">
                {movies.slice(i * 5, i * 5 + 5).map(renderItem)}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
