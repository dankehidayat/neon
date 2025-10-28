"use client";

import { useState, useCallback, useEffect } from "react";
import Search from "@/components/Search";
import Commands from "@/components/Commands";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      const newDark = !isDark;
      setIsDark(newDark);

      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },
    [isDark]
  );

  const handleSearch = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleCommandClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // Global keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Open search with any letter key or space
      if (
        !searchOpen &&
        e.key.length === 1 &&
        e.key !== " " &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setInitialInput(e.key);
        setSearchOpen(true);
        e.preventDefault();
      }

      // Open search with space
      if (!searchOpen && e.key === " ") {
        setInitialInput("");
        setSearchOpen(true);
        e.preventDefault();
      }

      // Close search with Escape
      if (searchOpen && e.key === "Escape") {
        setSearchOpen(false);
        e.preventDefault();
      }

      // Toggle theme with Ctrl/Cmd + T
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, toggleTheme]);

  return (
    <div
      className="min-h-screen bg-gradient-custom p-8 cursor-text relative"
      onClick={() => {
        setInitialInput("");
        setSearchOpen(true);
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl theme-toggle z-10"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <div className="text-center mb-16">
        <h1 className="text-7xl font-bold text-primary mb-6 font-duospace tracking-tight">
          Neon
        </h1>
        <p className="text-xl text-muted font-duospace">
          Start typing or click anywhere to search
        </p>
      </div>

      <Commands onCommandClick={handleCommandClick} />

      <Search
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={handleSearch}
        initialInput={initialInput}
      />
    </div>
  );
}
