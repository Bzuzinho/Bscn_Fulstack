# Swimming Club Management System

## Overview

This is a comprehensive management system for swimming clubs, built with a modern full-stack architecture. The system manages athletes, activities (training, competitions, camps), financials, inventory, and communications. It's designed for administrators, coaches, and members to efficiently handle all aspects of club operations.

The application uses React with TypeScript for the frontend, Express.js for the backend, and PostgreSQL (via Neon) for data persistence. The UI is built with shadcn/ui components following Material Design 3 principles, with support for both light and dark modes.

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
- Users table (mandatory for Replit Auth integration)
- Sessions table (mandatory for session storage)
- Domain tables: pessoas (people), escaloes (age groups), atividades (activities), presencas (attendance), mensalidades (monthly fees), materiais (materials), emprestimos (loans), emails (communications)
- Zod schemas generated from Drizzle for runtime validation

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