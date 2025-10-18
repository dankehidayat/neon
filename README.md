# Neon Startpage

## Overview
Neon is a modern, minimalist browser startpage designed for power users who want quick access to their most-used web services and efficient web searching. It replaces your browser's default new tab page with a clean, customizable interface that prioritizes speed and productivity.

## Key Features

### **Instant Command Navigation**
- **Quick Aliases**: Type short commands to instantly navigate to services
  - `g` → GitHub, `c` → ChatGPT, `gh` → GitHub, `ai` → ChatGPT
  - `yt` → YouTube, `rd` → Reddit, `dl` → DeepL, etc.
- **Smart Search Integration**: Commands with search terms (e.g., "youtube cats")
- **Category Organization**: Commands grouped into logical categories (AI, Development, Media, Tools, Services)

### 🔍 **Advanced Search System**
- **Transparent Modal**: Beautiful glass-morphism search interface
- **Dual Search Engine**: 
  - **Brave Search** as default for privacy-focused results
  - **DuckDuckGo** for instant autocomplete suggestions
- **Smart Autocomplete**: Shows both command aliases and search suggestions
- **Keyboard Optimized**: Arrow key navigation, Tab completion, Enter to execute

### **Modern Design**
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Backgrounds**: Subtle gradients for depth and visual appeal
- **Responsive Layout**: Adapts to any screen size from mobile to desktop
- **Smooth Animations**: Hover effects and transitions for polished experience

### **Theme System**
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **System Integration**: Automatically detects system theme preference
- **Smooth Transitions**: All theme changes are animated

### ⌨️ **Keyboard-First Workflow**
- **Any Key to Search**: Press any letter to instantly open search
- **Fast Typing Support**: Optimized for rapid keyboard input
- **Escape to Close**: Quick dismissal with Escape key
- **Click Anywhere**: Click empty space to open search modal

## Technical Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: shadcn/ui for consistent components
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks with custom theme context

## Architecture
- **Component-Based**: Modular React components (Search, Commands, ThemeToggle)
- **Configuration-Driven**: Commands and settings in centralized config files
- **JSONP Integration**: CORS-free autocomplete using DuckDuckGo's JSONP API
- **Performance Optimized**: Fast loading with optimized builds

## Use Cases
- **Developers**: Quick access to GitHub, documentation, and development tools
- **Researchers**: Fast searching across multiple services
- **Power Users**: Keyboard-driven workflow for maximum efficiency
- **Privacy-Conscious Users**: Brave Search as default for private browsing

## Unique Selling Points
1. **Speed**: Instant navigation with command aliases
2. **Privacy**: Brave Search as default engine
3. **Elegance**: Beautiful glass-morphism design
4. **Efficiency**: Keyboard-first workflow optimized for power users
5. **Customizability**: Easy to add new commands and services

Neon transforms your browsing experience from a blank tab into a powerful productivity hub that gets you where you need to go faster than ever before.
