# 🎵 Spotify Guesser

> Aplikacja webowa do analizy Twoich preferencji muzycznych i zabawy z quizami muzycznymi opartymi o Twoje dane ze Spotify!

![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)
![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)

---

## 📋 Spis Treści

- [O Projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Tech Stack](#-tech-stack)
- [Struktura Projektu](#-struktura-projektu)
- [Instalacja](#-instalacja)
- [Konfiguracja](#-konfiguracja)
- [Uruchomienie](#-uruchomienie)
- [Deployment](#-deployment)
- [Licencja](#-licencja)

---

## 🎯 O Projekcie

**Spotify Guesser** to kompleksowa aplikacja która łączy się z Twoim kontem Spotify, aby:
- 📊 Analizować Twoje nawyki muzyczne
- 🎤 Wyświetlać Twoich ulubionych artystów
- 🎵 Pokazywać najpopularniejsze utwory
- 🎮 Organizować quizy muzyczne z przyjaciółmi w czasie rzeczywistym

Projekt składa się z trzech głównych komponentów:
1. **Frontend** - Nowoczesny interfejs użytkownika (React + Vite)
2. **Backend Auth** - Serwer autoryzacji Spotify (Express)
3. **Socket Server** - Serwer gier multiplayer (Socket.IO)

---

## ✨ Funkcjonalności

### 🔐 Autoryzacja
- Bezpieczne logowanie przez Spotify OAuth 2.0
- Automatyczne odświeżanie tokenów
- Zarządzanie sesją użytkownika

### 📊 Dashboard Muzyczny
- **Top Artists** - Twoi ulubieni artyści (krótki, średni i długi termin)
- **Top Tracks** - Najpopularniejsze utwory
- **Szczegółowe Analizy** - Informacje o artystach i utworach
- **Wizualizacje** - Piękne wykresy i statystyki

### 🎮 Quiz Game
- Gry multiplayer w czasie rzeczywistym
- Pytania generowane na podstawie Twoich danych
- System punktacji
- Pokoje gier dla przyjaciół

### 🎨 UI/UX
- Dark/Light mode
- Responsywny design
- Animacje i przejścia
- Komponenty UI od shadcn/ui

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
- **Concurrently** - Równoległe uruchamianie skryptów
- **ESLint** - Linting kodu
- **Dotenv** - Zarządzanie zmiennymi środowiskowymi

---

## 📁 Struktura Projektu

```
spotify_guessser/
├── 📂 src/
│   ├── 📂 components/          # Komponenty React
│   │   ├── 📂 ui/              # Komponenty UI (shadcn)
│   │   ├── ArtistDetails.tsx   # Szczegóły artysty
│   │   ├── TopArtists.tsx      # Lista top artystów
│   │   ├── TopTracks.tsx       # Lista top utworów
│   │   ├── QuizGame.tsx        # Gra quizowa
│   │   └── ...
│   ├── 📂 lib/
│   │   ├── 📂 auth/            # Logika autoryzacji Spotify
│   │   │   └── authorize.ts    # Express auth server
│   │   ├── 📂 server/          # Socket.IO server
│   │   │   └── server.ts       # Multiplayer game logic
│   │   ├── 📂 database/        # Warstwa bazy danych
│   │   │   ├── supabase.ts     # Klient Supabase
│   │   │   └── services.ts     # Serwisy DB
│   │   ├── 📂 routers/         # Express routes
│   │   └── 📂 config/          # Konfiguracja
│   ├── 📂 contexts/            # React Contexts
│   │   └── AuthContext.tsx     # Kontekst autoryzacji
│   ├── App.tsx                 # Główny komponent
│   └── main.tsx                # Entry point
├── 📂 public/                  # Pliki statyczne
├── vite.config.ts              # Konfiguracja Vite (dev)
├── vite.config.prod.ts         # Konfiguracja Vite (prod)
├── tailwind.config.js          # Konfiguracja Tailwind
├── tsconfig.json               # Konfiguracja TypeScript
└── package.json                # Zależności projektu
```

---

## 🚀 Instalacja

### Wymagania
- **Node.js** >= 24.0.0
- **npm** lub **yarn**
- **Konto Spotify Developer** (dla API keys)
- **Konto Supabase** (dla bazy danych)

### Krok 1: Klonowanie repozytorium
```bash
# Klonuj projekt
git clone <repository-url>
cd spotify_guessser
```

### Krok 2: Instalacja zależności
```bash
# Zainstaluj wszystkie pakiety
npm install
```

### Krok 3: Generowanie certyfikatów SSL (tylko dla development)
```bash
# Wygeneruj self-signed SSL certificate dla lokalnego HTTPS
openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes -subj "/CN=192.168.0.93" -addext "subjectAltName=IP:192.168.0.93,DNS:localhost"
```

> **Uwaga:** Zamień `192.168.0.93` na swój lokalny adres IP

---

## ⚙️ Konfiguracja

### Krok 1: Spotify Developer App

1. Wejdź na [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Utwórz nową aplikację
3. Dodaj Redirect URIs:
   ```
   https://localhost:8888/callback
   https://192.168.0.93:8888/callback
   ```
4. Skopiuj **Client ID** i **Client Secret**

### Krok 2: Supabase Setup

1. Utwórz projekt na [Supabase](https://supabase.com)
2. Skopiuj URL projektu i API keys
3. Uruchom SQL queries z pliku `database inster query` aby stworzyć tabele

### Krok 3: Plik .env

Utwórz plik `.env` w głównym katalogu:

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
# 🌐 DEVELOPMENT URLS (localhost lub local IP)
# ============================================
VITE_FRONTEND_URL=https://192.168.0.93:5173
VITE_BACKEND_URL=https://192.168.0.93:8888
VITE_SERVER_BACKEND_URL=https://192.168.0.93:3001

FRONTEND_URL=https://192.168.0.93:5173
BACKEND_URL=https://192.168.0.93:8888
SERVER_BACKEND_URL=https://192.168.0.93:3001

# ============================================
# ⚙️ OTHER SETTINGS
# ============================================
NODE_ENV=development
AUTH_PORT=8888
```

> **💡 Tip:** Zamień `192.168.0.93` na swój lokalny adres IP (sprawdź przez `ipconfig` lub `ifconfig`)

---

## 🎬 Uruchomienie

### Development Mode (wszystkie serwery naraz)

```bash
# Uruchamia frontend, backend auth, socket server i sprawdza DB
npm run dev
```

To uruchomi:
- ✅ Frontend na `https://192.168.0.93:5173`
- ✅ Backend Auth na `https://192.168.0.93:8888`
- ✅ Socket Server na `https://192.168.0.93:3001`
- ✅ Database check script

### Uruchamianie osobno

```bash
# Tylko frontend
npm run dev:frontend

# Tylko backend (auth + socket)
npm run dev:backend

# Tylko auth server
npm run dev:backend-auth

# Tylko socket server
npm run dev:backend-socket

# Sprawdzenie połączenia z bazą danych
npm run db:check
```

### Akceptowanie SSL Certyfikatów

Po pierwszym uruchomieniu odwiedź w przeglądarce i zaakceptuj self-signed certyfikaty:
1. `https://192.168.0.93:5173` (Frontend)
2. `https://192.168.0.93:8888` (Backend Auth)
3. `https://192.168.0.93:3001` (Socket Server)

---

## 📦 Deployment

### Build dla Produkcji

```bash
# Build frontend (bez SSL config)
npm run build:prod

# Build backend
npm run build:backend
```

To wygeneruje folder `dist/` z zoptymalizowanym kodem frontend.

### Deployment Options

#### Option 1: Frontend na FTP/Static Hosting
1. Uruchom `npm run build:prod`
2. Upload zawartości folderu `dist/` na serwer FTP
3. Backend musi być hostowany osobno (np. VPS, Heroku, Railway)

#### Option 2: Full Stack Deployment
Potrzebujesz hostingu z Node.js:
- **Vercel** / **Netlify** - Frontend
- **Railway** / **Render** / **Heroku** - Backend
- **Supabase** - Database (już w chmurze)

#### Option 3: VPS (pełna kontrola)
Deploy całej aplikacji na VPS (np. DigitalOcean, AWS EC2):
1. Zainstaluj Node.js na serwerze
2. Sklonuj repo
3. Zainstaluj zależności
4. Setup NGINX jako reverse proxy
5. Użyj PM2 do zarządzania procesami
6. Certyfikaty SSL z Let's Encrypt

### Zmienne Środowiskowe dla Produkcji

W produkcji zmień wszystkie URL na swoje domeny:
```bash
VITE_FRONTEND_URL=https://yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
NODE_ENV=production
```

---

## 🔒 Bezpieczeństwo

### Development
- ✅ Self-signed SSL certificates
- ✅ CORS włączone dla localhost
- ✅ Cookies: `sameSite: 'lax'`

### Production
- ✅ Prawdziwe SSL certificates (Let's Encrypt)
- ✅ CORS ograniczony do twojej domeny
- ✅ Cookies: `httpOnly: true, secure: true, sameSite: 'strict'`
- ✅ Zmienne środowiskowe w `.env` (nie commituj do git!)
- ✅ Rate limiting na endpointach API

---

## 🐛 Troubleshooting

### Problem: "Certificate error" w przeglądarce
**Rozwiązanie:** Odwiedź każdy port (5173, 8888, 3001) i zaakceptuj certyfikat

### Problem: "Failed to connect to database"
**Rozwiązanie:** Sprawdź `DATABASE_URL` w `.env` i upewnij się że Supabase projekt działa

### Problem: "CORS error"
**Rozwiązanie:** Upewnij się że `FRONTEND_URL` i `BACKEND_URL` są prawidłowe

### Problem: Porty zajęte
**Rozwiązanie:** 
```bash
# Znajdź procesy na portach
lsof -i :5173
lsof -i :8888
lsof -i :3001

# Zabij proces
kill -9 <PID>
```

---

## 📝 Skrypty NPM

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchom wszystkie serwery (dev) |
| `npm run dev:frontend` | Tylko frontend |
| `npm run dev:backend` | Tylko backend (auth + socket) |
| `npm run build` | Build frontend (dev config) |
| `npm run build:prod` | Build frontend (prod config) |
| `npm run build:backend` | Kompiluj TypeScript backend |
| `npm run lint` | Sprawdź kod (ESLint) |
| `npm run db:check` | Sprawdź połączenie z DB |

---

## 🤝 Contributing

Pull requesty są mile widziane! Dla większych zmian, najpierw otwórz issue aby przedyskutować co chcesz zmienić.

---

## 📄 Licencja

MIT License - możesz robić z tym projektem co chcesz!

---

## 👨‍💻 Autor

Stworzony z ❤️ przez Kacpra

---

## 🙏 Podziękowania

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Supabase](https://supabase.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
- [React](https://react.dev)

---

### 📱 Screenshots

_// TODO: Dodaj screenshoty aplikacji_

---

**Miłej zabawy z analizą swojej muzyki! 🎵✨**
