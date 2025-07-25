'use client';
import React, { useState, useEffect, use } from 'react';
import Banner from './Banner';
import MovieRow from './MovieRow';

const clientID = "637397882bce97dc00d38f79c3d19c443b5edaded0448c9bc0bbebc879d1124a";

export default function Library({ type, onMovieClick }) {

    const [fetchUrl, setFetchUrl] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [movieIds, setMovieIds] = useState([]);
    const [posterIds, setPosterIds] = useState([]);

    async function getListOfMovies(type) {
        try {
            // console.dir(fetchUrl);
            const plResponse = await fetch(fetchUrl);
            if (!plResponse.ok) console.log(plResponse.status);
            const plData = await plResponse.json();
            // console.dir(plData);
            let idArray = plData.map((movie) => (movie.ids.simkl_id));
            let posterArray = plData.map((movie) => (movie.poster));
            // console.dir(idArray.length);
            setMovieIds(idArray.slice(0, 3));
            setPosterIds(posterArray.slice(0, 3));
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
        function handleFetchUrl() {
            if (type == "Trending Now") {
                const url = `https://api.simkl.com/movies/trending/day?client_id=${clientID}`;
                setFetchUrl(url);
            } else if (type == "New Release") {
                const url = `https://api.simkl.com/movies/genres/all/type/country/this-week/newest?client_id=${clientID}`;
                setFetchUrl(url);
            }
        }
        handleFetchUrl();
    }, []);

    useEffect(() => {
        getListOfMovies(type);
    }, [fetchUrl]);

    useEffect(() => {
        async function fetchMovies() {
            if (movieIds.length > 0) {
                let thisMovies = [];
                for (let i = 0; i < movieIds.length; i++) {
                    let movie = await getMovieById(movieIds[i]);
                    movie.id = movieIds[i];
                    movie.posterMUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${posterIds[i]}_m.jpg`;
                    movie.posterWUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${posterIds[i]}_w.jpg`;
                    thisMovies.push(movie);
                }
                setMovieList(thisMovies);
            }
        }
        fetchMovies();
    }, [movieIds]);

    return (
        <div>
            { (type == "Trending Now") && <Banner movies={movieList} /> }
            <MovieRow 
                title={type} 
                movies={movieList}
                onMovieClick={onMovieClick} 
            />
        </div>
    );
}