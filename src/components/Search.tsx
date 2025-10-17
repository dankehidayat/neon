"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { COMMANDS, ALIAS_MAP, CONFIG } from "@/lib/commands";
import {
  escapeRegexCharacters,
  formatSearchUrl,
  isUrl,
  hasProtocol,
} from "@/lib/utils";

interface SearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (url: string) => void;
  initialInput?: string;
}

interface Suggestion {
  text: string;
  commandId?: string;
  isSearch?: boolean;
}

interface ParsedQuery {
  query: string;
  url?: string;
  key?: string;
  search?: string;
  splitBy?: string;
  path?: string;
}

interface DuckDuckGoSuggestion {
  phrase: string;
}

// Global callback for JSONP - MUST be 'autocompleteCallback' for DuckDuckGo
declare global {
  interface Window {
    autocompleteCallback?: (res: DuckDuckGoSuggestion[]) => void;
  }
}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { open, onOpenChange, onSearch, initialInput = "" },
  ref
) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine external ref with internal ref
  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    },
    [ref]
  );

  // Parse query similar to the original HTML version
  const parseQuery = useCallback((raw: string): ParsedQuery => {
    const query = raw.trim();

    if (isUrl(query)) {
      const url = hasProtocol(query) ? query : `https://${query}`;
      return { query, url };
    }

    // Check if it's a direct command
    const commandId = ALIAS_MAP[query.toLowerCase()];
    if (commandId) {
      const command = COMMANDS.find((c) => c.id === commandId);
      if (command) {
        return { query, key: commandId, url: command.url };
      }
    }

    // Check for command with search
    let splitBy = CONFIG.commandSearchDelimiter;
    const [searchKey, rawSearch] = query.split(new RegExp(`${splitBy}(.*)`));

    if (searchKey && rawSearch) {
      const searchCommandId = ALIAS_MAP[searchKey.toLowerCase()];
      if (searchCommandId) {
        const command = COMMANDS.find((c) => c.id === searchCommandId);
        if (command && command.searchTemplate) {
          const search = rawSearch.trim();
          const url = formatSearchUrl(command.searchTemplate, search);
          return {
            query,
            key: searchCommandId,
            search,
            splitBy,
            url: new URL(url, command.url).href,
          };
        }
      }
    }

    // Check for command with path
    splitBy = CONFIG.commandPathDelimiter;
    const [pathKey, path] = query.split(new RegExp(`${splitBy}(.*)`));

    if (pathKey && path) {
      const pathCommandId = ALIAS_MAP[pathKey.toLowerCase()];
      if (pathCommandId) {
        const command = COMMANDS.find((c) => c.id === pathCommandId);
        if (command) {
          const url = `${new URL(command.url).origin}/${path}`;
          return { query, key: pathCommandId, path, splitBy, url };
        }
      }
    }

    // Default search
    const url = formatSearchUrl(CONFIG.defaultSearchTemplate, query);
    return { query, search: query, url };
  }, []);

  // Fetch search suggestions using JSONP
  const fetchSearchSuggestions = useCallback(
    (search: string): Promise<string[]> => {
      return new Promise((resolve) => {
        // Remove any existing callback
        if (window.autocompleteCallback) {
          delete window.autocompleteCallback;
        }

        window.autocompleteCallback = (res: DuckDuckGoSuggestion[]) => {
          const searchSuggestions: string[] = [];

          for (const item of res) {
            if (item.phrase === search.toLowerCase()) continue;
            searchSuggestions.push(item.phrase);
          }

          resolve(searchSuggestions);

          // Clean up
          delete window.autocompleteCallback;
        };

        // Create and append script tag for JSONP
        const script = document.createElement("script");
        script.src = `https://duckduckgo.com/ac/?callback=autocompleteCallback&q=${encodeURIComponent(
          search
        )}`;
        script.onload = () => script.remove();
        script.onerror = () => {
          console.error("Failed to load search suggestions");
          resolve([]);
          script.remove();
        };

        document.head.appendChild(script);
      });
    },
    []
  );

  const handleInputChange = useCallback(
    async (value: string) => {
      setQuery(value);
      setFocusedSuggestion(-1);

      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      const parsed = parseQuery(value);
      let newSuggestions: Suggestion[] = [];

      // Get command-based suggestions from aliases (exact matches first)
      const exactCommandMatches = COMMANDS.flatMap((command) =>
        (command.aliases || [])
          .filter((alias) => alias.toLowerCase() === value.toLowerCase())
          .map((alias) => ({ text: alias, commandId: command.id }))
      );

      const partialCommandMatches = COMMANDS.flatMap((command) =>
        (command.aliases || [])
          .filter(
            (alias) =>
              alias.toLowerCase().includes(value.toLowerCase()) &&
              alias.toLowerCase() !== value.toLowerCase()
          )
          .map((alias) => ({ text: alias, commandId: command.id }))
      );

      // Combine exact matches first, then partial matches
      newSuggestions = [...exactCommandMatches, ...partialCommandMatches].slice(
        0,
        CONFIG.suggestionLimit
      );

      // If we have a command key and search term, show command-specific search suggestions
      if (parsed.key && parsed.search) {
        try {
          const command = COMMANDS.find((c) => c.id === parsed.key);
          if (command) {
            const searchResults = await fetchSearchSuggestions(parsed.search);
            const commandSearchSuggestions = searchResults
              .slice(0, CONFIG.suggestionLimit - newSuggestions.length)
              .map((text) => ({
                text: `${parsed.key}${CONFIG.commandSearchDelimiter}${text}`,
                isSearch: true,
              }));

            newSuggestions = [...newSuggestions, ...commandSearchSuggestions];
          }
        } catch (error) {
          console.error("Failed to fetch command search suggestions:", error);
        }
      }
      // If no command matches, show general search suggestions
      else if (newSuggestions.length < CONFIG.suggestionLimit) {
        try {
          const searchResults = await fetchSearchSuggestions(value);
          const generalSearchSuggestions = searchResults
            .slice(0, CONFIG.suggestionLimit - newSuggestions.length)
            .map((text) => ({
              text: text,
              isSearch: true,
            }));

          newSuggestions = [...newSuggestions, ...generalSearchSuggestions];
        } catch (error) {
          console.error("Failed to fetch search suggestions:", error);
        }
      }

      setSuggestions(newSuggestions);
    },
    [parseQuery, fetchSearchSuggestions]
  );

  useEffect(() => {
    if (open) {
      // Set the initial input when opening
      if (initialInput) {
        setQuery(initialInput);
      } else {
        setQuery("");
      }
      setSuggestions([]);
      setFocusedSuggestion(-1);

      // Focus and set input value immediately
      if (inputRef.current) {
        inputRef.current.focus();
        if (initialInput) {
          inputRef.current.value = initialInput;
          // Move cursor to end
          inputRef.current.setSelectionRange(
            initialInput.length,
            initialInput.length
          );
          // Trigger input event to show suggestions
          handleInputChange(initialInput);
        }
      }
    } else {
      setQuery("");
    }
  }, [open, initialInput, handleInputChange]);

  const executeSearch = (searchQuery: string) => {
    const parsed = parseQuery(searchQuery);
    if (parsed.url) {
      onSearch(parsed.url);
      onOpenChange(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (focusedSuggestion >= 0 && suggestions[focusedSuggestion]) {
      executeSearch(suggestions[focusedSuggestion].text);
    } else {
      executeSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    executeSearch(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "Escape") {
      onOpenChange(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
      return;
    }

    if (e.key === "Enter" && focusedSuggestion >= 0) {
      e.preventDefault();
      if (suggestions[focusedSuggestion]) {
        executeSearch(suggestions[focusedSuggestion].text);
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        if (focusedSuggestion >= 0) {
          executeSearch(suggestions[focusedSuggestion].text);
        } else {
          setFocusedSuggestion(0);
        }
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white/90 dark:bg-gray-900/90 rounded-2xl search-modal max-w-2xl w-full border border-white/20 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-8">
          <input
            ref={setRefs}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter command..."
            className="w-full text-4xl h-20 border-none focus:outline-none bg-transparent text-gray-900 dark:text-white text-center placeholder-gray-500 dark:placeholder-gray-400 font-bold font-inter"
            autoComplete="off"
            spellCheck="false"
          />
        </form>

        {suggestions.length > 0 && (
          <div className="px-8 pb-8 border-t border-white/20 pt-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestions.map((suggestion, index) => {
                const escapedQuery = escapeRegexCharacters(query);
                const matched = suggestion.text.match(
                  new RegExp(escapedQuery, "i")
                );

                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setFocusedSuggestion(index)}
                    className={`px-4 py-3 text-sm rounded-xl transition-all duration-200 suggestion-item ${
                      focusedSuggestion === index
                        ? "bg-blue-500 text-white shadow-lg transform scale-105"
                        : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md"
                    } border border-white/30`}
                  >
                    {matched ? (
                      <>
                        {suggestion.text.slice(0, matched.index!)}
                        <span
                          className={`${
                            focusedSuggestion === index
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {matched[0]}
                        </span>
                        {suggestion.text.slice(
                          matched.index! + matched[0].length
                        )}
                      </>
                    ) : (
                      suggestion.text
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Search;
