# 📝 Zmiany w Strukturze Projektu

## ✅ Co zostało zrobione

### 1. Reorganizacja na Monorepo
Projekt został podzielony na dwa niezależne moduły:
- **frontend/** - Aplikacja React (Vite)
- **backend/** - Serwery Node.js (Express + Socket.IO)

### 2. Przeniesione Pliki

#### Frontend (`frontend/`)
```
✅ src/components/ → frontend/src/components/
✅ src/assets/ → frontend/src/assets/
✅ src/contexts/ → frontend/src/contexts/
✅ src/types/ → frontend/src/types/
✅ src/App.tsx → frontend/src/App.tsx
✅ src/main.tsx → frontend/src/main.tsx
✅ public/ → frontend/public/
✅ vite.config.ts → frontend/vite.config.ts
✅ tailwind.config.js → frontend/tailwind.config.js
✅ index.html → frontend/index.html
```

#### Backend (`backend/`)
```
✅ src/lib/auth/ → backend/src/auth/
✅ src/lib/server/ → backend/src/server/
✅ src/lib/database/ → backend/src/database/
✅ src/lib/routers/ → backend/src/routers/
✅ src/lib/config/ → backend/src/config/
✅ src/scripts/ → backend/src/scripts/
✅ private.key → backend/private.key
✅ certificate.crt → backend/certificate.crt
```

### 3. Zaktualizowane Pliki

#### Root
- ✅ `package.json` - Zmieniony na workspace root
- ✅ `README.md` - Zaktualizowana dokumentacja
- ✅ Dodany `MIGRATION_GUIDE.md`
- ✅ Dodany `CHANGES.md` (ten plik)

#### Frontend
- ✅ Nowy `frontend/package.json`
- ✅ Nowy `frontend/vite.config.ts` (zaktualizowane ścieżki SSL)
- ✅ Nowy `frontend/vite.config.prod.ts`
- ✅ Nowy `frontend/README.md`
- ✅ Nowy `frontend/.gitignore`

#### Backend
- ✅ Nowy `backend/package.json`
- ✅ Nowy `backend/tsconfig.json`
- ✅ Nowy `backend/README.md`
- ✅ Nowy `backend/.gitignore`
- ✅ `backend/src/auth/authorize.ts` - Zaktualizowane importy (@/lib/ → @/)

### 4. Nowe Skrypty NPM

#### Z Root Directory
```json
{
  "dev": "Frontend + Backend razem",
  "dev:frontend": "Tylko frontend",
  "dev:backend": "Tylko backend",
  "build": "Build wszystko",
  "build:frontend": "Build frontend",
  "build:backend": "Build backend"
}
```

---

## 🔧 Co się Zmieniło?

### Importy w Backend
**Przed:**
```typescript
import userRoute from "@/lib/routers/userRoute.ts";
```

**Po:**
```typescript
import userRoute from "@/routers/userRoute.ts";
```

### SSL Certyfikaty
**Przed:**
- Certyfikaty w głównym katalogu
- Bezpośrednie czytanie

**Po:**
- Certyfikaty w głównym katalogu (współdzielone)
- Frontend: `../private.key` (względna ścieżka)
- Backend: kopiowane do `backend/`

### Uruchamianie

**Przed:**
```bash
npm run dev
```

**Po (z root):**
```bash
npm run dev                # Wszystko razem
npm run dev:frontend       # Tylko frontend
npm run dev:backend        # Tylko backend
```

**Po (z folderu):**
```bash
cd frontend && npm run dev
cd backend && npm run dev
```

---

## 🎯 Następne Kroki

### Teraz możesz:

1. **Zainstalować zależności:**
```bash
# Z root
npm install

# Lub osobno
cd frontend && npm install
cd ../backend && npm install
```

2. **Uruchomić projekt:**
```bash
# Z root
npm run dev

# Zobaczysz:
# - Frontend na https://192.168.0.93:5173
# - Auth Server na https://192.168.0.93:8888
# - Socket Server na https://192.168.0.93:3001
```

3. **Build dla produkcji:**
```bash
npm run build

# Lub osobno:
npm run build:frontend  # -> frontend/dist/
npm run build:backend   # -> backend/dist/
```

---

## 📊 Statystyki

- **Plików przeniesionych:** ~100+
- **Katalogów utworzonych:** 6 (frontend/, backend/, + podfoldery)
- **Nowych plików config:** 8
- **Zaktualizowanych importów:** 9

---

## ✨ Korzyści Nowej Struktury

1. ✅ **Czystsza organizacja** - Frontend i backend jasno oddzielone
2. ✅ **Łatwiejszy deployment** - Deploy frontend i backend niezależnie
3. ✅ **Lepsze zarządzanie zależnościami** - Każdy moduł ma swoje dependencies
4. ✅ **Scalability** - Łatwo dodać więcej modułów (np. mobile app, admin panel)
5. ✅ **Team collaboration** - Zespoły mogą pracować niezależnie nad frontend/backend
6. ✅ **Selektywne buildy** - Build tylko to co potrzebujesz

---

## 🐛 Znane Problemy i Rozwiązania

### Problem: Module not found '@/...'
**Rozwiązanie:** Sprawdź `tsconfig.json` - paths powinny wskazywać na `./src/*`

### Problem: SSL certificate errors
**Rozwiązanie:** 
- Frontend: Certyfikat w `../private.key`
- Backend: Skopiuj certyfikat do `backend/`

### Problem: npm workspace errors
**Rozwiązanie:** Upewnij się że root `package.json` ma:
```json
{
  "workspaces": ["frontend", "backend"]
}
```

---

## 📚 Dokumentacja

- **Root README** - Ogólny przegląd projektu
- **Frontend README** - Dokumentacja React app
- **Backend README** - Dokumentacja Node.js servers
- **MIGRATION_GUIDE** - Szczegółowe instrukcje migracji

---

**Reorganizacja zakończona! 🎉**

Data: 17 października 2025
Wersja: 0.2.0 (Monorepo)


