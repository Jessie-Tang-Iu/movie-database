'use client';
import React, { useState, useEffect, use } from 'react';
import MovieRow from "./MovieRow";

const clientID = "12200e77fe00a17c44b6b7a79d977d4e35bd3b3d77ebf9899ad60bd15af14ea6";

export default function Genre({ genre }) {

    const [movieList, setMovieList] = useState([]);
    const [movieIds, setMovieIds] = useState([]);
    const [posterIds, setPosterIds] = useState([]);
    
    async function getListOfTrendingMoviesByGenre(genre) {
        try {
            const response = await fetch(`https://api.simkl.com/movies/genres/${genre}/type/country/this-year/popular-this-month?client_id=${clientID}`);
            if (!response.ok) console.log(response.status);
            const data = await response.json();
            let idArray = data.map((movie) => (movie.ids.simkl_id));
            let posterArray = data.map((movie) => (movie.poster));
            // console.dir(idArray.length);
            setMovieIds(idArray.slice(0, 10));
            setPosterIds(posterArray.slice(0, 10));
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
        getListOfTrendingMoviesByGenre(genre);
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
            { (movieList.length > 0) && <MovieRow title={genre} movies={movieList} /> }
        </div>
    );
}