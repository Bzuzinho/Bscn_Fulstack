#!/usr/bin/env bash
set -e

# ---- ARRANQUE BACKEND (Laravel) ----
echo "🚀 A iniciar Laravel (porta 3000)..."
cd backend

# Exportar variáveis de ambiente para PostgreSQL
export DB_CONNECTION=pgsql
export DB_HOST=helium
export DB_PORT=5432
export DB_DATABASE=heliumdb
export DB_USERNAME=postgres
export DB_PASSWORD=password

# Limpar cache de configuração
php artisan config:clear > /dev/null 2>&1 || true
php artisan cache:clear > /dev/null 2>&1 || true

php artisan serve --host 0.0.0.0 --port 3000 &
BACK_PID=$!

# ---- ARRANQUE FRONTEND (Vite) ----
echo "🌐 A iniciar Vite (porta 5000)..."
cd ../client
npm run dev

# ---- LIMPEZA ----
kill $BACK_PID 2>/dev/null || true
bash scripts/docs_watch.sh &   # <— arranca o watcher em background
# arranca Laravel e Vite como já fazes