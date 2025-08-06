"use client";
import React, { useState, useEffect } from "react";
import MovieRow from "./MovieRow";
import { TMDB_API_KEY } from "../_utils/thekey";

const tmdbKey = TMDB_API_KEY;

// TMDB Genre IDs mapping
const genreMap = {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Romance": 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  "Thriller": 53,
  "War": 10752,
  "Western": 37
};

export default function Genre({ genre, onMovieClick }) {
  const [movieList, setMovieList] = useState([]);

  async function getListOfMoviesByGenre(genre) {
    try {
      const genreId = genreMap[genre];
      if (!genreId) {
        console.log("Genre not found:", genre);
        return;
      }

      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${genreId}&sort_by=popularity.desc&page=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.log("TMDB API error:", response.status);
        return;
      }
      
      const data = await response.json();
      
      // Transform TMDB data to match your existing structure
      const transformedMovies = data.results.slice(0, 10).map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        posterWUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        posterMUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
        // Add placeholders - will be fetched when modal opens
        runtime: null,
        genres: null,
        cast: null,
        director: null
      }));
      
      setMovieList(transformedMovies);
    } catch (error) {
      console.log("Error fetching genre movies:", error);
    }
  }

  useEffect(() => {
    getListOfMoviesByGenre(genre);
  }, [genre]);

  return (
    <div>
      {movieList.length > 0 && (
        <MovieRow
          title={genre}
          movies={movieList}
          onMovieClick={onMovieClick}
        />
      )}
    </div>
  );
}