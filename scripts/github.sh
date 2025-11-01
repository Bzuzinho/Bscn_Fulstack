#!/usr/bin/env bash
set -euo pipefail

# Ligação Replit → GitHub (Laravel + Vite)
GITHUB_USER="Bzuzinho"
GITHUB_REPO="Bscn_Fulstack"
GIT_NAME="Ricardo Ferreira"
GIT_EMAIL="ricardo@example.com"

echo "=== Ligação GitHub: $GITHUB_USER/$GITHUB_REPO ==="

cat > .gitignore <<'EOF'
/backend/vendor/
/backend/node_modules/
/backend/storage/*.key
/backend/storage/app/*
!/backend/storage/app/.gitignore
/backend/storage/framework/*
!/backend/storage/framework/.gitignore
/backend/storage/logs/*
!/backend/storage/logs/.gitignore
/backend/.env
/client/node_modules/
/client/dist/
/client/.vite/
/client/.cache
.replit
.nix
.env
.DS_Store
*.log
*.sqlite
*.sqlite-journal
EOF

cat > .gitattributes <<'EOF'
* text=auto eol=lf
*.php diff=php
*.ts diff=ts
*.tsx diff=ts
*.js diff=js
*.css diff=css
*.md diff=markdown
EOF

if [[ -f backend/.env && ! -f backend/.env.example ]]; then
  cp backend/.env backend/.env.example
  echo "[INFO] backend/.env.example criado."
fi

git init >/dev/null 2>&1 || true
git config user.name  "$GIT_NAME"
git config user.email "$GIT_EMAIL"

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git add -A
  git commit -m "chore: primeiro commit (Laravel+Vite stack Replit)"
else
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "chore: sync inicial"
  fi
fi

git branch -M main
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/$GITHUB_USER/$GITHUB_REPO.git
else
  git remote set-url origin https://github.com/$GITHUB_USER/$GITHUB_REPO.git
fi

git push -u origin main || {
  echo "⚠️  Push falhou. Repo remoto pode não estar vazio."
  echo "   Se tiver README, usa:"
  echo "   git pull origin main --allow-unrelated-histories"
  echo "   git push"
}