#!/bin/bash

# 🎯 Skrypt do reorganizacji projektu na frontend/backend
# Nie zmienia treści plików, tylko przenosi je do odpowiednich katalogów

echo "🚀 Starting project reorganization..."

# ============================================
# 📂 FRONTEND FILES
# ============================================
echo "📦 Moving frontend files..."

# Przeniesienie głównych katalogów frontendu
mv src/components frontend/src/ 2>/dev/null
mv src/assets frontend/src/ 2>/dev/null
mv src/contexts frontend/src/ 2>/dev/null
mv src/types frontend/src/ 2>/dev/null

# Główne pliki frontend
mv src/App.tsx frontend/src/ 2>/dev/null
mv src/App.css frontend/src/ 2>/dev/null
mv src/main.tsx frontend/src/ 2>/dev/null
mv src/index.css frontend/src/ 2>/dev/null
mv src/vite-env.d.ts frontend/src/ 2>/dev/null

# Public i inne pliki
cp -r public/* frontend/public/ 2>/dev/null
cp -r app frontend/ 2>/dev/null

# Config files dla frontend
cp index.html frontend/ 2>/dev/null
cp vite.config.ts frontend/ 2>/dev/null
cp vite.config.prod.ts frontend/ 2>/dev/null
cp tailwind.config.js frontend/ 2>/dev/null
cp postcss.config.js frontend/ 2>/dev/null
cp components.json frontend/ 2>/dev/null
cp tsconfig.json frontend/ 2>/dev/null
cp tsconfig.app.json frontend/ 2>/dev/null
cp eslint.config.js frontend/ 2>/dev/null

# ============================================
# 🔧 BACKEND FILES
# ============================================
echo "🔧 Moving backend files..."

# Przeniesienie serwerów
mv src/lib/auth backend/src/ 2>/dev/null
mv src/lib/server backend/src/ 2>/dev/null
mv src/lib/database backend/src/ 2>/dev/null
mv src/lib/routers backend/src/ 2>/dev/null
mv src/lib/config backend/src/ 2>/dev/null
mv src/scripts backend/src/ 2>/dev/null

# SSL certyfikaty (dla development)
cp private.key backend/ 2>/dev/null
cp certificate.crt backend/ 2>/dev/null

# Config files dla backend
cp tsconfig.json backend/ 2>/dev/null
cp tsconfig.node.json backend/ 2>/dev/null

# ============================================
# 📋 ROOT FILES (pozostają w głównym katalogu)
# ============================================
echo "📋 Configuring root workspace..."

# Backup starego package.json
mv package.json package.json.old 2>/dev/null

# Użyj nowego package.json dla workspace
mv package-root.json package.json 2>/dev/null

# .env pozostaje w rocie ale może być współdzielony
# README.md pozostaje w rocie
# .gitignore pozostaje w rocie

# ============================================
# 🧹 CLEANUP (opcjonalne)
# ============================================
echo "🧹 Cleaning up..."

# Usuń puste katalogi
rmdir src/lib 2>/dev/null
rmdir src 2>/dev/null

echo "✅ Reorganization complete!"
echo ""
echo "📁 New structure:"
echo "   ├── frontend/    (React app)"
echo "   ├── backend/     (Node.js servers)"
echo "   └── package.json (workspace root)"
echo ""
echo "🎯 Next steps:"
echo "   1. cd frontend && npm install"
echo "   2. cd backend && npm install"
echo "   3. npm run dev (from root)"


