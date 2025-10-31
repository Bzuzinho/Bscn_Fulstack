# Ambiente Full-Stack Laravel + Vite

## Visão Geral
Projeto full-stack com backend Laravel (PHP 8.3) e frontend Vite/React (Node 20) configurado para desenvolvimento automático no Replit. Criado e configurado em 31 de Outubro de 2025.

## Estrutura do Projeto

### Backend
- **Diretório:** `backend/`
- **Framework:** Laravel (PHP 8.3)
- **Porta:** 3000 (interna)
- **Base de Dados:** SQLite
- **Gestor de Pacotes:** Composer

### Frontend
- **Diretório:** `client/`
- **Framework:** Vite + React 18 + TypeScript
- **Porta:** 5000 (exposta ao público)
- **Gestor de Pacotes:** npm (Node 20)
- **Proxy:** `/api` → `http://127.0.0.1:3000`

### Scripts
- **run.sh:** Arranca Laravel (porta 3000) em background e Vite (porta 5000) em foreground

## Alterações Recentes

### 2025-10-31: Configuração Full-Stack
- Instalado PHP 8.3 e Node.js 20
- Instalado Composer, SQLite, Git, unzip
- Configurado Vite com proxy para Laravel
- Criado endpoint `/api/ping` que retorna `{"status": "ok"}`
- Configurado workflow automático com `bash ./run.sh`
- Ajustada porta do Vite para 5000 (requisito do Replit para webview)
- Corrigidos erros de sintaxe JSON em package.json e tsconfig.json
- Removidos scripts Bash antigos (main.sh, example.sh, utils.sh)
- Testado e validado comunicação frontend ↔ backend

## Arquitetura

### Fluxo de Comunicação
```
Browser → Replit (porta 5000) → Vite Dev Server → Proxy /api → Laravel (porta 3000)
```

### Arranque Automático
1. Laravel arranca na porta 3000 em background
2. Vite arranca na porta 5000 em foreground (exposto ao público)
3. Ao parar o workflow, o Laravel é automaticamente terminado

### Configuração de Proxy
O Vite está configurado para encaminhar todas as requisições `/api/*` para `http://127.0.0.1:3000`, permitindo comunicação transparente com o backend.

## Dependências do Sistema

- **Node.js:** 20
- **PHP:** 8.3
- **Composer:** (via php83Packages.composer)
- **SQLite:** Incluído
- **Git:** Incluído
- **Unzip:** Incluído

## Preferências do Utilizador

- Comunicação em Português
- Ambiente Laravel + Vite full-stack
- Arranque automático ao clicar em "Run"
- Frontend na porta 5000, backend na porta 3000

## Endpoints da API

### GET /api/ping
Endpoint de teste que retorna:
```json
{
  "status": "ok",
  "time": "2025-10-31T19:55:09.549811Z"
}
```

**Testado com sucesso via:**
- Direto: `http://127.0.0.1:3000/api/ping` ✅
- Proxy: `http://127.0.0.1:5000/api/ping` ✅

## Notas Técnicas

### Porta 5000
O Replit requer que aplicações web com `output_type: webview` usem a porta 5000. Por isso, o Vite foi configurado para essa porta em vez da padrão (5173).

### Hot Reload
Ambos os ambientes suportam hot reload:
- Laravel: Reflete alterações ao recarregar a página
- Vite: Hot Module Replacement (HMR) automático

## Estado Atual

✅ PHP 8.3 instalado e funcional
✅ Node.js 20 instalado e funcional  
✅ Laravel a correr na porta 3000
✅ Vite a correr na porta 5000
✅ Proxy /api funcional
✅ Endpoint /api/ping testado e validado
✅ Workflow configurado e a funcionar
✅ Comunicação frontend ↔ backend confirmada
