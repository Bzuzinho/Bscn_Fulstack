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

## Problemas Resolvidos

### Erro "Blocked request. This host is not allowed"
**Solução aplicada:** Adicionado `allowedHosts: true` no `client/vite.config.ts` na seção `server`. Isso é **obrigatório** para o Vite funcionar no ambiente Replit, pois permite que o servidor aceite pedidos do domínio dinâmico do Replit.

### Erro "DashboardModal is not found"
**Solução aplicada:** 
1. Instalados pacotes Uppy: `@uppy/core`, `@uppy/react`, `@uppy/dashboard`, `@uppy/aws-s3`
2. Corrigido import de `import { DashboardModal } from "@uppy/react"` para `import DashboardModal from "@uppy/react/dashboard-modal"`
3. CSS do Uppy carregado via CDN no `index.html`

## Dependências Instaladas

### Frontend (366 pacotes)
- React 18.3 + React DOM
- Wouter (routing)
- TanStack Query (data fetching)
- Radix UI (todos os componentes: accordion, dialog, dropdown, etc)
- Tailwind CSS 3 + Tailwind Merge + Tailwind Animate
- Lucide React (ícones)
- React Hook Form + Zod (formulários e validação)
- Framer Motion (animações)
- Next Themes (tema escuro/claro)
- Date-fns, Recharts, Embla Carousel, e muito mais

### Backend
- Laravel 11
- PHP 8.3
- SQLite

## Armazenamento de Imagens

Este sistema armazena imagens de perfil **diretamente na base de dados** (como base64), eliminando a necessidade de configurar buckets S3/GCS externos e problemas de CORS.

**📖 Como Funciona**: [docs/DATABASE_IMAGE_STORAGE.md](docs/DATABASE_IMAGE_STORAGE.md) - Guia completo sobre upload e armazenamento de imagens

### Características
- ✅ Upload direto para base de dados (sem S3/GCS)
- ✅ Sem configuração de CORS necessária
- ✅ Suporta imagens (PNG, JPG, GIF, WebP) e documentos (PDF, Word, Excel)
- ✅ Limite de 5MB por ficheiro
- ✅ Conversão automática para base64
- ✅ Validação de permissões server-side

### Referência Histórica
Documentação sobre CORS para storage externo (caso necessário no futuro):
- [docs/S3_CORS_SETUP.md](docs/S3_CORS_SETUP.md) - Configuração de CORS para S3/GCS
- [docs/QUICK_FIX_CORS.md](docs/QUICK_FIX_CORS.md) - Correção rápida de CORS

## Troubleshooting

### Página em Branco (Importante!)

Se vir uma página completamente em branco ao abrir a aplicação:

1. **Force um refresh completo** no navegador:
   - **Windows/Linux**: `Ctrl + Shift + R`
   - **Mac**: `Cmd + Shift + R`

2. **Limpe o cache do navegador**:
   - Abra as ferramentas de desenvolvedor (F12)
   - Clique com o botão direito no ícone de refresh
   - Selecione "Empty Cache and Hard Reload"

3. **Verifique os logs**:
   - Os logs no painel do Replit devem mostrar:
     ```
     VITE v5.4.21  ready in XXX ms
     ➜  Local:   http://localhost:5000/
     INFO  Server running on [http://0.0.0.0:3000]
     ```

4. **Teste a API diretamente**:
   - Aceda a `/api/ping` no navegador
   - Deve retornar: `{"status":"ok","time":"..."}`

**Nota:** O iframe do Replit pode fazer cache agressivo. Um hard refresh resolve o problema.

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
