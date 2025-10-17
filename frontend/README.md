    # 🎨 Spotify Guesser - Frontend

React frontend aplikacji Spotify Guesser zbudowany z Vite, TypeScript i Tailwind CSS.

## 🛠 Tech Stack

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.1** - Build tool
- **Tailwind CSS 4.1** - Styling
- **shadcn/ui** - UI components
- **React Router DOM** - Routing
- **Socket.IO Client** - Real-time communication
- **Recharts** - Data visualization

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
# Start dev server
npm run dev

# Start dev server (z root directory)
cd .. && npm run dev:frontend
```

Frontend będzie dostępny na: `https://192.168.0.93:5173`

## 🏗️ Build

```bash
# Development build
npm run build

# Production build (bez SSL config)
npm run build:prod
```

Build wygeneruje folder `dist/` gotowy do deployment.

## 📁 Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/       # React contexts (Auth, Theme)
│   ├── assets/         # Static assets & wrappers
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static files
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

## 🔧 Configuration

### Environment Variables

Utwórz plik `.env` w katalogu `frontend/`:

```bash
VITE_FRONTEND_URL=https://192.168.0.93:5173
VITE_BACKEND_URL=https://192.168.0.93:8888
VITE_SERVER_BACKEND_URL=https://192.168.0.93:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SPOTIFY_CLIENT_ID=your_client_id
```

### Vite Config

- `vite.config.ts` - Development (z SSL)
- `vite.config.prod.ts` - Production (bez SSL)

## 📱 Features

- 🎵 Top Artists & Tracks visualization
- 📊 Music analytics dashboard
- 🎮 Real-time quiz game
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🔐 Spotify OAuth authentication

## 🎨 Styling

Używamy Tailwind CSS z konfiguracją CSS variables dla theming:

```tsx
// Example
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

## 🧩 Components

UI komponenty bazują na shadcn/ui i Radix UI:

```bash
# Dodaj nowy komponent
npx shadcn-ui@latest add button
```

## 📝 Scripts

| Komenda | Opis |
|---------|------|
| `npm run dev` | Start dev server z HMR |
| `npm run build` | Build dla development |
| `npm run build:prod` | Build dla production |
| `npm run preview` | Preview production build |
| `npm run lint` | Uruchom ESLint |

## 🚢 Deployment

### Static Hosting (Vercel, Netlify, FTP)

```bash
# Build
npm run build:prod

# Upload zawartość dist/ na serwer
```

### Environment dla Production

Upewnij się że zmienne środowiskowe wskazują na produkcyjne URLe:

```bash
VITE_FRONTEND_URL=https://yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
```

---

**Część projektu Spotify Guesser Monorepo 🎵**

