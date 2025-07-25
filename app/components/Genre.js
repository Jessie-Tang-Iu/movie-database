'use client';
import React, { useState, useEffect, use } from 'react';
import MovieRow from "./MovieRow";

const clientID = "637397882bce97dc00d38f79c3d19c443b5edaded0448c9bc0bbebc879d1124a";

export default function Genre({ genre, onMovieClick }) {

    const [movieList, setMovieList] = useState([]);
    const [movieIds, setMovieIds] = useState([]);
    const [posterIds, setPosterIds] = useState([]);
    
    async function getListOfMoviesByGenre(genre) {
        try {
            const response = await fetch(`https://api.simkl.com/movies/genres/${genre}/type/country/this-year/popular-this-month?client_id=${clientID}`);
            if (!response.ok) console.log(response.status);
            const data = await response.json();
            let idArray = data.map((movie) => (movie.ids.simkl_id));
            let posterArray = data.map((movie) => (movie.poster));
            // console.dir(idArray.length);
            setMovieIds(idArray.slice(0, 2));
            setPosterIds(posterArray.slice(0, 2));
        } catch (error) {
            console.log("Error fetching library data:", error);
        }
    }

    async function getMovieById(id) {
        try {
            const response = await fetch(`https://api.simkl.com/movies/${id}?client_id=${clientID}`);
            if (!response.ok) console.log(response.status);
            const movieData = await response.json();
            return movieData;
        } catch (error) {
            console.log("Error fetching movie by ID:", error);
        }
    }

    useEffect(() => {
        getListOfMoviesByGenre(genre);
    }, []);
    
    useEffect(() => {
        async function fetchMovies() {
            if (movieIds.length > 0) {
                let thisMovies = [];
                for (let i = 0; i < movieIds.length; i++) {
                    let movie = await getMovieById(movieIds[i]);
                    movie.posterMUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${posterIds[i]}_m.jpg`;
                    movie.posterWUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${posterIds[i]}_w.jpg`;
                    thisMovies.push(movie);
                }
                // console.dir(thisMovies);
                setMovieList(thisMovies);
            }
        }
        fetchMovies();
    }, [movieIds]);

    return (
        <div>
            { (movieList.length > 0) && <MovieRow title={genre} movies={movieList} onMovieClick={onMovieClick}/> }
        </div>
    );
}