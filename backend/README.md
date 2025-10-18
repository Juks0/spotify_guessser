# 🔧 Spotify Guesser - Backend

Node.js backend for Spotify Guesser application with Express, Socket.IO, and Supabase.

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
# Start all servers (auth + socket + db check)
npm run dev

# Or separately:
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

Create a `.env` file in the project root directory (shared with frontend):

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
FRONTEND_URL=https://{local ip}:5173
BACKEND_URL=https://{local ip}:8888
SERVER_BACKEND_URL=https://{local ip}:3001

# Other
NODE_ENV=development
AUTH_PORT=8888
```

## 🎯 Services

### 1. Auth Server (Port 8888)

Express server handling:
- Spotify OAuth 2.0 authentication
- Token management & refresh
- API routes for user data, top artists, top tracks
- Playback control endpoints

**Main endpoints:**
- `GET /login` - Spotify OAuth initiation
- `GET /callback` - OAuth callback
- `GET /refresh_token` - Token refresh
- `GET /spotify/me` - User profile
- `GET /spotify/top-artists` - Top artists
- `GET /spotify/top-tracks` - Top tracks
- `POST /spotify/play` - Playback control

### 2. Socket.IO Server (Port 3001)

WebSocket server for multiplayer quiz game:
- Room creation & joining
- Real-time question distribution
- Score tracking
- Timer synchronization

**Socket Events:**
- `createRoom` - Create game room
- `joinRoom` - Join room
- `hostQuestions` - Send questions
- `submitAnswer` - Submit answer
- `questionStart` / `questionEnd` - Question synchronization

### 3. Database Layer

Services for interacting with Supabase PostgreSQL:
- User management
- Top artists/tracks storage
- Quiz history
- Friend relationships

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start auth + socket + db check |
| `npm run dev:auth` | Auth server only (8888) |
| `npm run dev:socket` | Socket server only (3001) |
| `npm run db:check` | Check database connection |
| `npm run build` | Compile TypeScript |
| `npm run start:auth` | Production auth server |
| `npm run start:socket` | Production socket server |

## 🔐 SSL Certificates (Development)

Backend uses HTTPS in development. Certificates are copied from main directory:
- `private.key`
- `certificate.crt`

For production, use real certificates (Let's Encrypt).

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

1. Install Node.js on server
2. Clone project and install dependencies
3. Setup NGINX as reverse proxy
4. Use PM2 for process management:

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start src/auth/authorize.ts --name "auth-server" --interpreter tsx
pm2 start src/server/server.ts --name "socket-server" --interpreter tsx

# Save PM2 config
pm2 save
pm2 startup
```

### Environment for Production

```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
SERVER_BACKEND_URL=https://api.yourdomain.com:3001
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process
lsof -i :8888
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database connection failed
- Check `DATABASE_URL` in `.env`
- Ensure Supabase project is running
- Check if server IP is allowed in Supabase

### SSL certificate errors
- In development: Accept self-signed cert in browser
- In production: Use real certificate (Let's Encrypt)

---

**Part of Spotify Guesser Monorepo 🔧**
