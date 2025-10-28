import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeRegexCharacters(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatSearchUrl(template: string, search: string): string {
  const encodedSearch = encodeURIComponent(search);
  return template.replace(/{}/g, encodedSearch);
}

export function hasProtocol(s: string): boolean {
  return /^[a-zA-Z]+:\/\//.test(s);
}

export function isUrl(s: string): boolean {
  const urlPattern = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;
  return urlPattern.test(s);
}
