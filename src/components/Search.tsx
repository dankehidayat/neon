"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { COMMANDS, ALIAS_MAP, CONFIG, FOURCHAN_BOARDS } from "@/lib/commands";
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
  const [showHelp, setShowHelp] = useState(false);
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

    // Check for 4chan board navigation (e.g., "4c u", "chan fit")
    const fourchanMatch = query.match(/^(4c|chan)\s+([a-z0-9]+)$/i);
    if (fourchanMatch) {
      const [, , board] = fourchanMatch;
      const normalizedBoard = board.toLowerCase();
      if (FOURCHAN_BOARDS[normalizedBoard]) {
        const url = `https://boards.4chan.org/${FOURCHAN_BOARDS[normalizedBoard]}/`;
        return { query, key: `4chan-${normalizedBoard}`, url };
      }
    }

    // Check for Reddit subreddit (e.g., "rd r/opendirectories", "r programming")
    const redditMatch = query.match(
      /^(rd|r)\s+(r\/[a-zA-Z0-9_]+|[a-zA-Z0-9_]+)$/i
    );
    if (redditMatch) {
      const [, , subreddit] = redditMatch;
      // Remove "r/" prefix if it exists and add it properly
      const cleanSubreddit = subreddit.startsWith("r/")
        ? subreddit.substring(2)
        : subreddit;
      const url = `https://www.reddit.com/r/${cleanSubreddit}/`;
      return { query, key: "reddit", url };
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
            url: url, // Use the formatted URL directly
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

      // Add 4chan board suggestions if typing 4chan-related
      if (
        value.toLowerCase().startsWith("4c ") ||
        value.toLowerCase().startsWith("chan ")
      ) {
        const prefix = value.toLowerCase().startsWith("4c ") ? "4c " : "chan ";
        const boardPrefix = value.slice(prefix.length).toLowerCase();

        const boardMatches = Object.keys(FOURCHAN_BOARDS)
          .filter((board) => board.startsWith(boardPrefix))
          .slice(0, 3) // Limit to 3 board suggestions
          .map((board) => ({
            text: `${prefix.trim()} ${board}`,
            commandId: `4chan-${board}`,
          }));

        newSuggestions = [...newSuggestions, ...boardMatches];
      }

      // Add Reddit subreddit suggestions
      if (
        value.toLowerCase().startsWith("rd ") ||
        value.toLowerCase().startsWith("r ")
      ) {
        const prefix = value.toLowerCase().startsWith("rd ") ? "rd " : "r ";
        const subredditPrefix = value.slice(prefix.length).toLowerCase();

        // Popular subreddits for suggestions
        const popularSubreddits = [
          "programming",
          "gaming",
          "movies",
          "music",
          "news",
          "askscience",
          "todayilearned",
        ];
        const subredditMatches = popularSubreddits
          .filter((sub) => sub.startsWith(subredditPrefix))
          .slice(0, 3)
          .map((sub) => ({
            text: `${prefix.trim()} ${sub}`,
            commandId: "reddit",
          }));

        newSuggestions = [...newSuggestions, ...subredditMatches];
      }

      // Combine exact matches first, then partial matches
      newSuggestions = [
        ...exactCommandMatches,
        ...partialCommandMatches,
        ...newSuggestions,
      ].slice(0, CONFIG.suggestionLimit);

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
      e.preventDefault();
      e.stopPropagation();
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

  // Handle escape key to close help modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showHelp]);

  // Filter commands to only show those with search functionality
  const searchCommands = COMMANDS.filter(
    (command) =>
      command.searchTemplate ||
      command.id === "4chan" ||
      command.id === "reddit"
  );

  if (!open) return null;

  return (
    <>
      {/* Search Modal */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="search-modal rounded-2xl max-w-2xl w-full backdrop-blur-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="absolute top-4 right-4 p-2 text-muted hover:text-primary transition-all duration-300 info-icon"
            title="Search Help"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <form onSubmit={handleSubmit} className="p-8">
            <input
              ref={setRefs}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or enter command..."
              className="w-full text-4xl h-20 border-none focus:outline-none bg-transparent text-primary text-center search-input font-bold font-duospace"
              autoComplete="off"
              spellCheck="false"
            />
          </form>

          {suggestions.length > 0 && (
            <div className="px-8 pb-8 border-t border-border pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestions.map((suggestion, index) => {
                  const escapedQuery = escapeRegexCharacters(query);
                  const matched = suggestion.text.match(
                    new RegExp(escapedQuery, "i")
                  );

                  const isFocused = focusedSuggestion === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setFocusedSuggestion(index)}
                      className={`px-4 py-3 text-sm rounded-xl transition-all duration-200 suggestion-item ${
                        isFocused ? "suggestion-item-focused" : ""
                      } font-duospace`}
                    >
                      {matched ? (
                        <>
                          {suggestion.text.slice(0, matched.index!)}
                          <span
                            className={`${
                              isFocused ? "text-blue-100" : "text-muted"
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

      {/* Help Modal Card - Separate from search modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="help-modal-card rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden help-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary font-duospace">
                  Search Help & Supported Commands
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 text-muted hover:text-primary transition-all duration-300 info-icon"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 help-modal-content">
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    Basic Search
                  </h4>
                  <ul className="space-y-2 text-primary font-duospace">
                    <li>• Type any URL to go directly to a website</li>
                    <li>• Type any text for web search</li>
                    <li>• Use command aliases for quick access</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    Command Search
                  </h4>
                  <ul className="space-y-2 text-primary font-duospace">
                    <li>
                      <code>yt Linux terminal</code> → YouTube search
                    </li>
                    <li>
                      <code>ytm jazz music</code> → YouTube Music search
                    </li>
                    <li>
                      <code>ha one piece</code> → HiAnime search
                    </li>
                    <li>
                      <code>ny torrent</code> → Nyaa search
                    </li>
                    <li>
                      <code>rd programming</code> → Reddit search
                    </li>
                    <li>
                      <code>rd r/opendirectories</code> → Go to subreddit
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    4chan Boards
                  </h4>
                  <ul className="space-y-2 text-primary font-duospace">
                    <li>
                      <code>4c fit</code> → /fit/ board
                    </li>
                    <li>
                      <code>4c pol</code> → /pol/ board
                    </li>
                    <li>
                      <code>4c u</code> → /u/ board
                    </li>
                    <li>
                      <code>chan a</code> → /a/ board
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    Reddit Subreddits
                  </h4>
                  <ul className="space-y-2 text-primary font-duospace">
                    <li>
                      <code>rd r/opendirectories</code> → r/opendirectories
                    </li>
                    <li>
                      <code>r r/umamusume</code> → r/umamusume
                    </li>
                    <li>
                      <code>r news</code> → Searches News
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    Supported Search Commands
                  </h4>
                  <div className="space-y-4">
                    {searchCommands.map((command) => (
                      <div
                        key={command.id}
                        className="flex items-center justify-between p-3 bg-card text-primary rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <span className="font-medium font-duospace block">
                            {command.name}
                          </span>
                          {command.description && (
                            <span className="text-sm text-muted font-duospace block mt-1">
                              {command.description}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {command.aliases?.slice(0, 2).map((alias) => (
                            <code
                              key={alias}
                              className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded"
                            >
                              {alias}
                            </code>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 font-duospace">
                    Keyboard Shortcuts
                  </h4>
                  <ul className="space-y-2 text-primary font-duospace">
                    <li>
                      • <kbd>Enter</kbd> - Execute search
                    </li>
                    <li>
                      • <kbd>Escape</kbd> - Close search
                    </li>
                    <li>
                      • <kbd>↑↓</kbd> - Navigate suggestions
                    </li>
                    <li>
                      • <kbd>Tab</kbd> - Select first suggestion
                    </li>
                    <li>
                      • <kbd>Any letter</kbd> - Start searching
                    </li>
                    <li>
                      • <kbd>Ctrl/Cmd + T</kbd> - Toggle theme
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Search;
