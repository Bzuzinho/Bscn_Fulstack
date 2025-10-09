# Swimming Club Management System

## Overview

This is a comprehensive management system for swimming clubs, built with a modern full-stack architecture. The system manages athletes, activities (training, competitions, camps), financials, inventory, sponsorships, sales, marketing, and communications. It's designed for administrators, coaches, and members to efficiently handle all aspects of club operations with support for 80 athletes/year scalable to 240.

The application uses React with TypeScript for the frontend, Express.js for the backend, and PostgreSQL (via Neon) for data persistence. The UI is built with shadcn/ui components following Material Design 3 principles with club branding (navy blue #003366, yellow #FFD700), supporting both light and dark modes.

## Recent Changes (October 2025)

**Major Database Expansion - All Tables Created:**
- ✅ Expanded users table with ~30 fields (consolidated from pessoas)
- ✅ Implemented complete RBAC system (5 tables)
- ✅ Created RGPD compliance module (dados_configuracao)
- ✅ Expanded Escalões with historical tracking (user_escaloes)
- ✅ Added Sports & Health data (dados_desportivos, saude_atletas)
- ✅ Refined Treinos/Presenças with new structure (presencas_novo)
- ✅ Complete Events system (5 tables: eventos, eventos_tipos, convocatorias, evento_escalao, eventos_users)
- ✅ Complete Financial module (8 tables) with automatic invoicing and cost centers
- ✅ Sponsorships module (4 tables: patrocinadores, patrocinios, patrocinio_parcelas, patrocinio_metricas)
- ✅ Sales & Stock module (4 tables: produtos, movimentos_stock, vendas, venda_itens)
- ✅ Marketing/Communication module (4 tables: noticias, campanhas, campanha_logs, crm_interacoes)
- ✅ All foreign keys configured and schema synchronized
- ✅ TypeScript compilation validated

**Next Steps:**
- Data migration from legacy pessoas to expanded users table
- Implement automatic cost center distribution logic
- Implement automatic invoice generation system

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**State Management:**
- TanStack Query (React Query) for server state management and API caching
- React Hook Form with Zod for form validation and state
- React Context for theme management (light/dark mode)

**UI Component System:**
- shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design 3 principles with custom refinements
- HSL-based color system supporting dark mode
- Custom fonts: Inter (UI/body), JetBrains Mono (data/numbers)

**Design System:**
- Utility-focused with information-dense layouts
- Consistent component patterns across 7 main modules
- Role-based UX considerations
- Responsive design with mobile breakpoint at 768px

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system
- Session-based authentication using Replit Auth (OIDC)

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routing (e.g., `/api/pessoas`, `/api/atividades`)
- Authentication middleware protecting all routes
- JSON request/response format

**Authentication & Authorization:**
- Replit Auth (OpenID Connect) for user authentication
- Session management with connect-pg-simple (PostgreSQL session store)
- User information stored in database with OIDC claims
- Protected routes requiring authentication

**Data Access Layer:**
- Storage abstraction pattern (`storage.ts`) providing a clean interface
- CRUD operations for all entities (pessoas, escaloes, atividades, etc.)
- Centralized database access through storage methods

### Data Storage

**Database:**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database access
- WebSocket connection pooling for serverless environments

**Schema Design:**
- **Core Auth Tables:**
  - users: Expanded with ~30 fields (numeroSocio, NIF, contacts, address, personal info, relations)
  - sessions: PostgreSQL session store for Replit Auth
  
- **RBAC System (5 tables):**
  - roles, permissions
  - role_has_permissions, model_has_roles, model_has_permissions
  
- **RGPD & Compliance:**
  - dados_configuracao: Consent management, document storage
  
- **People & Relations:**
  - user_escaloes: Historical escalão assignments (N:N)
  - encarregado_user: Guardian relationships
  
- **Sports & Health:**
  - dados_desportivos: Height, weight, medical certificates, federation data
  - saude_atletas: Legacy health records
  
- **Training & Results:**
  - treinos: Training sessions
  - presencas_novo: New attendance structure (user-based)
  - resultados: Competition results
  
- **Events System (5 tables):**
  - eventos, eventos_tipos, convocatorias
  - evento_escalao (N:N), eventos_users (N:N with attendance)
  
- **Financial Module (8 tables):**
  - tipos_mensalidade, dados_financeiros
  - faturas (auto-generation support), fatura_itens, catalogo_fatura_itens
  - centros_custo (escalões, departments, generic)
  - lancamentos_financeiros, extratos_bancarios, mapa_conciliacao
  
- **Sponsorships (4 tables):**
  - patrocinadores, patrocinios, patrocinio_parcelas, patrocinio_metricas
  
- **Sales & Stock (4 tables):**
  - produtos, movimentos_stock, vendas, venda_itens
  
- **Marketing/Communication (4 tables):**
  - noticias, campanhas, campanha_logs, crm_interacoes
  
- **Legacy Tables (to be deprecated):**
  - pessoas, atividades, presencas, mensalidades, materiais, emprestimos, emails
  
- Zod schemas generated from Drizzle for runtime validation
- All foreign keys properly configured with cascade/set null policies

**Data Validation:**
- Drizzle Zod for schema-based validation
- Server-side validation before database operations
- Client-side form validation with React Hook Form + Zod

### Module Structure

**7 Main Application Modules:**

1. **Gestão de Pessoas (People Management):** Athletes, members, coaches, guardians with personal data, age groups, RGPD compliance
2. **Atividades & Eventos (Activities & Events):** Groups/classes, training sessions, competitions, camps, meetings with attendance tracking
3. **Financeiro (Financial):** Monthly fees, quotas, invoices, payments, bank accounts, accounting codes
4. **Inventário (Inventory):** Equipment categories, locations, stock management, loans, maintenance tracking
5. **Comunicação (Communication):** Email and SMS sending, templates, scheduling, campaigns
6. **Configurações (Settings):** Club profile, general settings, permissions, external integrations
7. **Relatórios (Reports):** Dashboard with KPIs, statistics, data exports (PDF, CSV, Excel)

### External Dependencies

**Third-party UI Libraries:**
- Radix UI primitives (accordion, dialog, dropdown, etc.)
- Lucide React for iconography
- date-fns for date manipulation with Portuguese locale
- cmdk for command palette functionality

**Development Tools:**
- TypeScript for type safety across the stack
- ESBuild for production server bundling
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)

**Authentication Service:**
- Replit Auth (OpenID Connect provider)
- Passport.js with openid-client strategy

**Database Service:**
- Neon Serverless PostgreSQL
- Connection pooling with @neondatabase/serverless
- WebSocket support for serverless environments

**Notable Features:**
- Session persistence in PostgreSQL
- Auto-generated UUID for user IDs
- Environment-based configuration (DATABASE_URL, SESSION_SECRET, REPL_ID)
- CORS and security headers configured for Replit domains