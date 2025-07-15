"use client";

import Link from "next/link";
import { useUserAuth } from "./_utils/auth-context";


export default function Home() {

  const { user, googleSignIn, firebaseSignOut } = useUserAuth();

  async function handleSignIn() {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.log(error);
    }
  }

  console.dir(user);

  let linkStyles = "text-cyan-600 underline hover:text-cyan-300";

  return (
    <main>
      <h1 className="text-3xl"><strong>Welcome to Movie Database</strong></h1>
      <br />
      <h2>Please Login with your account </h2>

      { user ? (
        <section>
          <p>Welcome, {user.displayName}</p>
          <div>
            <button 
            onClick={handleSignOut}
            className="text-lg bg-blue-600 text-white rounded px-2 py-1 mt-4"
            type="button">Sign Out</button>
          </div>

        <Link href="/movies" className={linkStyles}>
          <p>Go to Movies</p>
        </Link>
        </section>
      ) : (
        <section>
          <button 
          onClick={handleSignIn}
          className="text-lg bg-blue-600 text-white rounded px-2 py-1 mt-4"
          type="button">Sign in with Google</button>
        </section>
      )}
    </main>
  );
}
