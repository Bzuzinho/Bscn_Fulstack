#!/usr/bin/env bash
set -euo pipefail
# load env from .env (ignoring comments)
if [ ! -f .env ]; then
  echo ".env file not found"
  exit 1
fi

# always load env from .env and overwrite existing values so .env is always applied
while IFS= read -r line; do
  # skip comments and blank lines
  [[ "$line" =~ ^\s*# ]] && continue
  [[ -z "$line" ]] && continue
  # export the literal line (KEY=VALUE)
  export "$line"
done < .env

echo "Starting server using tsx with PORT=${PORT:-5000}..."
npx tsx server/index.ts
