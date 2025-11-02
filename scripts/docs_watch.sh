#!/usr/bin/env bash
set -e

echo "[watch] A atualizar /docs sempre que houver alterações…"

# Se tiver 'entr' instalado (mais leve), usa-o; caso contrário, usa npx chokidar-cli.
if command -v entr >/dev/null 2>&1; then
  # Watch com 'entr' (ignora vendor/ node_modules)
  while true; do
    find backend client -type f \
      \( -name "*.php" -o -name "*.blade.php" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.scss" \) \
      -not -path "*/vendor/*" -not -path "*/node_modules/*" \
    | entr -c bash scripts/docs.sh
  done
else
  # Fallback com npx (primeira vez faz download do pacote)
  npx -y chokidar-cli@3 \
    "backend/**/*.php" "backend/**/*.blade.php" \
    "client/src/**/*.{ts,tsx,js,jsx,css,scss}" \
    -i "backend/vendor/**" -i "client/node_modules/**" \
    -c "bash scripts/docs.sh"
fi