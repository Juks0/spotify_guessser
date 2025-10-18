# 🎨 Spotify Guesser - Frontend

React frontend for Spotify Guesser application built with Vite, TypeScript, and Tailwind CSS.

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

# Start dev server (from root directory)
cd .. && npm run dev:frontend
```

Frontend will be available at: `{ip}`

## 🏗️ Build

```bash
# Development build
npm run build

# Production build (without SSL config)
npm run build:prod
```

Build will generate `dist/` folder ready for deployment.

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

Create a `.env` file in the `frontend/` directory:

```bash
VITE_FRONTEND_URL=https://{local ip}:5173
VITE_BACKEND_URL=https://{local ip}:8888
VITE_SERVER_BACKEND_URL=https://{local ip}:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SPOTIFY_CLIENT_ID=your_client_id
```

### Vite Config

- `vite.config.ts` - Development (with SSL)
- `vite.config.prod.ts` - Production (without SSL)

## 📱 Features

- 🎵 Top Artists & Tracks visualization
- 📊 Music analytics dashboard
- 🎮 Real-time quiz game
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🔐 Spotify OAuth authentication

## 🎨 Styling

We use Tailwind CSS with CSS variables configuration for theming:

```tsx
// Example
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

## 🧩 Components

UI components are based on shadcn/ui and Radix UI:

```bash
# Add new component
npx shadcn-ui@latest add button
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🚢 Deployment

### Static Hosting (Vercel, Netlify, FTP)

```bash
# Build
npm run build:prod

# Upload dist/ contents to server
```

### Environment for Production

Make sure environment variables point to production URLs:

```bash
VITE_FRONTEND_URL=https://yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
```

---

**Part of Spotify Guesser Monorepo 🎵**
