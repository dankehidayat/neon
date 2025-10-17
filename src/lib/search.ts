// lib/search.ts
import { COMMANDS } from "./commands";

export interface SearchResult {
  query: string;
  url: string;
  key?: string;
  search?: string;
  path?: string;
  splitBy?: string;
}

interface DuckDuckGoSuggestion {
  phrase: string;
}

export function hasProtocol(s: string): boolean {
  return /^[a-zA-Z]+:\/\//i.test(s);
}

export function isUrl(s: string): boolean {
  return /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i.test(s);
}

export function formatSearchUrl(template: string, search: string): string {
  return template.replace(/{}/g, encodeURIComponent(search));
}

export function parseQuery(raw: string): SearchResult {
  const query = raw.trim();

  if (isUrl(query)) {
    const url = hasProtocol(query) ? query : `https://${query}`;
    return { query, url };
  }

  // Find exact command match
  const exactCommand = COMMANDS.find((cmd) => cmd.id === query);
  if (exactCommand) {
    return { key: exactCommand.id, query, url: exactCommand.url };
  }

  // Handle search queries with commands (e.g., "youtube cats")
  const [potentialCommand, ...searchParts] = query.split(" ");
  const command = COMMANDS.find((cmd) => cmd.id === potentialCommand);

  if (command && command.searchTemplate && searchParts.length > 0) {
    const search = searchParts.join(" ");
    const url = formatSearchUrl(command.searchTemplate, search);
    return {
      key: command.id,
      query,
      search,
      splitBy: " ",
      url: `${command.url}${url}`,
    };
  }

  // Default to search
  const url = formatSearchUrl("https://duckduckgo.com/?q={}", query);
  return { query, search: query, url };
}

export async function fetchSearchSuggestions(
  search: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(search)}`
    );
    const data = (await response.json()) as DuckDuckGoSuggestion[];
    return data
      .map((item) => item.phrase)
      .filter(
        (phrase: string) => phrase.toLowerCase() !== search.toLowerCase()
      );
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return [];
  }
}
