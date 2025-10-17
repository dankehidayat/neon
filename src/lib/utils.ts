import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeRegexCharacters(s: string): string {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
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
