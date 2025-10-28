export interface Command {
  id: string;
  name: string;
  url: string;
  category: string;
  description?: string;
  searchTemplate?: string;
  keywords?: string[];
  aliases?: string[];
}

export const COMMANDS: Command[] = [
  // AI & Chat
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: "ai",
    description: "OpenAI ChatGPT",
    keywords: ["ai", "chat", "gpt"],
    aliases: ["gpt", "ai"],
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/new",
    category: "ai",
    description: "Anthropic Claude AI",
    keywords: ["ai", "claude"],
    aliases: ["cl"],
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/app",
    category: "ai",
    description: "Google Gemini",
    keywords: ["ai", "google"],
    aliases: ["gem", "gg"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "ai",
    description: "AI search engine",
    keywords: ["ai", "search"],
    aliases: ["perp", "pp"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://chat.deepseek.com/coder",
    category: "ai",
    description: "DeepSeek AI chat",
    keywords: ["ai", "coder"],
    aliases: ["ds", "deep"],
  },
  {
    id: "colab",
    name: "Google Colab",
    url: "https://colab.research.google.com",
    category: "ai",
    description: "Google Colaboratory",
    keywords: ["python", "notebook", "ml"],
    aliases: ["gc", "colab"],
  },

  // Development
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com",
    category: "dev",
    description: "Code repository",
    keywords: ["code", "git", "repos"],
    aliases: ["gh", "git"],
  },
  {
    id: "notion",
    name: "Notion",
    url: "https://notion.so",
    category: "dev",
    description: "Notes & documentation",
    keywords: ["notes", "docs"],
    aliases: ["note", "nt"],
  },
  {
    id: "clickup",
    name: "ClickUp",
    url: "https://app.clickup.com",
    category: "dev",
    description: "Project management",
    keywords: ["tasks", "projects", "management"],
    aliases: ["cu", "tasks"],
  },

  // Media & Entertainment
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    category: "media",
    description: "YouTube video search",
    searchTemplate: "https://www.youtube.com/results?search_query={}",
    keywords: ["video", "youtube"],
    aliases: ["yt"],
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    url: "https://jf.foxlust.my.id",
    category: "media",
    description: "Media server",
    keywords: ["media", "movies", "tv"],
    aliases: ["jf", "media"],
  },
  {
    id: "youtubesubs",
    name: "YouTube Subs",
    url: "https://youtube.com/feed/subscriptions",
    category: "media",
    description: "YouTube subscriptions",
    keywords: ["subscriptions", "videos"],
    aliases: ["yts", "subs"],
  },
  {
    id: "ytmusic",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    category: "media",
    description: "YouTube Music",
    searchTemplate: "https://music.youtube.com/search?q={}",
    keywords: ["music", "songs"],
    aliases: ["ytm"],
  },
  {
    id: "hianime",
    name: "HiAnime",
    url: "https://hianime.to",
    category: "media",
    description: "Anime streaming",
    searchTemplate: "https://hianime.to/search?keyword={}",
    keywords: ["anime", "watch"],
    aliases: ["ha", "anime"],
  },
  {
    id: "nyaa",
    name: "Nyaa",
    url: "https://nyaa.si",
    category: "media",
    description: "Anime torrents",
    searchTemplate: "https://nyaa.si/?f=0&c=0_0&q={}",
    keywords: ["torrent", "anime"],
    aliases: ["ny", "torrent"],
  },
  {
    id: "bsky",
    name: "Bluesky",
    url: "https://bsky.app",
    category: "media",
    description: "Bluesky social",
    keywords: ["social", "twitter"],
    aliases: ["bs", "sky"],
  },
  {
    id: "reddit",
    name: "Reddit",
    url: "https://reddit.com",
    category: "media",
    description: "Reddit social & subreddits",
    searchTemplate: "https://www.reddit.com/search/?q={}",
    keywords: ["social", "forum", "subreddit"],
    aliases: ["rd", "r"],
  },
  {
    id: "4chan",
    name: "4chan",
    url: "https://boards.4chan.org",
    category: "media",
    description: "4chan imageboard",
    keywords: ["imageboard", "anonymous", "boards"],
    aliases: ["4c", "chan"],
  },

  // Tools & Utilities
  {
    id: "deepl",
    name: "DeepL",
    url: "https://deepl.com",
    category: "tools",
    description: "AI translation",
    keywords: ["translate", "language"],
    aliases: ["dl", "translate"],
  },
  {
    id: "googletranslate",
    name: "Google Translate",
    url: "https://translate.google.com",
    category: "tools",
    description: "Google translation",
    keywords: ["translate", "google"],
    aliases: ["gt", "gtranslate"],
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    url: "https://duckduckgo.com",
    category: "tools",
    description: "Private search",
    searchTemplate: "https://duckduckgo.com/?q={}",
    keywords: ["search", "private"],
    aliases: ["ddg"],
  },
  {
    id: "gmail",
    name: "Gmail",
    url: "https://mail.google.com",
    category: "tools",
    description: "Email",
    keywords: ["email", "mail"],
    aliases: ["gm", "mail"],
  },
  {
    id: "drive",
    name: "Google Drive",
    url: "https://drive.google.com",
    category: "tools",
    description: "Cloud storage",
    keywords: ["storage", "cloud"],
    aliases: ["gd", "drive"],
  },

  // Local & Services
  {
    id: "port8080",
    name: "Port 8080",
    url: "http://localhost:8080",
    category: "services",
    description: "Local service",
    keywords: ["local", "service"],
    aliases: ["p8", "8080"],
  },
  {
    id: "localhost",
    name: "Local Dev",
    url: "http://localhost:3000",
    category: "services",
    description: "Development",
    keywords: ["dev", "local", "next"],
    aliases: ["dev", "local", "next"],
  },
];

export const CATEGORIES = {
  ai: { name: "AI & Chat" },
  dev: { name: "Development" },
  media: { name: "Media" },
  tools: { name: "Tools" },
  services: { name: "Services" },
};

// 4chan boards mapping
export const FOURCHAN_BOARDS: Record<string, string> = {
  // Traditional boards
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  gif: "gif",
  h: "h",
  hr: "hr",
  k: "k",
  m: "m",
  o: "o",
  p: "p",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  vg: "vg",
  vm: "vm",
  vmg: "vmg",
  vr: "vr",
  vrpg: "vrpg",
  vst: "vst",
  w: "w",
  wg: "wg",

  // International boards
  i: "i",
  ic: "ic",

  // Other boards
  r9k: "r9k",
  s4s: "s4s",
  vip: "vip",

  // Misc boards
  cm: "cm",
  hm: "hm",
  lgbt: "lgbt",
  y: "y",

  // Additional boards
  "3": "3",
  aco: "aco",
  adv: "adv",
  an: "an",
  bant: "bant",
  biz: "biz",
  cgl: "cgl",
  ck: "ck",
  co: "co",
  diy: "diy",
  fa: "fa",
  fit: "fit",
  gd: "gd",
  hc: "hc",
  his: "his",
  int: "int",
  jp: "jp",
  lit: "lit",
  mlp: "mlp",
  mu: "mu",
  n: "n",
  news: "news",
  out: "out",
  po: "po",
  pol: "pol",
  pw: "pw",
  qst: "qst",
  sci: "sci",
  soc: "soc",
  sp: "sp",
  tg: "tg",
  toy: "toy",
  trv: "trv",
  tv: "tv",
  vp: "vp",
  vt: "vt",
  wsg: "wsg",
  wsr: "wsr",
  x: "x",
  xs: "xs",
};

// Create a map for quick alias lookup
export const ALIAS_MAP: Record<string, string> = {};

COMMANDS.forEach((command) => {
  if (command.aliases) {
    command.aliases.forEach((alias) => {
      ALIAS_MAP[alias] = command.id;
    });
  }
  // Also map the id itself
  ALIAS_MAP[command.id] = command.id;
});

export const CONFIG = {
  commandPathDelimiter: "/",
  commandSearchDelimiter: " ",
  defaultSearchTemplate: "https://search.brave.com/search?q={}",
  openLinksInNewTab: true,
  suggestionLimit: 4,
};
