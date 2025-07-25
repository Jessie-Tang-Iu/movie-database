"use client";

import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Library from "../components/Library";
import Genre from "../components/Genre";

// const dummyMovies = [
//   { title: "WeCrashed", posterWUrl: "wecrashed.jpg" },
//   { title: "Fallback Test", posterWUrl: "nonexistent.jpg" },
//   { title: "No Image", posterWUrl: "" },
//   { title: "Another One", posterWUrl: "" },
//   { title: "Another Two", posterWUrl: "fallback.png" },
//   { title: "Another Three", posterWUrl: "" },
//   { title: "Another Four", posterWUrl: "" },
//   { title: "Another Five", posterWUrl: "" },
//   { title: "Another Six", posterWUrl: "fakeurl.jpg" },
//   { title: "Another Seven", posterWUrl: "" },
//   { title: "Another Eight", posterWUrl: "" },
//   { title: "Another Nine", posterWUrl: "" },
// ];

const genres = ['Action', 'Animation', 'Crime', 'Drama', 'Family', 'History', 'Music', 'Romance', 'Thriller', 'War', 'Adventure', 'Comedy', 'Documentary', 'Erotica', 'Fantasy', 'Horror', 'Mystery', 'Science fiction', 'Western'];

export default function Page() {
    return (
        <div className="bg-black text-white min-h-screen">
            <NavBar />

            {/* <h1 className="text-2xl font-bold px-4 pt-6">Movie Home</h1> */}
            <Library type="Trending" />
            <Library type="Newest" />

            {genres.map(
                (item) => ( <Genre genre={item} /> )
            )}
            
        </div>
    );
}
