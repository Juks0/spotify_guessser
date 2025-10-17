# 📦 Migration Guide - Reorganizacja Frontend/Backend

Ten przewodnik pomoże Ci zreorganizować projekt na strukturę monorepo z oddzielnymi folderami `frontend/` i `backend/`.

---

## 🎯 Co się zmieni?

### Przed:
```
spotify_guessser/
├── src/
│   ├── components/
│   ├── lib/
│   │   ├── auth/
│   │   ├── server/
│   │   └── ...
│   └── ...
├── package.json (wszystko razem)
```

### Po:
```
spotify_guessser/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── server/
│   │   ├── database/
│   │   └── ...
│   └── package.json
├── package.json (workspace root)
└── README.md
```

---

## 🚀 Automatic Migration (Recommended)

### Option 1: Użyj skryptu reorganize.sh

```bash
# Nadaj uprawnienia do wykonania
chmod +x reorganize.sh

# Uruchom reorganizację
./reorganize.sh
```

### Option 2: Manual Migration (krok po kroku)

Jeśli wolisz kontrolować każdy krok:

#### 1️⃣ Backup projektu
```bash
# Stwórz backup na wszelki wypadek
cp -r ../spotify_guessser ../spotify_guessser-backup
```

#### 2️⃣ Przenieś pliki Frontend

```bash
# Komponenty React
mv src/components frontend/src/
mv src/assets frontend/src/
mv src/contexts frontend/src/
mv src/types frontend/src/

# Główne pliki aplikacji
mv src/App.tsx frontend/src/
mv src/App.css frontend/src/
mv src/main.tsx frontend/src/
mv src/index.css frontend/src/
mv src/vite-env.d.ts frontend/src/

# Public files
cp -r public/* frontend/public/
cp -r app frontend/

# Config files
cp index.html frontend/
cp tailwind.config.js frontend/
cp postcss.config.js frontend/
cp components.json frontend/
cp tsconfig.json frontend/
cp tsconfig.app.json frontend/
cp eslint.config.js frontend/
```

#### 3️⃣ Przenieś pliki Backend

```bash
# Serwery i logika
mv src/lib/auth backend/src/
mv src/lib/server backend/src/
mv src/lib/database backend/src/
mv src/lib/routers backend/src/
mv src/lib/config backend/src/
mv src/scripts backend/src/

# SSL certificates (dla development)
cp private.key backend/
cp certificate.crt backend/

# Config files
cp tsconfig.node.json backend/
```

#### 4️⃣ Konfiguracja Root Workspace

```bash
# Backup starego package.json
mv package.json package.json.old

# Użyj nowego package.json dla workspace
mv package-root.json package.json
```

#### 5️⃣ Zainstaluj zależności

```bash
# Root workspace
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Wróć do root
cd ..
```

#### 6️⃣ Aktualizuj .env (jeśli potrzeba)

Plik `.env` pozostaje w głównym katalogu i jest współdzielony przez frontend i backend.

Jeśli chcesz osobne pliki:
```bash
# Stwórz osobne .env dla frontendu
cp .env frontend/.env

# Stwórz osobne .env dla backendu
cp .env backend/.env
```

---

## ✅ Weryfikacja

Po migracji sprawdź czy wszystko działa:

```bash
# Z głównego katalogu - uruchom wszystko
npm run dev

# Lub osobno:
npm run dev:frontend
npm run dev:backend
```

Powinieneś zobaczyć:
- ✅ Frontend na `https://192.168.0.93:5173`
- ✅ Backend Auth na `https://192.168.0.93:8888`
- ✅ Socket Server na `https://192.168.0.93:3001`

---

## 🔄 Aktualizacja Importów

Jeśli masz problemy z importami, sprawdź:

### Frontend (`frontend/src/`)
Importy powinny działać tak samo:
```typescript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
```

### Backend (`backend/src/`)
Importy mogą wymagać aktualizacji ścieżek:

**Przed:**
```typescript
import { environment } from '@/lib/config/environment'
```

**Po:**
```typescript
import { environment } from '@/config/environment'
```

---

## 🎯 Nowe Komendy NPM

### Z root directory:

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchom frontend + backend razem |
| `npm run dev:frontend` | Tylko frontend |
| `npm run dev:backend` | Tylko backend |
| `npm run build` | Build frontend + backend |
| `npm run build:frontend` | Build tylko frontend (production) |
| `npm run build:backend` | Build tylko backend |

### Z frontend/:

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchom Vite dev server |
| `npm run build` | Build dla produkcji |
| `npm run build:prod` | Build z production config |
| `npm run preview` | Preview production build |

### Z backend/:

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchom oba serwery (auth + socket) + db check |
| `npm run dev:auth` | Tylko auth server |
| `npm run dev:socket` | Tylko socket server |
| `npm run db:check` | Sprawdź połączenie z DB |
| `npm run build` | Kompiluj TypeScript |

---

## 🐛 Troubleshooting

### Problem: "Cannot find module '@/...'"

**Rozwiązanie:**
Sprawdź czy `tsconfig.json` ma prawidłowe ścieżki:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Problem: "private.key not found"

**Rozwiązanie:**
Upewnij się że certyfikaty SSL są dostępne:
- Frontend szuka w `../private.key` (jeden poziom wyżej)
- Backend szuka w `./private.key` (w katalogu backend/)

```bash
# Skopiuj do backendu
cp private.key backend/
cp certificate.crt backend/
```

### Problem: "npm workspace not found"

**Rozwiązanie:**
Upewnij się że `package.json` w root ma:
```json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

---

## 📦 Deployment po reorganizacji

### Frontend (Static Hosting / FTP)
```bash
cd frontend
npm run build:prod

# Upload zawartość folderu dist/ na serwer
```

### Backend (Node.js Hosting)
```bash
cd backend
npm run build

# Deploy cały folder backend/ na serwer Node.js
```

### Full Stack (VPS)
```bash
# Build wszystko
npm run build

# Upload całego projektu na VPS
# Uruchom:
cd backend
npm run start:auth &
npm run start:socket &
```

---

## 🎉 Gotowe!

Twój projekt jest teraz zorganizowany jako monorepo z czystym podziałem na frontend i backend!

**Zalety:**
- ✅ Czystsza struktura
- ✅ Łatwiejszy deployment (osobno frontend/backend)
- ✅ Niezależne wersjonowanie
- ✅ Lepsze zarządzanie zależnościami
- ✅ Możliwość współdzielenia kodu przez shared package

---

**Miłej zabawy z nową strukturą! 🚀**


