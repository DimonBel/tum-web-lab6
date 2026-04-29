# Who Am I? AR

A multiplayer party game where each player gets a secret character assigned to them via QR code. Other players scan your QR with their camera (AR) to see who you are — then ask yes/no questions to figure out your own character.

## Flows

### Home
- Create a game (host) or join one with a room code
- Scan a host's QR code to join directly
- Manage and browse the character library

### Create / Lobby
- Host generates a room code + QR
- Players join and their status shows live
- Host starts the game when everyone is ready

### Character Assignment (My QR)
- Each player gets a random character encoded as a QR code
- The QR is shown on your screen for others to scan
- "Peek" (hold) briefly reveals your character if needed

### AR Scan
- Opens the real device camera
- Point at another player's QR code
- The app decodes it using `jsQR` and overlays the character info (AR effect)
- Falls back to demo mode if camera is unavailable

### Gameplay
- Players take turns asking yes/no questions in a chat-style interface
- Answer YES or NO to questions about your character
- Guess your character at any time

### Win / Wrong
- Correct guess → scoreboard shown with all players' points
- Wrong guess → hint given, game continues

### Characters Library
- Browse all characters with search + category filter
- Like / favourite characters (❤️)
- Add custom characters (name, emoji, category)
- Remove characters
- State persisted to `localStorage`

## Tech Stack

- **React 18** + **Vite**
- **jsQR** — real QR code scanning from camera frames
- **qrcode** — generates scannable QR codes for each player
- **CSS Variables** — light/dark theme, toggled per user preference stored in `localStorage`
- **localStorage** — characters list and scores persist across sessions
- Hosted on **GitHub Pages** via GitHub Actions

## Folder Structure

```
src/
  assets/
  components/       # Avatar, NavBar, StatusBar, QRCode
  context/          # ThemeContext, GameContext
  data/             # Default characters + players
  hooks/            # useLocalStorage, useTheme
  pages/            # One file per screen
  styles/           # globals.css (CSS variables, shared classes)
  App.jsx
  main.jsx
```

## Dev Setup

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

Pushes to `main` automatically deploy to GitHub Pages via the included workflow.
Set `base` in `vite.config.js` to match your repo name: `/your-repo-name/`.
