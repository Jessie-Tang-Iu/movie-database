"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    console.log("[SearchBar] onChange triggered:", value);
    setInputValue(value);
    onSearch?.(value); // Optional live update
  };

  const handleKeyDown = (e) => {
    console.log("[SearchBar] onKeyDown:", e.key);
    if (e.key === "Enter") {
      console.log("[SearchBar] Enter pressed, sending search:", inputValue);
      onSearch?.(inputValue);
    }
  };

  const handleIconClick = () => {
    console.log("[SearchBar] 🔍 icon clicked, sending search:", inputValue);
    onSearch?.(inputValue);
  };

  return (
    <div
      className={`flex items-center bg-gray-700 rounded-md overflow-hidden ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="px-3 py-1 text-sm text-black flex-grow bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="Search"
      />
      <button
        onClick={handleIconClick}
        className="p-2 text-white hover:text-cyan-400 transition-colors"
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </div>
  );
}
