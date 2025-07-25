"use client";

import { useState } from 'react';
import Library from "../components/Library";
import Genre from "../components/Genre";
import MovieRow from "../components/MovieRow";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import MovieModal from "../components/MovieModal";

const genres = ['Action', 'Animation', 'Crime', 'Drama', 'Family', 'History', 'Music', 'Romance', 'Thriller', 'War', 'Adventure', 'Comedy', 'Documentary', 'Erotica', 'Fantasy', 'Horror', 'Mystery', 'Science fiction', 'Western'];

const dummyMovies = [
  { 
    title: "WeCrashed", 
    posterUrl: "wecrashed.jpg",
    description: "The greed-filled rise and inevitable fall of WeWork, one of the world's most valuable startups, and the narcissists whose chaotic love made it all possible.",
    cast: "Jared Leto, Anne Hathaway, Kyle Marvin",
    genres: "Drama, Biography",
    director: "Lee Eisenberg",
    duration: "1h 30m"
  },
  { 
    title: "Fallback Test", 
    posterUrl: "nonexistent.jpg",
    description: "A thrilling adventure that tests the limits of human endurance and the power of hope.",
    cast: "Chris Evans, Scarlett Johansson, Robert Downey Jr.",
    genres: "Action, Adventure, Sci-Fi",
    director: "Russo Brothers",
    duration: "2h 15m"
  },
  { 
    title: "No Image", 
    posterUrl: "",
    description: "A mysterious tale of love, loss, and redemption set against the backdrop of a changing world.",
    cast: "Emma Stone, Ryan Gosling, John Legend",
    genres: "Romance, Drama, Musical",
    director: "Damien Chazelle",
    duration: "2h 8m"
  },
  { 
    title: "Another One", 
    posterUrl: "",
    description: "An epic journey through time and space that challenges everything we thought we knew about reality.",
    cast: "Matthew McConaughey, Jessica Chastain, Anne Hathaway",
    genres: "Sci-Fi, Drama, Adventure",
    director: "Christopher Nolan",
    duration: "2h 49m"
  },
  { 
    title: "Another Two", 
    posterUrl: "fallback.png",
    description: "A heartwarming story about friendship, family, and finding your place in the world.",
    cast: "Tom Hanks, Robin Wright, Gary Sinise",
    genres: "Drama, Romance, Comedy",
    director: "Robert Zemeckis",
    duration: "2h 22m"
  },
  { 
    title: "Another Three", 
    posterUrl: "",
    description: "A mind-bending thriller that explores the nature of reality and the power of dreams.",
    cast: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy",
    genres: "Action, Sci-Fi, Thriller",
    director: "Christopher Nolan",
    duration: "2h 28m"
  },
  { 
    title: "Another Four", 
    posterUrl: "",
    description: "A gripping tale of survival against impossible odds in the most dangerous place on Earth.",
    cast: "Sandra Bullock, George Clooney, Ed Harris",
    genres: "Thriller, Drama, Sci-Fi",
    director: "Alfonso Cuarón",
    duration: "1h 31m"
  },
  { 
    title: "Another Five", 
    posterUrl: "",
    description: "An inspiring story of determination, teamwork, and the pursuit of excellence.",
    cast: "Brad Pitt, Jonah Hill, Philip Seymour Hoffman",
    genres: "Biography, Drama, Sport",
    director: "Bennett Miller",
    duration: "2h 13m"
  },
  { 
    title: "Another Six", 
    posterUrl: "fakeurl.jpg",
    description: "A powerful drama about justice, morality, and the price of doing what's right.",
    cast: "Denzel Washington, Russell Crowe, Chiwetel Ejiofor",
    genres: "Biography, Crime, Drama",
    director: "Ridley Scott",
    duration: "2h 37m"
  },
  { 
    title: "Another Seven", 
    posterUrl: "",
    description: "A stunning visual masterpiece that tells the story of humanity's greatest adventure.",
    cast: "Ryan Gosling, Claire Foy, Jason Clarke",
    genres: "Biography, Drama, History",
    director: "Damien Chazelle",
    duration: "2h 21m"
  },
  { 
    title: "Another Eight", 
    posterUrl: "",
    description: "An unforgettable journey of self-discovery and the courage to change your life.",
    cast: "Julia Roberts, Javier Bardem, James Franco",
    genres: "Biography, Drama, Romance",
    director: "Ryan Murphy",
    duration: "2h 13m"
  },
  { 
    title: "Another Nine", 
    posterUrl: "",
    description: "A masterful blend of action, humor, and heart that redefines what it means to be a hero.",
    cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
    genres: "Action, Adventure, Sci-Fi",
    director: "Russo Brothers",
    duration: "3h 1m"
  },
];

export default function Page() {
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

  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />
    
      <Library type="Trending" />
      <Library type="Newest" />
      
      {genres.map(
        (item) => ( <Genre genre={item} /> )
      )}

      <MovieRow 
        title="Boredom Busters" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="Trending Now" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="Popular on Netflix" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="New Releases" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="Award Winners" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="Because You Watched" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />
      <MovieRow 
        title="Last Chance" 
        movies={dummyMovies} 
        onMovieClick={handleMovieClick}
      />

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
