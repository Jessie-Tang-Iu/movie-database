"use client";
import React, { useState, useEffect, use } from "react";
import MovieRow from "./MovieRow";
import { SIMKL_KEY } from "../_utils/thekey";

const clientID = SIMKL_KEY;
const max = 10; // max number of movies to fetch per genre

export default function Genre({ genre, onMovieClick }) {
  const [movieList, setMovieList] = useState([]);
  const [movieIds, setMovieIds] = useState([]);
  const [posterIds, setPosterIds] = useState([]);
  const [durationList, setDurationList] = useState([]);

  async function getListOfMoviesByGenre(genre) {
    try {
      const response = await fetch(
        `https://api.simkl.com/movies/genres/${genre}/type/country/this-year/popular-this-month?client_id=${clientID}`
      );
      if (!response.ok) console.log(response.status);
      const data = await response.json();
      if (data != null) {
        let idArray = data.map((movie) => movie.ids.simkl_id);
        setMovieIds(idArray.slice(0, max));
        let posterArray = data.map((movie) => movie.poster);
        setPosterIds(posterArray.slice(0, max));
        let durationArray = data.map((movie) => movie.runtime);
        setDurationList(durationArray.slice(0, max));
      }
    } catch (error) {
      console.log("Error fetching library data:", error);
    }
  }

  async function getMovieById(id) {
    try {
      const response = await fetch(
        `https://api.simkl.com/movies/${id}?client_id=${clientID}`
      );
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
          movie.id = movieIds[i];
          movie.duration = durationList[i];
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
