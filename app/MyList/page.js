"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useState } from "react";
import NavBar from "../components/NavBar";
import MovieRow from "../components/MovieRow";
import MovieModal2 from "../components/MovieModel_TMBD";
import { TMDB_API_KEY } from "../_utils/thekey";

export default function MyList() {
    const tmdbKey = TMDB_API_KEY;
    const { userMovieList } = useUserAuth();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMovieClick = async (movie) => {
        try {
            if (!movie?.title) return;

            let movieId = movie.tmdbId || movie.id;
            
            // If we don't have a TMDB ID, search by title first
            if (!movieId || typeof movieId !== 'number') {
                console.log("Searching TMDB by title:", movie.title);
                const searchRes = await fetch(
                    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
                        movie.title
                    )}&api_key=${tmdbKey}`
                );
                const searchData = await searchRes.json();
                const tmdbMatch = searchData.results?.[0];
                
                if (!tmdbMatch?.id) {
                    console.warn("TMDB movie not found for:", movie.title);
                    return;
                }
                movieId = tmdbMatch.id;
            }

            console.log("Fetching TMDB details for movie ID:", movieId);

            // Fetch detailed movie information
            const detailsRes = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}&language=en-US`
            );
            const details = await detailsRes.json();

            // Fetch cast and crew information
            const creditsRes = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbKey}`
            );
            const credits = await creditsRes.json();

            // Create enriched movie object
            const enrichedMovie = {
                id: movieId,
                tmdbId: movieId,
                title: details.title || movie.title,
                overview: details.overview || "No description available.",
                runtime: details.runtime
                    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
                    : "N/A",
                genres: details.genres?.map((g) => g.name).join(", ") || "N/A",
                cast: credits.cast
                    ?.slice(0, 5)
                    ?.map((p) => p.name)
                    ?.join(", ") || "N/A",
                director: credits.crew?.find((member) => member.job === "Director")?.name || "N/A",
                poster_path: details.poster_path,
                backdrop_path: details.backdrop_path,
                release_date: details.release_date,
                vote_average: details.vote_average,
                posterWUrl: details.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}` 
                    : movie.posterWUrl,
            };

            console.log("Enriched movie data:", enrichedMovie);
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

        try {
            const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
                query
            )}&api_key=${tmdbKey}&language=en-US&page=1`;
            
            const res = await fetch(url);
            const data = await res.json();
            console.log("[TMDB] Raw search data:", data);

            const validResults = data.results
                ?.filter((item) => item?.title && item?.id)
                ?.slice(0, 1); // Take first result

            if (validResults.length === 0) {
                console.warn("No usable search results");
                return;
            }

            // Use the first search result
            const tmdbMovie = validResults[0];
            await handleMovieClick(tmdbMovie);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    return(      
        <main className="bg-black text-white min-h-screen">
            <NavBar onSearch={handleSearch} />
            <MovieRow title={"My Watchlist"} movies={userMovieList} onMovieClick={handleMovieClick} />
            <MovieModal2
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </main>
    )
}