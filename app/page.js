"use client";

import Link from "next/link";
import { useUserAuth } from "./_utils/auth-context";

export default function Home() {
  const { user, googleSignIn, firebaseSignOut } = useUserAuth();

  async function handleSignIn() {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-white">
          Movie Database
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          {user ? "Welcome back." : "Log in to explore your movies."}
        </p>

        {user ? (
          <div className="space-y-5">
            <p className="text-md text-gray-300 font-medium">
              Hello, <span className="text-white">{user.displayName}</span>
            </p>
            <Link
              href="/movies"
              className="block w-full text-center bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition"
            >
              Browse Movies
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-center bg-neutral-700 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md font-semibold transition"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </main>
  );
}
