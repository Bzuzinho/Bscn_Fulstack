#!/usr/bin/env bash
set -e

# ---- ARRANQUE BACKEND (Laravel) ----
echo "🚀 A iniciar Laravel (porta 3000)..."
cd backend
php artisan serve --host 0.0.0.0 --port 3000 &
BACK_PID=$!

# ---- ARRANQUE FRONTEND (Vite) ----
echo "🌐 A iniciar Vite (porta 5000)..."
cd ../client
npm run dev

# ---- LIMPEZA ----
kill $BACK_PID 2>/dev/null || true
