"use client";
import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import MovieRow from "./MovieRow";
import { TMDB_API_KEY } from "../_utils/thekey";

const tmdbKey = TMDB_API_KEY;

export default function Library({ type, onMovieClick }) {
  const [movieList, setMovieList] = useState([]);

  async function getListOfMovies(type) {
    try {
      let url = "";
      
      if (type === "Trending Now") {
        url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbKey}`;
      } else if (type === "New Release") {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=1`;
      } else if (type === "Popular") {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=1`;
      } else if (type === "Top Rated") {
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbKey}&language=en-US&page=1`;
      } else if (type === "Upcoming") {
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbKey}&language=en-US&page=1`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        console.log("TMDB API error:", response.status);
        return;
      }
      
      const data = await response.json();
      
      // Transform TMDB data to match your existing structure
      const transformedMovies = data.results.slice(0, 12).map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        posterWUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        posterMUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
        // Add runtime placeholder - will be fetched when modal opens
        runtime: null,
        genres: null,
        cast: null,
        director: null
      }));
      
      setMovieList(transformedMovies);
    } catch (error) {
      console.log("Error fetching TMDB data:", error);
    }
  }

  useEffect(() => {
    getListOfMovies(type);
  }, [type]);

  return (
    <div>
      {type === "Trending Now" && <Banner movies={movieList} />}
      <MovieRow title={type} movies={movieList} onMovieClick={onMovieClick} />
    </div>
  );
}