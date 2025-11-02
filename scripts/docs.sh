#!/usr/bin/env bash
set -e

# ============================================
# Atualizador de Documentação Viva (BSCN)
# Compatível com Replit (sem jq)
# ============================================

DOCS_DIR="docs"
BACKEND_DIR="backend"
CLIENT_DIR="client"

mkdir -p "$DOCS_DIR"

# 1️⃣ Estrutura geral
echo "# Estrutura Geral do Projeto" > "$DOCS_DIR/estrutura_geral.md"
echo '```' >> "$DOCS_DIR/estrutura_geral.md"
if command -v tree >/dev/null 2>&1; then
  tree -L 3 -I "node_modules|vendor|storage|dist|.git|.replit|*.sqlite" >> "$DOCS_DIR/estrutura_geral.md"
else
  echo "[INFO] 'tree' não disponível, a usar listagem simples." >> "$DOCS_DIR/estrutura_geral.md"
  ls -R "$BACKEND_DIR" "$CLIENT_DIR" >> "$DOCS_DIR/estrutura_geral.md"
fi
echo '```' >> "$DOCS_DIR/estrutura_geral.md"

# 2️⃣ Rotas backend
echo "# Rotas Backend (Laravel)" > "$DOCS_DIR/rotas_backend.md"
if [ -d "$BACKEND_DIR" ]; then
  cd "$BACKEND_DIR"
  php artisan route:list >> "../$DOCS_DIR/rotas_backend.md" || echo "[WARN] Falha ao listar rotas." >> "../$DOCS_DIR/rotas_backend.md"
  cd ..
else
  echo "[WARN] Diretório backend não encontrado." >> "$DOCS_DIR/rotas_backend.md"
fi

# 3️⃣ Modelos e tabelas
echo "# Modelos e Tabelas (Laravel Models)" > "$DOCS_DIR/tabelas.md"
if [ -d "$BACKEND_DIR/app/Models" ]; then
  for model in "$BACKEND_DIR"/app/Models/*.php; do
    nome=$(basename "$model" .php)
    echo -e "\n## $nome" >> "$DOCS_DIR/tabelas.md"
    (cd "$BACKEND_DIR" && php artisan model:show "$nome") >> "$DOCS_DIR/tabelas.md" 2>/dev/null || \
      echo "[INFO] Não foi possível gerar detalhes de $nome" >> "$DOCS_DIR/tabelas.md"
  done
else
  echo "[WARN] Pasta de Models não encontrada." >> "$DOCS_DIR/tabelas.md"
fi

echo
echo "✅ Documentação atualizada em /docs/"
ls -1 "$DOCS_DIR"