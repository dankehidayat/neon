# Neon Startpage

A modern, minimalist browser startpage designed for power users who want quick access to their most-used web services and efficient web searching.

![Neon Startpage](https://via.placeholder.com/800x450/3B82F6/FFFFFF?text=Neon+Startpage)

## ✨ Features

### 🚀 Instant Command Navigation

- **Quick Aliases**: Type short commands to instantly navigate to services
  - `yt` → YouTube, `rd` → Reddit, `gh` → GitHub, `ai` → ChatGPT
  - `g` → GitHub, `c` → ChatGPT, `dl` → DeepL, `4c` → 4chan
- **Smart Search Integration**: Commands with search terms (e.g., "yt linux tutorial")
- **Category Organization**: Commands grouped into logical categories (AI, Development, Media, Tools, Services)

### 🔍 Advanced Search System

- **Transparent Modal**: Beautiful glass-morphism search interface
- **Dual Search Engine**:
  - **Brave Search** as default for privacy-focused results
  - **DuckDuckGo** for instant autocomplete suggestions
- **Smart Autocomplete**: Shows both command aliases and search suggestions
- **Keyboard Optimized**: Arrow key navigation, Tab completion, Enter to execute

### 🎨 Modern Design

- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Backgrounds**: Subtle gradients for depth and visual appeal
- **Responsive Layout**: Adapts to any screen size from mobile to desktop
- **Smooth Animations**: Hover effects and transitions for polished experience

### 🌓 Theme System

- **Dark/Light Mode**: Toggle between themes with persistent preference
- **System Integration**: Automatically detects system theme preference
- **Smooth Transitions**: All theme changes are animated

### ⌨️ Keyboard-First Workflow

- **Any Key to Search**: Press any letter to instantly open search
- **Fast Typing Support**: Optimized for rapid keyboard input
- **Escape to Close**: Quick dismissal with Escape key
- **Click Anywhere**: Click empty space to open search modal

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/dankehidayat/neon.git
cd neon-startpage
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 💡 Usage Examples

### Basic Navigation

- `gh` → GitHub
- `yt` → YouTube
- `rd` → Reddit
- `ai` → ChatGPT

### Search Commands

- `yt linux tutorial` → YouTube search for "linux tutorial"
- `rd programming` → Reddit search for "programming"
- `ha one piece` → HiAnime search for "one piece"
- `ny torrent` → Nyaa search for "torrent"

### Special Features

- `rd r/opendirectories` → Direct subreddit access
- `4c fit` → 4chan /fit/ board
- `4c pol` → 4chan /pol/ board
- `chan a` → 4chan /a/ board

### Keyboard Shortcuts

- `Any letter` → Open search with that letter
- `Space` → Open empty search
- `Escape` → Close search modal
- `↑/↓` → Navigate suggestions
- `Tab` → Select first suggestion
- `Ctrl/Cmd + T` → Toggle theme
- `Enter` → Execute search

## 🛠 Supported Services

### 🔍 Search-Enabled Services

- **YouTube** (`yt`) - Video search
- **YouTube Music** (`ytm`) - Music search
- **Reddit** (`rd`, `r`) - Search and subreddit navigation
- **HiAnime** (`ha`) - Anime streaming search
- **Nyaa** (`ny`) - Torrent search
- **4chan** (`4c`, `chan`) - Board navigation
- **DuckDuckGo** (`ddg`) - Private search

### 🎯 Quick Access

- **GitHub** (`gh`, `git`)
- **ChatGPT** (`gpt`, `ai`)
- **Claude** (`cl`)
- **Gemini** (`gem`, `gg`)
- **Notion** (`note`, `nt`)
- **DeepL** (`dl`, `translate`)
- **Gmail** (`gm`, `mail`)
- **Google Drive** (`gd`, `drive`)
- **Local Development** (`dev`, `local`)

## 🏗 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: shadcn/ui for consistent components
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks with custom theme context

## 🎯 Architecture

- **Component-Based**: Modular React components (Search, Commands, ThemeToggle)
- **Configuration-Driven**: Commands and settings in centralized config files
- **JSONP Integration**: CORS-free autocomplete using DuckDuckGo's JSONP API
- **Performance Optimized**: Fast loading with optimized builds

## 🔧 Configuration

### Adding New Commands

Edit `src/lib/commands.ts` to add new services:

```typescript
{
  id: "example",
  name: "Example Service",
  url: "https://example.com",
  category: "tools",
  description: "Example description",
  searchTemplate: "https://example.com/search?q={}", // Optional
  aliases: ["ex", "example"],
}
```

### Customizing Search

Modify `CONFIG` in `src/lib/commands.ts`:

```typescript
export const CONFIG = {
  defaultSearchTemplate: "https://search.brave.com/search?q={}",
  commandSearchDelimiter: " ",
  suggestionLimit: 4,
};
```

## 🎨 Customization

### Themes

The theme system uses CSS variables for easy customization. Modify `src/app/globals.css`:

```css
:root {
  --background: 220 23% 95%;
  --foreground: 222 47% 11%;
  /* Add your custom colors */
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  /* Dark theme colors */
}
```

### Styling

- Edit component styles in respective `.tsx` files
- Global styles in `src/app/globals.css`
- Tailwind configuration in `tailwind.config.js`

## 🌟 Use Cases

- **Developers**: Quick access to GitHub, documentation, and development tools
- **Researchers**: Fast searching across multiple services
- **Power Users**: Keyboard-driven workflow for maximum efficiency
- **Privacy-Conscious Users**: Brave Search as default for private browsing

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the build folder to Netlify
```

### Self-Hosted

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Brave Search](https://search.brave.com) for privacy-focused search
- [DuckDuckGo](https://duckduckgo.com) for autocomplete suggestions
- [IAWriter](https://ia.net/topics/in-search-of-the-perfect-writing-font) for the beautiful font.
