"use client";

import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { dbAddMovieItem } from "../_services/movie-list-service";




export default function AddToMyListPage() {

    const { user } = useUserAuth();
    const [title, setTitle] = useState("");
    const handleTitleChange = (event) => setTitle(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let newMovieItem = {
            title: title,
        }
        await dbAddMovieItem(user.uid, newMovieItem);
        setTitle("");
    }

    if(!user) {
        return(
            <main>
                <p>You need to login first!</p>
            </main>
        );
    }

    return(
        <main>
            <header>This is adding page</header>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" onChange={handleTitleChange} value={title} />
                </div>
                <div>
                    <button type="submit">Add Movie</button>
                </div>
            </form>
        </main>
    )
}