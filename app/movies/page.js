"use client";

import MovieRow from "../components/MovieRow";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";

const dummyMovies = [
  { title: "WeCrashed", posterUrl: "wecrashed.jpg" },
  { title: "Fallback Test", posterUrl: "nonexistent.jpg" },
  { title: "No Image", posterUrl: "" },
  { title: "Another One", posterUrl: "" },
  { title: "Another Two", posterUrl: "fallback.png" },
  { title: "Another Three", posterUrl: "" },
  { title: "Another Four", posterUrl: "" },
  { title: "Another Five", posterUrl: "" },
  { title: "Another Six", posterUrl: "fakeurl.jpg" },
  { title: "Another Seven", posterUrl: "" },
  { title: "Another Eight", posterUrl: "" },
  { title: "Another Nine", posterUrl: "" },
];

export default function Page() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />
      <Banner movies={dummyMovies} />

      {/* <h1 className="text-2xl font-bold px-4 pt-6">Movie Home</h1> */}
      <MovieRow title="Boredom Busters" movies={dummyMovies} />
      <MovieRow title="More Movies" movies={dummyMovies} />
      <MovieRow title="More Movies" movies={dummyMovies} />
      <MovieRow title="More Movies" movies={dummyMovies} />
      <MovieRow title="More Movies" movies={dummyMovies} />
      <MovieRow title="Even More Movies" movies={dummyMovies} />
      <MovieRow title="Last Row" movies={dummyMovies} />
    </div>
  );
}
