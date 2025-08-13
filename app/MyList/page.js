"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useState } from "react";
import NavBar from "../components/NavBar";
import MovieModal2 from "../components/MovieModel_TMBD";
import MovieList from "../components/MovieList";

export default function MyList() {

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

    // console.log("My List for", user.displayName);
    
    return(      
        <main className="bg-black text-white min-h-screen">
            <NavBar />

            <MovieList title={"WatchList"} movies={userMovieList} onMovieClick={handleMovieClick} />

            <MovieModal2
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

        </main>
    )
}