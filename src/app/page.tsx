"use client";

import { useState, useEffect, useRef } from "react";
import Commands from "@/components/Commands";
import Search from "@/components/Search";
import ThemeToggle from "@/components/ThemeToggle";
import { CONFIG } from "@/lib/commands";
import { useTheme } from "@/lib/theme";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if search is already open or user is typing in an input
      if (
        searchOpen ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Open search on any key press and capture the key
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setInitialInput(e.key);
        setSearchOpen(true);
      }

      // Close search on Escape
      if (e.key === "Escape") {
        setSearchOpen(false);
        setInitialInput("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Handle fast typing by directly manipulating the input when it opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current && initialInput) {
      // Directly set the input value
      searchInputRef.current.value = initialInput;
      // Move cursor to end
      searchInputRef.current.setSelectionRange(
        initialInput.length,
        initialInput.length
      );
      // Focus immediately
      searchInputRef.current.focus();
    }
  }, [searchOpen, initialInput]);

  const handleCommandClick = (url: string) => {
    window.open(url, CONFIG.openLinksInNewTab ? "_blank" : "_self");
  };

  const handleSearch = (url: string) => {
    window.open(url, CONFIG.openLinksInNewTab ? "_blank" : "_self");
    setSearchOpen(false);
    setInitialInput("");
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setInitialInput("");
  };

  return (
    <main
      className={`min-h-screen p-8 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
      onClick={(e) => {
        // Only open search if clicking on the main background, not on buttons or cards
        if (e.target === e.currentTarget) {
          setSearchOpen(true);
          setInitialInput("");
        }
      }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-6xl font-bold mb-4 font-inter ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Neon
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-inter">
            Start typing or click anywhere to search
            <span className="hidden md:inline-block ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm font-mono">
              Any key
            </span>
          </p>
        </div>

        <Commands onCommandClick={handleCommandClick} />
        <Search
          ref={searchInputRef}
          open={searchOpen}
          onOpenChange={handleSearchClose}
          onSearch={handleSearch}
          initialInput={initialInput}
        />
        <ThemeToggle />
      </div>
    </main>
  );
}
