"use client";

import { useUserAuth } from "../_utils/auth-context";
import { dbGetAllMovieList } from "../_services/movie-list-service";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function MyList() {

    const { user } = useUserAuth();

    

    const [myMovieList, setMyMovieList] = useState([]);

    const handleSearch = async (text) => {
        const query = text.trim();
        if (!query) return;

        try {
            const url = `https://api.simkl.com/search/movie?q=${encodeURIComponent(
                query
            )}&client_id=${simklKey}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log("[Simkl] Raw search data:", data);

            const validResults = data
                .map((entry) => entry?.movie || entry?.show || entry)
                .filter((item) => item?.title)
                .slice(0, 3); // 🔥 Only take 3 results

            if (validResults.length === 0) {
                console.warn("No usable search results");
                return;
            }

            // Try TMDB enrichment on first result
            const simklMovie = validResults[0];
            await handleMovieClick(simklMovie);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    useEffect( () => {
        if(user) {
            dbGetAllMovieList(user.uid, setMyMovieList);
        }
    }, [user] );

    console.log("My List for", user.displayName);
    
    console.log(myMovieList);
    
    return(      
        <main className="bg-black text-white min-h-screen">
            <NavBar onSearch={handleSearch} />
            <header>This is {user.displayName} my list</header>
            <div>
                <ul>
                    {
                        myMovieList.map( (movie) => {
                            return(

                                <li key={movie.id}>
                                    <p>{movie.title}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </main>
    )
}