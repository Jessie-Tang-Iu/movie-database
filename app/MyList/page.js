"use client";

import { useUserAuth } from "../_utils/auth-context";
import { dbGetAllMovieList } from "../_services/movie-list-service";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import MovieRow from "../components/MovieRow";
import MovieModal2 from "../components/MovieModel_TMBD";
import { SIMKL_KEY, TMDB_API_KEY } from "../_utils/thekey";
import MovieCard from "../components/MovieCard";

export default function MyList() {
    const tmdbKey = TMDB_API_KEY;
    const simklKey = SIMKL_KEY;

    const { userMovieList } = useUserAuth();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleMovieSearch = async (movie) => {
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
            posterWUrl: movie.posterWUrl || `https://image.tmdb.org/t/p/w500${tmdbMatch.poster_path}`,
        };

        setSelectedMovie(enrichedMovie);
        setIsModalOpen(true);
        } catch (err) {
            console.error("Error enriching TMDB movie:", err);
        }
    };

    const handleSearch = async (text) => {
        const query = text.trim();
        if (!query) return;

        try {
            const url = `https://api.simkl.com/search/movie?q=${encodeURIComponent(
                query
            )}&client_id=${simklKey}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log("[Simkl] Raw search data:", data);

            const validResults = data
                .map((entry) => entry?.movie || entry?.show || entry)
                .filter((item) => item?.title)
                .slice(0, 3); // 🔥 Only take 3 results

            if (validResults.length === 0) {
                console.warn("No usable search results");
                return;
            }

            // Try TMDB enrichment on first result
            const simklMovie = validResults[0];
            await handleMovieSearch(simklMovie);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    // console.log("My List for", user.displayName);
    
    
    return(      
        <main className="bg-black text-white min-h-screen">
            <NavBar onSearch={handleSearch} />
            <MovieRow title={"WatchList"} movies={userMovieList} onMovieClick={handleMovieClick} />
            {/* <div className="my-5">
                <h2 className="text-xl font-semibold px-4 mb-2">WatchList</h2>
                <div className="overflow-x-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {userMovieList.map((movie, index) => (
                            <MovieCard
                                key={index}
                                title={movie.title}
                                posterUrl={movie.posterWUrl}
                                movie={movie}
                                onMovieClick={handleMovieClick}
                            />
                        ))}
                    </div>
                </div>
            </div> */}
            <MovieModal2
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

        </main>
    )
}