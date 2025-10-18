# 🎵 Spotify Guesser

> A web application for analyzing your music preferences and playing music quizzes based on your Spotify data!

![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)
![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running](#-running)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🎯 About

**Spotify Guesser** is a comprehensive application that connects to your Spotify account to:
- 📊 Analyze your music listening habits
- 🎤 Display your favorite artists
- 🎵 Show your most popular tracks
- 🎮 Organize real-time music quizzes with friends

The project consists of three main components:
1. **Frontend** - Modern user interface (React + Vite)
2. **Backend Auth** - Spotify authorization server (Express)
3. **Socket Server** - Multiplayer game server (Socket.IO)

---

## ✨ Features

### 🔐 Authorization
- Secure login via Spotify OAuth 2.0
- Automatic token refresh
- User session management

### 📊 Music Dashboard
- **Top Artists** - Your favorite artists (short, medium, and long term)
- **Top Tracks** - Most popular tracks
- **Detailed Analytics** - Artist and track information
- **Visualizations** - Beautiful charts and statistics

### 🎮 Quiz Game
- Real-time multiplayer games
- Questions generated based on your data
- Scoring system
- Game rooms for friends

### 🎨 UI/UX
- Dark/Light mode
- Responsive design
- Animations and transitions
- UI components from shadcn/ui

---

## 🛠 Tech Stack

### Frontend
```json
{
  "Framework": "React 18.3",
  "Build Tool": "Vite 7.1",
  "Language": "TypeScript 5.8",
  "Styling": "Tailwind CSS 4.1",
  "UI Components": "Radix UI + shadcn/ui",
  "Routing": "React Router DOM 7",
  "State Management": "React Context + Hooks",
  "Charts": "Recharts",
  "Icons": "Lucide React"
}
```

### Backend
```json
{
  "Runtime": "Node.js 24.x",
  "Server Framework": "Express 5.1",
  "Real-time": "Socket.IO 4.8",
  "Database": "Supabase (PostgreSQL)",
  "Authentication": "Spotify OAuth 2.0",
  "Language": "TypeScript"
}
```

### DevOps & Tools
- **TSX** - TypeScript execution
- **Concurrently** - Parallel script execution
- **ESLint** - Code linting
- **Dotenv** - Environment variable management

---

## 📁 Project Structure (Monorepo)

```
spotify_guessser/
├── 📂 frontend/                # 🎨 React Application
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   │   ├── 📂 ui/          # shadcn/ui components
│   │   │   ├── TopArtists.tsx
│   │   │   ├── TopTracks.tsx
│   │   │   ├── QuizGame.tsx
│   │   │   └── ...
│   │   ├── 📂 contexts/        # React Contexts
│   │   ├── 📂 assets/          # Static assets
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   ├── 📂 public/              # Static files
│   ├── vite.config.ts          # Vite config
│   ├── package.json            # Frontend dependencies
│   └── README.md               # Frontend docs
│
├── 📂 backend/                 # 🔧 Node.js Servers
│   ├── 📂 src/
│   │   ├── 📂 auth/            # Spotify OAuth server
│   │   │   └── authorize.ts
│   │   ├── 📂 server/          # Socket.IO server
│   │   │   └── server.ts
│   │   ├── 📂 database/        # Supabase client
│   │   │   ├── supabase.ts
│   │   │   └── services.ts
│   │   ├── 📂 routers/         # API routes
│   │   ├── 📂 config/          # Configuration
│   │   └── 📂 scripts/         # Utility scripts
│   ├── package.json            # Backend dependencies
│   └── README.md               # Backend docs
│
├── 📄 .env                     # Environment variables (shared)
├── 📄 package.json             # Workspace root
├── 📄 README.md                # This file
└── 📄 MIGRATION_GUIDE.md       # Migration instructions
```

> **💡 The project is organized as a monorepo** with separate folders for frontend and backend, making development and deployment easier.

---

## 🚀 Installation

### Requirements
- **Node.js** >= 24.0.0
- **npm** or **yarn**
- **Spotify Developer Account** (for API keys)
- **Supabase Account** (for database)

### Step 1: Clone repository
```bash
# Clone project
git clone <repository-url>
cd spotify_guessser
```

### Step 2: Install dependencies
```bash
# Install all packages (root + frontend + backend)
npm install

# Or separately:
cd frontend && npm install
cd ../backend && npm install
```

### Step 3: Generate SSL certificates (development only)
```bash
# Generate self-signed SSL certificate for local HTTPS
openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes -subj "/CN={local ip}" -addext "subjectAltName=IP:{local ip},DNS:localhost"
```

> **Note:** Replace `{local ip}` with your local IP address

---

## ⚙️ Configuration

### Step 1: Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add Redirect URIs:
   ```
   https://localhost:8888/callback
   https://{local ip}:8888/callback
   ```
4. Copy **Client ID** and **Client Secret**

### Step 2: Supabase Setup

1. Create a project on [Supabase](https://supabase.com)
2. Copy project URL and API keys
3. Run SQL queries from `database inster query` file to create tables

### Step 3: .env File

Create a `.env` file in the main directory:

```bash
# ============================================
# 🎵 SPOTIFY API CREDENTIALS
# ============================================
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# ============================================
# 🗄️ SUPABASE DATABASE
# ============================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# ============================================
# 🌐 DEVELOPMENT URLS (localhost or local IP)
# ============================================
VITE_FRONTEND_URL=https://{local ip}:5173
VITE_BACKEND_URL=https://{local ip}:8888
VITE_SERVER_BACKEND_URL=https://{local ip}:3001

FRONTEND_URL=https://{local ip}:5173
BACKEND_URL=https://{local ip}:8888
SERVER_BACKEND_URL=https://{local ip}:3001

# ============================================
# ⚙️ OTHER SETTINGS
# ============================================
NODE_ENV=development
AUTH_PORT=8888
```

> **💡 Tip:** Replace `{local ip}` with your local IP address (check with `ipconfig` or `ifconfig`)

---

## 🎬 Running

### Development Mode - From root directory (Monorepo)

```bash
# Run frontend + backend together
npm run dev
```

This will start:
- ✅ Frontend at `https://{local ip}:5173`
- ✅ Backend Auth at `https://{local ip}:8888`
- ✅ Socket Server at `https://{local ip}:3001`
- ✅ Database check script

### Running separately

```bash
# From root directory:
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only (auth + socket + db check)

# Or enter specific folder:
cd frontend && npm run dev      # Vite dev server
cd backend && npm run dev       # All backend servers
cd backend && npm run dev:auth  # Auth server only
cd backend && npm run dev:socket # Socket server only
```

### Accepting SSL Certificates

After first run, visit in browser and accept self-signed certificates:
1. `https://{local ip}:5173` (Frontend)
2. `https://{local ip}:8888` (Backend Auth)
3. `https://{local ip}:3001` (Socket Server)

---

## 📦 Deployment

### Production Build

```bash
# Build frontend + backend (from root)
npm run build

# Or separately:
npm run build:frontend  # Build frontend (production config)
npm run build:backend   # Compile backend TypeScript

# Or enter folder:
cd frontend && npm run build:prod  # -> frontend/dist/
cd backend && npm run build        # -> backend/dist/
```

### Deployment Options

#### Option 1: Frontend on FTP/Static Hosting
1. Run `npm run build:prod`
2. Upload `dist/` folder contents to FTP server
3. Backend must be hosted separately (e.g., VPS, Heroku, Railway)

#### Option 2: Full Stack Deployment
Requires Node.js hosting:
- **Vercel** / **Netlify** - Frontend
- **Railway** / **Render** / **Heroku** - Backend
- **Supabase** - Database (already in cloud)

#### Option 3: VPS (full control)
Deploy entire app on VPS (e.g., DigitalOcean, AWS EC2):
1. Install Node.js on server
2. Clone repo
3. Install dependencies
4. Setup NGINX as reverse proxy
5. Use PM2 for process management
6. SSL certificates from Let's Encrypt

### Environment Variables for Production

In production, change all URLs to your domains:
```bash
VITE_FRONTEND_URL=https://yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
NODE_ENV=production
```

---

## 🔒 Security

### Development
- ✅ Self-signed SSL certificates
- ✅ CORS enabled for localhost
- ✅ Cookies: `sameSite: 'lax'`

### Production
- ✅ Real SSL certificates (Let's Encrypt)
- ✅ CORS restricted to your domain
- ✅ Cookies: `httpOnly: true, secure: true, sameSite: 'strict'`
- ✅ Environment variables in `.env` (don't commit to git!)
- ✅ Rate limiting on API endpoints

---

## 🐛 Troubleshooting

### Problem: "Certificate error" in browser
**Solution:** Visit each port (5173, 8888, 3001) and accept the certificate

### Problem: "Failed to connect to database"
**Solution:** Check `DATABASE_URL` in `.env` and ensure Supabase project is running

### Problem: "CORS error"
**Solution:** Ensure `FRONTEND_URL` and `BACKEND_URL` are correct

### Problem: Ports in use
**Solution:** 
```bash
# Find processes on ports
lsof -i :5173
lsof -i :8888
lsof -i :3001

# Kill process
kill -9 <PID>
```

---

## 📝 NPM Scripts

### Root Directory (Workspace)

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only (all) |
| `npm run build` | Build frontend + backend |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |

### Frontend (`cd frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (5173) |
| `npm run build:prod` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint check |

### Backend (`cd backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Auth + Socket + DB check |
| `npm run dev:auth` | Auth only (8888) |
| `npm run dev:socket` | Socket only (3001) |
| `npm run db:check` | Check database |
| `npm run build` | Compile TypeScript |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License - you can do whatever you want with this project!

---

## 👨‍💻 Author

Created with ❤️ by Kacper Mazur

---

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Supabase](https://supabase.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
- [React](https://react.dev)

---

### 📱 Screenshots

#### Dashboard / Me Page
![Dashboard](img/me.png)
*Your personalized music dashboard with listening statistics and insights*

#### Top Artists
![Top Artists](img/top-artists.png)
*View your most listened to artists across different time periods*

#### Top Tracks
![Top Tracks](img/top-tracks.png)
*Discover your favorite songs and tracks*

#### Artist Details
![Artist Details](img/artist.png)
*Detailed information about your favorite artists*

#### Track Details
![Track Details](img/track.png)
*In-depth track information and audio features*

---

**Enjoy analyzing your music! 🎵✨**
