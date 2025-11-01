#!/usr/bin/env bash
set -euo pipefail

# =====================================
# Ligação Replit → GitHub (Laravel + Vite)
# Autor: Ricardo Ferreira (Bzuzinho)
# Repo: Bscn_Fulstack
# =====================================

GITHUB_USER="Bzuzinho"
GITHUB_REPO="Bscn_Fulstack"
GIT_NAME="Ricardo Ferreira"
GIT_EMAIL="ricardo@example.com"

echo "=== Ligação GitHub: $GITHUB_USER/$GITHUB_REPO ==="

# 1️⃣ Configurar identidade e guardar credenciais
git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"
git config --global credential.helper store

# 2️⃣ Criar .gitignore (Laravel + Vite + Replit)
cat > .gitignore <<'EOF'
# --- Laravel ---
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

# --- React/Vite ---
/client/node_modules/
/client/dist/
/client/.vite/
/client/.cache

# --- Replit / SO ---
.replit
.nix
.env
.DS_Store
*.log
*.sqlite
*.sqlite-journal
EOF

# 3️⃣ Criar .gitattributes (EOL + diffs úteis)
cat > .gitattributes <<'EOF'
* text=auto eol=lf
*.php diff=php
*.ts diff=ts
*.tsx diff=ts
*.js diff=js
*.css diff=css
*.md diff=markdown
EOF

# 4️⃣ Garantir .env.example
if [[ -f backend/.env && ! -f backend/.env.example ]]; then
  cp backend/.env backend/.env.example
  echo "[INFO] Criado backend/.env.example a partir de backend/.env"
fi

# 5️⃣ Inicializar repositório e commit
git init >/dev/null 2>&1 || true
git add -A
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git commit -m "chore: primeiro commit (Laravel+Vite stack Replit)"
else
  if ! git diff --cached --quiet; then
    git commit -m "chore: sync atualização inicial"
  else
    echo "[INFO] Nenhuma alteração para commitar."
  fi
fi

git branch -M main

# 6️⃣ Definir remote
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/$GITHUB_USER/$GITHUB_REPO.git

# 7️⃣ Push inicial
echo
echo "👉 Quando for pedido 'Username', escreve: $GITHUB_USER"
echo "👉 Quando for pedido 'Password', cola o teu token GitHub (PAT) e pressiona ENTER"
echo
git push -u origin main || {
  echo "⚠️ Push falhou. Se o repositório no GitHub já tiver README/licença, executa manualmente:"
  echo "   git pull origin main --allow-unrelated-histories"
  echo "   git push"
  exit 1
}

echo
echo "✅ Concluído! O projeto está sincronizado com https://github.com/$GITHUB_USER/$GITHUB_REPO"
echo "   Próximos commits:"
echo "     git add ."
echo "     git commit -m 'mensagem'"
echo "     git push"