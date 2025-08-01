"use client";

import { useUserAuth } from "../_utils/auth-context";
import { dbGetAllMovieList } from "../_services/movie-list-service";
import { useEffect, useState } from "react";



export default function MyList() {

    const { user } = useUserAuth();

    console.log("My List for", user.displayName);

    const [myMovieList, setMyMovieList] = useState([]);
      useEffect( () => {
        if(user) {
          dbGetAllMovieList(user.uid, setMyMovieList);
        }
      }, [user] );
    
      console.log(myMovieList);
    
    return(
        <main>
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