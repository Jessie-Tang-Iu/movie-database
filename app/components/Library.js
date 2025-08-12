"use client";
import React, { useState, useEffect, use } from "react";
import Banner from "./Banner";
import MovieRow from "./MovieRow";
import { SIMKL_KEY } from "../_utils/thekey";

const clientID = SIMKL_KEY;
const max = 10; // max number of movies to fetch per genre

export default function Library({ type, onMovieClick }) {
  const [fetchUrl, setFetchUrl] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [movieIds, setMovieIds] = useState([]);
  const [posterIds, setPosterIds] = useState([]);
  const [durationList, setDurationList] = useState([]);

  async function getListOfMovies(type) {
    try {
      // console.dir(fetchUrl);
      const plResponse = await fetch(fetchUrl);
      if (!plResponse.ok) console.log(plResponse.status);
      const plData = await plResponse.json();
      // console.dir(plData);
      let idArray = plData.map((movie) => movie.ids.simkl_id);
      setMovieIds(idArray.slice(0, max));
      let posterArray = plData.map((movie) => movie.poster);
      setPosterIds(posterArray.slice(0, max));
      let durationArray = plData.map((movie) => movie.runtime);
      setDurationList(durationArray.slice(0, max));
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
    if (fetchUrl != "") {
      getListOfMovies(type);
    }
  }, [fetchUrl]);

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
        setMovieList(thisMovies);
      }
    }
    fetchMovies();
  }, [movieIds]);

  return (
    <div>
      {type == "Trending Now" && <Banner movies={movieList} />}
      <MovieRow title={type} movies={movieList} onMovieClick={onMovieClick} />
    </div>
  );
}
