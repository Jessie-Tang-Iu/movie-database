"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../app/_utils/auth-context";

export default function NavBar({ onSearch }) {
  const router = useRouter();
  const { user, firebaseSignOut } = useUserAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-neutral-900 text-white shadow-md">
      {/* Left side: filter links */}
      <div className="flex space-x-6 text-sm font-semibold">
        <Link href="/movies" className="hover:text-cyan-400 transition-colors">
          Movies
        </Link>
        <Link href="/tv" className="hover:text-cyan-400 transition-colors">
          TV Shows
        </Link>
      </div>

      {/* Right side: search + logout */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="rounded-md px-3 py-1 text-sm text-black bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        {user && (
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
