# Laravel + Vite Full-Stack Application

Ambiente full-stack funcional com Laravel (backend) e Vite/React (frontend) configurado para desenvolvimento no Replit.

## Estrutura do Projeto

```
.
├── backend/          # Laravel PHP 8.3 (porta 3000)
├── client/           # Vite + React + TypeScript (porta 5000)
└── run.sh           # Script de arranque automático
```

## Tecnologias

### Backend (Laravel)
- PHP 8.3
- Laravel Framework
- SQLite
- Composer

### Frontend (Vite/React)
- Node.js 20
- Vite
- React 18
- TypeScript
- Proxy configurado: `/api` → `http://127.0.0.1:3000`

## Como Usar

### Arranque Automático

Basta clicar em **Run** no Replit. O script `run.sh` irá:
1. Arrancar o Laravel na porta 3000 (background)
2. Arrancar o Vite na porta 5000 (foreground)
3. Ao parar, mata automaticamente o processo do Laravel

### Desenvolvimento Manual

```bash
# Backend (Laravel)
cd backend
php artisan serve --host 0.0.0.0 --port 3000

# Frontend (Vite) - noutro terminal
cd client
npm run dev
```

## Endpoints da API

### Teste de Conexão
```bash
GET /api/ping
```

**Resposta:**
```json
{
  "status": "ok",
  "time": "2025-10-31T19:55:09.549811Z"
}
```

**Teste via frontend:**
```bash
curl http://127.0.0.1:5000/api/ping
```

**Teste via backend direto:**
```bash
curl http://127.0.0.1:3000/api/ping
```

## Configuração

### Proxy do Vite

O ficheiro `client/vite.config.ts` está configurado para encaminhar todas as chamadas `/api` para o Laravel:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Variáveis de Ambiente

O Laravel usa `.env` (criado automaticamente a partir de `.env.example`).

## Portas

- **Frontend (Vite):** 5000 (exposta pelo Replit)
- **Backend (Laravel):** 3000 (interna)

> **Nota:** O Replit requer que aplicações web usem a porta 5000 para exposição pública.

## Comandos Úteis

### Laravel
```bash
cd backend
php artisan route:list    # Listar rotas
php artisan migrate       # Executar migrations
php artisan tinker        # Console interativa
```

### Frontend
```bash
cd client
npm run build            # Build para produção
npm run preview          # Preview do build
```

## Desenvolvimento

Ambos os servidores suportam **hot reload**:
- Alterações no código Laravel são refletidas imediatamente
- Alterações no código React/Vite atualizam automaticamente o browser

## Troubleshooting

### Laravel não arranca
```bash
cd backend
composer install
php artisan key:generate
```

### Frontend não arranca
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Proxy não funciona
Verifique que o Laravel está a correr na porta 3000:
```bash
curl http://127.0.0.1:3000/api/ping
```

## Licença

MIT
