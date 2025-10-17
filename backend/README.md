# 🔧 Spotify Guesser - Backend

Node.js backend aplikacji Spotify Guesser z Express, Socket.IO i Supabase.

## 🛠 Tech Stack

- **Node.js 24.x** - Runtime
- **Express 5.1** - HTTP server
- **Socket.IO 4.8** - WebSocket server
- **TypeScript 5.8** - Type safety
- **Supabase** - PostgreSQL database
- **Spotify API** - Music data source

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
# Start wszystkie serwery (auth + socket + db check)
npm run dev

# Lub osobno:
npm run dev:auth      # Auth server (port 8888)
npm run dev:socket    # Socket server (port 3001)
npm run db:check      # Database connection check
```

## 🏗️ Build

```bash
# Compile TypeScript
npm run build
```

## 📁 Structure

```
backend/
├── src/
│   ├── auth/           # Spotify OAuth & Express routes
│   │   └── authorize.ts
│   ├── server/         # Socket.IO multiplayer server
│   │   └── server.ts
│   ├── database/       # Supabase client & services
│   │   ├── supabase.ts
│   │   ├── services.ts
│   │   └── types.ts
│   ├── routers/        # Express API routes
│   │   ├── userRoute.ts
│   │   ├── topArtistRoute.ts
│   │   ├── topTrackRoute.ts
│   │   ├── quizQuestions.ts
│   │   └── ...
│   ├── config/         # Environment configuration
│   │   └── environment.ts
│   └── scripts/        # Utility scripts
│       └── check-database.ts
└── package.json
```

## 🔧 Configuration

### Environment Variables

Utwórz plik `.env` w katalogu głównym projektu (współdzielony z frontendem):

```bash
# Spotify API
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
DATABASE_URL=postgresql://...

# URLs
FRONTEND_URL=https://192.168.0.93:5173
BACKEND_URL=https://192.168.0.93:8888
SERVER_BACKEND_URL=https://192.168.0.93:3001

# Other
NODE_ENV=development
AUTH_PORT=8888
```

## 🎯 Services

### 1. Auth Server (Port 8888)

Express server obsługujący:
- Spotify OAuth 2.0 authentication
- Token management & refresh
- API routes dla user data, top artists, top tracks
- Playback control endpoints

**Główne endpointy:**
- `GET /login` - Spotify OAuth initiation
- `GET /callback` - OAuth callback
- `GET /refresh_token` - Token refresh
- `GET /spotify/me` - User profile
- `GET /spotify/top-artists` - Top artists
- `GET /spotify/top-tracks` - Top tracks
- `POST /spotify/play` - Playback control

### 2. Socket.IO Server (Port 3001)

WebSocket server dla multiplayer quiz game:
- Room creation & joining
- Real-time question distribution
- Score tracking
- Timer synchronization

**Socket Events:**
- `createRoom` - Stwórz pokój gry
- `joinRoom` - Dołącz do pokoju
- `hostQuestions` - Wyślij pytania
- `submitAnswer` - Wyślij odpowiedź
- `questionStart` / `questionEnd` - Synchronizacja pytań

### 3. Database Layer

Serwisy do interakcji z Supabase PostgreSQL:
- User management
- Top artists/tracks storage
- Quiz history
- Friend relationships

## 📝 Scripts

| Komenda | Opis |
|---------|------|
| `npm run dev` | Start auth + socket + db check |
| `npm run dev:auth` | Tylko auth server (8888) |
| `npm run dev:socket` | Tylko socket server (3001) |
| `npm run db:check` | Sprawdź połączenie z DB |
| `npm run build` | Compile TypeScript |
| `npm run start:auth` | Production auth server |
| `npm run start:socket` | Production socket server |

## 🔐 SSL Certificates (Development)

Backend używa HTTPS w development. Certyfikaty są kopiowane z głównego katalogu:
- `private.key`
- `certificate.crt`

Dla produkcji użyj prawdziwych certyfikatów (Let's Encrypt).

## 🚢 Deployment

### Node.js Hosting (Railway, Render, Heroku)

```bash
# Build
npm run build

# Start servers
npm run start:auth &
npm run start:socket &
```

### VPS Deployment

1. Zainstaluj Node.js na serwerze
2. Sklonuj projekt i zainstaluj zależności
3. Setup NGINX jako reverse proxy
4. Użyj PM2 do zarządzania procesami:

```bash
# Zainstaluj PM2
npm install -g pm2

# Start services
pm2 start src/auth/authorize.ts --name "auth-server" --interpreter tsx
pm2 start src/server/server.ts --name "socket-server" --interpreter tsx

# Save PM2 config
pm2 save
pm2 startup
```

### Environment dla Production

```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
SERVER_BACKEND_URL=https://api.yourdomain.com:3001
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Znajdź proces
lsof -i :8888
lsof -i :3001

# Zabij proces
kill -9 <PID>
```

### Database connection failed
- Sprawdź `DATABASE_URL` w `.env`
- Upewnij się że Supabase projekt działa
- Sprawdź czy IP serwera jest dozwolony w Supabase

### SSL certificate errors
- W development: Zaakceptuj self-signed cert w przeglądarce
- W production: Użyj prawdziwego certyfikatu (Let's Encrypt)

---

**Część projektu Spotify Guesser Monorepo 🔧**


