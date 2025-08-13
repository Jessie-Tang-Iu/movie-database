"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../app/_utils/auth-context";
import SearchBar from "./SearchBar";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function NavBar() {
  const router = useRouter();
  const { user, firebaseSignOut } = useUserAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-3 bg-neutral-900 text-white shadow-md">
        {/* Left side: filter links */}
        <div className="flex space-x-6 text-sm font-semibold">
          <Link
            href="/movies"
            className="hover:text-cyan-400 transition-colors"
          >
            Movies
          </Link>
          {/* <Link href="/tv" className="hover:text-cyan-400 transition-colors">
            TV Shows
          </Link> */}
          {/* <Link
            href="/test-fetch"
            className="hover:text-cyan-400 transition-colors"
          >
            Test
          </Link> */}
          <Link
            href="/MyList"
            className="hover:text-cyan-400 transition-colors"
          >
            My List
          </Link>
          {/* <Link
            href="/add-to-my-list"
            className="hover:text-cyan-400 transition-colors"
          >
            Add to My List (For Test)
          </Link> */}
        </div>

        {/* Right side: search + logout */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          {user && (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={() => {
          setShowConfirm(false);
          handleSignOut();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
