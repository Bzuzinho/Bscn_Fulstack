#!/usr/bin/env bash
set -euo pipefail

# Composer pode já vir instalado com a feature PHP, mas garantimos:
if ! command -v composer >/dev/null 2>&1; then
  EXPECTED_CHECKSUM="$(curl -s https://composer.github.io/installer.sig)"
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php -r "if (hash_file('sha384', 'composer-setup.php') !== '$EXPECTED_CHECKSUM') { echo 'Integrity check failed'; unlink('composer-setup.php'); exit(1); }"
  php composer-setup.php --install-dir=/usr/local/bin --filename=composer
  php -r "unlink('composer-setup.php');"
fi

# Depêndencias do projeto
if [ -f composer.json ]; then composer install --no-interaction --prefer-dist; fi
if [ -f package.json ]; then npm ci || npm i; fi

# Laravel .env e chave
[ -f .env ] || cp .env.example .env || true
php artisan key:generate || true

# MySQL local (da feature) — cria DB e aponta o .env
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS appdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php -r '
$env = file_get_contents(".env");
$env = preg_replace("/^DB_CONNECTION=.*/m", "DB_CONNECTION=mysql", $env);
$env = preg_replace("/^DB_HOST=.*/m", "DB_HOST=127.0.0.1", $env);
$env = preg_replace("/^DB_PORT=.*/m", "DB_PORT=3306", $env);
$env = preg_replace("/^DB_DATABASE=.*/m", "DB_DATABASE=appdb", $env);
$env = preg_replace("/^DB_USERNAME=.*/m", "DB_USERNAME=root", $env);
$env = preg_replace("/^DB_PASSWORD=.*/m", "DB_PASSWORD=root", $env);
file_put_contents(".env",$env);
';

# Migrar (best-effort)
php artisan migrate --force || true
