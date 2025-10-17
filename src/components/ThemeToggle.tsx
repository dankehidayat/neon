"use client";

import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering search when clicking the button
        toggleTheme();
      }}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full glass shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
