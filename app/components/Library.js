'use client';
import React, { useState, useEffect, use } from 'react';
import Banner from './Banner';
import MovieRow from './MovieRow';

const clientID = "12200e77fe00a17c44b6b7a79d977d4e35bd3b3d77ebf9899ad60bd15af14ea6";

export default function Library( {type} ) {

    const [fetchUrl, setFetchUrl] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [movieIds, setMovieIds] = useState([]);
    const [posterIds, setPosterIds] = useState([]);

    async function getListOfMovies(type) {
        if (type == "Trending") {
            let url = `https://api.simkl.com/movies/trending/day?client_id=${clientID}`;
            setFetchUrl(url);
        } else if (type == "Newest") {
            let url = `https://api.simkl.com/movies/genres/all/type/country/this-week/newest?client_id=${clientID}`;
            setFetchUrl(url);
        }
        try {
            const plResponse = await fetch(fetchUrl);
            if (!plResponse.ok) console.log(plResponse.status);
            const plData = await plResponse.json();
            // console.dir(plData);
            let idArray = plData.map((movie) => (movie.ids.simkl_id));
            let posterArray = plData.map((movie) => (movie.poster));
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
        getListOfMovies(type);
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
                setMovieList(thisMovies);
            }
        }
        fetchMovies();
    }, [movieIds]);

    return (
        <div>
            { (type == "Trending") && <Banner movies={movieList} /> }
            <MovieRow title={type} movies={movieList} />
        </div>
    );
}