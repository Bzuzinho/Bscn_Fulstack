#!/usr/bin/env bash
set -euo pipefail

# Detectar Laravel
LARAVEL_ROOT="$(dirname "$(fd -a artisan . 2>/dev/null | head -n1)")"
if [ -z "${LARAVEL_ROOT:-}" ] || [ ! -f "$LARAVEL_ROOT/artisan" ]; then
  echo "❌ postStart: artisan não encontrado."
  exit 0
fi

pushd "$LARAVEL_ROOT" >/dev/null
[ -f .env ] || cp .env.example .env || true
php artisan key:generate || true
mkdir -p database && touch database/database.sqlite || true
php artisan migrate --force || true
popd >/dev/null

# PHP
nohup php -S 0.0.0.0:${PORT:-3000} -t "$LARAVEL_ROOT/public" >/tmp/php-server.log 2>&1 &

# Vite (raiz ou client/)
VITE_ROOT=""
if [ -f vite.config.ts ] || [ -f vite.config.js ]; then VITE_ROOT="."; fi
if [ -z "$VITE_ROOT" ] && [ -d client ] && { [ -f client/vite.config.ts ] || [ -f client/vite.config.js ]; }; then
  VITE_ROOT="client"
fi
if [ -n "$VITE_ROOT" ]; then
  pushd "$VITE_ROOT" >/dev/null
  [ -f package.json ] && (npm ci || npm i)
  nohup npx vite --host ${VITE_HOST:-0.0.0.0} --port ${VITE_PORT:-5173} >/tmp/vite.log 2>&1 &
  popd >/dev/null
fi

# Watcher
if [ -f scripts/docs_watch.sh ]; then
  git config user.name  "${GIT_AUTHOR_NAME:-Codespaces Auto Doc}"
  git config user.email "${GIT_AUTHOR_EMAIL:-codespaces-auto-doc@users.noreply.github.com}"
  nohup bash scripts/docs_watch.sh >/tmp/docs_watch.log 2>&1 &
fi

echo "✅ postStart concluído."
